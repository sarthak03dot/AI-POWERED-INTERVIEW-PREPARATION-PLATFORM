import { api } from './api';

export const statsService = {
    getMyStats: async () => {
        const response = await api.get('/stats/me');
        return response.data;
    },
};

export const topicService = {
    getMyTopics: async () => {
        const response = await api.get('/topic-progress/me');
        return response.data;
    }
};
