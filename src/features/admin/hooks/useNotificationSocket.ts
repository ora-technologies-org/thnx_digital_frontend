// src/features/admin/hooks/useNotificationSocket.ts

import { useEffect, useState, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAppSelector } from '../../../app/hooks';
import {
  connectAdminSocket,
  connectMerchantSocket,
  disconnectAdminSocket,
  disconnectMerchantSocket,
  getAdminSocket,
  getMerchantSocket,
} from '../../../shared/utils/socket';
import { Notification } from '../types/notification.types';
import { notificationQueryKeys } from './useNotifications';

// import { notificationQueryKeys } from './useNotifications';

interface UseNotificationSocketOptions {
  enabled?: boolean;
  onNewNotification?: (notification: Notification) => void;
  onUnreadCountUpdate?: (count: number) => void;
}

interface UseNotificationSocketReturn {
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  error: string | null;
  reconnect: () => void;
}

export const useNotificationSocket = (
  options: UseNotificationSocketOptions = {}
): UseNotificationSocketReturn => {
  const { enabled = true, onNewNotification, onUnreadCountUpdate } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    'connecting' | 'connected' | 'disconnected' | 'error'
  >('disconnected');
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();
  
  // Get user role from Redux store
  const user = useAppSelector((state) => state.auth.user);
  const userRole = user?.role as 'ADMIN' | 'MERCHANT' | undefined;

  // Refs to keep callbacks stable
  const onNewNotificationRef = useRef(onNewNotification);
  const onUnreadCountUpdateRef = useRef(onUnreadCountUpdate);

  useEffect(() => {
    onNewNotificationRef.current = onNewNotification;
  }, [onNewNotification]);

  useEffect(() => {
    onUnreadCountUpdateRef.current = onUnreadCountUpdate;
  }, [onUnreadCountUpdate]);

  const reconnect = useCallback(() => {
    const token = localStorage.getItem('accessToken');
    if (token && userRole) {
      setConnectionStatus('connecting');
      setError(null);

      if (userRole === 'ADMIN') {
        disconnectAdminSocket();
        connectAdminSocket(token);
      } else {
        disconnectMerchantSocket();
        connectMerchantSocket(token);
      }
    }
  }, [userRole]);

  useEffect(() => {
    if (!enabled || !userRole) {
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('No authentication token');
      setConnectionStatus('error');
      return;
    }

    setConnectionStatus('connecting');

    // Connect to appropriate namespace based on role
    const socket =
      userRole === 'ADMIN'
        ? connectAdminSocket(token)
        : connectMerchantSocket(token);

    const handleConnect = () => {
      setIsConnected(true);
      setConnectionStatus('connected');
      setError(null);
    };

    const handleDisconnect = (reason: string) => {
      setIsConnected(false);
      setConnectionStatus('disconnected');
      console.log('Socket disconnected:', reason);
    };

    const handleConnectError = (err: Error) => {
      setIsConnected(false);
      setConnectionStatus('error');
      setError(err.message);
    };

    const handleNewNotification = (notification: Notification) => {
      console.log('🔔 New notification received:', notification);

      // Call the callback
      if (onNewNotificationRef.current) {
        onNewNotificationRef.current(notification);
      }

      // Invalidate notifications query to refetch
      queryClient.invalidateQueries({
        queryKey: notificationQueryKeys.all,
      });

      // Invalidate unread count
      queryClient.invalidateQueries({
        queryKey: notificationQueryKeys.unreadCount(),
      });
    };

    const handleUnreadCount = (data: { count: number }) => {
      console.log('📊 Unread count updated:', data.count);

      // Call the callback
      if (onUnreadCountUpdateRef.current) {
        onUnreadCountUpdateRef.current(data.count);
      }

      // Update the unread count in cache
      queryClient.setQueryData(notificationQueryKeys.unreadCount(), {
        success: true,
        data: { count: data.count },
      });
    };

    // Attach event listeners
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);
    socket.on('notification:new', handleNewNotification);
    socket.on('notification:unread-count', handleUnreadCount);

    // Check if already connected
    if (socket.connected) {
      handleConnect();
    }

    // Cleanup
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off('notification:new', handleNewNotification);
      socket.off('notification:unread-count', handleUnreadCount);
    };
  }, [enabled, userRole, queryClient]);

  return {
    isConnected,
    connectionStatus,
    error,
    reconnect,
  };
};

export default useNotificationSocket;