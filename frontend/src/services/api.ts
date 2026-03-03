import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/v1';

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach JWT Token if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        // Let auth/refresh pass without the default token to rely purely on what's configured locally if needed.
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Do not intercept refresh token failures to avoid infinite loops
            if (originalRequest.url === '/auth/refresh') {
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(error);
            }

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    throw new Error("No refresh token available");
                }

                // Explicitly send the refresh request
                const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
                    refresh_token: refreshToken
                }, {
                    headers: { 'Content-Type': 'application/json' }
                });

                // Update the new access token
                localStorage.setItem('token', data.access_token);
                if (data.refresh_token) {
                    localStorage.setItem('refreshToken', data.refresh_token);
                }

                // Retry original request 
                originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
                return api(originalRequest);

            } catch (err) {
                // If the refresh fails, wipe the cache and push to login
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);
