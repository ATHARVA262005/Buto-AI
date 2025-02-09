import express from 'express';
import { verifyCurrentPassword, changePassword } from '../controllers/passwordChange.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/verify-current', authMiddleware, verifyCurrentPassword);
router.post('/update', authMiddleware, changePassword);

export default router;
