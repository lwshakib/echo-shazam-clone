import { Router } from 'express';
import { uploadHashesHandler } from '../controllers/webhook.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/upload_hashes', authenticate, uploadHashesHandler);

export default router;
