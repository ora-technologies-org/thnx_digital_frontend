import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { changePasswordService } from "../services/forgotPasswordService";
import { useAppDispatch } from "@/app/hooks";
import { logout } from "@/features/auth/slices/authSlice";

// Define the actual response type from the service
interface ChangePasswordResponse {
  message?: string;
  data?: unknown; // Change this to unknown since the service returns unknown
}

// Define error response type
interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const useChangePassword = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  /**
   * Mutation for changing password
   * Updates user's password with current password verification
   */
  const changePasswordMutation = useMutation<
    ChangePasswordResponse,
    ErrorResponse,
    { password: string; newPassword: string; confirmPassword: string }
  >({
    mutationFn: (params: {
      password: string;
      newPassword: string;
      confirmPassword: string;
    }) => {
      console.log("Hook received params:", params);
      return changePasswordService.changePassword(
        params.password,
        params.newPassword,
        params.confirmPassword,
      );
    },
    onSuccess: (data: ChangePasswordResponse) => {
      // ✅ Update the parameter type
      toast.success(data.message || "Password changed successfully!");

      console.log("✅ Password changed successfully, logging out user");

      // ✅ CRITICAL: Log out the user after password change
      // This ensures they log in again with the new password
      // and the backend can properly update the isFirstTime flag
      dispatch(logout());

      // Clear all auth data from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // ✅ Redirect to login page after a short delay
      setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: {
            passwordChanged: true,
            message:
              "Password changed successfully! Please log in with your new password.",
          },
        });
      }, 1500);
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
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<boolean> => {
    console.log("changePassword called with:", {
      currentPassword: "***",
      newPassword: "***",
      confirmPassword: "***",
    });

    try {
      await changePasswordMutation.mutateAsync({
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
