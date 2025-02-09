import express from 'express';
import { 
    signup, 
    login, 
    verifyEmail, 
    forgotPassword, 
    resetPassword, 
    resendVerification, 
    verifyOTP, 
    resendOTP,
    getCurrentUser,
    logout,
    verifyResetOTP
} from '../controllers/auth.controller.js';
import { authenticateToken, authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOTP);
router.post('/reset-password', resetPassword);
router.post('/resend-verification', resendVerification);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.get('/me', authMiddleware, getCurrentUser);
router.post('/logout', authMiddleware, logout);
// router.post('/verify-email', verifyEmail);
router.post('/resend-otp', resendOTP);

export default router;
