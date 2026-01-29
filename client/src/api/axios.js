import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: 'https://smart-attendance-system-api.onrender.com/api', // Proxied by Vite to http://localhost:5000
    // If you deploy to Vercel/Render, this will need to point to your production details
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
