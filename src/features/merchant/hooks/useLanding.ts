// src/hooks/useLandingPage.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { toast } from "react-hot-toast";
import {
  fetchLandingPageData,
  updateLandingPageSection,
  clearError,
} from "../slices/LandingPageSlice";
import {
  landingPageService,
  UpdateLandingPageRequest,
} from "../services/LandingService";
import { RootState, AppDispatch } from "@/app/store";

/**
 * Hook to fetch landing page data using React Query
 */
export const useLandingPageData = () => {
  return useQuery({
    queryKey: ["landingPage"],
    queryFn: () => landingPageService.getLandingPageData(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

/**
 * Hook to fetch landing page data using Redux
 */
export const useLandingPageRedux = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error, updateLoading, updateError } = useSelector(
    (state: RootState) => state.landingPage,
  );

  const fetchData = useCallback(() => {
    dispatch(fetchLandingPageData());
  }, [dispatch]);

  const clearErrors = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    data,
    loading,
    error,
    updateLoading,
    updateError,
    fetchData,
    clearErrors,
  };
};

/**
 * Hook to update landing page section using Redux - FIXED VERSION
 */
export const useUpdateLandingPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  const updateSection = async (payload: UpdateLandingPageRequest) => {
    try {
      // First do the API call (don't do optimistic update first)
      await dispatch(updateLandingPageSection(payload)).unwrap();

      // Invalidate React Query cache
      queryClient.invalidateQueries({ queryKey: ["landingPage"] });

      toast.success("Landing page updated successfully!");
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update landing page";
      toast.error(errorMessage);
      return false;
    }
  };

  return { updateSection };
};

interface LandingPageData {
  [key: string]: unknown;
}

interface MutationContext {
  previousData?: LandingPageData;
}

interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

/**
 * Hook to update landing page using React Query - FIXED VERSION
 */
export const useUpdateLandingPageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateLandingPageRequest) =>
      landingPageService.updateLandingPageSection(payload),
    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["landingPage"] });

      // Snapshot previous value
      const previousData = queryClient.getQueryData<LandingPageData>([
        "landingPage",
      ]);

      // Optimistically update
      queryClient.setQueryData<LandingPageData>(["landingPage"], (old) => {
        if (!old) return old;

        const updated = { ...old };
        const { section, data, index } = newData;

        if (index !== undefined && Array.isArray(updated[section])) {
          // Update specific item in array
          const newArray = [...(updated[section] as unknown[])];
          newArray[index] = data;
          updated[section] = newArray;
        } else {
          // Update entire section
          updated[section] = data;
        }

        return updated;
      });

      return { previousData };
    },
    onError: (
      error: ErrorResponse,
      _newData,
      context: MutationContext | undefined,
    ) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(["landingPage"], context.previousData);
      }
      toast.error(error?.response?.data?.message || "Failed to update");
    },
    onSuccess: () => {
      toast.success("Landing page updated successfully!");
    },
    onSettled: () => {
      // Always refetch after error or success to ensure data consistency
      queryClient.invalidateQueries({ queryKey: ["landingPage"] });
    },
  });
};

/**
 * Hook to subscribe to newsletter
 */
export const useNewsletterSubscription = () => {
  return useMutation({
    mutationFn: (email: string) =>
      landingPageService.subscribeNewsletter(email),
    onSuccess: (data: { message?: string }) => {
      toast.success(data.message || "Successfully subscribed to newsletter!");
    },
    onError: (error: ErrorResponse) => {
      const errorMessage =
        error?.response?.data?.message ||
        "Failed to subscribe. Please try again.";
      toast.error(errorMessage);
    },
  });
};

/**
 * Hook to submit contact form
 */
export const useContactForm = () => {
  return useMutation({
    mutationFn: (data: { name: string; email: string; message: string }) =>
      landingPageService.submitContactForm(data),
    onSuccess: (data: { message?: string }) => {
      toast.success(
        data.message ||
          "Message sent successfully! We will get back to you soon.",
      );
    },
    onError: (error: ErrorResponse) => {
      const errorMessage =
        error?.response?.data?.message ||
        "Failed to send message. Please try again.";
      toast.error(errorMessage);
    },
  });
};

interface RawStats {
  activeUsers: number;
  merchants: number;
  giftCardsSold: number;
  satisfactionRate: number;
}

interface LandingPageDataWithStats {
  rawStats?: RawStats;
}

/**
 * Hook to get formatted stats for display
 */
export const useFormattedStats = () => {
  const { data, isLoading } = useLandingPageData();

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const typedData = data as LandingPageDataWithStats | undefined;

  const formattedStats = typedData?.rawStats
    ? [
        {
          value: formatNumber(typedData.rawStats.activeUsers),
          label: "Active Users",
          suffix: "+",
        },
        {
          value: formatNumber(typedData.rawStats.merchants),
          label: "Merchants",
          suffix: "+",
        },
        {
          value: formatNumber(typedData.rawStats.giftCardsSold),
          label: "Gift Cards Sold",
          suffix: "+",
        },
        {
          value: typedData.rawStats.satisfactionRate.toString(),
          label: "Satisfaction Rate",
          suffix: "%",
        },
      ]
    : [];

  return {
    stats: formattedStats,
    isLoading,
  };
};
