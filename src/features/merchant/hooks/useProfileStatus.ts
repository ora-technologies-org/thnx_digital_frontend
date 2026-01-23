// src/features/merchant/hooks/useProfileStatus.ts
import { useState, useEffect } from "react";

import { profileService } from "../services/ProfileMerchantService";
import {
  ProfileStatusData,
  type ProfileStatus,
} from "../types/profileMerchant.types";

/**
 * Custom hook to fetch and manage merchant profile status
 *
 * This hook:
 * - Fetches profile status on mount
 * - Provides loading state management
 * - Exposes a refresh function to manually refetch status
 * - Returns profile completion status and permissions
 *
 * @returns Object containing profile status data, loading state, and refresh function
 */
export const useProfileStatus = () => {
  const [profileStatus, setProfileStatus] = useState<ProfileStatusData>({
    status: "incomplete",
    isProfileComplete: false,
    isVerified: false,
    canCreateGiftCards: false,
    canEdit: true,
  });
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Fetches profile status from the service layer
   * Updates component state with the result
   */
  const fetchProfileStatus = async () => {
    try {
      const status = await profileService.getProfileStatus();
      setProfileStatus(status);
    } catch (error) {
      console.error("Error in useProfileStatus:", error);
      // Keep default incomplete status if error occurs
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch profile status on component mount
  useEffect(() => {
    fetchProfileStatus();
  }, []);

  /**
   * Manually refresh profile status
   * Useful after profile updates or verification status changes
   */
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

// Re-export types for consumers
export type { ProfileStatus, ProfileStatusData };
