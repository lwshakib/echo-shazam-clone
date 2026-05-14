import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import audioRoutes from './routes/audio.routes.js';
import webhookRoutes from './routes/webhook.routes.js';
import { initDb } from './lib/db.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Mount routes
app.use('/identify', audioRoutes);
app.use('/webhook', webhookRoutes);

// Initialize DB schema and start server
initDb().then(() => {
  app.listen(port, () => {
    console.log(`Echo Server running at http://localhost:${port}`);
  });
});

export default app;
