// src/shared/components/notifications/NotificationDropdown.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  CheckCheck,
  Settings,
  Loader2,
  RefreshCw,
  Bell,
  BellOff,
} from 'lucide-react';
import { useNotifications } from '../../../features/admin/hooks/useNotifications';
import NotificationItem from './NotificationItem';
import { useAppSelector } from '@/app/hooks';
// import NotificationItem from './NotificationItem';

interface NotificationDropdownProps {
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
  const {
    notifications,
    isLoading,
    isFetching,
    markAllAsRead,
    isMarkingAllAsRead,
    refresh,
    filters,
    toggleUnreadOnly,
  } = useNotifications({ limit: 10 });


  const user = useAppSelector((state) => state.auth.user);
  const viewAllLink = user?.role === 'ADMIN' ? '/admin/notifications' : '/merchant/notifications';

  const hasNotifications = notifications.length > 0;
  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <div
      className="
        absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)]
        bg-white rounded-xl shadow-xl border border-gray-200
        z-50 overflow-hidden
      "
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          <div className="flex items-center gap-2">
            {/* Refresh Button */}
            <button
              onClick={() => refresh()}
              disabled={isFetching}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            </button>

            {/* Mark All as Read */}
            {hasUnread && (
              <button
                onClick={() => markAllAsRead()}
                disabled={isMarkingAllAsRead}
                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Mark all as read"
              >
                {isMarkingAllAsRead ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCheck className="w-4 h-4" />
                )}
              </button>
            )}

            {/* Settings Link */}
            <Link
              to="/settings/notifications"
              onClick={onClose}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Notification settings"
            >
              <Settings className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Filter Toggle */}
        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={toggleUnreadOnly}
            className={`
              flex items-center gap-1.5 px-3 py-1 text-sm rounded-full transition-colors
              ${
                filters.unreadOnly
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
          >
            {filters.unreadOnly ? (
              <>
                <Bell className="w-3.5 h-3.5" />
                Unread only
              </>
            ) : (
              <>
                <BellOff className="w-3.5 h-3.5" />
                All notifications
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notification List */}
      <div className="max-h-[400px] overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : !hasNotifications ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Bell className="w-12 h-12 mb-3 text-gray-300" />
            <p className="text-sm font-medium">No notifications</p>
            <p className="text-xs text-gray-400 mt-1">
              {filters.unreadOnly
                ? "You're all caught up!"
                : "You don't have any notifications yet"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClose={onClose}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {hasNotifications && (
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
          <Link
            to={viewAllLink}
            onClick={onClose}
            className="
              block w-full text-center text-sm font-medium text-blue-600 
              hover:text-blue-700 transition-colors
            "
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;