import apiClient from "../../api/apiClient";

/**
 * Auth Service for handling authentication API calls.
 */
export const authService = {
  /**
   * POST /auth/signup
   * Register a new user with email, password, name, and organization
   */
  signup: async (signupData) => {
    const response = await apiClient.post("/auth/signup", signupData);
    return response.data;
  },

  /**
   * POST /auth/login
   * Login with email and password
   */
  login: async (credentials) => {
    const response = await apiClient.post("/auth/login", credentials);
    return response.data;
  },

  /**
   * POST /auth/logout
   * Logout and invalidate refresh token
   */
  logout: async () => {
    const response = await apiClient.post("/auth/logout");
    return response.data;
  },

  /**
   * POST /auth/refresh
   * Refresh access token using refresh token
   */
  refreshTokens: async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }
    const response = await apiClient.post("/auth/refresh", {
      refreshToken,
    });
    return response.data;
  },

  /**
   * GET /auth/me
   * Get current authenticated user profile
   */
  getProfile: async () => {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },
};
