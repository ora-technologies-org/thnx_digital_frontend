// src/features/auth/hooks/useForgotPassword.ts
import { useState } from "react";
import { forgotPasswordService } from "../services/forgotPasswordService";
import { toast } from "react-hot-toast";

interface UseForgotPasswordReturn {
  requestOtp: (email: string) => Promise<boolean>;
  verifyOtp: (email: string, otp: string) => Promise<boolean>;
  resetPassword: (
    email: string,
    otp: string,
    password: string,
    confirmPassword: string
  ) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  resetSuccess: boolean;
}

export const useForgotPassword = (): UseForgotPasswordReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const requestOtp = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const response = await forgotPasswordService.getOtp(email);

      if (response.success) {
        setIsSuccess(true);
        toast.success(
          response.message || "OTP sent successfully! Check your email."
        );
        return true;
      } else {
        const errorMessage = response.message || "Failed to send OTP";
        setError(errorMessage);
        toast.error(errorMessage);
        return false;
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to send OTP. Please try again.";

      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (email: string, otp: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await forgotPasswordService.verifyOtp(email, otp);

      if (response.success) {
        toast.success(response.message || "OTP verified successfully!");
        return true;
      } else {
        const errorMessage = response.message || "Invalid OTP";
        setError(errorMessage);
        toast.error(errorMessage);
        return false;
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to verify OTP. Please try again.";

      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (
    email: string,
    otp: string,
    password: string,
    confirmPassword: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setResetSuccess(false);

    console.log("Hook - resetPassword called with:", {
      email,
      otp,
      password,
      confirmPassword,
    });

    try {
      const response = await forgotPasswordService.resetPassword(
        email,
        otp,
        password,
        confirmPassword
      );

      console.log("Reset Password Response:", response);

      if (response.success) {
        setResetSuccess(true);
        setError(null); // Clear any previous errors
        toast.success(response.message || "Password reset successfully!");
        return true;
      } else {
        const errorMessage = response.message || "Failed to reset password";
        setError(errorMessage);
        toast.error(errorMessage);
        return false;
      }
    } catch (err: any) {
      console.error("Reset Password Error:", err);

      // Handle validation errors from API
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const errorMessages = errors
          .map((e: any) => `${e.field}: ${e.message}`)
          .join(", ");
        setError(errorMessages);
        toast.error(errorMessages);
      } else {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to reset password. Please try again.";

        setError(errorMessage);
        toast.error(errorMessage);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    requestOtp,
    verifyOtp,
    resetPassword,
    isLoading,
    error,
    isSuccess,
    resetSuccess,
  };
};
