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
