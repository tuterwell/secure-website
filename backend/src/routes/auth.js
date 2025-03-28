import express from 'express';
import { register, login } from '../controllers/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Register with file upload
router.post('/register', upload.single('avatar'), register);

// Login (no file upload needed)
router.post('/login', login);

export default router; 