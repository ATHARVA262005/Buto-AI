import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { UserContext } from '../context/user.context';
import LoadingBar from './LoadingBar';

const ProtectedRoute = ({ children }) => {
    const { user, loading, authChecked } = useContext(UserContext);
    const location = useLocation();

    // Show loading only on initial auth check
    if (loading && !authChecked) {
        return <LoadingBar fullScreen />;
    }

    // Not logged in -> Login page
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Not verified -> Verify email page
    if (!user.emailVerified) {
        return <Navigate to="/verify-email" replace />;
    }

    // No active subscription -> Subscription page
    // Skip this check for the subscription page itself to avoid infinite loops
    if (location.pathname !== '/subscription' && user.subscription?.status !== 'active') {
        return <Navigate to="/subscription" state={{ from: location }} replace />;
    }

    // If subscription page and has active subscription, redirect to home
    if (location.pathname === '/subscription' && user.subscription?.status === 'active') {
        return <Navigate to="/" replace />;
    }

    // All checks passed -> Show protected content
    return children;
};

export default ProtectedRoute;
