import axios from '../config/axios';

export const saveToken = (token) => {
    localStorage.setItem('token', token);
    // Also set it as a default header for axios if you're using it
    if (window.axios) {
        window.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
};

export const getToken = () => {
    return localStorage.getItem('token');
};

export const removeToken = () => {
    localStorage.removeItem('token');
    // Remove from axios headers if you're using it
    if (window.axios) {
        delete window.axios.defaults.headers.common['Authorization'];
    }
};

export const isAuthenticated = () => {
    const token = getToken();
    if (!token) return false;
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isValid = payload.exp > Date.now() / 1000;
        
        if (!isValid) {
            removeToken();
            return false;
        }
        
        return true;
    } catch (error) {
        removeToken();
        return false;
    }
};

export const setupAuthInterceptor = (axiosInstance) => {
    axiosInstance.interceptors.request.use(
        (config) => {
            const token = getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    axiosInstance.interceptors.response.use(
        (response) => {
            const newToken = response.headers['x-auth-token'];
            if (newToken) {
                saveToken(newToken);
            }
            return response;
        },
        (error) => {
            if (error.response?.status === 401) {
                removeToken();
            }
            return Promise.reject(error);
        }
    );
};

export const login = async (email, password) => {
    try {
        const response = await axios.post('/auth/login', { email, password });
        if (response.data.success) {
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            return { success: true, data: { token, user } };
        }
        return { success: false, error: 'Login failed' };
    } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
};

export const logout = async () => {
    try {
        await axios.post('/auth/logout');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Logout failed' };
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

export const signup = async (userData) => {
    try {
        const response = await axios.post('/auth/signup', userData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Registration failed');
    }
};
