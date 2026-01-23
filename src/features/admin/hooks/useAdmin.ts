// src/features/admin/hooks/useAdmin.ts - REFACTORED WITH CUSTOM HOOK! 🔄

import { useQuery, useMutation } from "@tanstack/react-query";
import {
  adminApi,
  CreateMerchantRequest,
  MerchantUser,
} from "../api/admin.api";
import {
  ContactMessage,
  contactUsService,
} from "../services/contactusServices";
import api from "../../../shared/utils/api";
import { merchantService } from "../services/merchantService";
import { useInvalidateQueries } from "@/shared/hooks/useInvalidateQueries";
import { GetMerchantsParams } from "../types/merchant.types";
export interface RecentActivityItem {
  id: string;
  type: "new" | "purchase" | "update" | string;
  merchantName?: string;
  title?: string;
  description?: string;
  timestamp: string;
}

export interface DashboardData {
  timeRange: string;
  dateRange: {
    start: string;
    end: string;
  };
  overview: {
    totalMerchants: number;
    totalRevenue: {
      value: number;
      percentageChange: number;
    };
    giftCardsSold: {
      value: number;
      percentageChange: number;
    };
    totalOrders: {
      value: number;
      percentageChange: number;
    };
  };
  verificationStatus: {
    pending: number;
    verified: number;
    rejected: number;
    activeCustomers: {
      value: number;
      percentageChange: number;
    };
  };
  salesAnalytics: {
    monthlyRevenueTrends: Array<{
      month: string;
      revenue: number;
    }>;
    currentMonthRevenue: number;
    previousMonthRevenue: number;
    percentageChange: number;
  };
  merchantGrowth: {
    trends: Array<{
      month: string;
      count: number;
    }>;
    currentMonthMerchants: number;
    previousMonthMerchants: number;
    percentageChange: number;
  };
  giftCardStatus: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  recentActivity?: RecentActivityItem[];
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardData;
}
// ==================== QUERY KEYS - EXPORTED FOR USE IN OTHER FILES ====================
export const adminQueryKeys = {
  all: ["admin"] as const,
  merchants: () => [...adminQueryKeys.all, "merchants"] as const,
  pendingMerchants: () => [...adminQueryKeys.all, "pending-merchants"] as const,
  merchant: (id: string) => [...adminQueryKeys.merchants(), id] as const,
  dashboard: (timeRange: string) =>
    [...adminQueryKeys.all, "dashboard", timeRange] as const,
};

// IMPORTANT: These query keys MUST be used consistently across all hooks:
// - useAdmin.ts
// - useMerchantMutations.ts
// - Any other file that deals with merchant data

// ==================== TYPE DEFINITIONS ====================

/**
 * Parameters for fetching pending merchants
 */
export interface GetPendingMerchantsParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: "createdAt" | "updatedAt";
  order?: "asc" | "desc";
}

// ==================== GET ALL MERCHANTS ====================
export const useAllMerchants = (params: GetMerchantsParams) => {
  return useQuery({
    queryKey: ["merchants", params],
    queryFn: () => merchantService.getMerchants(params),
    staleTime: 30000,
  });
};

// ==================== GET PENDING MERCHANTS ====================
export const usePendingMerchants = (params: GetPendingMerchantsParams) => {
  return useQuery({
    queryKey: ["pending-merchants", params],
    queryFn: () => adminApi.getPendingMerchants(params),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

// ==================== CREATE MERCHANT ====================
export const useCreateMerchant = () => {
  const { invalidateMerchants } = useInvalidateQueries();

  return useMutation({
    mutationFn: (data: CreateMerchantRequest) => adminApi.createMerchant(data),
    onSuccess: () => {
      invalidateMerchants();
    },
    onError: (error: Error) => {
      console.error("Create merchant error:", error.message);
    },
  });
};

// ==================== APPROVE MERCHANT - REFACTORED! ====================
export const useApproveMerchant = () => {
  const { updateMerchantInCache, refetchMerchantsAndPending } =
    useInvalidateQueries();

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

      const updatedProfile = response?.data?.profile;

      if (updatedProfile) {
        console.log("✅ Updated Profile:", updatedProfile);

        // Update all merchants cache immediately
        updateMerchantInCache<MerchantUser[]>(
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
        updateMerchantInCache<MerchantUser[]>(
          adminQueryKeys.pendingMerchants(),
          (oldData) => {
            if (!oldData) return oldData;
            console.log("🔄 Updating pending merchants cache...");
            return oldData.filter(
              (merchant) => merchant.id !== updatedProfile.id,
            );
          },
        );
      }

      // Force immediate refetch to ensure consistency
      console.log("🔄 Forcing refetch...");
      refetchMerchantsAndPending();
    },
    onError: (error: Error) => {
      console.error("❌ Approve merchant error:", error.message);
    },
  });
};

// ==================== REJECT MERCHANT - REFACTORED! ====================
export const useRejectMerchant = () => {
  const { updateMerchantInCache, refetchMerchantsAndPending } =
    useInvalidateQueries();

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

        updateMerchantInCache<MerchantUser[]>(
          adminQueryKeys.merchants(),
          (oldData) => {
            if (!oldData) return oldData;
            console.log("🔄 Updating merchants cache...");
            return oldData.map((merchant) =>
              merchant.id === updatedProfile.id ? updatedProfile : merchant,
            );
          },
        );

        updateMerchantInCache<MerchantUser[]>(
          adminQueryKeys.pendingMerchants(),
          (oldData) => {
            if (!oldData) return oldData;
            console.log("🔄 Updating pending merchants cache...");
            return oldData.filter(
              (merchant) => merchant.id !== updatedProfile.id,
            );
          },
        );
      }

      console.log("🔄 Forcing refetch...");
      refetchMerchantsAndPending();
    },
    onError: (error: Error) => {
      console.error("❌ Reject merchant error:", error.message);
    },
  });
};

// ==================== DELETE MERCHANT (SOFT/HARD) - REFACTORED! ====================
export const useDeleteMerchant = () => {
  const { updateMerchantInCache, refetchMerchantsAndPending } =
    useInvalidateQueries();

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
      updateMerchantInCache<MerchantUser[]>(
        adminQueryKeys.merchants(),
        (oldData) => {
          if (!oldData) return oldData;
          return oldData.filter(
            (merchant) => merchant.id !== variables.merchantId,
          );
        },
      );

      updateMerchantInCache<MerchantUser[]>(
        adminQueryKeys.pendingMerchants(),
        (oldData) => {
          if (!oldData) return oldData;
          return oldData.filter(
            (merchant) => merchant.id !== variables.merchantId,
          );
        },
      );

      // Force refetch
      refetchMerchantsAndPending();
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

// ==================== CONTACT MESSAGES ====================
export const CONTACT_MESSAGES_QUERY_KEY = ["contact-messages"];
export function useContactMessages() {
  return useQuery<ContactMessage[], Error>({
    queryKey: CONTACT_MESSAGES_QUERY_KEY,
    queryFn: contactUsService.getContactMessages,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
}

// ==================== DASHBOARD DATA HOOK ====================
export const useDashboardData = (timeRange: string) => {
  return useQuery<DashboardResponse>({
    queryKey: adminQueryKeys.dashboard(timeRange),
    queryFn: async () => {
      // <DashboardResponse> - Generic type parameter that specifies the structure of response.data
      const response = await api.get<DashboardResponse>(
        `/admin/dashboard?timeRange=${timeRange}`,
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};
