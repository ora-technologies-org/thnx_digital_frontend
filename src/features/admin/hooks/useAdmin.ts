// src/features/admin/hooks/useAdmin.ts - ADMIN HOOKS! 🎣

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adminApi,
  CreateMerchantRequest,
  MerchantUser,
} from "../api/admin.api";
import { ContactMessage, contactUsService } from "../services/contactusService";

// ==================== QUERY KEYS ====================
export const adminQueryKeys = {
  all: ["admin"] as const,
  merchants: () => [...adminQueryKeys.all, "merchants"] as const,
  pendingMerchants: () => [...adminQueryKeys.all, "pending-merchants"] as const,
  merchant: (id: string) => [...adminQueryKeys.merchants(), id] as const,
};

// ==================== GET ALL MERCHANTS ====================
export const useAllMerchants = () => {
  return useQuery({
    queryKey: adminQueryKeys.merchants(),
    queryFn: adminApi.getAllMerchants,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// ==================== GET PENDING MERCHANTS ====================
export const usePendingMerchants = () => {
  return useQuery({
    queryKey: adminQueryKeys.pendingMerchants(),
    queryFn: adminApi.getPendingMerchants,
    staleTime: 1000 * 60 * 2, // 2 minutes (check more frequently)
  });
};

// ==================== CREATE MERCHANT ====================
export const useCreateMerchant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMerchantRequest) => adminApi.createMerchant(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.merchants() });
    },
    onError: (error: Error) => {
      console.error("Create merchant error:", error.message);
    },
  });
};

// ==================== APPROVE MERCHANT ====================
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
    onSuccess: (_, variables) => {
      // Invalidate both lists
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.pendingMerchants(),
      });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.merchants() });

      // Optionally update cache directly for instant UI update
      queryClient.setQueryData<MerchantUser[]>(
        adminQueryKeys.pendingMerchants(),
        (old) => old?.filter((m) => m.userId !== variables.merchantId),
      );
    },
    onError: (error: Error) => {
      console.error("Approve merchant error:", error.message);
    },
  });
};

// ==================== REJECT MERCHANT ====================
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
    onSuccess: (_, variables) => {
      // Invalidate both lists
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.pendingMerchants(),
      });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.merchants() });

      // Optionally update cache directly for instant UI update
      queryClient.setQueryData<MerchantUser[]>(
        adminQueryKeys.pendingMerchants(),
        (old) => old?.filter((m) => m.userId !== variables.merchantId),
      );
    },
    onError: (error: Error) => {
      console.error("Reject merchant error:", error.message);
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
    onSuccess: (_, variables) => {
      // Invalidate all merchant lists
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.pendingMerchants(),
      });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.merchants() });

      // Update cache directly for instant UI update
      queryClient.setQueryData<MerchantUser[]>(
        adminQueryKeys.merchants(),
        (old) => old?.filter((m) => m.userId !== variables.merchantId),
      );
      queryClient.setQueryData<MerchantUser[]>(
        adminQueryKeys.pendingMerchants(),
        (old) => old?.filter((m) => m.userId !== variables.merchantId),
      );
    },
    onError: (error: Error) => {
      console.error("Delete merchant error:", error.message);
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
