// src/features/admin/services/profileService.ts
import api from "@/shared/utils/api";
import type { AxiosError } from "axios";

export interface AdminProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  avatar?: string;
}

export interface ProfileResponse {
  success: boolean;
  data: AdminProfile;
  message?: string;
}

export interface ErrorResponse {
  success: false;
  errors?: Array<{ field: string; message: string }>;
  message?: string;
}

class ProfileService {
  private readonly baseUrl = "/admin";

  async getProfile(): Promise<AdminProfile> {
    try {
      const response = await api.get<ProfileResponse>(
        `${this.baseUrl}/profile`,
      );
      return response.data.data;
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorResponse>;
      throw new Error(err.response?.data?.message || "Failed to fetch profile");
    }
  }

  async updateProfile(data: UpdateProfileRequest): Promise<AdminProfile> {
    try {
      const response = await api.put<ProfileResponse>(
        `${this.baseUrl}/profile`,
        data,
      );
      return response.data.data;
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorResponse>;

      if (err.response?.data?.errors?.length) {
        const errorMessages = err.response.data.errors
          .map((e) => `${e.field}: ${e.message}`)
          .join(", ");
        throw new Error(errorMessages);
      }

      throw new Error(
        err.response?.data?.message || "Failed to update profile",
      );
    }
  }
}

export const profileService = new ProfileService();
