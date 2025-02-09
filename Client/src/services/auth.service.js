import axios from '../config/axios';

export const login = async (email, password) => {
    try {
        const response = await axios.post('/auth/login', { email, password });
        return { success: true, data: response.data.user };
    } catch (error) {
        return { 
            success: false, 
            error: error.response?.data?.message || 'Login failed' 
        };
    }
};

export const logout = async () => {
    try {
        await axios.post('/auth/logout');
        return { success: true };
    } catch (error) {
        return { 
            success: false, 
            error: error.response?.data?.message || 'Logout failed' 
        };
    }
};

export const checkAuth = async () => {
    try {
        const response = await axios.get('/auth/me');
        return { success: true, data: response.data.user };
    } catch (error) {
        return { success: false, error: 'Authentication failed' };
    }
};
