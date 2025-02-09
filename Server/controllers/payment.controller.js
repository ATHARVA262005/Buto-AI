import User from '../models/user.model.js';
import { createTestPayment } from '../services/payment.service.js';
import { SUBSCRIPTION_PLANS } from '../config/plans.js';

export const handleTestPayment = async (req, res) => {
    try {
        const { planId } = req.body;
        const user = req.user;

        // Validate plan exists
        const plan = SUBSCRIPTION_PLANS[planId.toUpperCase()];
        if (!plan) {
            return res.status(400).json({
                success: false,
                message: 'Invalid plan selected'
            });
        }

        // Create test payment
        const payment = await createTestPayment(planId);

        if (payment.status === 'succeeded') {
            // Calculate subscription end date based on plan
            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + 1); // 30 days from now

            // Update user subscription
            user.subscription = {
                plan: planId.toLowerCase(),
                status: 'active',
                startDate: new Date(),
                endDate: endDate,
                paymentId: payment.id
            };

            // Reset usage stats for new subscription
            user.usageStats = {
                projectsCreated: 0,
                totalRequests: 0,
                lastRequestDate: new Date(),
                monthlyRequestCount: 0,
                lastResetDate: new Date()
            };

            await user.save();

            // Return success with subscription details
            res.json({
                success: true,
                message: 'Subscription activated successfully',
                subscription: user.subscription,
                payment: {
                    id: payment.id,
                    amount: plan.price,
                    status: payment.status,
                    card: {
                        last4: payment.last4,
                        brand: payment.brand
                    }
                },
                features: plan.features
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Payment processing failed'
            });
        }
    } catch (error) {
        console.error('Payment error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Payment processing failed'
        });
    }
};
