import api from './api';

export const userService = {
  getProfile: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/users/me', data);
    return response.data;
  },

  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/users/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/users/me/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getScoreSummary: async () => {
    const response = await api.get('/users/me/score-summary');
    return response.data;
  },

  getInterviews: async () => {
    const response = await api.get('/users/me/interviews');
    return response.data;
  },

  getInterviewById: async (id) => {
    const response = await api.get(`/users/me/interviews/${id}`);
    return response.data;
  },

  deleteInterview: async (id) => {
    const response = await api.delete(`/interviews/${id}`);
    return response.data;
  },

  updateInterview: async (id, data) => {
    const response = await api.put(`/interviews/${id}`, data);
    return response.data;
  },

  getRecommendations: async () => {
    const response = await api.get('/users/me/recommendations');
    return response.data;
  },

  deleteAccount: async () => {
    const response = await api.delete('/users/me');
    return response.data;
  }
};
