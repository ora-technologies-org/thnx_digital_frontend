// hooks/useMerchantMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CreateMerchantForm } from "../slices/MerchantCreateSlice";
import {
  CreateMerchantResponse,
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
