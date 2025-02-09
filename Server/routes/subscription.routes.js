import { Router } from 'express';
import * as subscriptionController from '../controllers/subscription.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/create', authMiddleware, subscriptionController.createSubscription);
router.post('/payment', authMiddleware, subscriptionController.processPayment);
router.get('/details', authMiddleware, subscriptionController.getSubscriptionDetails);
router.post('/cancel', authMiddleware, subscriptionController.cancelSubscription);

// New route for subscription status
router.get('/status', authMiddleware, subscriptionController.getSubscriptionStatus);

export default router;
