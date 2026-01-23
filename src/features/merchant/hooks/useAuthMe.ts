// src/features/merchant/hooks/useAuthMe.ts
import { useQuery } from "@tanstack/react-query";
import { authService, UserData } from "../services/DashboardService";

/**
 * Hook to fetch and manage authenticated user's data
 */
export const useAuthMe = () => {
  return useQuery<UserData>({
    queryKey: ["auth-me"],
    queryFn: authService.getAuthMe,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export default useAuthMe;
