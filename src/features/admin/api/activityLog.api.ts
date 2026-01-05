import api from "../../../shared/utils/api";
import {
  ActivityLogFilters,
  ActivityLogResponse,
  ActivityStatsResponse,
  ActivityTimelineResponse,
} from "../types/activityLog.types";

export const activityLogApi = {
  getActivityLogs: async (
    filters: ActivityLogFilters = {},
  ): Promise<ActivityLogResponse> => {
    const params = new URLSearchParams();

    if (filters.page) params.append("page", String(filters.page));
    if (filters.limit) params.append("limit", String(filters.limit));
    if (filters.category) params.append("category", filters.category);
    if (filters.severity) params.append("severity", filters.severity);
    if (filters.merchantId) params.append("merchantId", filters.merchantId);
    if (filters.actorId) params.append("actorId", filters.actorId);
    if (filters.resourceType)
      params.append("resourceType", filters.resourceType);
    if (filters.resourceId) params.append("resourceId", filters.resourceId);
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);
    if (filters.search) params.append("search", filters.search);

    const response = await api.get<ActivityLogResponse>(
      `/activity-logs?${params.toString()}`,
    );
    return response.data;
  },

  getActivityStats: async (
    merchantId?: string,
  ): Promise<ActivityStatsResponse> => {
    const params = merchantId ? `?merchantId=${merchantId}` : "";
    const response = await api.get<ActivityStatsResponse>(
      `/activity-logs/stats${params}`,
    );
    return response.data;
  },

  getResourceTimeline: async (
    resourceType: string,
    resourceId: string,
  ): Promise<ActivityTimelineResponse> => {
    const response = await api.get<ActivityTimelineResponse>(
      `/activity-logs/timeline/${resourceType}/${resourceId}`,
    );
    return response.data;
  },
};

export default activityLogApi;
