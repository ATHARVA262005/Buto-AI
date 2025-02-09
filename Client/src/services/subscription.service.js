import axios from '../config/axios';

export const createSubscription = async (planId) => {
    try {
        const response = await axios.post('/subscription/create', { planId });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to create subscription');
    }
};

export const processPayment = async (subscriptionId, paymentDetails) => {
    try {
        const response = await axios.post('/subscription/payment', {
            subscriptionId,
            ...paymentDetails
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
