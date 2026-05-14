import type { Request, Response } from 'express';
import { pool } from '../lib/db.js';
import { WORKER_API_URL } from '../envs.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import logger from '../logger/winston.logger.js';

/**
 * Identify Audio Chunk via FastAPI and PostgreSQL
 * Uses time-alignment validation to prevent false positives.
 */
async function identifyAudio(fileBuffer: Buffer, fileName: string): Promise<string | null> {
  try {
    logger.info(`Sending buffer to FastAPI for identification: ${fileName}`);

    const formData = new FormData();
    const blob = new Blob([new Uint8Array(fileBuffer)], { type: 'audio/webm' });
    formData.append('audio', blob, fileName);

    const response = await fetch(WORKER_API_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      logger.error(`FastAPI identification error: ${response.statusText}`);
      return null;
    }

    const hashes = (await response.json()) as [string, number][];

    if (!Array.isArray(hashes) || hashes.length === 0) {
      return null;
    }

    const hashStrings = hashes.map((h) => h[0]);
    const recordingOffsets = hashes.map((h) => h[1]);

    const matchQuery = `
            WITH matches AS (
                SELECT 
                    s.name as song_name, 
                    (f.offset_val - data.recording_offset) as time_diff
                FROM fingerprints f
                JOIN songs s ON f.song_id = s.id
                JOIN unnest($1::text[], $2::int[]) AS data(hash, recording_offset) 
                  ON f.hash = data.hash
            )
            SELECT song_name, COUNT(*) as hits
            FROM matches
            GROUP BY song_name, time_diff
            ORDER BY hits DESC
            LIMIT 1
        `;

    const dbRes = await pool.query(matchQuery, [hashStrings, recordingOffsets]);

    const threshold = 15;
    if (dbRes.rows.length > 0 && dbRes.rows[0].hits >= threshold) {
      logger.info(
        `Match success: ${dbRes.rows[0].song_name} with ${dbRes.rows[0].hits} aligned hits.`,
      );
      return dbRes.rows[0].song_name;
    } else {
      if (dbRes.rows.length > 0) {
        logger.warn(
          `Low confidence match: ${dbRes.rows[0].song_name} had ${dbRes.rows[0].hits} hits (Threshold: ${threshold})`,
        );
      }
      return null;
    }
  } catch (err) {
    logger.error('Identification failed:', err);
    throw new ApiError(500, 'Audio identification internal error');
  }
}

export const identifyAudioHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new ApiError(400, 'No audio file provided.');
  }

  const result = await identifyAudio(req.file.buffer, req.file.originalname);

  if (result) {
    return res.status(200).json(new ApiResponse(200, { match: true, song: result }, 'Match found'));
  } else {
    return res.status(200).json(new ApiResponse(200, { match: false }, 'No match found'));
  }
});
