import axios from "axios";
import { toast } from "sonner";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1"]);

const resolveDefaultApiUrl = () => {
  if (typeof window === "undefined") {
    return "http://localhost:3000/api";
  }

  const protocol = window.location.protocol === "https:" ? "https" : "http";
  const hostname = window.location.hostname || "localhost";
  return `${protocol}://${hostname}:3000/api`;
};

const getSafeApiBaseUrl = () => {
  const envApiUrl = import.meta.env.VITE_API_URL?.trim();
  if (!envApiUrl) {
    return resolveDefaultApiUrl();
  }

  if (typeof window === "undefined") {
    return envApiUrl;
  }

  try {
    const envUrl = new URL(envApiUrl);
    const appHost = window.location.hostname;
    const envHostIsLocal = LOCAL_HOSTS.has(envUrl.hostname);
    const appHostIsLocal = LOCAL_HOSTS.has(appHost);

    // If app is opened from another device, ignore localhost env URLs.
    if (envHostIsLocal && !appHostIsLocal) {
      return resolveDefaultApiUrl();
    }
  } catch {
    return resolveDefaultApiUrl();
  }

  return envApiUrl;
};

export const API_BASE_URL = getSafeApiBaseUrl();

/**
 * Professional Axios Instance Configuration
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let activeRequestCount = 0;

const emitApiLoadingState = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("api:loading", {
      detail: { pending: activeRequestCount },
    }),
  );
};

const incrementApiLoading = () => {
  activeRequestCount += 1;
  emitApiLoadingState();
};

const decrementApiLoading = () => {
  activeRequestCount = Math.max(0, activeRequestCount - 1);
  emitApiLoadingState();
};

const getValidToken = (value) => {
  if (!value || typeof value !== "string") return null;
  const normalized = value.trim();
  if (!normalized || normalized === "null" || normalized === "undefined") {
    return null;
  }
  return normalized;
};

/**
 * REQUEST INTERCEPTOR
 * Automatically attaches the JWT access token to every request if available.
 */
apiClient.interceptors.request.use(
  (config) => {
    if (config?.showGlobalLoader !== false) {
      config.__trackGlobalLoader = true;
      incrementApiLoading();
    }

    const hasAuthorizationHeader = Boolean(config.headers?.Authorization);
    if (hasAuthorizationHeader) {
      return config;
    }

    const accessToken = getValidToken(localStorage.getItem("accessToken"));
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      localStorage.removeItem("accessToken");
    }
    return config;
  },
  (error) => {
    if (error?.config?.__trackGlobalLoader) {
      decrementApiLoading();
    }
    return Promise.reject(error);
  },
);

/**
 * RESPONSE INTERCEPTOR
 * Centralized error handling including token refresh logic.
 */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  isRefreshing = false;
  failedQueue = [];
};

const WRITE_METHODS = new Set(["post", "put", "patch", "delete"]);
const GENERIC_SUCCESS_MESSAGES = new Set([
  "created successfully",
  "updated successfully",
  "deleted successfully",
  "action completed successfully",
  "success",
]);

const getMessageFromPayload = (payload) => {
  if (!payload) return "";
  if (typeof payload === "string") return payload;
  if (Array.isArray(payload)) return payload.join(", ");
  if (Array.isArray(payload?.details)) return payload.details.join(", ");
  if (Array.isArray(payload?.message)) return payload.message.join(", ");
  if (typeof payload?.detail === "string") return payload.detail;
  if (typeof payload?.details === "string") return payload.details;
  if (typeof payload?.message === "string") return payload.message;
  if (typeof payload?.error === "string") return payload.error;
  return "";
};

const getFriendlyErrorMessage = (error) => {
  if (!error?.response) {
    return "Cannot reach server. Please check your internet or API URL.";
  }

  const status = error.response?.status;
  const payloadMessage = getMessageFromPayload(error.response?.data);
  const cleaned = String(payloadMessage || "").trim();

  if (cleaned && cleaned.toLowerCase() !== "internal server error") {
    return cleaned;
  }

  if (status === 400) {
    return "Invalid request. Please check required fields and values.";
  }
  if (status === 401) {
    return "Session expired. Please sign in again.";
  }
  if (status === 403) {
    return "You do not have permission to perform this action.";
  }
  if (status === 404) {
    return "Requested resource was not found.";
  }
  if (status === 409) {
    return "Conflict detected. The record may already exist or is in use.";
  }
  if (status >= 500) {
    return "Server error occurred. Please try again or contact support.";
  }

  return error?.message || "Something went wrong";
};

