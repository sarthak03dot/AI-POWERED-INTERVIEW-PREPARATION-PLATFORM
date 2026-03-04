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
    },

    getHistoryByTopic: async (topic: string) => {
        const response = await api.get(`/history/topic/${topic}`);
        return response.data;
    },

    getPaginatedHistory: async (page: number = 1, limit: number = 10) => {
        const response = await api.get(`/history/paginated?page=${page}&limit=${limit}`);
        return response.data;
    },

    generateResumeQuestion: async (resume_text: string) => {
        const response = await api.post('/questions/resume', { resume_text });
        return response.data.reply;
    },

    askLLM: async (message: string) => {
        const response = await api.post('/llm/ask', { message });
        return response.data.reply;
    },

    evaluatePractice: async (data: { question_data: any, user_answer: string, question_type: string, topic: string }) => {
        const response = await api.post('/evaluate/practice', data);
        return response.data;
    }
};
