import { useMutation } from "@tanstack/react-query";

import { toast } from "react-hot-toast";
import { changePasswordService } from "../services/forgotPasswordService";

// Define error response type
interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

// Define success response type
interface SuccessResponse {
  message?: string;
}

export const useChangePassword = () => {
  /**
   * Mutation for changing password
   * Updates user's password with current password verification
   */
  const changePasswordMutation = useMutation({
    mutationFn: (params: {
      email: string;
      password: string;
      newPassword: string;
      confirmPassword: string;
    }) => {
      console.log("Hook received params:", params);
      return changePasswordService.changePassword(
        params.email,
        params.password,
        params.newPassword,
        params.confirmPassword,
      );
    },
    onSuccess: (data: SuccessResponse) => {
      toast.success(data.message || "Password changed successfully!");
    },
    onError: (error: ErrorResponse) => {
      toast.error(error.response?.data?.message || "Failed to change password");
    },
  });

  /**
   * Wrapper function for changing password
   * Returns a Promise that resolves to boolean indicating success
   */
  const changePassword = async (
    email: string,
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<boolean> => {
    console.log("changePassword called with:", {
      email,
      currentPassword: "***",
      newPassword: "***",
      confirmPassword: "***",
    });

    try {
      await changePasswordMutation.mutateAsync({
        email,
        password: currentPassword,
        newPassword,
        confirmPassword,
      });
      return true;
    } catch (error) {
      console.error("Change password error:", error);
      return false;
    }
  };

  return {
    // Async wrapper function that returns Promise
    changePassword,

    // Loading state
    isLoading: changePasswordMutation.isPending,

    // Success state (used to show success UI)
    changeSuccess: changePasswordMutation.isSuccess,

    // Error state from TanStack Query
    changePasswordError: changePasswordMutation.error,

    // Raw mutation object for advanced usage
    mutation: changePasswordMutation,
  };
};
