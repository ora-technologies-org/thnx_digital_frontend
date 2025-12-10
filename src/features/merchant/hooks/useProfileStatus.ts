


// src/features/merchant/hooks/useProfileStatus.ts - FIXED FOR YOUR BACKEND
import { useState, useEffect } from 'react';
import api from '../../../shared/utils/api';

export type ProfileStatus = 'incomplete' | 'pending' | 'approved' | 'rejected';

interface ProfileStatusData {
  status: ProfileStatus;
  isProfileComplete: boolean;
  isVerified: boolean;
  canCreateGiftCards: boolean;
  rejectionReason?: string;
}

// Map backend status to frontend status
const mapBackendStatus = (backendStatus: string | null, isVerified: boolean): ProfileStatus => {
  if (!backendStatus) return 'incomplete';
  
  const status = backendStatus.toUpperCase();
  
  switch (status) {
    case 'VERIFIED':
    case 'APPROVED':
      return 'approved';
    case 'PENDING':
      return 'pending';
    case 'REJECTED':
      return 'rejected';
    case 'INCOMPLETE':
    default:
      return 'incomplete';
  }
};

export const useProfileStatus = () => {
  const [profileStatus, setProfileStatus] = useState<ProfileStatusData>({
    status: 'incomplete',
    isProfileComplete: false,
    isVerified: false,
    canCreateGiftCards: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfileStatus = async () => {
    try {
      // Get current user data (which includes merchantProfile)
      const response = await api.get('/auth/me'); // Adjust endpoint if needed
      
      const userData = response.data.data?.user || response.data.user || response.data;
      const merchantProfile = userData.merchantProfile;

      if (!merchantProfile) {
        // No merchant profile exists yet
        setProfileStatus({
          status: 'incomplete',
          isProfileComplete: false,
          isVerified: false,
          canCreateGiftCards: false,
        });
        setIsLoading(false);
        return;
      }

      // Map the backend status to our frontend status
      const mappedStatus = mapBackendStatus(
        merchantProfile.profileStatus,
        merchantProfile.isVerified
      );

      // Determine if profile is complete
      // Profile is complete if it has required fields filled
      const isProfileComplete = !!(
        merchantProfile.address &&
        merchantProfile.city &&
        merchantProfile.country &&
        merchantProfile.businessPhone &&
        merchantProfile.businessEmail
      );

      setProfileStatus({
        status: mappedStatus,
        isProfileComplete: isProfileComplete || merchantProfile.isVerified,
        isVerified: merchantProfile.isVerified || false,
        canCreateGiftCards: merchantProfile.isVerified || false,
        rejectionReason: merchantProfile.rejectionReason || undefined,
      });

    } catch (error) {
      console.error('Error fetching profile status:', error);
      // Default to incomplete if error
      setProfileStatus({
        status: 'incomplete',
        isProfileComplete: false,
        isVerified: false,
        canCreateGiftCards: false,
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