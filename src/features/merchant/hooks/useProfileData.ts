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

function isValidProfileData(data: unknown): data is ProfileData {
  if (!data || typeof data !== "object") {
    return false;
  }

  const obj = data as Record<string, unknown>;

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

export const useProfileData = () => {
  return useQuery<ProfileData | null>({
    queryKey: ["merchant-profile"],
    queryFn: async (): Promise<ProfileData | null> => {
      try {
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

              // Handle different response structures
              if (
                typeof profileData === "object" &&
                profileData !== null &&
                "success" in profileData &&
                profileData.success === true &&
                "data" in profileData
              ) {
                const data = (profileData as { data: unknown }).data;

                // Check if data has a profile property
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

              // Handle direct profile response
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

              if (isValidProfileData(profileData)) {
                const formattedData = { ...profileData } as ProfileData;

                // Normalize profileStatus
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
                // Try to see what we actually got
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
          }
        }

        if (lastError?.response?.status === 404) {
          console.log("📭 No existing profile found (404)");
          return null;
        }

        throw new Error(lastError?.message || "Failed to fetch profile data");
      } catch (error: unknown) {
        console.error("❌ Profile fetch error:", error);

        if (error instanceof AxiosError && error.response?.status === 404) {
          console.log("📭 No profile exists - returning null");
          return null;
        }

        if (error instanceof Error && error.message.includes("404")) {
          console.log("📭 No profile exists - returning null");
          return null;
        }

        console.error("Failed to fetch profile:", error);
        return null;
      }
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// Default export for convenience
export default useProfileData;
