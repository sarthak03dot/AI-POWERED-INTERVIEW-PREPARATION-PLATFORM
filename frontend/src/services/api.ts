import axios from 'axios';
import { setLoading } from '../redux/slices/uiSlice';

const BASE_URL = 'http://localhost:8000/api/v1';

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

let storeInstance: any = null;

export const setupInterceptors = (store: any) => {
    storeInstance = store;
};

// Helper to keep track of active requests to prevent flickering
let activeRequests = 0;

const startLoading = () => {
    activeRequests++;
    if (activeRequests === 1 && storeInstance) {
        storeInstance.dispatch(setLoading(true));
    }
};

const stopLoading = () => {
    activeRequests--;
    if (activeRequests <= 0) {
        activeRequests = 0;
        if (storeInstance) {
            storeInstance.dispatch(setLoading(false));
        }
    }
};

// Request Interceptor: Attach JWT Token if available
api.interceptors.request.use(
    (config) => {
        // Only show loader for non-GET requests or major GETs
        // (Optional check: if (config.method !== 'get') startLoading(); )
        // User asked for "each loading", so we show it for all.
        startLoading();

        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        stopLoading();
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        stopLoading();
        return response;
    },
    async (error) => {
        stopLoading();
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
