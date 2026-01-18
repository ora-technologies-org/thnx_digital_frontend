// src/features/merchant/hooks/useChangePassword.ts
import { useMutation } from "@tanstack/react-query";

import { AxiosError } from "axios";
import { changePasswordService } from "../services/forgotPasswordService";

interface ChangePasswordPayload {
  password: string;
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordError {
  message: string;
}

// Mutation hook for changing password
export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (data: ChangePasswordPayload) => {
      return await changePasswordService.changePassword(
        data.password,
        data.newPassword,
        data.confirmPassword,
      );
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
