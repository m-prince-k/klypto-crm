import axios from 'axios';

/**
 * Professional Axios Instance Configuration
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * REQUEST INTERCEPTOR
 * Automatically attaches the JWT token to every request if available.
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * RESPONSE INTERCEPTOR
 * Centralized error handling (e.g., redirecting to login on 401).
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific status codes
      if (error.response.status === 401) {
        console.error('Unauthorized! Logging out...');
        // Optional: localStorage.clear(); window.location.href = '/login';
      }
      return Promise.reject(error.response.data.message || 'Server Error');
    }
    return Promise.reject(error.message || 'Network Error');
  }
);

export default apiClient;
