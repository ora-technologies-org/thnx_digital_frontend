import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { merchantService } from "../services/merchantService";
// import type { MerchantUser } from "@/features/admin/api/admin.api";

// CRITICAL FIX: Import the same query keys used in useAdmin
import { adminQueryKeys } from "./useAdmin";
import { CreateMerchantForm } from "@/shared/types/Form.types";
import {
  CreateMerchantResponse,
  UpdateMerchantResponse,
  ApiError,
} from "../types/merchant.types";

export const useCreateMerchant = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateMerchantResponse, ApiError, CreateMerchantForm>({
    mutationFn: (formData) => merchantService.createMerchant(formData),
    onSuccess: (data) => {
      console.log("✅ Create Success:", data);

      // CRITICAL FIX: Use the same query keys as useAdmin
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.merchants(),
        refetchType: "active",
      });
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.pendingMerchants(),
        refetchType: "active",
      });

      // Force immediate refetch
      queryClient.refetchQueries({
        queryKey: adminQueryKeys.merchants(),
        type: "active",
      });
    },
  });
};

export const useMerchants = () => {
  // CRITICAL FIX: Use the same query keys as useAdmin
  return useQuery({
    queryKey: adminQueryKeys.merchants(),
    queryFn: () => merchantService.getMerchants(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};
export const useUpdateMerchant = () => {
  const queryClient = useQueryClient();

  type UpdateMutationVariables = {
    merchantId: string;
    formData: CreateMerchantForm;
  };

  return useMutation<UpdateMerchantResponse, ApiError, UpdateMutationVariables>(
    {
      mutationFn: ({ merchantId, formData }) =>
        merchantService.updateMerchant(merchantId, formData),
      onSuccess: (data, variables) => {
        console.log("✅ Update Success:", data);
        console.log("✅ Updated Merchant ID:", variables.merchantId);

        const updatedMerchantId = data?.data?.merchantId;

        if (updatedMerchantId) {
          console.log("✅ Updated Merchant ID:", updatedMerchantId);

          queryClient.invalidateQueries({
            queryKey: adminQueryKeys.merchants(),
            refetchType: "active",
          });
          queryClient.invalidateQueries({
            queryKey: adminQueryKeys.pendingMerchants(),
            refetchType: "active",
          });

          console.log("🔄 Forcing refetch after update...");
          queryClient.refetchQueries({
            queryKey: adminQueryKeys.merchants(),
            type: "active",
          });
        }
      },
    },
  );
};

// export const useUpdateMerchant = () => {
//   const queryClient = useQueryClient();

//   return useMutation<
//     UpdateMerchantResponse,
//     ApiError,
//     { merchantId: string; formData: CreateMerchantForm }
//   >({
//     mutationFn: ({ merchantId, formData }) =>
//       merchantService.updateMerchant(merchantId, formData),
//     onSuccess: (data, variables) => {
//       console.log("✅ Update Success:", data);
//       console.log("✅ Updated Merchant ID:", variables.merchantId);

//       const updatedMerchant = data?.data?.merchantId || data?.merchant;

//       if (updatedMerchant) {
//         console.log("✅ Updated Merchant Data:", updatedMerchant);

//         queryClient.setQueryData<MerchantUser[]>(
//           adminQueryKeys.merchants(),
//           (oldData) => {
//             if (!oldData) return oldData;
//             console.log("🔄 Updating merchant in cache...");
//             return oldData.map((merchant) =>
//               merchant.id === updatedMerchant.id ? updatedMerchant : merchant,
//             );
//           },
//         );

//         queryClient.invalidateQueries({
//           queryKey: adminQueryKeys.merchants(),
//           refetchType: "active",
//         });
//         queryClient.invalidateQueries({
//           queryKey: adminQueryKeys.pendingMerchants(),
//           refetchType: "active",
//         });

//         console.log("🔄 Forcing refetch after update...");
//         queryClient.refetchQueries({
//           queryKey: adminQueryKeys.merchants(),
//           type: "active",
//         });
//       }
//     },
//   });
// };
