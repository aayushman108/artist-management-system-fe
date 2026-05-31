/**
 * Configured Axios instance with JWT auth, automatic token refresh, and request queueing.
 */

import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

/** Indicates whether a token refresh request is currently in-flight. */
let isRefreshing = false;

/** Queue of pending requests waiting for the token refresh to complete. */
let refreshSubscribers: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

/**
 * Queues a request to be retried once the token refresh resolves.
 * @param resolve - Called with the new token on successful refresh.
 * @param reject - Called with the error if refresh fails.
 */
const subscribeTokenRefresh = (
  resolve: (token: string) => void,
  reject: (error: unknown) => void,
) => {
  refreshSubscribers.push({ resolve, reject });
};

/**
 * Resolves all queued requests with the new token and clears the queue.
 * @param token - The newly issued access token.
 */
const onRefreshed = (token: string) => {
  refreshSubscribers.forEach(({ resolve }) => resolve(token));
  refreshSubscribers = [];
};

/**
 * Rejects all queued requests and clears the queue.
 * @param error - The refresh failure reason.
 */
const onRefreshFailed = (error: unknown) => {
  refreshSubscribers.forEach(({ reject }) => reject(error));
  refreshSubscribers = [];
};

/** Pre-configured Axios instance */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor — attaches the Bearer token from localStorage to every outgoing request.
 */
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Response interceptor — handles 401 errors by attempting a single token refresh.
 * Concurrent requests during refresh are queued and retried once the new token is available.
 * Redirects to /login on refresh failure.
 */
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const status = error.response?.status;
    const isRefreshRequest = originalRequest?.url?.includes("/auth/refresh");

    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isRefreshRequest
    ) {
      originalRequest._retry = true;

      // Queue concurrent requests while a refresh is in-flight
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh(
            (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;

              resolve(api(originalRequest));
            },
            (err: unknown) => {
              reject(err);
            },
          );
        });
      }

      isRefreshing = true;

      try {
        const refreshUrl = `${API_BASE_URL.replace(/\/$/, "")}/auth/refresh`;

        const { data } = await axios.get(refreshUrl, {
          withCredentials: true,
        });

        const newToken = data?.data?.accessToken;

        if (newToken) {
          if (typeof window !== "undefined") {
            localStorage.setItem("accessToken", newToken);
          }

          onRefreshed(newToken);

          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          return api(originalRequest);
        } else {
          throw new Error("Refresh failed: No access token in response");
        }
      } catch (refreshError) {
        onRefreshFailed(refreshError);

        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          if (!window.location.pathname.includes("/login")) {
            window.location.href = "/login";
          }
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
