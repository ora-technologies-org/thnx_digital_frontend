// src/features/merchant/services/profileService.ts
import api from "@/shared/utils/api";
import { AxiosError } from "axios";
import type {
  ProfileData,
  ProfileStatus,
  ProfileStatusData,
  UpdateProfilePayload,
  UpdateProfileResponse,
  ApiResponse,
  EndpointError,
} from "../types/profileMerchant.types";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Type guard to validate profile data structure
 * Ensures all required fields are present and non-empty
 *
 * @param data - Unknown data to validate
 * @returns True if data matches ProfileData structure
 */
function isValidProfileData(data: unknown): data is ProfileData {
  if (!data || typeof data !== "object") {
    return false;
  }

  const obj = data as Record<string, unknown>;

  // Required fields for a valid merchant profile
  const requiredFields = [
    "businessName",
    "address",
    "city",
    "country",
    "businessPhone",
    "businessEmail",
    "bankName",
    "accountNumber",
    "accountHolderName",
  ];

  return requiredFields.every(
    (field) =>
      field in obj && typeof obj[field] === "string" && obj[field] !== "",
  );
}

/**
 * Normalizes profile status values to standard format
 *
 * @param status - Raw status value from API
 * @returns Normalized status value
 */
function normalizeProfileStatus(status: string): ProfileData["profileStatus"] {
  const normalizedStatus = status.toLowerCase();

  if (
    normalizedStatus.includes("pending") ||
    normalizedStatus.includes("pending_verification")
  ) {
    return "pending";
  } else if (
    normalizedStatus.includes("approved") ||
    normalizedStatus.includes("verified")
  ) {
    return "approved";
  } else if (normalizedStatus.includes("rejected")) {
    return "rejected";
  } else if (normalizedStatus.includes("incomplete")) {
    return "incomplete";
  }

  return status as ProfileData["profileStatus"];
}

/**
 * Maps backend status to frontend ProfileStatus enum
 *
 * @param backendStatus - Raw status from backend API
 * @param isVerified - Whether the profile is verified
 * @param hasRequiredFields - Whether all required fields are filled
 * @returns Normalized ProfileStatus
 */
function mapBackendStatus(
  backendStatus: string | null | undefined,
  isVerified: boolean,
  hasRequiredFields: boolean,
): ProfileStatus {
  // If already verified, return approved regardless of other fields
  if (isVerified) {
    return "approved";
  }

  // If no status set yet, check if profile has required fields
  if (!backendStatus) {
    return hasRequiredFields ? "pending" : "incomplete";
  }

  const status = backendStatus.toUpperCase();

  switch (status) {
    case "VERIFIED":
    case "APPROVED":
      return "approved";
    case "PENDING":
      return "pending";
    case "REJECTED":
      return "rejected";
    case "INCOMPLETE":
    default:
      return hasRequiredFields ? "pending" : "incomplete";
  }
}

/**
 * Checks if merchant profile has all required fields filled
 *
 * @param profile - Merchant profile data
 * @returns True if all required fields are present and non-empty
 */
function hasRequiredFields(profile: ProfileData): boolean {
  return !!(
    profile.address &&
    profile.city &&
    profile.country &&
    profile.businessPhone &&
    profile.businessEmail
  );
}

/**
 * Extracts and normalizes profile data from various API response structures
 *
 * @param responseData - Raw API response data
 * @returns Normalized profile data or null
 */
function extractProfileData(responseData: unknown): ProfileData | null {
  let profileData: unknown = responseData;

  // Handle API response with success wrapper: { success: true, data: { profile: {...} } }
  if (
    typeof profileData === "object" &&
    profileData !== null &&
    "success" in profileData &&
    profileData.success === true &&
    "data" in profileData
  ) {
    const data = (profileData as { data: unknown }).data;

    // Extract profile from nested data.profile
    if (typeof data === "object" && data !== null && "profile" in data) {
      profileData = (data as { profile: unknown }).profile;
      console.log("📦 Extracted profile from data.profile:", profileData);
    }
  }

  // Handle direct profile property in response: { profile: {...} }
  if (
    typeof profileData === "object" &&
    profileData !== null &&
    "profile" in profileData
  ) {
    profileData = (profileData as { profile: unknown }).profile;
    console.log("📦 Extracted profile from root.profile:", profileData);
  }

  // Validate and format the extracted profile data
  if (isValidProfileData(profileData)) {
    const formattedData = { ...profileData } as ProfileData;

    // Normalize profile status to standard values
    if (formattedData.profileStatus) {
      formattedData.profileStatus = normalizeProfileStatus(
        formattedData.profileStatus,
      );
    }

    console.log("✅ Returning formatted profile data:", formattedData);
    return formattedData;
  } else {
    console.log("❌ Invalid profile data structure:", profileData);
    // Diagnostic logging for debugging
    if (typeof profileData === "object" && profileData !== null) {
      console.log("🔍 Actual object keys:", Object.keys(profileData));
      console.log("🔍 Has id property:", "id" in profileData);
      console.log("🔍 Has businessName:", "businessName" in profileData);
    }
    return null;
  }
}

// ============================================================================
// SERVICE OBJECT - PUBLIC API
// ============================================================================

