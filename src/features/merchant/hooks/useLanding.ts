// src/features/merchant/hooks/useLanding.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";
import {
  fetchLandingPageData,
  updateLandingPageSection,
  clearError,
} from "../slices/LandingPageSlice";
import {
  landingPageService,
  UpdateLandingPageRequest,
  LandingPageData,
} from "../services/LandingService";
import { RootState, AppDispatch } from "@/app/store";

/**
 * Interface for wrapped array data from API
 * Some API endpoints return arrays wrapped in objects with these property names
 */
interface ArrayWrapper<T> {
  data?: T[];
  items?: T[];
}

/**
 * Transform API data to ensure all arrays are properly formatted
 * Handles cases where arrays might be wrapped in objects or missing
 *
 * @param data - Raw data from API that may contain wrapped arrays
 * @returns Transformed LandingPageData with properly formatted arrays, or null if no data
 */
const transformLandingData = (data: unknown): LandingPageData | null => {
  if (!data) return null;

  /**
   * Ensures a value is returned as an array
   * Unwraps arrays from common wrapper formats (data, items properties)
   *
   * @param value - Value that might be an array or wrapped array
   * @returns Proper array or empty array if no valid data found
   */
  const ensureArray = <T>(value: unknown): T[] => {
    if (Array.isArray(value)) return value;

    // Type guard for wrapped arrays
    if (value && typeof value === "object") {
      const wrapper = value as ArrayWrapper<T>;
      if (Array.isArray(wrapper.data)) return wrapper.data;
      if (Array.isArray(wrapper.items)) return wrapper.items;
    }

    return [];
  };

  // Cast data to partial LandingPageData for transformation
  const rawData = data as Partial<LandingPageData>;

  const transformed: LandingPageData = {
    ...rawData,
    faqs: ensureArray(rawData.faqs),
    testimonials: ensureArray(rawData.testimonials),
    features: ensureArray(rawData.features),
    steps: ensureArray(rawData.steps),
    stats: ensureArray(rawData.stats),
  } as LandingPageData;

  return transformed;
};

/**
 * Hook to fetch landing page data using React Query
 * Provides caching, automatic refetching, and stale-while-revalidate behavior
 *
 * @returns Landing page data with loading and error states
 */
export const useLandingPageData = () => {
  const query = useQuery({
    queryKey: ["landingPage"],
    queryFn: () => landingPageService.getLandingPageData(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  // Transform data to ensure arrays are properly formatted
  const transformedData = useMemo(() => {
    return transformLandingData(query.data);
  }, [query.data]);

  return {
    data: transformedData,
    isLoading: query.isLoading,
    error: query.error,
    isError: query.isError,
    refetch: query.refetch,
  };
};

/**
 * Hook to fetch landing page data using Redux
 * Alternative to React Query for projects preferring Redux state management
 *
 * @returns Landing page data from Redux store with loading states and actions
 */
export const useLandingPageRedux = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error, updateLoading, updateError } = useSelector(
    (state: RootState) => state.landingPage,
  );

  /**
   * Fetches landing page data and stores in Redux
   */
  const fetchData = useCallback(() => {
    dispatch(fetchLandingPageData());
  }, [dispatch]);

  /**
   * Clears all error states in Redux store
   */
  const clearErrors = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Transform Redux data to ensure consistent array formatting
  const transformedData = useMemo(() => {
    return transformLandingData(data);
  }, [data]);

  return {
    data: transformedData,
    loading,
    error,
    updateLoading,
    updateError,
    fetchData,
    clearErrors,
  };
};

/**
 * Hook to update landing page section using Redux
 * Handles updates with automatic cache invalidation and toast notifications
 *
 * @returns Function to update a specific section of the landing page
 */
export const useUpdateLandingPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  /**
   * Updates a specific section of the landing page
   * Invalidates both Redux and React Query caches after update
   *
   * @param payload - Section name, data, and optional index for array updates
   * @returns Success boolean indicating if update was successful
   */
  const updateSection = async (payload: UpdateLandingPageRequest) => {
    try {
      await dispatch(updateLandingPageSection(payload)).unwrap();

      // Invalidate React Query cache to trigger refetch
      queryClient.invalidateQueries({ queryKey: ["landingPage"] });

      toast.success("Landing page updated successfully!");
      return true;
    } catch (error) {
      // Type guard for error handling
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

/**
 * Hook to update landing page using React Query mutation
 * Implements optimistic updates with automatic rollback on error
 *
 * @returns Mutation object with mutate function and state
 */
export const useUpdateLandingPageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateLandingPageRequest) =>
      landingPageService.updateLandingPageSection(payload),

    /**
     * Optimistic update: Apply changes immediately before server confirms
     * Stores previous data for potential rollback
     */
    onMutate: async (newData) => {
      // Cancel outgoing refetches to prevent overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: ["landingPage"] });
      const previousData = queryClient.getQueryData(["landingPage"]);

      // Optimistically update cache
      queryClient.setQueryData(["landingPage"], (old: unknown) => {
        if (!old || typeof old !== "object") return old;

        const updated = { ...old } as Record<string, unknown>;
        const { section, data } = newData;
        updated[section] = data;

        return updated;
      });

      return { previousData };
    },

    /**
     * Rollback optimistic update on error
     * Restores previous data and shows error toast
     */
    onError: (error: unknown, _newData, context) => {
      // Rollback to previous data if available
      if (context?.previousData) {
        queryClient.setQueryData(["landingPage"], context.previousData);
      }

      // Extract error message with proper type checking
      let errorMessage = "Failed to update";
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        errorMessage = axiosError?.response?.data?.message || errorMessage;
      }

      toast.error(errorMessage);
    },

    /**
     * Show success notification when update completes
     */
    onSuccess: () => {
      toast.success("Landing page updated successfully!");
    },

    /**
     * Refetch data after mutation completes (success or error)
     * Ensures cache is in sync with server
     */
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["landingPage"] });
    },
  });
};

