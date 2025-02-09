import express from 'express';
import { verifyPassword, initiateEmailChange, verifyEmailChange } from '../controllers/emailChange.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/verify-password', authMiddleware, verifyPassword);
router.post('/initiate', authMiddleware, initiateEmailChange);
router.post('/verify', authMiddleware, verifyEmailChange);

export default router;