/**
 * Profile service for handling all merchant profile-related API operations
 * Centralizes profile data fetching, status checking, and updates
 */
export const profileService = {
  /**
   * Fetches merchant profile data from API
   * Tries multiple endpoints in sequence to handle different API structures
   *
   * @returns Promise resolving to ProfileData or null if no profile exists
   * @throws Error if all endpoints fail (except 404)
   */
  getProfile: async (): Promise<ProfileData | null> => {
    try {
      // Try multiple endpoints in case API structure changes
      const endpoints = ["/auth/me", "/merchants/profile"];
      let lastError: EndpointError | null = null;

      for (const endpoint of endpoints) {
        try {
          console.log(`🔄 Trying endpoint: ${endpoint}`);
          const response = await api.get<ApiResponse>(endpoint);

          if (response.data) {
            console.log(`✅ Success with endpoint: ${endpoint}`, response.data);

            // Extract and validate profile data
            const profileData = extractProfileData(response.data);

            if (profileData) {
              return profileData;
            }

            // If extraction failed, try next endpoint
            continue;
          }
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          console.log(`❌ Endpoint ${endpoint} failed:`, errorMessage);

          lastError = {
            message: errorMessage,
            response:
              error instanceof AxiosError
                ? {
                    status: error.response?.status,
                  }
                : undefined,
          };
        }
      }

      // Handle 404 specifically as "no profile exists" (not an error)
      if (lastError?.response?.status === 404) {
        console.log("📭 No existing profile found (404)");
        return null;
      }

      throw new Error(lastError?.message || "Failed to fetch profile data");
    } catch (error: unknown) {
      console.error("❌ Profile fetch error:", error);

      // Gracefully handle missing profiles
      if (error instanceof AxiosError && error.response?.status === 404) {
        console.log("📭 No profile exists - returning null");
        return null;
      }

      if (error instanceof Error && error.message.includes("404")) {
        console.log("📭 No profile exists - returning null");
        return null;
      }

      console.error("Failed to fetch profile:", error);
      return null; // Return null instead of throwing to prevent UI crashes
    }
  },

  /**
   * Fetches merchant profile status and determines permissions
   *
   * This function:
   * - Gets current user data including merchant profile
   * - Determines profile completion status
   * - Calculates permissions (edit, create gift cards)
   * - Maps backend status to frontend status format
   *
   * @returns Promise resolving to ProfileStatusData
   */
  getProfileStatus: async (): Promise<ProfileStatusData> => {
    try {
      // Get current user data (which includes merchantProfile)
      const response = await api.get("/auth/me");

      console.log("API Response:", response.data);

      // Extract user data from response
      // The response structure is: { success, message, data: { ...userData... } }
      const userData = response.data.data || response.data;

      console.log("User Data:", userData);
      console.log("Merchant Profile:", userData.merchantProfile);

      const merchantProfile = userData.merchantProfile as
        | ProfileData
        | undefined;

      // No merchant profile exists yet - show as incomplete
      if (!merchantProfile) {
        return {
          status: "incomplete",
          isProfileComplete: false,
          isVerified: false,
          canCreateGiftCards: false,
          canEdit: true,
        };
      }

      // Check if required fields are filled
      const hasRequired = hasRequiredFields(merchantProfile);

      console.log("Has Required Fields:", hasRequired);
      console.log("Is Verified:", merchantProfile.isVerified);
      console.log("Profile Status:", merchantProfile.profileStatus);

      // Map the backend status to our frontend status
      const mappedStatus = mapBackendStatus(
        merchantProfile.profileStatus,
        merchantProfile.isVerified || false,
        hasRequired,
      );

      console.log("Mapped Status:", mappedStatus);

      // Determine if profile can be edited
      // Can edit ONLY when: pending (make changes while under review) OR rejected (fix and resubmit)
      // Cannot edit when: incomplete (use "Complete Profile Now" button) or approved (verified already)
      const canEdit = mappedStatus === "pending" || mappedStatus === "rejected";

      const finalProfileStatus: ProfileStatusData = {
        status: mappedStatus,
        isProfileComplete: hasRequired,
        isVerified: merchantProfile.isVerified || false,
        canCreateGiftCards: merchantProfile.isVerified || false,
        canEdit: canEdit,
        rejectionReason: merchantProfile.rejectionReason || undefined,
      };

      console.log("Final Profile Status:", finalProfileStatus);

      return finalProfileStatus;
    } catch (error) {
      console.error("Error fetching profile status:", error);

      // Default to incomplete if error occurs
      return {
        status: "incomplete",
        isProfileComplete: false,
        isVerified: false,
        canCreateGiftCards: false,
        canEdit: true,
      };
    }
  },

  /**
   * Updates merchant profile information
   *
   * @param data - Profile update payload containing name, phone, and bio
   * @returns Promise resolving to the API response
   * @throws AxiosError if the update fails
   */
  updateProfile: async (
    data: UpdateProfilePayload,
  ): Promise<UpdateProfileResponse> => {
    const response = await api.put<UpdateProfileResponse>(
      "/merchants/update/profile",
      data,
    );
    return response.data;
  },
};
