import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "./authService";

/**
 * SIGNUP THUNK: Register a new user with role-based signup
 */
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (signupData, { rejectWithValue }) => {
    try {
      const response = await authService.signup(signupData);
      // Store tokens in localStorage
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.message || error?.data?.message || "Signup failed",
      );
    }
  },
);

/**
 * LOGIN THUNK: User login with email and password
 */
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      // Store tokens in localStorage
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.message || error?.data?.message || "Login failed",
      );
    }
  },
);

/**
 * LOGOUT THUNK: Logout user and clear tokens
 */
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  try {
    await authService.logout();
    // Clear tokens from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return null;
  } catch {
    // Even if logout fails on server, clear local tokens
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return null;
  }
});

/**
 * REFRESH ACCESS TOKEN THUNK: Refresh expired access token
 */
export const refreshAccessToken = createAsyncThunk(
  "auth/refreshAccessToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.refreshTokens();
      localStorage.setItem("accessToken", response.accessToken);
      if (response.refreshToken) {
        localStorage.setItem("refreshToken", response.refreshToken);
      }
      return response;
    } catch {
      // If refresh fails, logout user
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return rejectWithValue("Token refresh failed");
    }
  },
);

/**
 * FETCH USER PROFILE THUNK: Get authenticated user profile with role
 */
export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getProfile();
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.message || error?.data?.message || "Failed to fetch profile",
      );
    }
  },
);

// Initial state
const initialState = {
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  user: null, // { id, email, fullName, organization, roles, isActive, createdAt }
  roles: [], // User roles array
  primaryRole: null, // Primary/first role
  isAuthenticated: !!localStorage.getItem("accessToken"),
  loading: false,
  error: null,
};

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * Logout action - clear all auth state
     */
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.roles = [];
      state.primaryRole = null;
      state.isAuthenticated = false;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },

    /**
     * Clear error state
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Restore auth from tokens (for app initialization)
     */
    restoreAuth: (state) => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      if (accessToken) {
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.isAuthenticated = true;
      }
    },
  },

  extraReducers: (builder) => {
    // ============= SIGNUP CASES =============
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        // Handle both 'role' (signup) and 'roles' (login) in response
        state.primaryRole = action.payload.role || action.payload.roles?.[0];
        state.roles = action.payload.roles || [action.payload.role];
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });

    // ============= LOGIN CASES =============
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.roles = action.payload.roles || [];
        state.primaryRole = action.payload.roles?.[0];
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });

    // ============= LOGOUT CASES =============
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.accessToken = null;
        state.refreshToken = null;
        state.user = null;
        state.roles = [];
        state.primaryRole = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading = false;
        // Even on error, clear auth state
        state.accessToken = null;
        state.refreshToken = null;
        state.user = null;
        state.roles = [];
        state.primaryRole = null;
        state.isAuthenticated = false;
      });

    // ============= REFRESH TOKEN CASES =============
    builder
      .addCase(refreshAccessToken.pending, () => {
        // Don't set loading for token refresh to avoid UI indicators
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        if (action.payload.refreshToken) {
          state.refreshToken = action.payload.refreshToken;
        }
        state.isAuthenticated = true;
      })
      .addCase(refreshAccessToken.rejected, () => {
        // Token refresh failed, will be handled by app restart
      });

    // ============= FETCH PROFILE CASES =============
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.roles = action.payload.roles || [];
        state.primaryRole = action.payload.roles?.[0];
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError, restoreAuth } = authSlice.actions;
export default authSlice.reducer;
