// src/features/merchant/hooks/useProfileData.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/shared/utils/api";
import { AxiosError } from "axios";

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
  profileStatus?:
    | "incomplete"
    | "pending"
    | "approved"
    | "rejected"
    | "PENDING_VERIFICATION";
  rejectionReason?: string;
  submittedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse {
  success?: boolean;
  data?: {
    profile?: ProfileData;
    stats?: Record<string, unknown>;
  };
  profile?: ProfileData;
}

interface EndpointError {
  message: string;
  response?: {
    status?: number;
  };
}

/**
 * Type guard to validate profile data structure
 * Ensures all required fields are present and non-empty
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
 * Custom hook to fetch merchant profile data
 * Tries multiple API endpoints in sequence, normalizes response structures,
 * and handles various error scenarios including 404 (no profile exists)
 */
export const useProfileData = () => {
  return useQuery<ProfileData | null>({
    queryKey: ["merchant-profile"],
    queryFn: async (): Promise<ProfileData | null> => {
      try {
        // Try multiple endpoints in case API structure changes
        const endpoints = ["/auth/me", "/merchants/profile"];
        let lastError: EndpointError | null = null;

        for (const endpoint of endpoints) {
          try {
            console.log(`🔄 Trying endpoint: ${endpoint}`);
            const response = await api.get<ApiResponse>(endpoint);

            if (response.data) {
              console.log(
                `✅ Success with endpoint: ${endpoint}`,
                response.data,
              );

              let profileData: unknown = response.data;

              // Handle API response with success wrapper
              if (
                typeof profileData === "object" &&
                profileData !== null &&
                "success" in profileData &&
                profileData.success === true &&
                "data" in profileData
              ) {
                const data = (profileData as { data: unknown }).data;

                // Extract profile from nested data.profile
                if (
                  typeof data === "object" &&
                  data !== null &&
                  "profile" in data
                ) {
                  profileData = (data as { profile: unknown }).profile;
                  console.log(
                    "📦 Extracted profile from data.profile:",
                    profileData,
                  );
                }
              }

              // Handle direct profile property in response
              if (
                typeof profileData === "object" &&
                profileData !== null &&
                "profile" in profileData
              ) {
                profileData = (profileData as { profile: unknown }).profile;
                console.log(
                  "📦 Extracted profile from root.profile:",
                  profileData,
                );
              }

              // Validate and process the extracted profile data
              if (isValidProfileData(profileData)) {
                const formattedData = { ...profileData } as ProfileData;

                // Normalize profile status to standard values
                if (formattedData.profileStatus) {
                  const status = formattedData.profileStatus.toLowerCase();
                  if (
                    status.includes("pending") ||
                    status.includes("pending_verification")
                  ) {
                    formattedData.profileStatus = "pending";
                  } else if (
                    status.includes("approved") ||
                    status.includes("verified")
                  ) {
                    formattedData.profileStatus = "approved";
                  } else if (status.includes("rejected")) {
                    formattedData.profileStatus = "rejected";
                  } else if (status.includes("incomplete")) {
                    formattedData.profileStatus = "incomplete";
                  }
                }

                console.log(
                  "✅ Returning formatted profile data:",
                  formattedData,
                );
                return formattedData;
              } else {
                console.log("❌ Invalid profile data structure:", profileData);
                // Diagnostic logging for debugging
                if (typeof profileData === "object" && profileData !== null) {
                  console.log(
                    "🔍 Actual object keys:",
                    Object.keys(profileData),
                  );
                  console.log("🔍 Has id property:", "id" in profileData);
                  console.log(
                    "🔍 Has businessName:",
                    "businessName" in profileData,
                  );
                }
                continue; // Try next endpoint
              }
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
    // Cache configuration
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: 1, // Single retry for transient failures
    refetchOnWindowFocus: false, // Prevent refetch on tab focus
  });
};

// Default export for convenience
export default useProfileData;
