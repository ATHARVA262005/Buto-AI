export const SUBSCRIPTION_PLANS = {
    FREE: {
        name: 'Free',
        price: 0,
        features: {
            maxTeamMembers: "3 team members",
            maxProjects: "1 project",
            chatHistoryDays: "7 days history",
            promptBookmarking: "Basic Bookmarking",
            aiCodeGeneration: "5 AI code generations per day",
            pinnedMessages: "❌ No Pinned Messages",
            chatSearch: "❌ No Chat Search",
            e2eEncryption: "❌ No End-to-End Encryption",
            support: 'Community Support',
            monthlyTokens: "10,000 tokens/month",
            dailyTokens: "500 tokens/day",
            maxTokensPerRequest: "100 tokens per request"
        }
    },
    PRO: {
        name: 'Pro',
        price: 29.99,
        features: {
            maxTeamMembers: "10 team members",
            maxProjects: "10 projects",
            chatHistoryDays: "30 days history",
            promptBookmarking: "Advanced Bookmarking",
            aiCodeGeneration: "Unlimited AI code generations",
            pinnedMessages: "✅ Unlimited Pinned Messages",
            chatSearch: "✅ Chat Search",
            e2eEncryption: "✅ End-to-End Encryption",
            support: 'Priority Email Support',
            monthlyTokens: "100,000 tokens/month",
            dailyTokens: "5,000 tokens/day",
            maxTokensPerRequest: "500 tokens per request"
        }
    },
    ENTERPRISE: {
        name: 'Enterprise',
        price: 99.99,
        features: {
            maxTeamMembers: "Unlimited team members",
            maxProjects: "Unlimited projects",
            chatHistoryDays: "Unlimited chat history",
            promptBookmarking: "Enterprise Bookmarking",
            aiCodeGeneration: "Unlimited Advanced AI code generations",
            pinnedMessages: "✅ Unlimited Pinned Messages",
            chatSearch: "✅ Chat Search",
            e2eEncryption: "✅ End-to-End Encryption",
            support: '24/7 Dedicated Support',
            monthlyTokens: "Unlimited tokens/month",
            dailyTokens: "Unlimited tokens/day",
            maxTokensPerRequest: "2,000 tokens per request"
        }
    }
};

export const getFeatureLimit = (plan, feature) => {
    const planConfig = SUBSCRIPTION_PLANS[plan.toUpperCase()];
    if (!planConfig) return 0;

    const value = planConfig.features[feature];
    if (typeof value === 'string' && value.startsWith('Unlimited')) {
        return Infinity;
    }
    
    // Extract number from string like "10 projects" -> 10
    const numericValue = parseInt(value);
    return isNaN(numericValue) ? 0 : numericValue;
};

export const hasFeature = (plan, feature) => {
    const planConfig = SUBSCRIPTION_PLANS[plan.toUpperCase()];
    if (!planConfig) return false;

    const value = planConfig.features[feature];
    return value === true || value === "Unlimited" || Number(value) > 0;
};

export const formatFeatureValue = (value) => {
    if (value === true) return '✅';
    if (value === false) return '❌';
    if (typeof value === 'number') {
        return value.toLocaleString();
    }
    return value;
};

export const getPlanComparison = () => {
    const features = [
        { key: 'maxTeamMembers', label: '👥 Users per Project' },
        { key: 'maxProjects', label: '📂 Projects per User' },
        { key: 'chatHistoryDays', label: '💬 Chat History Retention' },
        { key: 'promptBookmarking', label: '🔖 Prompt Bookmarking' },
        { key: 'projectSpecificChat', label: '📑 Project-Specific Chat' },
        { key: 'aiCodeGeneration', label: '📄 AI-Generated Code' },
        { key: 'pinnedMessages', label: '📍 Pinned Messages & Todos' },
        { key: 'chatSearch', label: '🔍 Search in Chat' },
        { key: 'e2eEncryption', label: '🛡️ End-to-End Encryption' },
        { key: 'support', label: '🧑‍💻 Support Level' },
        { key: 'monthlyTokens', label: '🎯 Monthly Tokens' },
        { key: 'dailyTokens', label: '📊 Daily Tokens' }
    ];

    return features.map(feature => ({
        feature: feature.label,
        free: formatFeatureValue(SUBSCRIPTION_PLANS.FREE.features[feature.key]),
        pro: formatFeatureValue(SUBSCRIPTION_PLANS.PRO.features[feature.key]),
        enterprise: formatFeatureValue(SUBSCRIPTION_PLANS.ENTERPRISE.features[feature.key])
    }));
};
