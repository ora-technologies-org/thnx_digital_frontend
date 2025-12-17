// hooks/useMerchantMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CreateMerchantForm } from "../slices/MerchantCreateSlice";
import {
  CreateMerchantResponse,
  UpdateMerchantResponse,
  merchantService,
  ApiError,
} from "../services/merchantService";

export const useCreateMerchant = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateMerchantResponse, ApiError, CreateMerchantForm>({
    mutationFn: (formData) => merchantService.createMerchant(formData),
    onSuccess: (data) => {
      // Invalidate and refetch merchants list
      queryClient.invalidateQueries({ queryKey: ["merchants"] });
      alert(data.message || "Merchant created successfully!");
    },
    onError: (error) => {
      console.error("Failed to create merchant:", error);
      alert(error.message || "Failed to create merchant");
    },
  });
};

export const useUpdateMerchant = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateMerchantResponse,
    ApiError,
    { merchantId: string; formData: CreateMerchantForm }
  >({
    mutationFn: ({ merchantId, formData }) =>
      merchantService.updateMerchant(merchantId, formData),
    onSuccess: (data) => {
      // Invalidate and refetch merchants list
      queryClient.invalidateQueries({ queryKey: ["merchants"] });
      alert(data.message || "Merchant updated successfully!");
    },
    onError: (error) => {
      console.error("Failed to update merchant:", error);
      alert(error.message || "Failed to update merchant");

      // Show field-specific errors if available
      if (error.errors) {
        const errorMessages = Object.entries(error.errors)
          .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
          .join("\n");
        if (errorMessages) {
          alert(`Validation errors:\n${errorMessages}`);
        }
      }
    },
  });
};
