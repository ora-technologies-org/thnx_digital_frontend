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
  email: string;
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
   */
  changePassword: async (
    password: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<ChangePasswordResponse> => {
    // Extract email from localStorage - prioritize JWT token
    let email = "";

    try {
      // First, try to get from JWT token (most reliable source)
      const accessToken = localStorage.getItem("accessToken");

      if (accessToken) {
        try {
          // Decode JWT token to extract email
          const base64Url = accessToken.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const payload = JSON.parse(atob(base64));

          console.log("Decoded token payload:", payload);
          email = payload.email || "";
        } catch (e) {
          console.error("Could not decode accessToken:", e);
        }
      }

      // Fallback: try to get email from stored user data
      if (!email) {
        const userDataString = localStorage.getItem("user");
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          email = userData.email || "";
        }
      }

      // Fallback: try to get email directly from localStorage
      if (!email) {
        email = localStorage.getItem("email") || "";
      }

      console.log("Final email extracted:", email);

      if (!email) {
        throw new Error("No email found. Please log in again.");
      }
    } catch (error) {
      console.error("Error retrieving email from localStorage:", error);
      throw error;
    }

    const payload: ChangePasswordRequest = {
      email,
      password,
      newPassword,
      confirmPassword,
    };

    console.log("Change Password Payload being sent:", {
      email,
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
