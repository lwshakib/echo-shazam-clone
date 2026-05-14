import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { DATABASE_URL } from '../envs.js';

export const pool = new Pool({
  connectionString: DATABASE_URL,
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
