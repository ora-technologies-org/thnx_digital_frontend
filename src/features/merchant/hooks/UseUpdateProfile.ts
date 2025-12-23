// src/features/merchant/hooks/useUpdateProfile.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/shared/utils/api";
import { AxiosError } from "axios";

interface UpdateProfilePayload {
  name: string;
  phone: string;
  bio: string;
}

interface UpdateProfileError {
  message: string;
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfilePayload) => {
      const response = await api.put("/merchants/update/profile", data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ["auth-me"] });
      queryClient.invalidateQueries({ queryKey: ["merchant-profile"] });
    },
    onError: (error: AxiosError<UpdateProfileError>) => {
      console.error("Failed to update profile:", error);
    },
  });
};

export default useUpdateProfile;
