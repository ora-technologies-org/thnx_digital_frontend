// src/features/admin/services/resetPasswordService.ts
import api from "@/shared/utils/api";
import type { AxiosError } from "axios";

export interface ChangePasswordRequest {
  email: string;
  password: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ErrorResponse {
  success: false;
  errors?: ValidationError[];
  message?: string;
}

class PasswordService {
  private readonly baseUrl = "/auth";

  async changePassword(
    data: ChangePasswordRequest,
  ): Promise<ChangePasswordResponse> {
    try {
      const response = await api.post<ChangePasswordResponse>(
        `${this.baseUrl}/admin-password`,
        data,
      );
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorResponse>;

      // ✅ Validation errors from backend
      if (err.response?.data?.errors?.length) {
        const errorMessages = err.response.data.errors
          .map((e) => `${e.field}: ${e.message}`)
          .join(", ");
        throw new Error(errorMessages);
      }

      // ✅ Fallback error message
      throw new Error(
        err.response?.data?.message || "Failed to change password",
      );
    }
  }
}

export const passwordService = new PasswordService();