const getDefaultSuccessMessage = (method) => {
  switch (method) {
    case "post":
      return "Saved successfully";
    case "put":
    case "patch":
      return "Updated successfully";
    case "delete":
      return "Deleted successfully";
    default:
      return "Action completed successfully";
  }
};

const parseRequestData = (rawData) => {
  if (!rawData) return {};
  if (typeof rawData === "object") return rawData;
  if (typeof rawData === "string") {
    try {
      return JSON.parse(rawData);
    } catch {
      return {};
    }
  }
  return {};
};

const normalizeEndpoint = (url = "") => {
  if (!url) return "";
  const withoutQuery = url.split("?")[0];
  if (
    withoutQuery.startsWith("http://") ||
    withoutQuery.startsWith("https://")
  ) {
    try {
      return new URL(withoutQuery).pathname;
    } catch {
      return withoutQuery;
    }
  }
  return withoutQuery;
};

const isGenericSuccessMessage = (message) => {
  if (!message || typeof message !== "string") return false;
  return GENERIC_SUCCESS_MESSAGES.has(message.trim().toLowerCase());
};

const getContextSuccessMessage = (method, endpoint, requestData = {}) => {
  if (endpoint === "/auth/login" && method === "post") {
    return "Login successful";
  }

  if (endpoint === "/auth/logout" && method === "post") {
    return "Logged out successfully";
  }

  if (
    (endpoint === "/auth/signup" || endpoint === "/auth/invite-user") &&
    method === "post"
  ) {
    return "Account created successfully";
  }

  if (endpoint === "/attendance" && method === "post") {
    if (requestData.checkOut) return "Check-out recorded successfully";
    if (requestData.checkIn) return "Check-in recorded successfully";
    return "Attendance updated successfully";
  }

  if (endpoint === "/leaves" && method === "post") {
    return "Leave request submitted successfully";
  }

  if (endpoint === "/grievances" && method === "post") {
    return "Complaint submitted successfully";
  }

  if (endpoint.includes("/projects/tasks/") && method === "patch") {
    return "Task status updated successfully";
  }

  if (
    endpoint.includes("/auth/users/") &&
    endpoint.endsWith("/toggle-status") &&
    method === "patch"
  ) {
    return "User status updated successfully";
  }

  return "";
};

apiClient.interceptors.response.use(
  (response) => {
    if (response.config?.__trackGlobalLoader) {
      decrementApiLoading();
    }

    const method = String(response.config?.method || "get").toLowerCase();
    const endpoint = normalizeEndpoint(response.config?.url);
    const requestData = parseRequestData(response.config?.data);
    const payloadMessage = getMessageFromPayload(response.data);
    const contextMessage = getContextSuccessMessage(
      method,
      endpoint,
      requestData,
    );
    const shouldToastSuccess =
      response.config?.toast !== false && WRITE_METHODS.has(method);

    if (shouldToastSuccess) {
      const message =
        response.config?.successMessage ||
        (isGenericSuccessMessage(payloadMessage)
          ? contextMessage
          : payloadMessage) ||
        contextMessage ||
        getDefaultSuccessMessage(method);
      toast.success(message);
    }

    return response;
  },
  async (error) => {
    if (error?.config?.__trackGlobalLoader) {
      decrementApiLoading();
    }

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getValidToken(localStorage.getItem("refreshToken"));
      if (!refreshToken) {
        processQueue(new Error("No refresh token"), null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          null,
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          },
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          response.data;
        const validAccessToken = getValidToken(newAccessToken);
        const validRefreshToken = getValidToken(newRefreshToken);

        if (!validAccessToken) {
          throw new Error("Invalid refreshed access token");
        }

        localStorage.setItem("accessToken", validAccessToken);
        if (validRefreshToken) {
          localStorage.setItem("refreshToken", validRefreshToken);
        }

        apiClient.defaults.headers.common.Authorization = `Bearer ${validAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${validAccessToken}`;

        processQueue(null, validAccessToken);
        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    if (originalRequest?.toast !== false) {
      const message = getFriendlyErrorMessage(error);
      toast.error(message);
    }

    if (error.response) {
      // Handle specific status codes
      if (error.response.status === 401 && originalRequest._retry) {
        console.error("Unauthorized! Logging out...");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
    return Promise.reject(error);
  },
);

export default apiClient;
