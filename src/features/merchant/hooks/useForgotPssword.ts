import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { forgotPasswordService } from "../services/forgotPasswordService";

// ===== TYPES =====
/**
 * Password recovery flow steps
 */
export enum ForgotPasswordStep {
  REQUEST_OTP = "REQUEST_OTP",
  VERIFY_OTP = "VERIFY_OTP",
  RESET_PASSWORD = "RESET_PASSWORD",
  COMPLETED = "COMPLETED",
}

/**
 * API error response structure
 */
interface ApiErrorResponse {
  message?: string;
  error?: string;
}

/**
 * API success response structure
 */
interface ApiSuccessResponse {
  message?: string;
  data?: unknown;
}

/**
 * Request parameters for OTP verification
 */
interface VerifyOtpParams {
  email: string;
  otp: string;
}

/**
 * Request parameters for password reset
 */
interface ResetPasswordParams {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
}

/**
 * Operation result with status and optional message
 */
interface OperationResult {
  success: boolean;
  message?: string;
}

// ===== HELPERS =====
/**
 * Extract error message from API error
 * Uses generic messages to prevent information leakage
 */
const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    // Return generic messages for security (prevents email enumeration)
    return data?.message || fallback;
  }
  return fallback;
};

/**
 * Development-only logging
 */
const devLog = (message: string, data?: unknown) => {
  if (import.meta.env.DEV) {
    console.log(message, data || "");
  }
};

const devError = (message: string, error?: unknown) => {
  if (import.meta.env.DEV) {
    console.error(message, error || "");
  }
};

// ===== CONSTANTS =====
/**
 * Generic error messages to prevent information leakage
 */
const ERROR_MESSAGES = {
  REQUEST_OTP: "Unable to process request. Please try again later.",
  VERIFY_OTP: "Verification failed. Please check your code and try again.",
  RESET_PASSWORD: "Unable to reset password. Please try again.",
} as const;

const SUCCESS_MESSAGES = {
  REQUEST_OTP: "Verification code sent successfully!",
  VERIFY_OTP: "Code verified successfully!",
  RESET_PASSWORD: "Password reset successfully!",
} as const;

