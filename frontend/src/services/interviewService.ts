import { api } from './api';

export const interviewService = {
    generateMCQ: async (topic: string, difficulty: string) => {
        const response = await api.post('/questions/mcq', { topic, difficulty });
        return response.data.reply;
    },

    generateCoding: async (topic: string, difficulty: string) => {
        const response = await api.post('/questions/coding', { topic, difficulty });
        return response.data.reply;
    },

    generateSystemDesign: async () => {
        const response = await api.get('/questions/system-design');
        return response.data.reply;
    },

    generateHR: async () => {
        const response = await api.get('/questions/hr');
        return response.data.reply;
    },

    generateFullInterview: async (topic: string, difficulty: string) => {
        const response = await api.get(`/interview/generate?topic=${topic}&difficulty=${difficulty}`);
        return response.data;
    },

    submitDaily: async (user_answer: string) => {
        const response = await api.post('/daily/submit', { user_answer });
        return response.data;
    },

    getDailyToday: async () => {
        const response = await api.get('/daily/today');
        return response.data;
    },

    getHistory: async () => {
        const response = await api.get('/history/all');
        return response.data;
    }
};
