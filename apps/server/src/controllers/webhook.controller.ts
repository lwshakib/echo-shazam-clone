import type { Request, Response } from 'express';
import { pool } from '../lib/db.js';

export const uploadHashesHandler = async (req: Request, res: Response) => {
  const { song, hashes } = req.body;
  if (!song || !hashes || !Array.isArray(hashes)) {
    res.status(400).send({ error: 'Invalid request body.' });
    return;
  }

  console.log(`Receiving data for ${song} (${hashes.length} hashes)...`);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    let songRes = await client.query('SELECT id FROM songs WHERE name = $1', [song]);
    let songId;

    if (songRes.rows.length > 0) {
      songId = songRes.rows[0].id;
      await client.query('DELETE FROM fingerprints WHERE song_id = $1', [songId]);
    } else {
      const insertSong = await client.query('INSERT INTO songs (name) VALUES ($1) RETURNING id', [
        song,
      ]);
      songId = insertSong.rows[0].id;
    }

    const CHUNK_SIZE = 1000;
    for (let i = 0; i < hashes.length; i += CHUNK_SIZE) {
      const chunk = hashes.slice(i, i + CHUNK_SIZE);
      const values: any[] = [songId];
      const placeholders = chunk
        .map((_, idx) => {
          const hIdx = 2 + idx * 2;
          const oIdx = 3 + idx * 2;
          values.push(chunk[idx][0], chunk[idx][1]);
          return `($1, $${hIdx}, $${oIdx})`;
        })
        .join(', ');

      await client.query(
        `INSERT INTO fingerprints (song_id, hash, offset_val) VALUES ${placeholders}`,
        values,
      );
    }

    await client.query('COMMIT');
    res.json({ success: true, count: hashes.length });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Failed to sync hashes:', err);
    res.status(500).send({ error: 'Database sync error.' });
  } finally {
    client.release();
  }
};
