import api from './api';

export const aiService = {
  startInterview: async (config) => {
    const response = await api.post('/ai/start-interview', config);
    return response.data;
  },

  getQuestion: async (interviewId) => {
    const response = await api.get(`/ai/interviews/${interviewId}/questions`);
    return response.data;
  },

  submitAnswer: async (interviewId, data) => {
    const response = await api.post(`/ai/interviews/${interviewId}/answers`, data);
    return response.data;
  },

  submitVoiceAnswer: async (interviewId, formData) => {
    const response = await api.post(`/ai/interviews/${interviewId}/voice-answer`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  analyzeResume: async (resumeId) => {
    const response = await api.post('/ai/analyze-resume', { resumeId });
    return response.data;
  },

  generateFeedback: async (interviewId) => {
    const response = await api.get(`/ai/interviews/${interviewId}/feedback`);
    return response.data;
  },
};
