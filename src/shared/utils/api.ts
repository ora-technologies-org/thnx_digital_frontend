// src/shared/utils/api.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Track refresh state
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

// Token refresh timer
let refreshTimer: NodeJS.Timeout | null = null;
let lastRefreshTime: number = 0;

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

// Decode JWT to get expiry time (without external library)
const getTokenExpiry = (token: string): number | null => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    const decoded = JSON.parse(jsonPayload);
    return decoded.exp ? decoded.exp * 1000 : null; // Convert to milliseconds
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

// Refresh tokens function
const refreshAccessToken = async (): Promise<string | null> => {
  if (isRefreshing) {
    // Wait for ongoing refresh
    return new Promise((resolve, reject) => {
      failedQueue.push({
        resolve,
        reject: (err: Error) => reject(err),
      });
    });
  }

  isRefreshing = true;

  try {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    console.log("🔄 Refreshing access token...");

    // Use separate axios instance to avoid interceptor loop
    const response = await axios.post(`${api.defaults.baseURL}auth/refresh`, {
      refreshToken,
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data.data;

    // Update localStorage
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", newRefreshToken);

    // ✅ Update last refresh time
    lastRefreshTime = Date.now();

    console.log("✅ Token refreshed successfully");

    // Process queued requests
    processQueue(null, accessToken);

    // Schedule next refresh
    scheduleTokenRefresh(accessToken);

    return accessToken;
  } catch (error) {
    console.error("❌ Token refresh failed:", error);

    processQueue(error as Error, null);

    // Clear tokens and redirect to login
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    const authPaths = ["/login", "/register", "/forgot-password"];
    if (!authPaths.some((path) => window.location.pathname.startsWith(path))) {
      window.location.href = "/login";
    }

    return null;
  } finally {
    isRefreshing = false;
  }
};

// Schedule proactive token refresh
export const scheduleTokenRefresh = (accessToken: string) => {
  // Clear existing timer
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }

  const expiry = getTokenExpiry(accessToken);
  if (!expiry) {
    console.warn(
      "⚠️ Could not decode token expiry, skipping scheduled refresh",
    );
    return;
  }

  const now = Date.now();
  const timeUntilExpiry = expiry - now;

  // ✅ FIX 1: Don't schedule refresh if token was just issued
  const timeSinceLastRefresh = now - lastRefreshTime;
  const minRefreshInterval = 30 * 1000; // Don't refresh more than once per 30 seconds

  if (lastRefreshTime > 0 && timeSinceLastRefresh < minRefreshInterval) {
    console.log(
      `⏭️ Skipping refresh - last refresh was ${Math.round(timeSinceLastRefresh / 1000)}s ago`,
    );
    return;
  }

  // ✅ FIX 2: Don't schedule if token expires too soon
  if (timeUntilExpiry < 30 * 1000) {
    console.warn(
      "⚠️ Token expires in less than 30s, skipping scheduled refresh",
    );
    return;
  }

  // ✅ FIX 3: Dynamic refresh buffer based on token lifetime
  // Use 50% of token lifetime or 5 minutes, whichever is smaller
  // This prevents issues with short-lived tokens
  const maxRefreshBuffer = 5 * 60 * 1000; // 5 minutes
  const dynamicBuffer = timeUntilExpiry * 0.5; // 50% of token lifetime
  const refreshBuffer = Math.min(maxRefreshBuffer, dynamicBuffer);

  const timeUntilRefresh = Math.max(0, timeUntilExpiry - refreshBuffer);

  // ✅ FIX 4: Ensure we don't schedule immediate refresh
  const minTimeUntilRefresh = 10 * 1000; // At least 10 seconds
  if (timeUntilRefresh < minTimeUntilRefresh) {
    console.log(
      `⏭️ Calculated refresh time too soon (${Math.round(timeUntilRefresh / 1000)}s), adjusting to ${minTimeUntilRefresh / 1000}s`,
    );
  }

  const finalTimeUntilRefresh = Math.max(timeUntilRefresh, minTimeUntilRefresh);

  console.log(
    `⏰ Token expires in ${Math.round(timeUntilExpiry / 1000 / 60)} minutes`,
  );
  console.log(
    `⏰ Scheduled refresh in ${Math.round(finalTimeUntilRefresh / 1000 / 60)} minutes`,
  );

  refreshTimer = setTimeout(() => {
    console.log("⏰ Proactive token refresh triggered");
    refreshAccessToken();
  }, finalTimeUntilRefresh);
};

// Cancel scheduled refresh (call on logout)
export const cancelTokenRefresh = () => {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
    console.log("🛑 Token refresh timer cancelled");
  }
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Handle 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();

        if (!newAccessToken) {
          return Promise.reject(error);
        }

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
