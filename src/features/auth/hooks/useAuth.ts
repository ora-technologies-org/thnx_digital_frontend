// src/features/auth/hooks/useAuth.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setCredentials, logout as logoutAction } from "../slices/authSlice";
import { authService } from "../services/authService";
import { LoginCredentials, RegisterData } from "../types/auth.types";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isLoading, error } = useAppSelector(
    (state) => state.auth
  );

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      console.log("🎉 Login successful, full response:", data);
      console.log("📦 Response structure check:", {
        hasData: !!data.data,
        hasUser: !!data.data?.user,
        hasTokens: !!data.data?.tokens,
        userRole: data.data?.user?.role,
      });

      // ✅ Dispatch credentials to Redux
      dispatch(
        setCredentials({
          user: data.data.user,
          accessToken: data.data.tokens.accessToken,
          refreshToken: data.data.tokens.refreshToken,
        })
      );

      console.log("✅ Credentials dispatched to Redux");
      console.log("📊 User role:", data.data.user.role);

      toast.success("Login successful!");

      // ✅ Navigate immediately - ProtectedRoute will handle the check
      const targetRoute =
        data.data.user.role === "MERCHANT"
          ? "/merchant/dashboard"
          : data.data.user.role === "ADMIN"
          ? "/admin/dashboard"
          : "/";

      console.log("🚀 Navigating to:", targetRoute);
      navigate(targetRoute, { replace: true });
    },
    onError: (error: any) => {
      console.error("❌ Login failed:", error);
      console.error("📋 Error details:", {
        status: error.response?.status,
        message: error.response?.data?.message,
        data: error.response?.data,
      });
      const message =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";
      toast.error(message);
    },
  });

  // Google Login mutation
  const googleLoginMutation = useMutation({
    mutationFn: authService.googleLogin,
    onSuccess: (data) => {
      console.log("🎉 Google login successful, full response:", data);
      console.log("📦 Response structure check:", {
        hasData: !!data.data,
        hasUser: !!data.data?.user,
        hasTokens: !!data.data?.tokens,
        userRole: data.data?.user?.role,
      });

      // ✅ Dispatch credentials to Redux
      dispatch(
        setCredentials({
          user: data.data.user,
          accessToken: data.data.tokens.accessToken,
          refreshToken: data.data.tokens.refreshToken,
        })
      );

      console.log("✅ Google credentials dispatched to Redux");
      console.log("📊 User role:", data.data.user.role);

      toast.success("Logged in with Google successfully!");

      // ✅ Navigate based on user role
      const targetRoute =
        data.data.user.role === "MERCHANT"
          ? "/merchant/dashboard"
          : data.data.user.role === "ADMIN"
          ? "/admin/dashboard"
          : "/";

      console.log("🚀 Navigating to:", targetRoute);
      navigate(targetRoute, { replace: true });
    },
    onError: (error: any) => {
      console.error("❌ Google login failed:", error);
      console.error("📋 Error details:", {
        status: error.response?.status,
        message: error.response?.data?.message,
        data: error.response?.data,
      });
      const message =
        error.response?.data?.message ||
        "Google login failed. Please try again.";
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
        })
      );
      toast.success(data.message || "Registration successful!");
      navigate("/merchant/dashboard", { replace: true });
    },
    onError: (error: any) => {
      console.error("❌ Registration failed:", error);
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => {
      const refreshToken = localStorage.getItem("refreshToken") || "";
      return authService.logout(refreshToken);
    },
    onSuccess: () => {
      dispatch(logoutAction());
      queryClient.clear();
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    },
    onError: () => {
      // Even if API call fails, clear local state
      dispatch(logoutAction());
      queryClient.clear();
      navigate("/login", { replace: true });
    },
  });

  const login = (credentials: LoginCredentials) => {
    console.log("🔐 Login initiated for:", credentials.email);
    loginMutation.mutate(credentials);
  };

  const loginWithGoogle = (credential: string) => {
    console.log("🔐 Google login initiated");
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
  };
};
