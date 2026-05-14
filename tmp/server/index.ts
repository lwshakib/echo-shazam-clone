import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3001;

// Use memory storage for production best practices
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Database Setup
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/echo_shazam',
});

// FastAPI worker URL
const WORKER_API_URL = process.env.WORKER_API_URL || 'http://localhost:8000/identify';

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Middleware to authenticate webhook requests
const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).send('No token provided.');

  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(403).send('Invalid token.');
  }
};

/**
 * Identify Audio Chunk via FastAPI and PostgreSQL
 * Uses time-alignment validation to prevent false positives.
 */
async function identifyAudio(fileBuffer: Buffer, fileName: string): Promise<string | null> {
  try {
    console.log(`Sending buffer to FastAPI for identification: ${fileName}`);

    const formData = new FormData();
    const blob = new Blob([fileBuffer], { type: 'audio/webm' });
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

    // Match hashes with Time-Alignment Check
    // legitimate matches will have consistent (song_offset - recording_offset)
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

    // Threshold: legitimate matches usually have many perfectly aligned hashes.
    // False positives from background noise rarely align in time.
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

// API Routes
app.post('/identify', upload.single('audio'), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).send('No audio file provided.');
  }

  const result = await identifyAudio(req.file.buffer, req.file.originalname);

  if (result) {
    res.json({ match: true, song: result });
  } else {
    res.json({ match: false });
  }
});

// Webhook for uploading hashes from the generator
app.post('/webhook/upload_hashes', authenticate, async (req: Request, res: Response) => {
  const { song, hashes } = req.body;
  if (!song || !hashes || !Array.isArray(hashes)) {
    return res.status(400).send({ error: 'Invalid request body.' });
  }

  console.log(`Receiving data for ${song} (${hashes.length} hashes)...`);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    let songRes = await client.query('SELECT id FROM songs WHERE name = $1', [song]);
    let songId;

    if (songRes.rows.length > 0) {
      // Clean up existing fingerprints for this song to allow re-sync/updates without duplicates
      songId = songRes.rows[0].id;
      await client.query('DELETE FROM fingerprints WHERE song_id = $1', [songId]);
    } else {
      const insertSong = await client.query('INSERT INTO songs (name) VALUES ($1) RETURNING id', [
        song,
      ]);
      songId = insertSong.rows[0].id;
    }

    // Batch insert fingerprints
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
});

// Initialize DB schema
async function initDb() {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, 'utf-8');
      await pool.query(schema);
      console.log('Database initialized.');
    }
  } catch (err) {
    console.error('Table init failed:', err);
  }
}

initDb().then(() => {
  app.listen(port, () => {
    console.log(`Echo Server running at http://localhost:${port}`);
  });
});

export default app;
