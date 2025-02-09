import { useContext } from 'react';
import { UserContext } from '../context/user.context';
import { SUBSCRIPTION_PLANS } from '../config/plans';

export const useSubscription = () => {
    const { user } = useContext(UserContext);
    
    const hasFeature = (feature) => {
        const plan = user?.subscription?.plan?.toUpperCase();
        return SUBSCRIPTION_PLANS[plan]?.features[feature] ?? false;
    };

    const getLimit = (feature) => {
        const plan = user?.subscription?.plan?.toUpperCase();
        return SUBSCRIPTION_PLANS[plan]?.features[feature] ?? 0;
    };

    const isFeatureAvailable = (feature, currentUsage = 0) => {
        const limit = getLimit(feature);
        return limit === -1 || currentUsage < limit;
    };

    const hasValidSubscription = () => {
        return user?.subscription?.status === 'active' &&
               (!user?.subscription?.endDate || new Date(user.subscription.endDate) > new Date());
    };

    return {
        hasFeature,
        getLimit,
        isFeatureAvailable,
        hasValidSubscription,
        currentPlan: SUBSCRIPTION_PLANS[user?.subscription?.plan?.toUpperCase()],
        isActive: user?.subscription?.status === 'active'
    };
};
