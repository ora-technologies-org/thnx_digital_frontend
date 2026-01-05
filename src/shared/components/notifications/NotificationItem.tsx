// src/shared/components/notifications/NotificationItem.tsx

import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Check, Trash2, Loader2 } from "lucide-react";
import { useNotifications } from "../../../features/admin/hooks/useNotifications";
import {
  Notification,
  NOTIFICATION_TYPE_CONFIG,
} from "../../../features/admin/types/notification.types";

interface NotificationItemProps {
  notification: Notification;
  onClose?: () => void;
  showActions?: boolean;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onClose,
  showActions = true,
}) => {
  const { markAsRead, deleteNotification, isMarkingAsRead, isDeleting } =
    useNotifications();

  const config = NOTIFICATION_TYPE_CONFIG[notification.type];
  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
  });

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotification(notification.id);
  };

  const handleClick = () => {
    // Mark as read when clicked
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

    // Navigate based on notification type (optional)
    // You can add navigation logic here based on resourceType/resourceId

    if (onClose) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        group relative px-4 py-3 cursor-pointer transition-colors
        hover:bg-gray-50
        ${!notification.isRead ? "bg-blue-50/50" : ""}
      `}
    >
      {/* Unread Indicator */}
      {!notification.isRead && (
        <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full" />
      )}

      <div className="flex gap-3">
        {/* Icon */}
        <div
          className={`
            flex-shrink-0 w-10 h-10 rounded-full 
            flex items-center justify-center text-lg
            ${config.bgColor}
          `}
        >
          {config.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              {/* Title */}
              <p
                className={`
                  text-sm font-medium truncate
                  ${!notification.isRead ? "text-gray-900" : "text-gray-700"}
                `}
              >
                {notification.title}
              </p>

              {/* Message */}
              <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">
                {notification.message}
              </p>

              {/* Meta */}
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-xs px-1.5 py-0.5 rounded ${config.bgColor} ${config.color}`}
                >
                  {config.label}
                </span>
                <span className="text-xs text-gray-400">{timeAgo}</span>
                {notification.actorName && (
                  <span className="text-xs text-gray-400">
                    by {notification.actorName}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            {showActions && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {!notification.isRead && (
                  <button
                    onClick={handleMarkAsRead}
                    disabled={isMarkingAsRead}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Mark as read"
                  >
                    {isMarkingAsRead ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                  </button>
                )}
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Delete"
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
