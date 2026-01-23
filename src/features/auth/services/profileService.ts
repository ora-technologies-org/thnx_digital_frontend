// src/features/admin/services/profileService.ts
import api from "@/shared/utils/api";
import type { AxiosError } from "axios";

/**
 * Represents an admin user's profile data
 */
export interface AdminProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Request payload for updating admin profile
 * All fields are optional - only provided fields will be updated
 */
export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  avatar?: string;
  bio?: string;
}

/**
 * Success response structure from profile endpoints
 */
export interface ProfileResponse {
  success: boolean;
  data: AdminProfile;
  message?: string;
}

/**
 * Error response structure from the API
 * Contains either validation errors or a general error message
 */
export interface ErrorResponse {
  success: false;
  errors?: Array<{ field: string; message: string }>;
  message?: string;
}

/**
 * Base URL for admin-related endpoints
 */
const ADMIN_BASE_URL = "/admin";

/**
 * Fetches the currently authenticated admin user's profile
 *
 * @returns Promise resolving to the admin's profile data
 * @throws Error with message if the request fails
 *
 * @example
 * ```typescript
 * try {
 *   const profile = await getProfile();
 *   console.log(profile.name, profile.email);
 * } catch (error) {
 *   console.error('Failed to load profile:', error.message);
 * }
 * ```
 */
export async function getProfile(): Promise<AdminProfile> {
  try {
    // Fetch profile data from the backend
    const response = await api.get<ProfileResponse>(`${ADMIN_BASE_URL}/me`);

    return response.data.data;
  } catch (error: unknown) {
    // Type-safe error handling for Axios errors
    const err = error as AxiosError<ErrorResponse>;

    // Throw user-friendly error with backend message or fallback
    throw new Error(err.response?.data?.message || "Failed to fetch profile");
  }
}

/**
 * Updates the currently authenticated admin user's profile
 *
 * @param data - Partial profile data to update (only provided fields are updated)
 * @returns Promise resolving to the updated admin profile
 * @throws Error with validation messages or a generic failure message
 *
 * @example
 * ```typescript
 * try {
 *   const updatedProfile = await updateProfile({
 *     name: "John Doe",
 *     phone: "+1234567890"
 *   });
 *   console.log('Profile updated:', updatedProfile);
 * } catch (error) {
 *   console.error('Update failed:', error.message);
 * }
 * ```
 */
export async function updateProfile(
  data: UpdateProfileRequest,
): Promise<AdminProfile> {
  try {
    // Send update request to the backend
    const response = await api.put<ProfileResponse>(
      `${ADMIN_BASE_URL}/profile`,
      data,
    );

    // Extract and return the updated profile data
    return response.data.data;
  } catch (error: unknown) {
    // Type-safe error handling for Axios errors
    const err = error as AxiosError<ErrorResponse>;

    // Handle validation errors from backend
    // Multiple field errors are concatenated into a single message
    if (err.response?.data?.errors?.length) {
      const errorMessages = err.response.data.errors
        .map((e) => `${e.field}: ${e.message}`)
        .join(", ");
      throw new Error(errorMessages);
    }

    // Handle generic error with fallback message
    throw new Error(err.response?.data?.message || "Failed to update profile");
  }
}
