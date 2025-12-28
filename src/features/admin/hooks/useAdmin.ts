// src/features/admin/hooks/useAdmin.ts - PROPERLY FIXED AUTO-REFRESH! 🔄

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adminApi,
  CreateMerchantRequest,
  MerchantUser,
} from "../api/admin.api";
import { ContactMessage, contactUsService } from "../services/contactusService";

// ==================== QUERY KEYS - EXPORTED FOR USE IN OTHER FILES ====================
export const adminQueryKeys = {
  all: ["admin"] as const,
  merchants: () => [...adminQueryKeys.all, "merchants"] as const,
  pendingMerchants: () => [...adminQueryKeys.all, "pending-merchants"] as const,
  merchant: (id: string) => [...adminQueryKeys.merchants(), id] as const,
};

// IMPORTANT: These query keys MUST be used consistently across all hooks:
// - useAdmin.ts
// - useMerchantMutations.ts
// - Any other file that deals with merchant data

// ==================== GET ALL MERCHANTS ====================
export const useAllMerchants = () => {
  return useQuery({
    queryKey: adminQueryKeys.merchants(),
    queryFn: adminApi.getAllMerchants,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchOnMount: true, // Refetch when component mounts
  });
};

// ==================== GET PENDING MERCHANTS ====================
export const usePendingMerchants = () => {
  return useQuery({
    queryKey: adminQueryKeys.pendingMerchants(),
    queryFn: adminApi.getPendingMerchants,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

// ==================== CREATE MERCHANT ====================
export const useCreateMerchant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMerchantRequest) => adminApi.createMerchant(data),
    onSuccess: () => {
      // Invalidate and refetch immediately
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.merchants(),
        refetchType: "active", // Force immediate refetch
      });
    },
    onError: (error: Error) => {
      console.error("Create merchant error:", error.message);
    },
  });
};

// ==================== APPROVE MERCHANT - COMPLETE FIX! ====================
export const useApproveMerchant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      merchantId,
      notes,
    }: {
      merchantId: string;
      notes?: string;
    }) => adminApi.approveMerchant(merchantId, notes),
    onSuccess: (response, variables) => {
      console.log("✅ Approve Success - Response:", response);
      console.log("✅ Merchant ID:", variables.merchantId);

      // CRITICAL FIX: Extract the updated profile from response
      const updatedProfile = response?.data?.profile;

      if (updatedProfile) {
        console.log("✅ Updated Profile:", updatedProfile);

        //  Update all merchants cache immediately
        queryClient.setQueryData<MerchantUser[]>(
          adminQueryKeys.merchants(),
          (oldData) => {
            if (!oldData) return oldData;
            console.log("🔄 Updating merchants cache...");
            return oldData.map((merchant) =>
              merchant.id === updatedProfile.id ? updatedProfile : merchant,
            );
          },
        );

        // Update pending merchants cache
        queryClient.setQueryData<MerchantUser[]>(
          adminQueryKeys.pendingMerchants(),
          (oldData) => {
            if (!oldData) return oldData;
            console.log("🔄 Updating pending merchants cache...");
            // Remove from pending if approved
            return oldData.filter(
              (merchant) => merchant.id !== updatedProfile.id,
            );
          },
        );
      }

      //  Force immediate refetch to ensure consistency
      console.log("🔄 Forcing refetch...");
      queryClient.refetchQueries({
        queryKey: adminQueryKeys.merchants(),
        type: "active",
      });
      queryClient.refetchQueries({
        queryKey: adminQueryKeys.pendingMerchants(),
        type: "active",
      });
    },
    onError: (error: Error) => {
      console.error("❌ Approve merchant error:", error.message);
    },
  });
};

