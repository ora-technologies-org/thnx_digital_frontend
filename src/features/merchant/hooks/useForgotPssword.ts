import { useMutation } from "@tanstack/react-query";
import { forgotPasswordService } from "../services/forgotPasswordService";
import { toast } from "react-hot-toast";

// Define error response type
interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

// Define success response type
interface SuccessResponse {
  message?: string;
}

export const useForgotPassword = () => {
  /**
   * Mutation for requesting OTP
   * Sends verification code to the provided email address
   */
  const requestOtpMutation = useMutation({
    mutationFn: (email: string) => forgotPasswordService.getOtp(email),
    onSuccess: (data: SuccessResponse) => {
      toast.success(data.message || "OTP sent successfully!");
    },
    onError: (error: ErrorResponse) => {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    },
  });

  /**
   * Mutation for verifying OTP
   * Validates the OTP code against the email
   */
  const verifyOtpMutation = useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      forgotPasswordService.verifyOtp(email, otp),
    onSuccess: (data: SuccessResponse) => {
      toast.success(data.message || "OTP verified!");
    },
    onError: (error: ErrorResponse) => {
      toast.error(error.response?.data?.message || "Invalid OTP");
    },
  });

  /**
   * Mutation for resetting password
   * Updates user's password after successful OTP verification
   */
  const resetPasswordMutation = useMutation({
    mutationFn: (params: {
      email: string;
      otp: string;
      password: string;
      confirmPassword: string;
    }) =>
      forgotPasswordService.resetPassword(
        params.email,
        params.otp,
        params.password,
        params.confirmPassword,
      ),
    onSuccess: (data: SuccessResponse) => {
      toast.success(data.message || "Password reset successfully!");
    },
    onError: (error: ErrorResponse) => {
      toast.error(error.response?.data?.message || "Failed to reset password");
    },
  });

  /**
   * Wrapper function for requesting OTP
   * Returns a Promise that resolves to boolean indicating success
   */
  const requestOtp = async (email: string): Promise<boolean> => {
    try {
      await requestOtpMutation.mutateAsync(email);
      return true;
    } catch {
      return false;
    }
  };

  /**
   * Wrapper function for verifying OTP
   * Returns a Promise that resolves to boolean indicating success
   */
  const verifyOtp = async (email: string, otp: string): Promise<boolean> => {
    try {
      await verifyOtpMutation.mutateAsync({ email, otp });
      return true;
    } catch {
      return false;
    }
  };

  /**
   * Wrapper function for resetting password
   * Returns a Promise that resolves to boolean indicating success
   */
  const resetPassword = async (
    email: string,
    otp: string,
    password: string,
    confirmPassword: string,
  ): Promise<boolean> => {
    try {
      await resetPasswordMutation.mutateAsync({
        email,
        otp,
        password,
        confirmPassword,
      });
      return true;
    } catch {
      return false;
    }
  };

  return {
    // Async wrapper functions that return Promises
    requestOtp,
    verifyOtp,
    resetPassword,

    // Combined loading state - true if any mutation is in progress
    isLoading:
      requestOtpMutation.isPending ||
      verifyOtpMutation.isPending ||
      resetPasswordMutation.isPending,

    // Individual mutation states for granular control
    isRequestingOtp: requestOtpMutation.isPending,
    isVerifyingOtp: verifyOtpMutation.isPending,
    isResettingPassword: resetPasswordMutation.isPending,

    // Success state for password reset (used to show success UI)
    resetSuccess: resetPasswordMutation.isSuccess,

    // Error states from TanStack Query
    requestOtpError: requestOtpMutation.error,
    verifyOtpError: verifyOtpMutation.error,
    resetPasswordError: resetPasswordMutation.error,

    // Raw mutation objects for advanced usage
    mutations: {
      requestOtp: requestOtpMutation,
      verifyOtp: verifyOtpMutation,
      resetPassword: resetPasswordMutation,
    },
  };
};
