import multer from 'multer';

// Use memory storage for production best practices
const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });
