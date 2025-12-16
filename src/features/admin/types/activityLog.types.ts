
export type ActivityCategory = 
  | 'AUTH' 
  | 'USER' 
  | 'MERCHANT' 
  | 'GIFT_CARD' 
  | 'PURCHASE' 
  | 'REDEMPTION' 
  | 'SYSTEM';

export type ActivitySeverity = 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';

export interface ActivityLog {
  id: string;
  createdAt: string;
  actorId: string | null;
  actorType: string;
  action: string;
  category: ActivityCategory;
  description: string;
  resourceType: string | null;
  resourceId: string | null;
  metadata: Record<string, any> | null;
  severity: ActivitySeverity;
  merchantId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
}

export interface ActivityLogFilters {
  page?: number;
  limit?: number;
  category?: ActivityCategory | '';
  severity?: ActivitySeverity | '';
  merchantId?: string;
  actorId?: string;
  resourceType?: string;
  resourceId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface ActivityLogPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ActivityLogResponse {
  success: boolean;
  data: {
    logs: ActivityLog[];
    pagination: ActivityLogPagination;
  };
}

export interface ActivityStatsResponse {
  success: boolean;
  data: {
    today: number;
    byCategory: Record<ActivityCategory, number>;
    bySeverity: Record<ActivitySeverity, number>;
    recentErrors: ActivityLog[];
  };
}

export interface ActivityTimelineResponse {
  success: boolean;
  data: {
    logs: ActivityLog[];
  };
}

export const CATEGORY_CONFIG: Record<ActivityCategory, { label: string; color: string; bgColor: string }> = {
  AUTH: { label: 'Authentication', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  USER: { label: 'User', color: 'text-purple-700', bgColor: 'bg-purple-100' },
  MERCHANT: { label: 'Merchant', color: 'text-indigo-700', bgColor: 'bg-indigo-100' },
  GIFT_CARD: { label: 'Gift Card', color: 'text-emerald-700', bgColor: 'bg-emerald-100' },
  PURCHASE: { label: 'Purchase', color: 'text-cyan-700', bgColor: 'bg-cyan-100' },
  REDEMPTION: { label: 'Redemption', color: 'text-teal-700', bgColor: 'bg-teal-100' },
  SYSTEM: { label: 'System', color: 'text-gray-700', bgColor: 'bg-gray-100' },
};

export const SEVERITY_CONFIG: Record<ActivitySeverity, { label: string; color: string; bgColor: string; dotColor: string }> = {
  INFO: { label: 'Info', color: 'text-blue-700', bgColor: 'bg-blue-100', dotColor: 'bg-blue-500' },
  WARNING: { label: 'Warning', color: 'text-amber-700', bgColor: 'bg-amber-100', dotColor: 'bg-amber-500' },
  ERROR: { label: 'Error', color: 'text-red-700', bgColor: 'bg-red-100', dotColor: 'bg-red-500' },
  CRITICAL: { label: 'Critical', color: 'text-rose-700', bgColor: 'bg-rose-100', dotColor: 'bg-rose-600' },
};