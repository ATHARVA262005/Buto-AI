import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const UserAuth = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token');
    const pendingVerification = localStorage.getItem('pendingVerification');

    useEffect(() => {
        // Do not protect verification page
        if (location.pathname === '/verify-email') {
            return;
        }

        // If user has pending verification, force them to verify email
        if (pendingVerification) {
            navigate('/verify-email', { replace: true });
            return;
        }

        // For all other routes, require token
        if (!token) {
            navigate('/login', { replace: true });
        }
    }, [navigate, location.pathname, token, pendingVerification]);

    // For verification page, always render
    if (location.pathname === '/verify-email') {
        return children;
    }

    // For protected routes, only render if conditions are met
    if (!token || pendingVerification) {
        return null;
    }

    return children;
};

export default UserAuth;