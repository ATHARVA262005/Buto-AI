import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/user.context';

const SubscriptionGuard = ({ children }) => {
    const { user } = useContext(UserContext);

    if (user?.subscription?.status === 'active') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default SubscriptionGuard;
