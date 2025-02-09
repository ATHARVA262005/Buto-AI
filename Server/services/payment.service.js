import { v4 as uuidv4 } from 'uuid';

export const createTestPayment = async (planId) => {
    // Simulate API delay for realistic feel
    await new Promise(resolve => setTimeout(resolve, 800));

    // Always return successful payment
    return {
        id: `pay_${uuidv4()}`,
        planId,
        amount: getPlanAmount(planId),
        status: 'succeeded',
        created: Date.now(),
        receipt: `rcpt_${uuidv4()}`,
        last4: '4242',
        brand: 'visa'
    };
};

const getPlanAmount = (planId) => {
    const plans = {
        basic: 9.99,
        pro: 29.99,
        enterprise: 99.99
    };
    return plans[planId.toLowerCase()] || 0;
};

export const createPaymentSession = async (planDetails) => {
  return {
    id: `sess_${uuidv4()}`,
    url: `/checkout?session=${uuidv4()}`,
    planDetails
  };
};