/**
 * Hook to subscribe to newsletter
 * Handles newsletter subscription with toast notifications
 *
 * @returns Mutation object for newsletter subscription
 */
export const useNewsletterSubscription = () => {
  return useMutation({
    mutationFn: (email: string) =>
      landingPageService.subscribeNewsletter(email),
    onSuccess: (data) => {
      toast.success(data.message || "Successfully subscribed to newsletter!");
    },
    onError: (error: unknown) => {
      let errorMessage = "Failed to subscribe. Please try again.";

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        errorMessage = axiosError?.response?.data?.message || errorMessage;
      }

      toast.error(errorMessage);
    },
  });
};

/**
 * Contact form data interface
 */
interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

/**
 * Hook to submit contact form
 * Handles contact form submission with validation and notifications
 *
 * @returns Mutation object for contact form submission
 */
export const useContactForm = () => {
  return useMutation({
    mutationFn: (data: ContactFormData) =>
      landingPageService.submitContactForm(data),
    onSuccess: (data) => {
      toast.success(
        data.message ||
          "Message sent successfully! We will get back to you soon.",
      );
    },
    onError: (error: unknown) => {
      let errorMessage = "Failed to send message. Please try again.";

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        errorMessage = axiosError?.response?.data?.message || errorMessage;
      }

      toast.error(errorMessage);
    },
  });
};

/**
 * Hook to get formatted stats for display
 * Converts raw numbers into human-readable format (K, M suffixes)
 *
 * @returns Formatted statistics array with values, labels, and suffixes
 */
export const useFormattedStats = () => {
  const { data, isLoading } = useLandingPageData();

  /**
   * Formats large numbers with K/M suffixes
   *
   * @param num - Number to format
   * @returns Formatted string (e.g., "1.5K", "2.3M")
   */
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  // Memoize formatted stats to prevent unnecessary recalculations
  // Include the entire rawStats object as dependency to satisfy both ESLint and React Compiler
  const formattedStats = useMemo(() => {
    if (!data?.rawStats) return [];

    const { activeUsers, merchants, giftCardsSold, satisfactionRate } =
      data.rawStats;

    return [
      {
        value: formatNumber(activeUsers),
        label: "Active Users",
        suffix: "+",
      },
      {
        value: formatNumber(merchants),
        label: "Merchants",
        suffix: "+",
      },
      {
        value: formatNumber(giftCardsSold),
        label: "Gift Cards Sold",
        suffix: "+",
      },
      {
        value: satisfactionRate.toString(),
        label: "Satisfaction Rate",
        suffix: "%",
      },
    ];
  }, [data?.rawStats]); // Use the parent object as dependency

  return {
    stats: formattedStats,
    isLoading,
  };
};
