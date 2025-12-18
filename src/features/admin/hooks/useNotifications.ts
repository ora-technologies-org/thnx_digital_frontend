
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { notificationApi } from '../api/notification.api';
import {
  Notification,
  NotificationFilters,
  UpdatePreferencesPayload,
} from '../types/notification.types';

// Query keys
export const notificationQueryKeys = {
  all: ['notifications'] as const,
  list: (filters: NotificationFilters) =>
    [...notificationQueryKeys.all, 'list', filters] as const,
  unreadCount: () => [...notificationQueryKeys.all, 'unread-count'] as const,
  preferences: () => [...notificationQueryKeys.all, 'preferences'] as const,
};

// Default filters
const DEFAULT_FILTERS: NotificationFilters = {
  page: 1,
  limit: 20,
  unreadOnly: false,
};

/**
 * Hook for managing notifications
 */
export const useNotifications = (initialFilters: NotificationFilters = {}) => {
  const [filters, setFilters] = useState<NotificationFilters>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });

  const queryClient = useQueryClient();

  // Fetch notifications
  const query = useQuery({
    queryKey: notificationQueryKeys.list(filters),
    queryFn: () => notificationApi.getNotifications(filters),
    staleTime: 1000 * 30, // 30 seconds
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: notificationApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: notificationApi.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
    },
  });

  // Delete notification mutation
  const deleteNotificationMutation = useMutation({
    mutationFn: notificationApi.deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
    },
  });

  // Filter update functions
  const updateFilters = useCallback((newFilters: Partial<NotificationFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const toggleUnreadOnly = useCallback(() => {
    setFilters((prev) => ({ ...prev, unreadOnly: !prev.unreadOnly, page: 1 }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  // Refresh notifications
  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: notificationQueryKeys.list(filters) });
  }, [queryClient, filters]);

  return {
    // Data
    notifications: query.data?.data ?? [],
    pagination: query.data?.pagination ?? {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
      hasMore: false,
    },

    // Query state
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,

    // Filters
    filters,
    updateFilters,
    setPage,
    toggleUnreadOnly,
    resetFilters,

    // Actions
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    deleteNotification: deleteNotificationMutation.mutate,
    refresh,

    // Mutation states
    isMarkingAsRead: markAsReadMutation.isPending,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
    isDeleting: deleteNotificationMutation.isPending,
  };
};

/**
 * Hook for unread notification count
 */
export const useUnreadCount = () => {
  const query = useQuery({
    queryKey: notificationQueryKeys.unreadCount(),
    queryFn: notificationApi.getUnreadCount,
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 60, // Refetch every minute
  });

  return {
    count: query.data?.data.count ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
};

/**
 * Hook for notification preferences
 */
export const useNotificationPreferences = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: notificationQueryKeys.preferences(),
    queryFn: notificationApi.getPreferences,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const updateMutation = useMutation({
    mutationFn: notificationApi.updatePreferences,
    onSuccess: (data) => {
      queryClient.setQueryData(notificationQueryKeys.preferences(), data);
    },
  });

  const updatePreference = useCallback(
    (key: keyof UpdatePreferencesPayload, value: boolean) => {
      updateMutation.mutate({ [key]: value });
    },
    [updateMutation]
  );

  return {
    preferences: query.data?.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    updatePreference,
    updatePreferences: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
};

/**
 * Hook for sending test notifications (development only)
 */
export const useTestNotification = () => {
  const mutation = useMutation({
    mutationFn: ({
      type,
      merchantUserId,
    }: {
      type?: 'self' | 'admin' | 'merchant';
      merchantUserId?: string;
    }) => notificationApi.sendTestNotification(type, merchantUserId),
  });

  return {
    sendTest: mutation.mutate,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
};

export default useNotifications;