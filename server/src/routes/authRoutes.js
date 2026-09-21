import express from 'express';
import { getMe, logout, googleAuth, googleCallback, devLogin } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);
router.post('/dev-login', devLogin);

router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

export default router;
