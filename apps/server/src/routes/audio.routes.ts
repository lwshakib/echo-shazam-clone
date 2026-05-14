import { Router } from 'express';
import { identifyAudioHandler } from '../controllers/audio.controller.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

router.post('/', upload.single('audio'), identifyAudioHandler);

export default router;
