import React from "react";
import {
  Bell,
  Filter,
  RefreshCw,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Settings,
  ArrowLeft,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useNotifications } from "../features/admin/hooks/useNotifications";
import { useNotificationSocket } from "../features/admin/hooks/useNotificationSocket";
import { useAppSelector } from "../app/hooks";
import NotificationItem from "../shared/components/notifications/NotificationItem";

import { AdminLayout } from "../shared/components/layout/AdminLayout";
import { DashboardLayout } from "../shared/components/layout/DashboardLayout";

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const isAdmin = user?.role === "ADMIN";

  const {
    notifications,
    pagination,
    isLoading,
    isFetching,
    filters,
    setPage,
    toggleUnreadOnly,
    markAllAsRead,
    isMarkingAllAsRead,
    refresh,
  } = useNotifications({ limit: 20 });

  // Connect to socket for real-time updates
  const { isConnected } = useNotificationSocket({
    enabled: true,
  });

  const hasNotifications = notifications.length > 0;
  const hasUnread = notifications.some((n) => !n.isRead);

  // Determine links based on role
  const backLink = isAdmin ? "/admin/dashboard" : "/merchant/dashboard";
  const settingsLink = isAdmin ? "/admin/settings" : "/merchant/settings";

  // Page content (same for both layouts)
  const PageContent = (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(backLink)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </motion.button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Notifications
              </h1>
              <p className="text-sm text-gray-500">
                {pagination.total} total notifications
                {isConnected && (
                  <span className="ml-2 inline-flex items-center gap-1 text-green-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Live
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => refresh()}
              disabled={isFetching}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw
                className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {hasUnread && (
              <button
                onClick={() => markAllAsRead()}
                disabled={isMarkingAllAsRead}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isMarkingAllAsRead ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCheck className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">Mark all read</span>
              </button>
            )}

            <Link
              to={settingsLink}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Notification Settings"
            >
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-4 flex items-center gap-3"
      >
        <button
          onClick={toggleUnreadOnly}
          className={`
            flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors
            ${
              filters.unreadOnly
                ? "bg-blue-100 text-blue-700 border border-blue-200"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }
          `}
        >
          <Filter className="w-4 h-4" />
          {filters.unreadOnly ? "Showing unread only" : "Show all"}
        </button>
      </motion.div>

      {/* Notification List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : !hasNotifications ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <Bell className="w-16 h-16 mb-4 text-gray-300" />
            <p className="text-lg font-medium">No notifications</p>
            <p className="text-sm text-gray-400 mt-1">
              {filters.unreadOnly
                ? "You're all caught up!"
                : "You don't have any notifications yet"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <NotificationItem
                  notification={notification}
                  showActions={true}
                />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex items-center justify-between"
        >
          <p className="text-sm text-gray-500">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <span className="px-4 py-2 text-sm text-gray-700">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <button
              onClick={() => setPage(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );

  // Render with appropriate layout based on user role
  if (isAdmin) {
    return <AdminLayout>{PageContent}</AdminLayout>;
  }

  return <DashboardLayout>{PageContent}</DashboardLayout>;
};

export default NotificationsPage;
