import React, { useContext, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/user.context';

const SubscriptionGuard = ({ children }) => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        // Double-check subscription status and force redirect
        if (user?.subscription?.status === 'active') {
            console.log('Active subscription detected, redirecting...');
            navigate('/', { replace: true });
        }
    }, [user, navigate]);

    // Immediate check for active subscription
    if (user?.subscription?.status === 'active') {
        console.log('Blocking subscription page access - active subscription');
        return <Navigate to="/" replace />;
    }

    return children;
};

export default SubscriptionGuard;