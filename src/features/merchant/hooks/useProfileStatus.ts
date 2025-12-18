// src/features/merchant/hooks/useProfileStatus.ts - COMPLETE STATUS FLOW
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

      const userData =
        response.data.data?.user || response.data.user || response.data;
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

      // Map the backend status to our frontend status
      const mappedStatus = mapBackendStatus(
        merchantProfile.profileStatus,
        merchantProfile.isVerified,
        hasRequiredFields,
      );

      // Determine if profile can be edited
      // Can edit when: incomplete, or rejected
      // Cannot edit when: pending (under review), or approved
      const canEdit = mappedStatus !== "approved";

      setProfileStatus({
        status: mappedStatus,
        isProfileComplete: hasRequiredFields,
        isVerified: merchantProfile.isVerified || false,
        canCreateGiftCards: merchantProfile.isVerified || false,
        canEdit: canEdit,
        rejectionReason: merchantProfile.rejectionReason || undefined,
      });
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
