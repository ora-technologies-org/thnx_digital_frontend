// src/features/admin/services/resetPasswordService.ts
import api from "@/shared/utils/api";
import type { AxiosError } from "axios";

/**
 * Request payload for changing user password
 */
export interface ChangePasswordRequest {
  email: string;
  password: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Response structure for successful password change
 */
export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

/**
 * Represents a single validation error from the backend
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Error response structure from the API
 */
export interface ErrorResponse {
  success: false;
  errors?: ValidationError[];
  message?: string;
}

/**
 * Base URL for authentication-related endpoints
 */
const AUTH_BASE_URL = "/auth";

/**
 * Changes the admin password by sending a request to the backend API
 *
 * @param data - The password change request data including email, current password, and new password
 * @returns Promise resolving to the success response with a message
 * @throws Error with validation messages or a generic failure message
 *
 */
export async function changePassword(
  data: ChangePasswordRequest,
): Promise<ChangePasswordResponse> {
  try {
    // Make API request to change password endpoint
    // <ChangePasswordResponse> - Generic type parameter that specifies the structure of response.data
    const response = await api.post<ChangePasswordResponse>(
      `${AUTH_BASE_URL}/admin-password`,
      data, // TypeScript already knows this is ChangePasswordRequest
    );
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<ErrorResponse>;

    // Handle validation errors returned from backend
    if (err.response?.data?.errors?.length) {
      const errorMessages = err.response.data.errors
        .map((e) => `${e.field}: ${e.message}`)
        .join(", ");
      throw new Error(errorMessages);
    }

    // Handle generic error with fallback message
    throw new Error(err.response?.data?.message || "Failed to change password");
  }
}
