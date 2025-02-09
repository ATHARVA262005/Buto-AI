import Subscription from '../models/subscription.model.js';
import User from '../models/user.model.js';
import { SUBSCRIPTION_PLANS } from '../config/plans.js';

export const createSubscription = async ({ userId, plan }) => {
  // Calculate subscription end date based on plan
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription

  const subscription = await Subscription.create({
    userId,
    plan,
    endDate
  });

  // Update user with subscription reference
  await User.findByIdAndUpdate(userId, { subscription: subscription._id });

  return subscription;
};

export const updateSubscription = async ({ subscriptionId, plan, status }) => {
  return await Subscription.findByIdAndUpdate(
    subscriptionId,
    { plan, status },
    { new: true }
  );
};

export const cancelSubscription = async (subscriptionId) => {
  const subscription = await Subscription.findByIdAndUpdate(
    subscriptionId,
    { 
      status: 'cancelled',
      endDate: new Date() // End subscription immediately
    },
    { new: true }
  );

  return subscription;
};

export const getSubscriptionDetails = async (userId) => {
  const subscription = await Subscription.findOne({ userId });
  if (!subscription) {
    return {
      plan: 'free',
      features: SUBSCRIPTION_PLANS.FREE.features
    };
  }

  return {
    ...subscription.toJSON(),
    features: SUBSCRIPTION_PLANS[subscription.plan.toUpperCase()].features
  };
};

export const activateSubscription = async ({ userId, planId }) => {
  try {
    // Find user and their existing subscription
    const user = await User.findById(userId).populate('subscription');
    if (!user) {
      throw new Error('User not found');
    }

    let subscription;
    if (user.subscription) {
      // Update existing subscription instead of creating new one
      subscription = await Subscription.findByIdAndUpdate(
        user.subscription._id,
        {
          plan: planId,
          status: 'active',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          lastModified: new Date()
        },
        { new: true }
      );
    } else {
      // Only create new subscription if user doesn't have one
      subscription = await Subscription.create({
        userId,
        plan: planId,
        status: 'active',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        lastModified: new Date()
      });

      // Link new subscription to user
      user.subscription = subscription._id;
      await user.save();
    }

    return subscription;
  } catch (error) {
    console.error('Subscription activation error:', error);
    throw error;
  }
};
