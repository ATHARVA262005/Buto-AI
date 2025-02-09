import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../context/user.context';
import PlanSelector from '../components/PlanSelector';
import PaymentConfirmation from '../components/PaymentConfirmation';
import { createSubscription, processPayment } from '../services/subscription.service';
import { toast } from 'react-toastify';
import axios from 'axios';

const Subscription = () => {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const requireSubscription = location.state?.requireSubscription;
    const { user, updateUser } = useContext(UserContext);

    useEffect(() => {
        // Immediate check on component mount
        if (user?.subscription?.status === 'active') {
            console.log('Subscription component: Redirecting user with active subscription');
            navigate('/', { replace: true });
        }
    }, [user, navigate]);

    useEffect(() => {
        if (requireSubscription) {
            toast.info('Please select a subscription plan to continue');
        }
    }, [requireSubscription]);

    // Early return if user has active subscription
    if (user?.subscription?.status === 'active') {
        return null;
    }

    const handlePlanSelection = async () => {
        if (!selectedPlan) {
            toast.error('Please select a plan to continue');
            return;
        }

        try {
            setLoading(true);
            const response = await createSubscription(selectedPlan);
            
            if (response.success) {
                // Get fresh user data after subscription
                const userResponse = await axios.get('/auth/me');
                if (userResponse.data.success) {
                    await updateUser(userResponse.data.user);
                    toast.success('Subscription activated successfully');
                    navigate('/', { replace: true });
                } else {
                    throw new Error('Failed to update user data');
                }
            } else {
                throw new Error(response.message || 'Failed to update subscription');
            }
        } catch (error) {
            console.error('Subscription error:', error);
            toast.error(error.message || 'Failed to process subscription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 p-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Choose Your Plan</h1>
                    <p className="text-gray-400">Select a plan to start using our services</p>
                </div>

                <PlanSelector
                    selectedPlan={selectedPlan}
                    onPlanSelect={setSelectedPlan}
                    onSubmit={handlePlanSelection}
                    loading={loading}
                />

                {showPayment && paymentDetails && (
                    <PaymentConfirmation
                        payment={paymentDetails}
                        onClose={handlePaymentConfirmed}
                    />
                )}
            </div>
        </div>
    );
};

export default Subscription;
