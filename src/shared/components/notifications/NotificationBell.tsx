// src/shared/components/notifications/NotificationBell.tsx

import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useUnreadCount } from '../../../features/admin/hooks/useNotifications';
import { useNotificationSocket } from '../../../features/admin/hooks/useNotificationSocket';
import NotificationDropdown from './NotificationDropdown';
// import NotificationDropdown from './NotificationDropdown';

interface NotificationBellProps {
  className?: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Get unread count
  const { count: unreadCount } = useUnreadCount();

  // Connect to notification socket
  const { isConnected, connectionStatus } = useNotificationSocket({
    enabled: true,
    onNewNotification: (notification) => {
      // Trigger animation
      setHasNewNotification(true);
      setTimeout(() => setHasNewNotification(false), 1000);

      // Show browser notification if permitted
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico',
        });
      }
    },
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Bell Button */}
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className={`
          relative p-2 rounded-full transition-all duration-200
          hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500
          ${hasNewNotification ? 'animate-bounce' : ''}
          ${isOpen ? 'bg-gray-100' : ''}
        `}
        aria-label="Notifications"
      >
        <Bell
          className={`w-6 h-6 transition-colors ${
            isConnected ? 'text-gray-700' : 'text-gray-400'
          }`}
        />

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span
            className={`
              absolute -top-1 -right-1 
              min-w-[20px] h-5 px-1
              flex items-center justify-center
              text-xs font-bold text-white
              bg-red-500 rounded-full
              ${hasNewNotification ? 'animate-pulse' : ''}
            `}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}

        {/* Connection Status Indicator */}
        <span
          className={`
            absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white
            ${connectionStatus === 'connected' ? 'bg-green-500' : ''}
            ${connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' : ''}
            ${connectionStatus === 'disconnected' ? 'bg-gray-400' : ''}
            ${connectionStatus === 'error' ? 'bg-red-500' : ''}
          `}
          title={`Socket: ${connectionStatus}`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div ref={dropdownRef}>
          <NotificationDropdown onClose={() => setIsOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default NotificationBell;