// ===== HOOK =====
export const useForgotPassword = () => {
  /**
   * Mutation for requesting OTP
   * Backend must enforce:
   * - Rate limiting (e.g., max 3 requests per hour per email)
   * - Email validation
   * - OTP expiry (e.g., 5-10 minutes)
   */
  const requestOtpMutation = useMutation<
    ApiSuccessResponse,
    AxiosError,
    string
  >({
    mutationFn: (email: string) => forgotPasswordService.getOtp(email),
    onSuccess: (data) => {
      devLog("OTP requested successfully", { hasData: !!data });
    },
    onError: (error) => {
      devError("OTP request failed", {
        status: error.response?.status,
      });
    },
  });

  /**
   * Mutation for verifying OTP
   * Backend must enforce:
   * - Max attempts limit (e.g., 5 attempts per OTP)
   * - OTP expiry validation
   * - Account lockout after max attempts
   */
  const verifyOtpMutation = useMutation<
    ApiSuccessResponse,
    AxiosError,
    VerifyOtpParams
  >({
    mutationFn: ({ email, otp }: VerifyOtpParams) =>
      forgotPasswordService.verifyOtp(email, otp),
    onSuccess: (data) => {
      devLog("OTP verified successfully", { hasData: !!data });
    },
    onError: (error) => {
      devError("OTP verification failed", {
        status: error.response?.status,
      });
    },
  });

  /**
   * Mutation for resetting password
   * Backend must enforce:
   * - Strong password requirements
   * - OTP re-validation
   * - Single-use OTP tokens
   * - Password history checks
   */
  const resetPasswordMutation = useMutation<
    ApiSuccessResponse,
    AxiosError,
    ResetPasswordParams
  >({
    mutationFn: (params: ResetPasswordParams) =>
      forgotPasswordService.resetPassword(
        params.email,
        params.otp,
        params.password,
        params.confirmPassword,
      ),
    onSuccess: (data) => {
      devLog("Password reset successfully", { hasData: !!data });
    },
    onError: (error) => {
      devError("Password reset failed", {
        status: error.response?.status,
      });
    },
  });

  /**
   * Request OTP for email
   * Returns structured result for component to handle UI feedback
   */
  const requestOtp = async (email: string): Promise<OperationResult> => {
    try {
      const response = await requestOtpMutation.mutateAsync(email);
      return {
        success: true,
        message: response.message || SUCCESS_MESSAGES.REQUEST_OTP,
      };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, ERROR_MESSAGES.REQUEST_OTP),
      };
    }
  };

  /**
   * Verify OTP code
   * Returns structured result for component to handle UI feedback
   */
  const verifyOtp = async (
    email: string,
    otp: string,
  ): Promise<OperationResult> => {
    try {
      const response = await verifyOtpMutation.mutateAsync({ email, otp });
      return {
        success: true,
        message: response.message || SUCCESS_MESSAGES.VERIFY_OTP,
      };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, ERROR_MESSAGES.VERIFY_OTP),
      };
    }
  };

  /**
   * Reset password with verified OTP
   * Returns structured result for component to handle UI feedback
   */
  const resetPassword = async (
    email: string,
    otp: string,
    password: string,
    confirmPassword: string,
  ): Promise<OperationResult> => {
    try {
      const response = await resetPasswordMutation.mutateAsync({
        email,
        otp,
        password,
        confirmPassword,
      });
      return {
        success: true,
        message: response.message || SUCCESS_MESSAGES.RESET_PASSWORD,
      };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, ERROR_MESSAGES.RESET_PASSWORD),
      };
    }
  };

  /**
   * Reset all mutation states
   * Useful when navigating away or restarting the flow
   */
  const resetState = () => {
    requestOtpMutation.reset();
    verifyOtpMutation.reset();
    resetPasswordMutation.reset();
  };

  /**
   * Determine current step based on mutation states
   */
  const getCurrentStep = (): ForgotPasswordStep => {
    if (resetPasswordMutation.isSuccess) {
      return ForgotPasswordStep.COMPLETED;
    }
    if (verifyOtpMutation.isSuccess) {
      return ForgotPasswordStep.RESET_PASSWORD;
    }
    if (requestOtpMutation.isSuccess) {
      return ForgotPasswordStep.VERIFY_OTP;
    }
    return ForgotPasswordStep.REQUEST_OTP;
  };

  return {
    // Action methods - return OperationResult for component to handle UI
    requestOtp,
    verifyOtp,
    resetPassword,
    resetState,

    // Current step in the flow
    currentStep: getCurrentStep(),

    // Combined loading state
    isLoading:
      requestOtpMutation.isPending ||
      verifyOtpMutation.isPending ||
      resetPasswordMutation.isPending,

    // Granular loading states for each step
    loadingStates: {
      isRequestingOtp: requestOtpMutation.isPending,
      isVerifyingOtp: verifyOtpMutation.isPending,
      isResettingPassword: resetPasswordMutation.isPending,
    },

    // Success states for each step
    successStates: {
      otpRequested: requestOtpMutation.isSuccess,
      otpVerified: verifyOtpMutation.isSuccess,
      passwordReset: resetPasswordMutation.isSuccess,
    },

    // Error states (for advanced error handling if needed)
    errorStates: {
      requestOtpError: requestOtpMutation.error,
      verifyOtpError: verifyOtpMutation.error,
      resetPasswordError: resetPasswordMutation.error,
    },

    // Raw mutations (for advanced usage like checking mutation data)
    mutations: {
      requestOtp: requestOtpMutation,
      verifyOtp: verifyOtpMutation,
      resetPassword: resetPasswordMutation,
    },
  };
};
