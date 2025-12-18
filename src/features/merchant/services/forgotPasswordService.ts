import api from "../../../shared/utils/api";

export interface GetOtpRequest {
  email: string;
}

export interface GetOtpResponse {
  success: boolean;
  message: string;
  data?: {
    email: string;
    expiresIn?: number;
  };
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data?: {
    email: string;
    resetToken?: string;
  };
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
  data?: unknown;
}
export interface ChangePasswordRequest {
  password: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export const changePasswordService = {
  /**
   * Change user password
   *
   */
  changePassword: async (
    password: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<ChangePasswordResponse> => {
    const payload: ChangePasswordRequest = {
      password,
      newPassword,
      confirmPassword,
    };

    console.log("Change Password Payload being sent:", {
      password: "***",
      newPassword: "***",
      confirmPassword: "***",
    });

    const response = await api.post<ChangePasswordResponse>(
      "/auth/change-password",
      payload,
    );

    return response.data;
  },
};

export const forgotPasswordService = {
  /**
   * Request OTP for password reset
   */
  getOtp: async (email: string): Promise<GetOtpResponse> => {
    const response = await api.post<GetOtpResponse>("/auth/get-otp", { email });
    return response.data;
  },

  /**
   * Verify OTP
   */
  verifyOtp: async (email: string, otp: string): Promise<VerifyOtpResponse> => {
    const response = await api.post<VerifyOtpResponse>("/auth/verify-otp", {
      email,
      otp,
    });
    return response.data;
  },

  /**
   * Reset password with OTP
   */
  resetPassword: async (
    email: string,
    otp: string,
    password: string,
    confirmPassword: string,
  ): Promise<ResetPasswordResponse> => {
    const payload = {
      email,
      otp,
      password,
      confirmPassword,
    };
    console.log("Reset Password Payload being sent:", payload);
    const response = await api.post<ResetPasswordResponse>(
      "/auth/reset-password",
      payload,
    );
    return response.data;
  },
};
