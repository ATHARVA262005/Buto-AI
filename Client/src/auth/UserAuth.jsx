import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/user.context';

const UserAuth = ({ children }) => {
    const { user, loading, checkAuth } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthentication = async () => {
            if (!user) {
                const isAuthenticated = await checkAuth();
                if (!isAuthenticated) {
                    navigate('/login', { replace: true });
                }
            }
        };

        if (!loading) {
            checkAuthentication();
        }
    }, [loading]); // Only run when loading changes

    if (loading) {
        return <div>Loading...</div>;
    }

    return user ? children : null;
};

export default UserAuth;