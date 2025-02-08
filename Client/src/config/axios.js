import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true
});

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Remove this line to prevent full reload:
            // window.location.href = '/login';

            // Optionally, just reject the error or handle it in your components:
            // throw error;
        }
        return Promise.reject(error);
    }
);

export default instance;