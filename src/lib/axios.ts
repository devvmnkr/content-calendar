import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1",
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Endpoints that should not trigger token refresh
const AUTH_ENDPOINTS = [
  "/auth/login",
  "/auth/google",
  "/auth/refresh",
  "/auth/me",
  "/auth/logout",
];

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url || "";

    // Skip refresh for auth endpoints to prevent infinite loops
    const isAuthEndpoint = AUTH_ENDPOINTS.some((endpoint) =>
      requestUrl.includes(endpoint)
    );

    // If 401, not already retrying, and not an auth endpoint, attempt token refresh
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;

      const refreshed = await useAuthStore.getState().refreshToken();
      if (refreshed) {
        return api(originalRequest);
      }

      // Refresh failed, clear user state
      useAuthStore.setState({ user: null });
    }

    return Promise.reject(error);
  }
);

export default api;
