// src/features/merchant/hooks/useProfileData.ts
import {
  profileService,
  type ProfileData,
} from "@/features/merchant/services/ProfileMerchantService";
import { useQuery } from "@tanstack/react-query";

/**
 * Custom hook to fetch merchant profile data
 *
 * Uses React Query to manage server state with caching and automatic refetching.
 * Delegates data fetching to profileService for separation of concerns.
 *
 * @returns Query object containing profile data, loading state, and error state
 */
export const useProfileData = () => {
  return useQuery<ProfileData | null>({
    queryKey: ["merchant-profile"],
    queryFn: async (): Promise<ProfileData | null> => {
      return await profileService.getProfile();
    },
    // Cache configuration
    staleTime: 1000 * 60 * 5, // Data considered fresh for 5 minutes
    gcTime: 1000 * 60 * 30, // Cache persists for 30 minutes after last use
    retry: 1, // Single retry for transient failures
    refetchOnWindowFocus: false, // Prevent automatic refetch when user returns to tab
  });
};

// Default export for convenience
export default useProfileData;

// Re-export ProfileData type for consumers
export type { ProfileData } from "@/features/merchant/services/ProfileMerchantService";
