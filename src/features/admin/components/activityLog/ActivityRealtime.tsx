import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, Radio, X, Clock, Zap } from "lucide-react";
import {
  ActivityLog,
  CATEGORY_CONFIG,
  SEVERITY_CONFIG,
} from "../../types/activityLog.types";

interface ActivityLogRealtimeProps {
  logs: ActivityLog[];
  isConnected: boolean;
  connectionStatus: "connecting" | "connected" | "disconnected" | "error";
  error: string | null;
  onClear: () => void;
  onReconnect: () => void;
  onViewDetails?: (log: ActivityLog) => void;
}

const getRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 5) return "Just now";
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  return `${Math.floor(diffInSeconds / 3600)}h ago`;
};

export const ActivityLogRealtime: React.FC<ActivityLogRealtimeProps> = ({
  logs,
  isConnected,
  connectionStatus,
  error,
  onClear,
  onReconnect,
  onViewDetails,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
    >
      <div className="px-6 py-4 bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            animate={isConnected ? { scale: [1, 1.2, 1] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Radio className="w-5 h-5 text-white" />
          </motion.div>
          <h3 className="text-lg font-bold text-white">Real-time Activity</h3>

          <div className="flex items-center gap-2">
            {connectionStatus === "connected" && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1 px-2 py-1 bg-white/20 rounded-full text-xs text-white"
              >
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Live
              </motion.span>
            )}
            {connectionStatus === "connecting" && (
              <span className="flex items-center gap-1 px-2 py-1 bg-white/20 rounded-full text-xs text-white">
                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                Connecting...
              </span>
            )}
            {connectionStatus === "disconnected" && (
              <span className="flex items-center gap-1 px-2 py-1 bg-white/20 rounded-full text-xs text-white">
                <span className="w-2 h-2 bg-gray-400 rounded-full" />
                Disconnected
              </span>
            )}
            {connectionStatus === "error" && (
              <span className="flex items-center gap-1 px-2 py-1 bg-red-500/50 rounded-full text-xs text-white">
                <span className="w-2 h-2 bg-red-400 rounded-full" />
                Error
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {logs.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClear}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Clear"
            >
              <X className="w-4 h-4 text-white" />
            </motion.button>
          )}
          {!isConnected && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onReconnect}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white text-sm"
            >
              <Wifi className="w-4 h-4" />
              Reconnect
            </motion.button>
          )}
        </div>
      </div>

      {error && (
        <div className="px-6 py-3 bg-red-50 border-b border-red-100">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="max-h-[400px] overflow-y-auto">
        {logs.length === 0 ? (
          <div className="p-8 text-center">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Zap className="w-8 h-8 text-gray-400" />
            </motion.div>
            <p className="text-gray-500">
              {isConnected
                ? "Waiting for new activity..."
                : "Connect to see real-time activity"}
            </p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {logs.map((log, index) => {
              const categoryConfig = CATEGORY_CONFIG[log.category];
              const severityConfig = SEVERITY_CONFIG[log.severity];

              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: "auto" }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => onViewDetails?.(log)}
                  className={`px-6 py-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                    index === 0 ? "bg-orange-50" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <span
                        className={`w-3 h-3 rounded-full ${severityConfig.dotColor} block ${
                          index === 0 ? "animate-pulse" : ""
                        }`}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryConfig.bgColor} ${categoryConfig.color}`}
                        >
                          {categoryConfig.label}
                        </span>
                        <code className="text-xs bg-gray-100 px-2 py-0.5 rounded font-mono">
                          {log.action}
                        </code>
                        {index === 0 && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full font-medium"
                          >
                            NEW
                          </motion.span>
                        )}
                      </div>
                      <p className="text-sm text-gray-900 truncate">
                        {log.description}
                      </p>
                    </div>

                    {/* Time */}
                    <div className="flex items-center gap-1 text-xs text-gray-500 whitespace-nowrap">
                      <Clock className="w-3 h-3" />
                      {getRelativeTime(log.createdAt)}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {logs.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Showing last {logs.length} real-time events
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default ActivityLogRealtime;
