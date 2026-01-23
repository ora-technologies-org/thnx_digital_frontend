// src/features/merchant/hooks/useProfileComplete.ts
import { useMutation } from "@tanstack/react-query";
import api from "@/shared/utils/api";
import toast from "react-hot-toast";
import { AxiosError, AxiosResponse } from "axios";
import { useInvalidateQueries } from "@/shared/hooks/useInvalidateQueries";

import type {
  ApiSuccessResponse,
  ApiErrorResponse,
  FormDataEntry,
  ErrorMessage,
} from "../types/profileMerchant.types";

/**
 * Custom hook for submitting or updating merchant profile
 *
 * This hook handles both:
 * - Creating a new merchant profile (POST)
 * - Updating an existing merchant profile (PUT)
 *
 * @returns Mutation object with mutate function and status properties
 */
export const useSubmitProfile = () => {
  // Get the queryClient from the hook
  const { queryClient } = useInvalidateQueries();

  return useMutation({
    /**
     * Main mutation function that handles profile submission/update
     *
     * @param formData - FormData containing all profile information and files
     * @param isEdit - Boolean flag indicating if this is an edit operation
     * @param profileId - ID of the profile being edited (required when isEdit is true)
     * @returns Promise resolving to the API success response
     */
    mutationFn: async ({ formData, isEdit, profileId }: FormDataEntry) => {
      console.log("📊 Mutation Parameters:", {
        isEdit,
        profileId,
        formDataEntries: Array.from(formData.entries()).length,
      });

      // Validate edit mode requirements
      if (isEdit && !profileId) {
        console.error("❌ ERROR: Profile ID required for edit mode");
        throw new Error("Profile ID is required for editing");
      }

      // Log all FormData entries for debugging
      console.log("📦 FormData Contents:");
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(
            `  - ${key}: [File: ${value.name}, ${value.size} bytes, ${value.type}]`,
          );
        } else {
          console.log(`  - ${key}: ${value}`);
        }
      }

      // Determine endpoint based on operation type
      const endpoint = isEdit
        ? `/merchants/`
        : "/auth/merchant/complete-profile";

      console.log("🎯 API Endpoint:", endpoint);
      console.log("🔧 HTTP Method:", isEdit ? "PUT" : "POST");

      try {
        console.log("🚀 Sending API request...");

        // Configure headers for multipart/form-data
        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };

        let response: AxiosResponse<ApiSuccessResponse>;

        // Use appropriate HTTP method based on edit mode
        if (isEdit) {
          response = await api.put(endpoint, formData, config);
          console.log("✏️ Using PUT method for profile update");
        } else {
          response = await api.post(endpoint, formData, config);
          console.log("📝 Using POST method for new profile creation");
        }

        console.log("✅ API Response received:", response.data);
        console.log("✅ Status:", response.status);

        return response.data;
      } catch (error: unknown) {
        console.error("❌ API Error:", error);

        // Type guard for AxiosError
        if (error && typeof error === "object" && "isAxiosError" in error) {
          const axiosError = error as AxiosError<ApiErrorResponse>;
          console.error("📋 Axios Error Details:", {
            status: axiosError.response?.status,
            statusText: axiosError.response?.statusText,
            data: axiosError.response?.data,
            message: axiosError.message,
            endpoint: endpoint,
            method: isEdit ? "PUT" : "POST",
          });
        }

        throw error;
      }
    },

    /**
     * Success callback - executed when the mutation succeeds
     */
    onSuccess: (data: ApiSuccessResponse, variables: FormDataEntry) => {
      console.log("✅ Success data:", data);
      console.log("✅ Variables:", variables);

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["merchant-profile"] });
      queryClient.invalidateQueries({ queryKey: ["profile-status"] });

      // Show appropriate success message
      const message = variables.isEdit
        ? "Profile updated successfully!"
        : "Profile submitted for verification!";

      toast.success(message);
    },

    /**
     * Error callback - executed when the mutation fails
     */
    onError: (error: ErrorMessage, variables: FormDataEntry) => {
      console.error("❌ Error Response:", error.response);
      console.error("❌ Variables:", variables);

      let errorMessage = "Failed to submit profile. Please try again.";

      // Extract error message from response
      if (error.response?.data) {
        const errorData = error.response.data;

        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.errors) {
          // Handle field-specific validation errors
          console.error("📋 Field Errors:", errorData.errors);

          const firstError = Object.values(errorData.errors)[0];
          if (firstError) {
            if (Array.isArray(firstError)) {
              errorMessage = firstError[0] || errorMessage;
            } else if (typeof firstError === "string") {
              errorMessage = firstError;
            }
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    },

    /**
     * Mutate callback - executed before the mutation starts
     */
    onMutate: (variables: FormDataEntry) => {
      console.log("🔄 Mutation starting with variables:", {
        isEdit: variables.isEdit,
        profileId: variables.profileId,
        hasFormData: !!variables.formData,
      });
    },

    /**
     * Settled callback - executed after mutation completes
     */
    onSettled: (
      data: ApiSuccessResponse | undefined,
      error: ErrorMessage | null,
      variables: FormDataEntry,
    ) => {
      console.log("🏁 Mutation settled");
      console.log("Data:", data);
      console.log("Error:", error);
      console.log("Variables:", variables);
    },
  });
};