// ==================== REJECT MERCHANT - COMPLETE FIX! ====================
export const useRejectMerchant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      merchantId,
      reason,
      notes,
    }: {
      merchantId: string;
      reason: string;
      notes?: string;
    }) => adminApi.rejectMerchant(merchantId, reason, notes),
    onSuccess: (response, variables) => {
      console.log("✅ Reject Success - Response:", response);
      console.log("✅ Merchant ID:", variables.merchantId);

      const updatedProfile = response?.data?.profile;

      if (updatedProfile) {
        console.log("✅ Updated Profile:", updatedProfile);

        queryClient.setQueryData<MerchantUser[]>(
          adminQueryKeys.merchants(),
          (oldData) => {
            if (!oldData) return oldData;
            console.log("🔄 Updating merchants cache...");
            return oldData.map((merchant) =>
              merchant.id === updatedProfile.id ? updatedProfile : merchant,
            );
          },
        );

        // Method 2: Update pending merchants cache
        queryClient.setQueryData<MerchantUser[]>(
          adminQueryKeys.pendingMerchants(),
          (oldData) => {
            if (!oldData) return oldData;
            console.log("🔄 Updating pending merchants cache...");
            // Remove from pending if rejected
            return oldData.filter(
              (merchant) => merchant.id !== updatedProfile.id,
            );
          },
        );
      }

      // Method 3: Force immediate refetch to ensure consistency
      console.log("🔄 Forcing refetch...");
      queryClient.refetchQueries({
        queryKey: adminQueryKeys.merchants(),
        type: "active",
      });
      queryClient.refetchQueries({
        queryKey: adminQueryKeys.pendingMerchants(),
        type: "active",
      });
    },
    onError: (error: Error) => {
      console.error("❌ Reject merchant error:", error.message);
    },
  });
};

// ==================== DELETE MERCHANT (SOFT/HARD) ====================
export const useDeleteMerchant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      merchantId,
      hardDelete = false,
    }: {
      merchantId: string;
      hardDelete?: boolean;
    }) => adminApi.deleteMerchant(merchantId, hardDelete),
    onSuccess: (response, variables) => {
      console.log("✅ Delete Success - Response:", response);

      // Update cache - remove deleted merchant
      queryClient.setQueryData<MerchantUser[]>(
        adminQueryKeys.merchants(),
        (oldData) => {
          if (!oldData) return oldData;
          return oldData.filter(
            (merchant) => merchant.id !== variables.merchantId,
          );
        },
      );

      queryClient.setQueryData<MerchantUser[]>(
        adminQueryKeys.pendingMerchants(),
        (oldData) => {
          if (!oldData) return oldData;
          return oldData.filter(
            (merchant) => merchant.id !== variables.merchantId,
          );
        },
      );

      // Force refetch
      queryClient.refetchQueries({
        queryKey: adminQueryKeys.merchants(),
        type: "active",
      });
      queryClient.refetchQueries({
        queryKey: adminQueryKeys.pendingMerchants(),
        type: "active",
      });
    },
    onError: (error: Error) => {
      console.error("❌ Delete merchant error:", error.message);
    },
  });
};

// ==================== DEACTIVATE MERCHANT (Convenience) ====================
export const useDeactivateMerchant = () => {
  const deleteMutation = useDeleteMerchant();

  return {
    ...deleteMutation,
    mutate: (merchantId: string) =>
      deleteMutation.mutate({ merchantId, hardDelete: false }),
    mutateAsync: (merchantId: string) =>
      deleteMutation.mutateAsync({ merchantId, hardDelete: false }),
  };
};

// ==================== PERMANENTLY DELETE MERCHANT (Convenience) ====================
export const usePermanentlyDeleteMerchant = () => {
  const deleteMutation = useDeleteMerchant();

  return {
    ...deleteMutation,
    mutate: (merchantId: string) =>
      deleteMutation.mutate({ merchantId, hardDelete: true }),
    mutateAsync: (merchantId: string) =>
      deleteMutation.mutateAsync({ merchantId, hardDelete: true }),
  };
};

export const CONTACT_MESSAGES_QUERY_KEY = ["contact-messages"];
export function useContactMessages() {
  return useQuery<ContactMessage[], Error>({
    queryKey: CONTACT_MESSAGES_QUERY_KEY,
    queryFn: contactUsService.getContactMessages,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
}
