import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/echo_shazam',
});

async function resetDb() {
  try {
    console.log('Resetting database...');
    // Drop existing tables
    await pool.query('DROP TABLE IF EXISTS fingerprints CASCADE');
    await pool.query('DROP TABLE IF EXISTS songs CASCADE');

    // Re-run schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, 'utf-8');
      await pool.query(schema);
      console.log('Database reset and schema re-applied successfully.');
    } else {
      console.error('schema.sql not found at:', schemaPath);
    }
  } catch (err) {
    console.error('Failed to reset database:', err);
  } finally {
    await pool.end();
  }
}

resetDb();
