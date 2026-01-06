// src/features/auth/hooks/useAuth.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setCredentials, logout as logoutAction } from "../slices/authSlice";
import { authService } from "../services/authService";
import { LoginCredentials, RegisterData } from "../types/auth.types";

// ===== CONSTANTS =====
const ROUTES = {
  MERCHANT_DASHBOARD: "/merchant/dashboard",
  ADMIN_DASHBOARD: "/admin/dashboard",
  HOME: "/",
  LOGIN: "/login",
} as const;

// ===== TYPES =====
interface ApiErrorResponse {
  message?: string;
  error?: string;
}

type UserRole = "MERCHANT" | "ADMIN" | "USER";

// ===== HELPERS =====
/**
 * Get target route based on user role
 * Note: This is for UI routing only. Authorization is enforced on backend.
 */
const getRouteByRole = (role: UserRole): string => {
  switch (role) {
    case "MERCHANT":
      return ROUTES.MERCHANT_DASHBOARD;
    case "ADMIN":
      return ROUTES.ADMIN_DASHBOARD;
    default:
      return ROUTES.HOME;
  }
};

/**
 * Extract error message from API error
 */
const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    return data?.message || data?.error || defaultMessage;
  }
  return defaultMessage;
};

/**
 * Development-only logging
 */
const devLog = (message: string, data?: unknown) => {
  if (import.meta.env.DEV) {
    console.log(message, data || "");
  }
};

const devError = (message: string, data?: unknown) => {
  if (import.meta.env.DEV) {
    console.error(message, data || "");
  }
};

// ===== HOOK =====
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isLoading, error } = useAppSelector(
    (state) => state.auth,
  );

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      devLog("Login successful", {
        hasData: !!data.data,
        hasUser: !!data.data?.user,
        hasTokens: !!data.data?.tokens,
        userRole: data.data?.user?.role,
      });

      // Dispatch credentials to Redux (tokens stored in memory via Redux only)
      dispatch(
        setCredentials({
          user: data.data.user,
          accessToken: data.data.tokens.accessToken,
          refreshToken: data.data.tokens.refreshToken,
        }),
      );

      devLog("Credentials dispatched to Redux");

      toast.success("Login successful!");

      // Navigate based on user role (UI routing only - auth enforced on backend)
      const targetRoute = getRouteByRole(data.data.user.role);
      devLog("Navigating to:", targetRoute);
      navigate(targetRoute, { replace: true });
    },
    onError: (error: AxiosError) => {
      devError("Login failed:", {
        status: error.response?.status,
        message: error.response?.data,
      });

      const message = getErrorMessage(
        error,
        "Login failed. Please check your credentials.",
      );
      toast.error(message);
    },
  });

  // Google Login mutation
  const googleLoginMutation = useMutation({
    mutationFn: authService.googleLogin,
    onSuccess: (data) => {
      devLog("Google login successful", {
        hasData: !!data.data,
        hasUser: !!data.data?.user,
        hasTokens: !!data.data?.tokens,
        userRole: data.data?.user?.role,
      });

      // Dispatch credentials to Redux
      dispatch(
        setCredentials({
          user: data.data.user,
          accessToken: data.data.tokens.accessToken,
          refreshToken: data.data.tokens.refreshToken,
        }),
      );

      devLog("Google credentials dispatched to Redux");

      toast.success("Logged in with Google successfully!");

      // Navigate based on user role (UI routing only - auth enforced on backend)
      const targetRoute = getRouteByRole(data.data.user.role);
      devLog("Navigating to:", targetRoute);
      navigate(targetRoute, { replace: true });
    },
    onError: (error: AxiosError) => {
      devError("Google login failed:", {
        status: error.response?.status,
        message: error.response?.data,
      });

      const message = getErrorMessage(
        error,
        "Google login failed. Please try again.",
      );
      toast.error(message);
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      dispatch(
        setCredentials({
          user: data.data.user,
          accessToken: data.data.tokens.accessToken,
          refreshToken: data.data.tokens.refreshToken,
        }),
      );
      toast.success(data.message || "Registration successful!");
      navigate(ROUTES.MERCHANT_DASHBOARD, { replace: true });
    },
    onError: (error: AxiosError) => {
      devError("Registration failed:", error);
      const message = getErrorMessage(error, "Registration failed");
      toast.error(message);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => {
      // Note: Ideally, refresh token should be in HttpOnly cookie
      // and backend should handle logout without client sending token
      const refreshToken = localStorage.getItem("refreshToken") || "";
      return authService.logout(refreshToken);
    },
    onSuccess: () => {
      dispatch(logoutAction());
      queryClient.clear();
      toast.success("Logged out successfully");
      navigate(ROUTES.LOGIN, { replace: true });
    },
    onError: () => {
      // Even if API call fails, clear local state
      dispatch(logoutAction());
      queryClient.clear();
      navigate(ROUTES.LOGIN, { replace: true });
    },
  });

  const login = (credentials: LoginCredentials) => {
    devLog("Login initiated for:", credentials.email);
    loginMutation.mutate(credentials);
  };

  const loginWithGoogle = (credential: string) => {
    devLog("Google login initiated");
    googleLoginMutation.mutate(credential);
  };

  const register = (data: RegisterData) => {
    registerMutation.mutate(data);
  };

  const logout = () => {
    logoutMutation.mutate();
  };

  return {
    user,
    isAuthenticated,
    isLoading:
      isLoading ||
      loginMutation.isPending ||
      googleLoginMutation.isPending ||
      registerMutation.isPending,
    error,
    login,
    loginWithGoogle,
    register,
    logout,
    // Expose granular loading states for flexible UI control
    loadingStates: {
      isLoggingIn: loginMutation.isPending,
      isLoggingInWithGoogle: googleLoginMutation.isPending,
      isRegistering: registerMutation.isPending,
      isLoggingOut: logoutMutation.isPending,
    },
  };
};
