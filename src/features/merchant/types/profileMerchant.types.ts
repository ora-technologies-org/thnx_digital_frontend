// src/features/merchant/types/profile.types.ts

// Import shared types
import type {
  DocumentInfo,
  ProfileDocuments,
  ProfileStatus,
} from "@/shared/types/Form.types";

/**
 * Main profile data structure for merchant profiles
 * This extends the shared types with merchant-specific fields
 */
export interface ProfileData {
  id?: string;
  businessName: string;
  businessLogo?: string;
  address: string;
  city: string;
  state?: string;
  zipCode?: string;
  country: string;
  businessPhone: string;
  businessEmail: string;
  website?: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  ifscCode?: string;
  swiftCode?: string;
  businessRegistrationNumber?: string;
  taxId?: string;
  businessType?: string;
  businessCategory?: string;
  description?: string;
  profileStatus?: ProfileStatus;
  rejectionReason?: string;
  submittedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  isVerified?: boolean;

  // Document URLs (returned from API as strings)
  identityDocument?: string;
  registrationDocument?: string;
  taxDocument?: string;

  // Documents collection (flexible structure)
  documents?: ProfileDocuments;
}

/**
 * Profile status data with permissions and verification flags
 */
export interface ProfileStatusData {
  status: ProfileStatus;
  isProfileComplete: boolean;
  isVerified: boolean;
  canCreateGiftCards: boolean;
  canEdit: boolean;
  rejectionReason?: string;
}

/**
 * Payload for updating profile information
 */
export interface UpdateProfilePayload {
  name: string;
  phone: string;
  bio: string;
}

/**
 * API Success Response structure for profile operations
 * Handles various response formats from the backend
 */
export interface ApiSuccessResponse {
  success?: boolean;
  message?: string;
  data?: ProfileData;
  profile?: ProfileData;

  // Directly accessible properties (for flexibility)
  id?: string;
  businessLogo?: string;
  documents?: ProfileDocuments;

  // Allow any additional properties
  [key: string]: unknown;
}

/**
 * API Error Response structure
 */
export interface ApiErrorResponse {
  success?: false;
  message?: string;
  error?: string;
  errors?: Record<string, string | string[]>;
}

/**
 * Response structure for profile update
 */
export interface UpdateProfileResponse {
  success?: boolean;
  message?: string;
  data?: ProfileData;
}

/**
 * Generic API response structure
 */
export interface ApiResponse {
  success?: boolean;
  data?: {
    profile?: ProfileData;
    stats?: Record<string, unknown>;
    merchantProfile?: ProfileData;
  };
  profile?: ProfileData;
}

/**
 * Error structure for endpoint failures
 */
export interface EndpointError {
  message: string;
  response?: {
    status?: number;
    data?: ApiErrorResponse;
  };
}

/**
 * Form data mutation parameters
 */
export interface FormDataEntry {
  formData: FormData;
  isEdit: boolean;
  profileId?: string | number;
}

/**
 * Error message structure for mutations
 */
export interface ErrorMessage {
  response?: {
    data?: ApiErrorResponse;
    status?: number;
    statusText?: string;
  };
  message?: string;
}

// Re-export shared types for convenience
export type { DocumentInfo, ProfileDocuments, ProfileStatus };
