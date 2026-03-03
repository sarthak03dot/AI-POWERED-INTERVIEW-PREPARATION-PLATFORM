import { api } from './api';

export const authService = {
    login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    register: async (username: string, email: string, password: string) => {
        const response = await api.post('/auth/register', { username, email, password });
        return response.data;
    },

    getSecureData: async () => {
        const response = await api.get('/secure');
        return response.data;
    }
};
