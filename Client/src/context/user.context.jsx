import React, { createContext, useState, useCallback, useEffect } from 'react';
import axios from '../config/axios';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = useCallback(async (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    }, []);

    const logout = useCallback(async () => {
        try {
            await axios.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
        }
    }, []);

    const checkAuth = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            setUser(null);
            return false;
        }

        try {
            const response = await axios.get('/auth/me');
            if (response.data.success) {
                setUser(response.data.user);
                return true;
            }
            localStorage.removeItem('token');
            setUser(null);
            return false;
        } catch (error) {
            localStorage.removeItem('token');
            setUser(null);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, []); // Run only once on mount

    return (
        <UserContext.Provider value={{
            user,
            login,
            logout,
            loading,
            checkAuth,
            isAuthenticated: !!user
        }}>
            {children}
        </UserContext.Provider>
    );
};

