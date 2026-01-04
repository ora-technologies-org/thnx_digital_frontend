// import { useMutation } from "@tanstack/react-query";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import { changePasswordService } from "../services/forgotPasswordService";
// import { useAppDispatch } from "@/app/hooks";
// import { setUser } from "@/features/auth/slices/authSlice";

// // Define error response type
// interface ErrorResponse {
//   response?: {
//     data?: {
//       message?: string;
//     };
//   };
// }

// // Define success response type
// interface SuccessResponse {
//   message?: string;
//   data?: {
//     user?: {
//       id: string;
//       email: string;
//       name: string;
//       role: string;
//       isFirstTime: boolean; // ✅ This should be false after password change
//     };
//   };
// }

// export const useChangePassword = () => {
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();

//   /**
//    * Mutation for changing password
//    * Updates user's password with current password verification
//    */
//   const changePasswordMutation = useMutation({
//     mutationFn: (params: {
//       password: string;
//       newPassword: string;
//       confirmPassword: string;
//     }) => {
//       console.log("Hook received params:", params);
//       return changePasswordService.changePassword(
//         params.password,
//         params.newPassword,
//         params.confirmPassword,
//       );
//     },
//     onSuccess: (data: SuccessResponse) => {
//       toast.success(data.message || "Password changed successfully!");

//       // ✅ CRITICAL: Update user state to mark as NOT first-time
//       if (data.data?.user) {
//         const updatedUser = {
//           ...data.data.user,
//           isFirstTime: false, // Force set to false
//         };

//         // 1. Update Redux state
//         dispatch(setUser(updatedUser));

//         // 2. Update localStorage
//         const existingUserStr = localStorage.getItem("user");
//         if (existingUserStr) {
//           try {
//             const existingUser = JSON.parse(existingUserStr);
//             localStorage.setItem("user", JSON.stringify({
//               ...existingUser,
//               isFirstTime: false // Update this flag
//             }));
//             console.log("✅ User state updated in localStorage, isFirstTime now false");
//           } catch (err) {
//             console.error("Failed to update localStorage:", err);
//           }
//         }
//       }

//       // ✅ Optional: Redirect after a delay
//       setTimeout(() => {
//         navigate("/dashboard", {
//           replace: true,
//           state: { passwordChanged: true }
//         });
//       }, 1500);
//     },
//     onError: (error: ErrorResponse) => {
//       toast.error(error.response?.data?.message || "Failed to change password");
//     },
//   });

//   /**
//    * Wrapper function for changing password
//    * Returns a Promise that resolves to boolean indicating success
//    */
//   const changePassword = async (
//     currentPassword: string,
//     newPassword: string,
//     confirmPassword: string,
//   ): Promise<boolean> => {
//     console.log("changePassword called with:", {
//       currentPassword: "***",
//       newPassword: "***",
//       confirmPassword: "***",
//     });

//     try {
//       await changePasswordMutation.mutateAsync({
//         password: currentPassword,
//         newPassword,
//         confirmPassword,
//       });
//       return true;
//     } catch (error) {
//       console.error("Change password error:", error);
//       return false;
//     }
//   };

//   return {
//     // Async wrapper function that returns Promise
//     changePassword,

//     // Loading state
//     isLoading: changePasswordMutation.isPending,

//     // Success state (used to show success UI)
//     changeSuccess: changePasswordMutation.isSuccess,

//     // Error state from TanStack Query
//     changePasswordError: changePasswordMutation.error,

//     // Raw mutation object for advanced usage
//     mutation: changePasswordMutation,
//   };
// };
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { changePasswordService } from "../services/forgotPasswordService";
import { useAppDispatch } from "@/app/hooks";
import { logout } from "@/features/auth/slices/authSlice";

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
  data?: {
    user?: {
      id: string;
      email: string;
      name: string;
      role: string;
      isFirstTime: boolean;
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
  const changePasswordMutation = useMutation({
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
    onSuccess: (data: SuccessResponse) => {
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
