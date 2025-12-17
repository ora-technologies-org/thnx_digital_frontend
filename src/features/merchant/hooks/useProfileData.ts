// src/features/merchant/hooks/useProfileData.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/shared/utils/api";
import { AxiosError } from "axios";

export interface ProfileData {
  id?: string;
  businessName: string;
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
  profileStatus?: "incomplete" | "pending" | "approved" | "rejected";
  rejectionReason?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse {
  data?: ProfileData | { user?: { merchantProfile?: ProfileData } };
  success?: boolean;
}

interface EndpointError {
  message: string;
  response?: {
    status?: number;
  };
}

// Type guard to check if an object is a valid ProfileData
function isValidProfileData(data: unknown): data is ProfileData {
  if (!data || typeof data !== "object") {
    return false;
  }

  const obj = data as Record<string, unknown>;

  // Check required string fields
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

  // All required fields must exist and be strings
  return requiredFields.every(
    (field) =>
      field in obj && typeof obj[field] === "string" && obj[field] !== "",
  );
}

export const useProfileData = () => {
  return useQuery<ProfileData | null>({
    queryKey: ["merchant-profile"],
    queryFn: async (): Promise<ProfileData | null> => {
      try {
        // Try different possible endpoints for fetching merchant profile
        const endpoints = ["/auth/me"];

        let lastError: EndpointError | null = null;

        // Try each endpoint until one works
        for (const endpoint of endpoints) {
          try {
            console.log(`🔄 Trying endpoint: ${endpoint}`);
            const response = await api.get<ApiResponse>(endpoint);

            if (response.data) {
              console.log(`✅ Success with endpoint: ${endpoint}`);

              // Handle different response structures
              let profileData: unknown = response.data;

              // If response has success wrapper
              if (
                typeof profileData === "object" &&
                profileData !== null &&
                "success" in profileData &&
                profileData.success &&
                "data" in profileData
              ) {
                profileData = (profileData as { data: unknown }).data;
              }

              // If profile is nested under user
              if (
                typeof profileData === "object" &&
                profileData !== null &&
                "user" in profileData &&
                profileData.user &&
                typeof profileData.user === "object" &&
                "merchantProfile" in profileData.user
              ) {
                profileData = (profileData.user as { merchantProfile: unknown })
                  .merchantProfile;
              }

              // If it's an array, take first item
              if (Array.isArray(profileData) && profileData.length > 0) {
                profileData = profileData[0];
              }

              // Validate and transform the data
              if (isValidProfileData(profileData)) {
                // Format profileStatus if present
                const formattedData = { ...profileData };

                if (
                  formattedData.profileStatus &&
                  typeof formattedData.profileStatus === "string"
                ) {
                  const status = formattedData.profileStatus.toLowerCase();
                  if (
                    ["pending", "approved", "rejected", "incomplete"].includes(
                      status,
                    )
                  ) {
                    formattedData.profileStatus = status as
                      | "pending"
                      | "approved"
                      | "rejected"
                      | "incomplete";
                  }
                }

                return formattedData;
              } else {
                console.log("❌ Invalid profile data structure");
                continue;
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
            // Continue to next endpoint
          }
        }

        // If all endpoints failed with 404, return null (no profile exists)
        if (lastError?.response?.status === 404) {
          console.log("📭 No existing profile found");
          return null;
        }

        // If other errors occurred, throw the last error
        throw new Error(lastError?.message || "Failed to fetch profile data");
      } catch (error: unknown) {
        console.error("❌ Profile fetch error:", error);

        // Check if it's an AxiosError with 404 status
        if (error instanceof AxiosError && error.response?.status === 404) {
          return null;
        }

        // Check if it's a regular Error with 404 status
        if (error instanceof Error && error.message.includes("404")) {
          return null;
        }

        // For other errors, show console error but don't throw
        console.error("Failed to fetch profile:", error);
        return null;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
