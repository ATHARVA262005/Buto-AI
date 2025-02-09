import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/user.context';
import PlanSelector from '../components/PlanSelector';
import PaymentConfirmation from '../components/PaymentConfirmation';
import { createSubscription, processPayment } from '../services/subscription.service';
import { toast } from 'react-toastify';

const Subscription = () => {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState(null);
    const navigate = useNavigate();
    const { user, updateUser } = useContext(UserContext);

    useEffect(() => {
        // Immediate check on component mount
        if (user?.subscription?.status === 'active') {
            console.log('Subscription component: Redirecting user with active subscription');
            navigate('/', { replace: true });
        }
    }, [user, navigate]);

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
                // Update user context with new subscription data
                await updateUser(response.user);
                
                toast.success('Subscription updated successfully');
                // Force navigation to home page
                setTimeout(() => {
                    navigate('/', { replace: true });
                }, 1000);
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

    const handlePaymentConfirmed = () => {
        navigate('/');
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
