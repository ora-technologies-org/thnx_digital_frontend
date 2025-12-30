// src/features/merchant/hooks/useProfileComplete.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/shared/utils/api";
import toast from "react-hot-toast";
import { AxiosError, AxiosResponse } from "axios";

// Define types for the API response
interface ApiSuccessResponse {
  data?: Record<string, unknown>;
  message?: string;
  success?: boolean;
}

interface ApiErrorResponse {
  response?: {
    status?: number;
    data?: {
      message?: string;
      error?: string;
      errors?: Record<string, string | string[]>;
    };
  };
  message?: string;
}

interface ErrorMessage {
  response?: {
    data?: {
      message?: string;
      error?: string;
      errors?: Record<string, string | string[]>;
    };
  };
  message?: string;
}

interface FormDataEntry {
  formData: FormData;
  isEdit: boolean;
  profileId?: string | number;
}

export const useSubmitProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
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

      // Log all FormData entries
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

      // Determine endpoint
      const endpoint = isEdit
        ? `/merchants/`
        : "/auth/merchant/complete-profile";

      console.log("🎯 API Endpoint:", endpoint);
      console.log("🔧 HTTP Method:", isEdit ? "PUT" : "POST");

      try {
        console.log("🚀 Sending API request...");

        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };

        let response: AxiosResponse<ApiSuccessResponse>;

        // Use appropriate HTTP method based on edit mode
        if (isEdit) {
          // For PUT requests
          response = await api.put(endpoint, formData, config);
          console.log("✏️ Using PUT method for profile update");
        } else {
          // For POST requests
          response = await api.post(endpoint, formData, config);
          console.log("📝 Using POST method for new profile creation");
        }

        console.log("✅ API Response received:", response.data);
        console.log("✅ Status:", response.status);

        return response.data;
      } catch (error: unknown) {
        console.error("❌ API Error:", error);

        // Type guard to check if it's an AxiosError
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
    onSuccess: (data: ApiSuccessResponse, variables: FormDataEntry) => {
      console.log("✅ Success data:", data);
      console.log("✅ Variables:", variables);

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["merchant-profile"] });
      queryClient.invalidateQueries({ queryKey: ["profile-status"] });

      const message = variables.isEdit
        ? "Profile updated successfully!"
        : "Profile submitted for verification!";

      toast.success(message);
    },
    onError: (error: ErrorMessage, variables: FormDataEntry) => {
      console.error("❌ Error Response:", error.response);
      console.error("❌ Variables:", variables);

      let errorMessage = "Failed to submit profile. Please try again.";

      if (error.response) {
        console.error("📋 Response Status:", error.response.data);

        if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.data?.errors) {
          const fieldErrors = error.response.data.errors;
          console.error("📋 Field Errors:", fieldErrors);

          const firstError = Object.values(fieldErrors)[0];
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
    onMutate: (variables: FormDataEntry) => {
      console.log("🔄 Mutation starting with variables:", {
        isEdit: variables.isEdit,
        profileId: variables.profileId,
        hasFormData: !!variables.formData,
      });
    },
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
