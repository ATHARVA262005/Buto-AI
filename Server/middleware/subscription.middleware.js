import { SUBSCRIPTION_PLANS, getFeatureLimit } from '../config/plans.js';
import User from '../models/user.model.js';
import Subscription from '../models/subscription.model.js';

export const checkSubscriptionLimits = async (req, res, next) => {
    try {
        // Skip check for auth routes and payment routes
        if (req.path.startsWith('/auth') || req.path.startsWith('/payment')) {
            return next();
        }

        const user = req.user;
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Check if subscription is valid
        if (!user.hasValidSubscription()) {
            return res.status(403).json({
                success: false,
                message: 'Active subscription required',
                requiresSubscription: true
            });
        }

        // Get plan limits
        const plan = user.subscription.plan.toUpperCase();
        const planConfig = SUBSCRIPTION_PLANS[plan];

        // Check specific feature limits based on the request
        if (req.path.includes('/projects') && req.method === 'POST') {
            const limit = getFeatureLimit(plan, 'maxProjects');
            if (limit !== -1 && user.usageStats.projectsCreated >= limit) {
                return res.status(403).json({
                    success: false,
                    message: `Project limit (${limit}) reached for your plan`,
                    requiresUpgrade: true
                });
            }
        }

        // Check API request limits
        const requestLimit = getFeatureLimit(plan, 'maxRequestsPerMonth');
        if (requestLimit !== -1) {
            const currentMonth = new Date().getMonth();
            const lastRequestMonth = user.usageStats.lastRequestDate?.getMonth();

            if (currentMonth !== lastRequestMonth) {
                user.usageStats.totalRequests = 0;
            }

            if (user.usageStats.totalRequests >= requestLimit) {
                return res.status(429).json({
                    success: false,
                    message: 'Monthly request limit reached',
                    requiresUpgrade: true
                });
            }
        }

        // Increment usage counter
        await user.incrementUsage('totalRequests');

        // Add plan info to request for use in routes
        req.subscription = {
            plan: planConfig,
            limits: {
                projects: getFeatureLimit(plan, 'maxProjects'),
                requests: getFeatureLimit(plan, 'maxRequestsPerMonth'),
                teamMembers: getFeatureLimit(plan, 'maxTeamMembers')
            }
        };

        next();
    } catch (error) {
        console.error('Subscription check error:', error);
        res.status(500).json({
            success: false,
            message: 'Error checking subscription limits'
        });
    }
};
