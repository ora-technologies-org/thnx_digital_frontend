// // src/features/admin/hooks/useActivityLogSocket.ts

// import { useEffect, useState, useCallback, useRef } from 'react';
// import { useQueryClient } from '@tanstack/react-query';
// import { connectSocket, disconnectSocket } from '../../../shared/utils/socket';
// import { ActivityLog } from '../types/activityLog.types';
// import { activityLogQueryKeys } from './useActivityLogs';

// interface UseActivityLogSocketOptions {
//   enabled?: boolean;
//   onNewLog?: (log: ActivityLog) => void;
// }

// interface UseActivityLogSocketReturn {
//   isConnected: boolean;
//   connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
//   error: string | null;
//   reconnect: () => void;
// }

// export const useActivityLogSocket = (
//   options: UseActivityLogSocketOptions = {}
// ): UseActivityLogSocketReturn => {
//   const { enabled = true, onNewLog } = options;

//   const [isConnected, setIsConnected] = useState(false);
//   const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
//   const [error, setError] = useState<string | null>(null);

//   const queryClient = useQueryClient();
//   const onNewLogRef = useRef(onNewLog);

//   useEffect(() => {
//     onNewLogRef.current = onNewLog;
//   }, [onNewLog]);

//   const reconnect = useCallback(() => {
//     const token = localStorage.getItem('accessToken');
//     if (token) {
//       setConnectionStatus('connecting');
//       setError(null);
//       disconnectSocket();
//       connectSocket(token);
//     }
//   }, []);

//   useEffect(() => {
//     if (!enabled) {
//       disconnectSocket();
//       setIsConnected(false);
//       setConnectionStatus('disconnected');
//       return;
//     }

//     const token = localStorage.getItem('accessToken');
//     if (!token) {
//       setError('No authentication token');
//       setConnectionStatus('error');
//       return;
//     }

//     setConnectionStatus('connecting');

//     const socket = connectSocket(token);

//     const handleConnect = () => {
//       setIsConnected(true);
//       setConnectionStatus('connected');
//       setError(null);
//     };

//     const handleDisconnect = (reason: string) => {
//       setIsConnected(false);
//       setConnectionStatus('disconnected');
//     };

//     const handleConnectError = (err: Error) => {
//       setIsConnected(false);
//       setConnectionStatus('error');
//       setError(err.message);
//     };

//     const handleNewActivity = (log: ActivityLog) => {
//       // Call the callback to add log to table
//       if (onNewLogRef.current) {
//         onNewLogRef.current(log);
//       }

//       // Invalidate stats
//       queryClient.invalidateQueries({
//         queryKey: activityLogQueryKeys.stats(),
//       });
//     };

//     socket.on('connect', handleConnect);
//     socket.on('disconnect', handleDisconnect);
//     socket.on('connect_error', handleConnectError);
//     socket.on('activity:new', handleNewActivity);

//     if (socket.connected) {
//       handleConnect();
//     }

//     return () => {
//       socket.off('connect', handleConnect);
//       socket.off('disconnect', handleDisconnect);
//       socket.off('connect_error', handleConnectError);
//       socket.off('activity:new', handleNewActivity);
//     };
//   }, [enabled, queryClient]);

//   return {
//     isConnected,
//     connectionStatus,
//     error,
//     reconnect,
//   };
// };

// export default useActivityLogSocket;

// src/features/admin/hooks/useActivityLogSocket.ts

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { connectSocket, disconnectSocket } from "../../../shared/utils/socket";
import { ActivityLog } from "../types/activityLog.types";
import { activityLogQueryKeys } from "./useActivityLogs";

interface UseActivityLogSocketOptions {
  enabled?: boolean;
  onNewLog?: (log: ActivityLog) => void;
}

interface UseActivityLogSocketReturn {
  isConnected: boolean;
  connectionStatus: "connecting" | "connected" | "disconnected" | "error";
  error: string | null;
  reconnect: () => void;
}

export const useActivityLogSocket = (
  options: UseActivityLogSocketOptions = {},
): UseActivityLogSocketReturn => {
  const { enabled = true, onNewLog } = options;

  const [socketConnected, setSocketConnected] = useState(false);
  const [socketStatus, setSocketStatus] = useState<
    "connecting" | "connected" | "disconnected" | "error"
  >("disconnected");
  const [socketError, setSocketError] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const onNewLogRef = useRef(onNewLog);

  useEffect(() => {
    onNewLogRef.current = onNewLog;
  }, [onNewLog]);

  const reconnect = useCallback(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setSocketStatus("connecting");
      setSocketError(null);
      disconnectSocket();
      connectSocket(token);
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      disconnectSocket();
      // Defer state updates to avoid synchronous setState in effect
      const timeoutId = setTimeout(() => {
        setSocketConnected(false);
        setSocketStatus("disconnected");
      }, 0);

      return () => clearTimeout(timeoutId);
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      return;
    }

    const socket = connectSocket(token);

    const handleConnect = () => {
      setSocketConnected(true);
      setSocketStatus("connected");
      setSocketError(null);
    };

    const handleDisconnect = () => {
      setSocketConnected(false);
      setSocketStatus("disconnected");
    };

    const handleConnectError = (err: Error) => {
      setSocketConnected(false);
      setSocketStatus("error");
      setSocketError(err.message);
    };

    const handleNewActivity = (log: ActivityLog) => {
      // Call the callback to add log to table
      if (onNewLogRef.current) {
        onNewLogRef.current(log);
      }

      // Invalidate stats
      queryClient.invalidateQueries({
        queryKey: activityLogQueryKeys.stats(),
      });
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("activity:new", handleNewActivity);

    // Check if already connected
    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("activity:new", handleNewActivity);
    };
  }, [enabled, queryClient]);

  const hasToken = !!localStorage.getItem("accessToken");

  const isConnected = enabled && socketConnected;
  const connectionStatus = useMemo(() => {
    if (!enabled) return "disconnected";
    if (!hasToken) return "error";
    return socketStatus;
  }, [enabled, hasToken, socketStatus]);

  const error = useMemo(() => {
    if (!enabled) return null;
    if (!hasToken) return "No authentication token";
    return socketError;
  }, [enabled, hasToken, socketError]);

  return {
    isConnected,
    connectionStatus,
    error,
    reconnect,
  };
};

export default useActivityLogSocket;
