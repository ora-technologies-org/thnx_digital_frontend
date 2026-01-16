import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  setCredentials,
  logout as logoutAction,
  setError,
} from "../slices/authSlice";
import { authService } from "../services/authService";
import { LoginCredentials, RegisterData } from "../types/auth.types";
import { AxiosError } from "axios";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // 👈 Add this
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isLoading, error } = useAppSelector(
    (state) => state.auth,
  );

  interface ErrorResponse {
    message: string;
  }

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      console.log("🎉 Login successful, full response:", data);

      dispatch(
        setCredentials({
          user: data.data.user,
          accessToken: data.data.tokens.accessToken,
          refreshToken: data.data.tokens.refreshToken,
        }),
      );

      console.log("✅ Credentials dispatched to Redux");
      toast.success("Login successful!");

      // 🎯 CHECK IF THIS IS A FIRST-TIME USER
      if (data.data.user.isFirstTime === true) {
        console.log("🔐 First time user - redirecting to change password");
        navigate("/change-password", { replace: true });
        return;
      }

      //  Check if there's a saved location from ProtectedRoute
      const savedLocation = location.state?.from;

      console.log("🔍 Checking for saved location:", {
        hasSavedLocation: !!savedLocation,
        savedPath: savedLocation?.pathname,
        savedSearch: savedLocation?.search,
      });

      if (savedLocation?.pathname && savedLocation.pathname !== "/login") {
        // User was redirected from a protected route - go back there
        const redirectPath =
          savedLocation.pathname + (savedLocation.search || "");
        console.log("↩️ Redirecting back to saved location:", redirectPath);
        navigate(redirectPath, { replace: true });
        return; // 👈 Important: return early
      }

      // Default navigation based on role
      const targetRoute =
        data.data.user.role === "MERCHANT"
          ? "/merchant/dashboard"
          : data.data.user.role === "ADMIN"
            ? "/admin/dashboard"
            : "/";

      console.log("🏠 No saved location, navigating to default:", targetRoute);
      navigate(targetRoute, { replace: true });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error("❌ Login failed:", error);
      const message =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";

      dispatch(setError(message));
      toast.error(message);
    },
  });

  // Google Login mutation
  const googleLoginMutation = useMutation({
    mutationFn: authService.googleLogin,
    onSuccess: (data) => {
      console.log("🎉 Google login successful");

      dispatch(
        setCredentials({
          user: data.data.user,
          accessToken: data.data.tokens.accessToken,
          refreshToken: data.data.tokens.refreshToken,
        }),
      );

      toast.success("Logged in with Google successfully!");

      // 🎯 NEW: Check for saved location for Google login too
      const savedLocation = location.state?.from;

      if (savedLocation?.pathname && savedLocation.pathname !== "/login") {
        const redirectPath =
          savedLocation.pathname + (savedLocation.search || "");
        console.log(
          "↩️ Google login - redirecting to saved location:",
          redirectPath,
        );
        navigate(redirectPath, { replace: true });
        return;
      }

      const targetRoute =
        data.data.user.role === "MERCHANT"
          ? "/merchant/dashboard"
          : data.data.user.role === "ADMIN"
            ? "/admin/dashboard"
            : "/";

      navigate(targetRoute, { replace: true });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error("❌ Google login failed:", error);
      const message =
        error.response?.data?.message ||
        "Google login failed. Please try again.";

      dispatch(setError(message));
      toast.error(message);
    },
  });

  // Register mutation - FIXED VERSION
  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      console.log("🎉 Registration successful, response:", data);

      if (!data.data?.user || !data.data?.tokens) {
        console.error("❌ Invalid registration response structure:", data);
        const errorMsg = "Registration response is missing required data";
        dispatch(setError(errorMsg));
        toast.error(errorMsg);
        return;
      }

      dispatch(
        setCredentials({
          user: data.data.user,
          accessToken: data.data.tokens.accessToken,
          refreshToken: data.data.tokens.refreshToken,
        }),
      );

      console.log("✅ Registration credentials dispatched to Redux");
      toast.success(data.message || "Registration successful!");

      const targetRoute =
        data.data.user.role === "MERCHANT"
          ? "/merchant/dashboard"
          : data.data.user.role === "ADMIN"
            ? "/admin/dashboard"
            : "/";

      console.log("🚀 Navigating to:", targetRoute);
      navigate(targetRoute, { replace: true });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error("❌ Registration failed:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Registration failed. Please try again.";

      dispatch(setError(message));
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

  const register = async (data: RegisterData) => {
    console.log("📝 Registration initiated");
    const cleanData = {
      ...data,
      ...(data.phone && data.phone.trim() !== "" ? { phone: data.phone } : {}),
    };
    registerMutation.mutate(cleanData);
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
