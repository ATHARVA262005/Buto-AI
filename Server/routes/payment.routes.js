import { Router } from 'express';
import { handleTestPayment } from '../controllers/payment.controller.js';
import { authPayment } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/test', authPayment, handleTestPayment);

export default router;
