// src/features/merchant/hooks/useChangePassword.ts
import { useMutation } from "@tanstack/react-query";
import api from "@/shared/utils/api";
import { AxiosError } from "axios";

interface ChangePasswordPayload {
  password: string;
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordError {
  message: string;
}

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (data: ChangePasswordPayload) => {
      const response = await api.post("/auth/change-password", data);
      return response.data;
    },
    onSuccess: () => {
      console.log("Password changed successfully");
    },
    onError: (error: AxiosError<ChangePasswordError>) => {
      console.error("Failed to change password:", error);
    },
  });
};

export default useChangePassword;
