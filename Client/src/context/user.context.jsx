import React, { createContext, useState, useCallback, useEffect } from 'react';
import axios from '../config/axios';

export const UserContext = createContext({
    user: null,
    login: () => {},
    logout: () => {},
    loading: true,
    checkAuth: () => {},
    isAuthenticated: false
});

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authChecked, setAuthChecked] = useState(false);

    const login = useCallback((userData) => {
        setUser(userData);
        setAuthChecked(true);
        setLoading(false);
    }, []);

    const logout = useCallback(async () => {
        try {
            await axios.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            setAuthChecked(true);
            setLoading(false);
        }
    }, []);

    const checkAuth = useCallback(async () => {
        if (authChecked && user) {
            return { authenticated: true };
        }

        try {
            const response = await axios.get('/auth/me');
            
            if (response.data.success && response.data.user) {
                setUser(response.data.user);
                setAuthChecked(true);
                return { authenticated: true };
            } else {
                setUser(null);
                setAuthChecked(true);
                return { authenticated: false };
            }
        } catch (error) {
            setUser(null);
            setAuthChecked(true);
            return { authenticated: false };
        } finally {
            setLoading(false);
        }
    }, [authChecked, user]);

    const updateUser = async (newUserData) => {
        try {
            // You can add API call here if needed
            setUser(newUserData);
            return true;
        } catch (error) {
            console.error('Error updating user:', error);
            return false;
        }
    };

    useEffect(() => {
        if (!authChecked && loading) {
            checkAuth();
        }
    }, [authChecked, loading, checkAuth]);

    const value = {
        user,
        login,
        logout,
        loading,
        checkAuth,
        isAuthenticated: !!user,
        authChecked,
        updateUser
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

