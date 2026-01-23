// src/features/merchant/hooks/useDashboardStats.ts
import { useState, useEffect, useCallback, useRef } from "react";
import DashboardService, { DashboardStats } from "../services/DashboardService";

// ==================== TYPE DEFINITIONS ====================

/**
 * Dashboard stats state structure
 */
interface DashboardStatsState {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Return type for useDashboardStats hook
 */
interface UseDashboardStatsReturn extends DashboardStatsState {
  refresh: () => Promise<void>;
}

// ==================== CUSTOM HOOK ====================

/**
 * Custom hook to fetch and manage dashboard statistics
 * Fetches data from /merchants/dashboard endpoint via DashboardService
 *
 * Features:
 * - Automatic data fetching on mount
 * - Manual refresh capability
 * - Loading and error state management
 * - Cleanup on unmount to prevent memory leaks
 *
 * @returns {UseDashboardStatsReturn} Dashboard stats, loading state, error, and refresh function
 *
 * @example
 * const { stats, isLoading, error, refresh } = useDashboardStats();
 *
 * if (isLoading) return <Spinner />;
 * if (error) return <Error message={error} />;
 * return <Dashboard stats={stats} onRefresh={refresh} />;
 */
export const useDashboardStats = (): UseDashboardStatsReturn => {
  const [state, setState] = useState<DashboardStatsState>({
    stats: null,
    isLoading: true,
    error: null,
  });

  const isMountedRef = useRef(true);

  /**
   * Load dashboard statistics from the service
   * Updates state with fetched data or error
   */
  const loadDashboardStats = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      // Call the dashboard service
      const response = await DashboardService.getDashboardStats();

      // Only update state if component is still mounted
      if (isMountedRef.current) {
        if (response.success && response.data) {
          setState({
            stats: response.data,
            isLoading: false,
            error: null,
          });
        } else {
          setState({
            stats: null,
            isLoading: false,
            error: response.message || "Failed to fetch dashboard stats",
          });
        }
      }
    } catch (error) {
      console.error("❌ [useDashboardStats] Unexpected error:", error);

      if (isMountedRef.current) {
        setState({
          stats: null,
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
        });
      }
    }
  }, []); // Empty deps - function doesn't depend on any external values

  // Fetch stats on component mount
  useEffect(() => {
    // Set mounted flag
    isMountedRef.current = true;

    // Call async function
    loadDashboardStats();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  /**
   * Refresh function to manually trigger stats refetch
   * Useful after creating gift cards or other actions that affect stats
   *
   * @example
   * await refresh(); // Refetch the latest stats
   */
  const refresh = useCallback(async () => {
    await loadDashboardStats();
  }, [loadDashboardStats]);

  return {
    stats: state.stats,
    isLoading: state.isLoading,
    error: state.error,
    refresh,
  };
};
