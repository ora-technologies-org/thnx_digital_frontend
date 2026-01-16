// src/features/merchant/hooks/useAuthMe.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/shared/utils/api";

interface AuthMeResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    email: string;
    name: string;
    phone: string;
    role: string;
    avatar: string | null;
    bio: string;
    emailVerified: boolean;
    isActive: boolean;
    createdAt: string;
    lastLogin: string;
    merchantProfile?: {
      id: string;
      businessName: string;
      profileStatus: string;
      isVerified: boolean;
      verifiedAt: string;
      rejectionReason: string | null;
      rejectedAt: string | null;
      address: string;
      city: string;
      country: string;
      businessPhone: string;
      businessEmail: string;
      website: string | null;
      logo: string | null;
      description: string | null;
    };
  };
}

export interface UserData {
  name: string;
  phone: string;
  bio: string;
}
// Fetches the authenticated user's data
export const useAuthMe = () => {
  return useQuery<UserData>({
    queryKey: ["auth-me"],
    queryFn: async (): Promise<UserData> => {
      const response = await api.get<AuthMeResponse>("/auth/me");
      const user = response.data.data;

      return {
        name: user.name || "",
        phone: user.phone || "",
        bio: user.bio || "",
      };
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export default useAuthMe;
