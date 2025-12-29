// src/features/merchant/hooks/useDashboardStats.ts
import { useState, useEffect, useCallback, useRef } from "react";
import api from "../../../shared/utils/api";

interface DashboardStats {
  totalSales: string;
  activeGiftCards: number;
  redemptions: number;
  revenue: string;
}

interface DashboardStatsState {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook to fetch and manage dashboard statistics
 * Fetches data from /merchants/dashboard endpoint
 *
 * @returns {DashboardStatsState & { refresh: () => void }} Dashboard stats, loading state, error, and refresh function
 */
export const useDashboardStats = () => {
  const [state, setState] = useState<DashboardStatsState>({
    stats: null,
    isLoading: true,
    error: null,
  });

  const isMountedRef = useRef(true);

  // Fetch stats on component mount - using the effect itself for the async operation
  useEffect(() => {
    const loadDashboardStats = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        // Make API call to fetch dashboard stats
        const response = await api.get("/merchants/dashboard");

        console.log("Dashboard Stats Response:", response.data);

        // Extract data from response
        const statsData = response.data.data || response.data;

        // Only update state if component is still mounted
        if (isMountedRef.current) {
          setState({
            stats: {
              totalSales: statsData.totalSales || "0",
              activeGiftCards: statsData.activeGiftCards || 0,
              redemptions: statsData.redemptions || 0,
              revenue: statsData.revenue || "0",
            },
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);

        const errorMessage =
          error instanceof Error
            ? error.message
            : typeof error === "object" &&
                error !== null &&
                "response" in error &&
                typeof error.response === "object" &&
                error.response !== null &&
                "data" in error.response &&
                typeof error.response.data === "object" &&
                error.response.data !== null &&
                "message" in error.response.data
              ? String(error.response.data.message)
              : "Failed to fetch dashboard stats";

        if (isMountedRef.current) {
          setState({
            stats: null,
            isLoading: false,
            error: errorMessage,
          });
        }
      }
    };

    loadDashboardStats();

    // Cleanup function
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  /**
   * Refresh function to manually trigger stats refetch
   * Useful after creating gift cards or other actions that affect stats
   */
  const refresh = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await api.get("/merchants/dashboard");
      const statsData = response.data.data || response.data;

      setState({
        stats: {
          totalSales: statsData.totalSales || "0",
          activeGiftCards: statsData.activeGiftCards || 0,
          redemptions: statsData.redemptions || 0,
          revenue: statsData.revenue || "0",
        },
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "object" &&
              error !== null &&
              "response" in error &&
              typeof error.response === "object" &&
              error.response !== null &&
              "data" in error.response &&
              typeof error.response.data === "object" &&
              error.response.data !== null &&
              "message" in error.response.data
            ? String(error.response.data.message)
            : "Failed to fetch dashboard stats";

      setState({
        stats: null,
        isLoading: false,
        error: errorMessage,
      });
    }
  }, []);

  return {
    stats: state.stats,
    isLoading: state.isLoading,
    error: state.error,
    refresh,
  };
};
