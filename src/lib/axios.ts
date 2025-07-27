import axios from 'axios';
import { isTokenValid, isTokenExpired } from './tokenUtils';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Request interceptor to add auth token and validate before sending
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Check if token is valid before adding it
      if (!isTokenValid(token)) {
        // Token is invalid, remove it and redirect
        localStorage.removeItem('token');
        window.dispatchEvent(new CustomEvent('tokenExpired'));
        window.location.href = '/';
        return Promise.reject(new Error('Invalid token'));
      }
      
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token invalidation
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle various token invalidation scenarios
    if (error.response?.status === 401 || 
        error.response?.status === 403 ||
        error.response?.data?.message?.toLowerCase().includes('invalid token') ||
        error.response?.data?.message?.toLowerCase().includes('token expired') ||
        error.response?.data?.message?.toLowerCase().includes('unauthorized') ||
        error.response?.data?.error?.toLowerCase().includes('invalid token') ||
        error.response?.data?.error?.toLowerCase().includes('token expired') ||
        error.response?.data?.error?.toLowerCase().includes('unauthorized')) {
      
      // Token is invalid, expired, or unauthorized
      localStorage.removeItem('token');
      
      // Dispatch custom event to notify auth context
      window.dispatchEvent(new CustomEvent('tokenExpired'));
      
      // Redirect to login page
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api; 