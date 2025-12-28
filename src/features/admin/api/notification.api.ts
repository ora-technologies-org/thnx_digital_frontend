import api from "../../../shared/utils/api";
import {
  NotificationFilters,
  NotificationResponse,
  UnreadCountResponse,
  NotificationPreferencesResponse,
  UpdatePreferencesPayload,
} from "../types/notification.types";

export const notificationApi = {
  /**
   * Get notifications for the authenticated user
   */
  getNotifications: async (
    filters: NotificationFilters = {},
  ): Promise<NotificationResponse> => {
    const params = new URLSearchParams();

    if (filters.page) params.append("page", String(filters.page));
    if (filters.limit) params.append("limit", String(filters.limit));
    if (filters.unreadOnly) params.append("unreadOnly", "true");

    const response = await api.get<NotificationResponse>(
      `/notifications?${params.toString()}`,
    );
    return response.data;
  },

  /**
   * Get unread notification count
   */
  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    const response = await api.get<UnreadCountResponse>(
      "/notifications/unread-count",
    );
    return response.data;
  },

  /**
   * Mark a single notification as read
   */
  markAsRead: async (
    notificationId: string,
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.patch<{ success: boolean; message: string }>(
      `/notifications/${notificationId}/read`,
    );
    return response.data;
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async (): Promise<{
    success: boolean;
    message: string;
    data: { count: number };
  }> => {
    const response = await api.patch<{
      success: boolean;
      message: string;
      data: { count: number };
    }>("/notifications/read-all");
    return response.data;
  },

  /**
   * Delete a notification
   */
  deleteNotification: async (
    notificationId: string,
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete<{ success: boolean; message: string }>(
      `/notifications/${notificationId}`,
    );
    return response.data;
  },

  /**
   * Get notification preferences
   */
  getPreferences: async (): Promise<NotificationPreferencesResponse> => {
    const response = await api.get<NotificationPreferencesResponse>(
      "/notifications/preferences",
    );
    return response.data;
  },

  /**
   * Update notification preferences
   */
  updatePreferences: async (
    preferences: UpdatePreferencesPayload,
  ): Promise<NotificationPreferencesResponse> => {
    const response = await api.patch<NotificationPreferencesResponse>(
      "/notifications/preferences",
      preferences,
    );
    return response.data;
  },

  /**
   * Send a test notification (development only)
   */
  sendTestNotification: async (
    type: "self" | "admin" | "merchant" = "self",
    merchantUserId?: string,
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.post<{ success: boolean; message: string }>(
      "/notifications/test",
      { type, merchantUserId },
    );
    return response.data;
  },
};

export default notificationApi;
