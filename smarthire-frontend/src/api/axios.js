import axios from 'axios';

const api = axios.create({
  baseURL: 'https://smarthire-backend-production-3c99.up.railway.app',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;