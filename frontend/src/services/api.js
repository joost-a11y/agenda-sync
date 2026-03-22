import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (email, password) => apiClient.post('/auth/register', { email, password }),
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  getProfile: () => apiClient.get('/auth/profile'),
};

export const icsService = {
  addSource: (url, displayName) => apiClient.post('/ics/sources', { url, displayName }),
  getSources: () => apiClient.get('/ics/sources'),
  updateSource: (id, data) => apiClient.put(`/ics/sources/${id}`, data),
  deleteSource: (id) => apiClient.delete(`/ics/sources/${id}`),
  syncNow: () => apiClient.post('/ics/sync'),
  getLogs: () => apiClient.get('/ics/logs'),
};

export default apiClient;
