// src/features/auth/types/password.types.ts

/**
 * Request payload for getting OTP
 */
export interface GetOtpRequest {
  email: string;
}

/**
 * Response structure for OTP request
 */
export interface GetOtpResponse {
  success: boolean;
  message: string;
  data?: {
    email: string;
    expiresIn?: number;
  };
}

/**
 * Request payload for verifying OTP
 */
export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

/**
 * Response structure for OTP verification
 */
export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data?: {
    email: string;
    resetToken?: string;
  };
}

/**
 * Request payload for resetting password
 */
export interface ResetPasswordRequest {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
}

/**
 * Response structure for password reset
 */
export interface ResetPasswordResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

/**
 * Request payload for changing password
 */
export interface ChangePasswordRequest {
  email: string;
  password: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Response structure for password change
 */
export interface ChangePasswordResponse {
  success: boolean;
  message: string;
  data?: unknown;
}
