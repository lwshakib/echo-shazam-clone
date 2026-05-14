import type { Request, Response } from 'express';
import { pool } from '../lib/db.js';

const WORKER_API_URL = process.env.WORKER_API_URL || 'http://localhost:8000/identify';

/**
 * Identify Audio Chunk via FastAPI and PostgreSQL
 * Uses time-alignment validation to prevent false positives.
 */
async function identifyAudio(fileBuffer: Buffer, fileName: string): Promise<string | null> {
  try {
    console.log(`Sending buffer to FastAPI for identification: ${fileName}`);

    const formData = new FormData();
    const blob = new Blob([new Uint8Array(fileBuffer)], { type: 'audio/webm' });
    formData.append('audio', blob, fileName);

    const response = await fetch(WORKER_API_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      console.error(`FastAPI identification error: ${response.statusText}`);
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
      console.log(
        `Match success: ${dbRes.rows[0].song_name} with ${dbRes.rows[0].hits} aligned hits.`,
      );
      return dbRes.rows[0].song_name;
    } else {
      if (dbRes.rows.length > 0) {
        console.log(
          `Low confidence match: ${dbRes.rows[0].song_name} had ${dbRes.rows[0].hits} hits (Threshold: ${threshold})`,
        );
      }
      return null;
    }
  } catch (err) {
    console.error('Identification failed:', err);
    return null;
  }
}

export const identifyAudioHandler = async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).send('No audio file provided.');
    return;
  }

  const result = await identifyAudio(req.file.buffer, req.file.originalname);

  if (result) {
    res.json({ match: true, song: result });
  } else {
    res.json({ match: false });
  }
};
