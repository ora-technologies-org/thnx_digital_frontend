// src/features/auth/services/passwordService.ts
import api from "@/shared/utils/api";
import type {
  GetOtpResponse,
  VerifyOtpResponse,
  ResetPasswordResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
} from "../types/passwordMerchant.types";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Extracts email from localStorage using multiple fallback methods
 * Priority: JWT token > user data object > direct email key
 *
 * @returns Email string if found
 * @throws Error if no email is found in any storage location
 */
function extractEmailFromStorage(): string {
  let email = "";

  try {
    // Method 1: Extract from JWT access token (most reliable)
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      try {
        // Decode JWT token to extract email from payload
        const base64Url = accessToken.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(atob(base64));

        console.log("Decoded token payload:", payload);
        email = payload.email || "";
      } catch (e) {
        console.error("Could not decode accessToken:", e);
      }
    }

    // Method 2: Extract from stored user data object
    if (!email) {
      const userDataString = localStorage.getItem("user");
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        email = userData.email || "";
      }
    }

    // Method 3: Direct email key in localStorage
    if (!email) {
      email = localStorage.getItem("email") || "";
    }

    console.log("Final email extracted:", email);

    if (!email) {
      throw new Error("No email found. Please log in again.");
    }

    return email;
  } catch (error) {
    console.error("Error retrieving email from localStorage:", error);
    throw error;
  }
}

// ============================================================================
// SERVICE OBJECTS - PUBLIC API
// ============================================================================

/**
 * Service for handling password change operations
 * Requires user to be authenticated
 */
export const changePasswordService = {
  /**
   * Change user password
   * Automatically extracts email from localStorage
   *
   * @param password - Current password
   * @param newPassword - New password
   * @param confirmPassword - Confirmation of new password
   * @returns Promise resolving to ChangePasswordResponse
   * @throws Error if email cannot be extracted or API call fails
   */
  changePassword: async (
    password: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<ChangePasswordResponse> => {
    const email = extractEmailFromStorage();

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

/**
 * Service for handling forgot password flow
 * Includes OTP generation, verification, and password reset
 */
export const forgotPasswordService = {
  /**
   * Request OTP for password reset
   * Sends OTP to the provided email address
   *
   * @param email - User's email address
   * @returns Promise resolving to GetOtpResponse with expiry info
   */
  getOtp: async (email: string): Promise<GetOtpResponse> => {
    const response = await api.post<GetOtpResponse>("/auth/get-otp", { email });
    return response.data;
  },

  /**
   * Verify OTP received via email
   *
   * @param email - User's email address
   * @param otp - One-time password received via email
   * @returns Promise resolving to VerifyOtpResponse with reset token
   */
  verifyOtp: async (email: string, otp: string): Promise<VerifyOtpResponse> => {
    const response = await api.post<VerifyOtpResponse>("/auth/verify-otp", {
      email,
      otp,
    });
    return response.data;
  },

  /**
   * Reset password using verified OTP
   *
   * @param email - User's email address
   * @param otp - Verified one-time password
   * @param password - New password
   * @param confirmPassword - Confirmation of new password
   * @returns Promise resolving to ResetPasswordResponse
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

    console.log("Reset Password Payload being sent:", {
      email,
      otp: "***",
      password: "***",
      confirmPassword: "***",
    });

    const response = await api.post<ResetPasswordResponse>(
      "/auth/reset-password",
      payload,
    );

    return response.data;
  },
};
