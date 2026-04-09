import apiClient from '../../api/apiClient';

/**
 * Auth Service for handling authentication API calls.
 */
export const authService = {
  /**
   * POST /auth/login
   */
  login: async (credentials) => {
    // axios uses .post and returns a promise
    const response = await apiClient.post('/auth/login', credentials);
    return response.data; // axios wraps response in 'data'
  },

  /**
   * GET /user/profile
   */
  getProfile: async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },
};

