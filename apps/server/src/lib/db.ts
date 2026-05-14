import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/echo_shazam',
});

// Initialize DB schema
export async function initDb() {
  try {
    const schemaPath = path.join(import.meta.dirname, '../../schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, 'utf-8');
      await pool.query(schema);
      console.log('Database initialized.');
    } else {
      console.warn('schema.sql not found at', schemaPath);
    }
  } catch (err) {
    console.error('Table init failed:', err);
  }
}
