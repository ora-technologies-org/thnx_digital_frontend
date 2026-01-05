import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback, useEffect } from "react";
import { activityLogApi } from "../api/activityLog.api";
import {
  ActivityLog,
  ActivityLogFilters,
  ActivityCategory,
  ActivitySeverity,
} from "../types/activityLog.types";

export const activityLogQueryKeys = {
  all: ["activity-logs"] as const,
  logs: (filters: ActivityLogFilters) =>
    [...activityLogQueryKeys.all, "list", filters] as const,
  stats: (merchantId?: string) =>
    [...activityLogQueryKeys.all, "stats", merchantId] as const,
  timeline: (resourceType: string, resourceId: string) =>
    [
      ...activityLogQueryKeys.all,
      "timeline",
      resourceType,
      resourceId,
    ] as const,
};

const DEFAULT_FILTERS: ActivityLogFilters = {
  page: 1,
  limit: 25,
  category: "",
  severity: "",
  search: "",
  startDate: "",
  endDate: "",
};

export const useActivityLogs = (initialFilters: ActivityLogFilters = {}) => {
  const [filters, setFilters] = useState<ActivityLogFilters>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });

  const [realtimeLogs, setRealtimeLogs] = useState<ActivityLog[]>([]);
  const [newLogIds, setNewLogIds] = useState<Set<string>>(new Set());

  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: activityLogQueryKeys.logs(filters),
    queryFn: () => activityLogApi.getActivityLogs(filters),
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
  });

  useEffect(() => {
    // Defer state updates to avoid synchronous setState in effect
    const timeoutId = setTimeout(() => {
      setRealtimeLogs([]);
      setNewLogIds(new Set());
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [filters, query.dataUpdatedAt]);

  const addRealtimeLog = useCallback(
    (log: ActivityLog) => {
      if (filters.page !== 1) return;

      if (filters.category && log.category !== filters.category) return;
      if (filters.severity && log.severity !== filters.severity) return;
      if (
        filters.search &&
        !log.description.toLowerCase().includes(filters.search.toLowerCase())
      )
        return;

      setRealtimeLogs((prev) => {
        if (prev.some((l) => l.id === log.id)) return prev;
        return [log, ...prev].slice(0, 10);
      });

      setNewLogIds((prev) => new Set(prev).add(log.id));

      setTimeout(() => {
        setNewLogIds((prev) => {
          const next = new Set(prev);
          next.delete(log.id);
          return next;
        });
      }, 5000);
    },
    [filters],
  );

  const clearNewStatus = useCallback((logId: string) => {
    setNewLogIds((prev) => {
      const next = new Set(prev);
      next.delete(logId);
      return next;
    });
  }, []);

  const combinedLogs = [...realtimeLogs, ...(query.data?.data.logs ?? [])];

  const uniqueLogs = combinedLogs.filter(
    (log, index, self) => index === self.findIndex((l) => l.id === log.id),
  );

  const updateFilters = useCallback(
    (newFilters: Partial<ActivityLogFilters>) => {
      setFilters((prev) => ({
        ...prev,
        ...newFilters,
        page: newFilters.page ?? 1,
      }));
    },
    [],
  );

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const setCategory = useCallback((category: ActivityCategory | "") => {
    setFilters((prev) => ({ ...prev, category, page: 1 }));
  }, []);

  const setSeverity = useCallback((severity: ActivitySeverity | "") => {
    setFilters((prev) => ({ ...prev, severity, page: 1 }));
  }, []);

  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }));
  }, []);

  const setDateRange = useCallback((startDate: string, endDate: string) => {
    setFilters((prev) => ({ ...prev, startDate, endDate, page: 1 }));
  }, []);

  const refresh = useCallback(() => {
    setRealtimeLogs([]);
    setNewLogIds(new Set());
    queryClient.invalidateQueries({
      queryKey: activityLogQueryKeys.logs(filters),
    });
  }, [queryClient, filters]);

  const adjustedPagination = query.data?.data.pagination
    ? {
        ...query.data.data.pagination,
        total: query.data.data.pagination.total + realtimeLogs.length,
      }
    : { page: 1, limit: 25, total: 0, totalPages: 0 };

  return {
    // Data
    logs: uniqueLogs,
    pagination: adjustedPagination,
    realtimeCount: realtimeLogs.length,
    newLogIds,

    // Query state
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,

    // Filters
    filters,
    updateFilters,
    resetFilters,
    setPage,
    setCategory,
    setSeverity,
    setSearch,
    setDateRange,

    // Realtime
    addRealtimeLog,
    clearNewStatus,

    // Actions
    refresh,
    refetch: query.refetch,
  };
};

export const useActivityStats = (merchantId?: string) => {
  return useQuery({
    queryKey: activityLogQueryKeys.stats(merchantId),
    queryFn: () => activityLogApi.getActivityStats(merchantId),
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 60 * 2,
  });
};

export const useResourceTimeline = (
  resourceType: string,
  resourceId: string,
) => {
  return useQuery({
    queryKey: activityLogQueryKeys.timeline(resourceType, resourceId),
    queryFn: () => activityLogApi.getResourceTimeline(resourceType, resourceId),
    enabled: !!resourceType && !!resourceId,
    staleTime: 1000 * 30,
  });
};
