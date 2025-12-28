// src/features/merchant/hooks/useProfileStatus.ts - FIXED DATA EXTRACTION
import { useState, useEffect } from "react";
import api from "../../../shared/utils/api";

export type ProfileStatus = "incomplete" | "pending" | "approved" | "rejected";

interface ProfileStatusData {
  status: ProfileStatus;
  isProfileComplete: boolean;
  isVerified: boolean;
  canCreateGiftCards: boolean;
  canEdit: boolean;
  rejectionReason?: string;
}

// Map backend status to frontend status
const mapBackendStatus = (
  backendStatus: string | null,
  isVerified: boolean,
  hasRequiredFields: boolean,
): ProfileStatus => {
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
};

export const useProfileStatus = () => {
  const [profileStatus, setProfileStatus] = useState<ProfileStatusData>({
    status: "incomplete",
    isProfileComplete: false,
    isVerified: false,
    canCreateGiftCards: false,
    canEdit: true,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfileStatus = async () => {
    try {
      // Get current user data (which includes merchantProfile)
      const response = await api.get("/auth/me");

      console.log("API Response:", response.data);

      // FIXED: Correct data extraction based on actual API response structure
      // The response structure is: { success, message, data: { ...userData... } }
      const userData = response.data.data || response.data;

      console.log("User Data:", userData);
      console.log("Merchant Profile:", userData.merchantProfile);

      const merchantProfile = userData.merchantProfile;

      if (!merchantProfile) {
        // No merchant profile exists yet - show as incomplete
        setProfileStatus({
          status: "incomplete",
          isProfileComplete: false,
          isVerified: false,
          canCreateGiftCards: false,
          canEdit: true,
        });
        setIsLoading(false);
        return;
      }

      // Check if required fields are filled
      const hasRequiredFields = !!(
        merchantProfile.address &&
        merchantProfile.city &&
        merchantProfile.country &&
        merchantProfile.businessPhone &&
        merchantProfile.businessEmail
      );

      console.log("Has Required Fields:", hasRequiredFields);
      console.log("Is Verified:", merchantProfile.isVerified);
      console.log("Profile Status:", merchantProfile.profileStatus);

      // Map the backend status to our frontend status
      const mappedStatus = mapBackendStatus(
        merchantProfile.profileStatus,
        merchantProfile.isVerified,
        hasRequiredFields,
      );

      console.log("Mapped Status:", mappedStatus);

      // Determine if profile can be edited
      // Can edit ONLY when: pending (make changes while under review) OR rejected (fix and resubmit)
      // Cannot edit when: incomplete (use "Complete Profile Now" button) or approved (verified already)
      const canEdit = mappedStatus === "pending" || mappedStatus === "rejected";

      const finalProfileStatus = {
        status: mappedStatus,
        isProfileComplete: hasRequiredFields,
        isVerified: merchantProfile.isVerified || false,
        canCreateGiftCards: merchantProfile.isVerified || false,
        canEdit: canEdit,
        rejectionReason: merchantProfile.rejectionReason || undefined,
      };

      console.log("Final Profile Status:", finalProfileStatus);

      setProfileStatus(finalProfileStatus);
    } catch (error) {
      console.error("Error fetching profile status:", error);
      // Default to incomplete if error
      setProfileStatus({
        status: "incomplete",
        isProfileComplete: false,
        isVerified: false,
        canCreateGiftCards: false,
        canEdit: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileStatus();
  }, []);

  const refresh = () => {
    setIsLoading(true);
    fetchProfileStatus();
  };

  return {
    ...profileStatus,
    isLoading,
    refresh,
  };
};
