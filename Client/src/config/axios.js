import axios from 'axios';

const instance = axios.create({
    baseURL: '/api',
    withCredentials: true
});

instance.interceptors.response.use(
    response => response,
    error => {
        // Handle authentication errors
        if (error.response?.status === 401) {
            // For auth check endpoint, resolve with success: false
            if (error.config.url === '/auth/me') {
                return Promise.resolve({ 
                    data: { 
                        success: false,
                        user: null
                    } 
                });
            }
            // For other endpoints, reject with the error
            return Promise.reject(error);
        }
        return Promise.reject(error);
    }
);

export default instance;