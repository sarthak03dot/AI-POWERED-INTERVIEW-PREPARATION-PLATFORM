import { api } from './api';

export const mockInterviewService = {
    startSession: async (topic: string, difficulty: string) => {
        const response = await api.post('/mock-interview/start', { topic, difficulty });
        return response.data;
    },
    sendMessage: async (sessionId: number, message: string) => {
        const response = await api.post('/mock-interview/chat', { session_id: sessionId, message });
        return response.data;
    }
};
