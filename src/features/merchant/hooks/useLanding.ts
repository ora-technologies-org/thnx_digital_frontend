// src/hooks/useLandingPage.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { toast } from "react-hot-toast";
import {
  fetchLandingPageData,
  updateLandingPageSection,
  clearError,
} from "../slices/LandingPageSlice";
import { landingPageService } from "../services/LandingService";
import { RootState, AppDispatch } from "@/app/store";
import {
  UpdateLandingPageRequest,
  FAQItem,
  TestimonialItem,
} from "@/shared/types/landingPage.types";
import { useAppSelector } from "@/app/hooks";

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
 * Hook to fetch FAQs using React Query
 */
export const useFAQsData = () => {
  return useQuery({
    queryKey: ["faqs"],
    queryFn: () => landingPageService.getFAQs(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

/**
 * Hook to fetch Testimonials using React Query
 */
export const useTestimonialsData = () => {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: () => landingPageService.getTestimonials(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

/**
 * Hook to fetch landing page data using Redux - UPDATED VERSION
 * Now fetches FAQs and Testimonials from dedicated endpoints
 */
export const useLandingPageRedux = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error, updateLoading, updateError } = useAppSelector(
    (state: RootState) => state.landingPage,
  );

  const fetchData = useCallback(async () => {
    // Fetch main landing page data
    await dispatch(fetchLandingPageData());

    // Note: FAQs and Testimonials are now fetched separately in the component
    // using useFAQsData() and useTestimonialsData() hooks if needed
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
 * Hook to update landing page section using Redux - UPDATED VERSION
 * Routes FAQs and Testimonials section headers to landing-page endpoint
 * Individual items use dedicated endpoints
 */
export const useUpdateLandingPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  const updateSection = async (payload: UpdateLandingPageRequest) => {
    try {
      // For FAQ and Testimonial sections, send the entire section including items
      // This is used ONLY for updating section headers (title, subtitle)
      if (payload.section === "faqs" || payload.section === "testimonials") {
        await dispatch(updateLandingPageSection(payload)).unwrap();
        queryClient.invalidateQueries({ queryKey: ["landingPage"] });
        queryClient.invalidateQueries({
          queryKey: payload.section === "faqs" ? ["faqs"] : ["testimonials"],
        });
        toast.success(
          `${payload.section === "faqs" ? "FAQ" : "Testimonial"} section updated successfully!`,
        );
        return true;
      }

      // For other sections, use the original endpoint
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

/**
 * Hook for FAQ operations with dedicated endpoints - UPDATED VERSION
 */
export const useFAQOperations = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch<AppDispatch>();

  const addFAQ = useMutation({
    mutationFn: (faqItem: Omit<FAQItem, "id">) =>
      landingPageService.addFAQItem(faqItem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landingPage"] });
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      dispatch(fetchLandingPageData());
      toast.success("FAQ added successfully!");
    },
    onError: (error: Error) => {
      const apiError = error as ErrorResponse;
      toast.error(apiError?.response?.data?.message || "Failed to add FAQ");
    },
  });

  const updateFAQ = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<FAQItem, "id"> }) =>
      landingPageService.updateFAQItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landingPage"] });
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      dispatch(fetchLandingPageData());
      toast.success("FAQ updated successfully!");
    },
    onError: (error: Error) => {
      const apiError = error as ErrorResponse;
      toast.error(apiError?.response?.data?.message || "Failed to update FAQ");
    },
  });

  const deleteFAQ = useMutation({
    mutationFn: (id: string) => landingPageService.deleteFAQItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landingPage"] });
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      dispatch(fetchLandingPageData());
      toast.success("FAQ deleted successfully!");
    },
    onError: (error: Error) => {
      const apiError = error as ErrorResponse;
      toast.error(apiError?.response?.data?.message || "Failed to delete FAQ");
    },
  });

  return {
    addFAQ: addFAQ.mutateAsync,
    updateFAQ: updateFAQ.mutateAsync,
    deleteFAQ: deleteFAQ.mutateAsync,
    isLoading: addFAQ.isPending || updateFAQ.isPending || deleteFAQ.isPending,
  };
};

/**
 * Hook for Testimonial operations with dedicated endpoints - UPDATED VERSION
 */
export const useTestimonialOperations = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch<AppDispatch>();

  const addTestimonial = useMutation({
    mutationFn: (testimonialItem: Omit<TestimonialItem, "id">) =>
      landingPageService.addTestimonialItem(testimonialItem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landingPage"] });
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      dispatch(fetchLandingPageData());
      toast.success("Testimonial added successfully!");
    },
    onError: (error: Error) => {
      const apiError = error as ErrorResponse;
      toast.error(
        apiError?.response?.data?.message || "Failed to add testimonial",
      );
    },
  });

  const updateTestimonial = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Omit<TestimonialItem, "id">;
    }) => landingPageService.updateTestimonialItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landingPage"] });
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      dispatch(fetchLandingPageData());
      toast.success("Testimonial updated successfully!");
    },
    onError: (error: Error) => {
      const apiError = error as ErrorResponse;
      toast.error(
        apiError?.response?.data?.message || "Failed to update testimonial",
      );
    },
  });

  const deleteTestimonial = useMutation({
    mutationFn: (id: string) => landingPageService.deleteTestimonialItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landingPage"] });
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      dispatch(fetchLandingPageData());
      toast.success("Testimonial deleted successfully!");
    },
    onError: (error: Error) => {
      const apiError = error as ErrorResponse;
      toast.error(
        apiError?.response?.data?.message || "Failed to delete testimonial",
      );
    },
  });

  return {
    addTestimonial: addTestimonial.mutateAsync,
    updateTestimonial: updateTestimonial.mutateAsync,
    deleteTestimonial: deleteTestimonial.mutateAsync,
    isLoading:
      addTestimonial.isPending ||
      updateTestimonial.isPending ||
      deleteTestimonial.isPending,
  };
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
 * Hook to update landing page using React Query - UPDATED VERSION
 */
/**
 * Hook to update landing page using React Query - UPDATED VERSION
 */
export const useUpdateLandingPageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateLandingPageRequest) => {
      // Route to appropriate service method
      if (payload.section === "faqs" || payload.section === "testimonials") {
        // These should use dedicated hooks now
        throw new Error(
          `Use dedicated hooks for ${payload.section} operations`,
        );
      }
      return landingPageService.updateLandingPageSection(payload);
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["landingPage"] });
      const previousData = queryClient.getQueryData<LandingPageData>([
        "landingPage",
      ]);

      queryClient.setQueryData<LandingPageData>(["landingPage"], (old) => {
        if (!old) return old;
        const updated = { ...old } as LandingPageData;
        const { section, data, index } = newData;

        if (index !== undefined && Array.isArray(updated[section])) {
          const newArray = [...(updated[section] as unknown[])];
          newArray[index] = data;
          (updated[section] as unknown[]) = newArray;
        } else {
          (updated as Record<string, unknown>)[section] = data;
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
      if (context?.previousData) {
        queryClient.setQueryData(["landingPage"], context.previousData);
      }
      toast.error(error?.response?.data?.message || "Failed to update");
    },
    onSuccess: () => {
      toast.success("Landing page updated successfully!");
    },
    onSettled: () => {
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
    onError: (error: Error) => {
      const apiError = error as ErrorResponse;
      const errorMessage =
        apiError?.response?.data?.message ||
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
    onError: (error: Error) => {
      const apiError = error as ErrorResponse;
      const errorMessage =
        apiError?.response?.data?.message ||
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
