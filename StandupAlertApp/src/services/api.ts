import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

// Points API
export const pointsAPI = {
  recordStandup: () => api.post('/points/record'),
  getMyPoints: () => api.get('/points/me'),
  getLeaderboard: (limit = 50) => api.get(`/points/leaderboard?limit=${limit}`),
  getHistory: (limit = 30) => api.get(`/points/history?limit=${limit}`),
};

// Alerts API
export const alertsAPI = {
  getSettings: () => api.get('/alerts/settings'),
  updateSettings: (data: any) => api.put('/alerts/settings', data),
};

export default api;
