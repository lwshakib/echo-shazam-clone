import type { Request, Response } from "express"
import { pool } from "../lib/db.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import logger from "../logger/winston.logger.js"

export const uploadHashesHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { song, hashes } = req.body
    if (!song || !hashes || !Array.isArray(hashes)) {
      throw new ApiError(
        400,
        "Invalid request body. Expected song and hashes array."
      )
    }

    logger.info(`Receiving data for ${song} (${hashes.length} hashes)...`)

    const client = await pool.connect()
    try {
      await client.query("BEGIN")

      let songRes = await client.query("SELECT id FROM songs WHERE name = $1", [
        song,
      ])
      let songId

      if (songRes.rows.length > 0) {
        songId = songRes.rows[0].id
        await client.query("DELETE FROM fingerprints WHERE song_id = $1", [
          songId,
        ])
      } else {
        const insertSong = await client.query(
          "INSERT INTO songs (name) VALUES ($1) RETURNING id",
          [song]
        )
        songId = insertSong.rows[0].id
      }

      const CHUNK_SIZE = 1000
      for (let i = 0; i < hashes.length; i += CHUNK_SIZE) {
        const chunk = hashes.slice(i, i + CHUNK_SIZE)
        const values: any[] = [songId]
        const placeholders = chunk
          .map((_, idx) => {
            const hIdx = 2 + idx * 2
            const oIdx = 3 + idx * 2
            values.push(chunk[idx][0], chunk[idx][1])
            return `($1, $${hIdx}, $${oIdx})`
          })
          .join(", ")

        await client.query(
          `INSERT INTO fingerprints (song_id, hash, offset_val) VALUES ${placeholders}`,
          values
        )
      }

      await client.query("COMMIT")
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { count: hashes.length },
            "Hashes synchronized successfully"
          )
        )
    } catch (err) {
      await client.query("ROLLBACK")
      logger.error("Failed to sync hashes:", err)
      throw new ApiError(500, "Database synchronization error")
    } finally {
      client.release()
    }
  }
)
