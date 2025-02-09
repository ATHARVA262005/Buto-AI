import * as subscriptionService from '../services/subscription.service.js';
import Subscription from '../models/subscription.model.js';
import User from '../models/user.model.js';

export const createSubscription = async (req, res) => {
    try {
        const { planId } = req.body;
        const userId = req.user._id;

        // This will now update existing subscription if it exists
        const subscription = await subscriptionService.activateSubscription({
            userId,
            planId
        });

        // Get updated user details with subscription
        const updatedUser = await User.findById(userId)
            .populate('subscription')
            .select('-password');

        res.status(200).json({  // Changed to 200 since it might be an update
            success: true,
            subscription,
            user: updatedUser
        });
    } catch (error) {
        console.error('Subscription update error:', error);
        res.status(400).json({ 
            success: false, 
            message: error.message 
        });
    }
};

export const processPayment = async (req, res) => {
    try {
        const { subscriptionId, paymentDetails } = req.body;
        // Here you would typically integrate with a payment provider like Stripe
        // For now, we'll just update the subscription status
        const subscription = await subscriptionService.updateSubscription({
            subscriptionId,
            status: 'active',
            ...paymentDetails
        });

        res.json(subscription);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getSubscriptionDetails = async (req, res) => {
    try {
        const userId = req.user._id;
        const details = await subscriptionService.getSubscriptionDetails(userId);
        res.json(details);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const cancelSubscription = async (req, res) => {
    try {
        const { subscriptionId } = req.body;
        const subscription = await subscriptionService.cancelSubscription(subscriptionId);
        res.json(subscription);
    } catch (error) {
        res.status (400).json({ message: error.message });
    }
};

export const getSubscriptionStatus = async (req, res) => {
    try {
        const userId = req.user._id;
        const subscription = await Subscription.findOne({ userId });
        if (subscription) {
            return res.json({ success: true, status: subscription.status });
        }
        res.json({ success: true, status: 'none' });
    } catch (error) {
        console.error('Error fetching subscription status:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
