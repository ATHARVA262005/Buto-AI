import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/user.context';

const EmailVerificationGuard = ({ children }) => {
    const { user } = useContext(UserContext);
    
    if (user?.emailVerified) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default EmailVerificationGuard;
