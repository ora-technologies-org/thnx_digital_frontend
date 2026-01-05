// src/features/admin/components/activityLog/ActivityLogTable.tsx

import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Info,
  ExternalLink,
  WifiOff,
  Radio,
} from "lucide-react";
import {
  ActivityLog,
  ActivityLogPagination,
  CATEGORY_CONFIG,
  SEVERITY_CONFIG,
} from "../../types/activityLog.types";

interface ActivityLogTableProps {
  logs: ActivityLog[];
  pagination: ActivityLogPagination;
  onPageChange: (page: number) => void;
  isLoading: boolean;
  onViewDetails?: (log: ActivityLog) => void;
  // Real-time props
  newLogIds?: Set<string>;
  isConnected?: boolean;
  connectionStatus?: "connecting" | "connected" | "disconnected" | "error";
  onReconnect?: () => void;
  realtimeCount?: number;
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const getRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 5) return "Just now";
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export const ActivityLogTable: React.FC<ActivityLogTableProps> = ({
  logs,
  pagination,
  onPageChange,
  isLoading,
  onViewDetails,
  newLogIds = new Set(),
  // isConnected = false,
  connectionStatus = "disconnected",
  onReconnect,
  realtimeCount = 0,
}) => {
  const tableRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to top when new logs arrive
  useEffect(() => {
    if (realtimeCount > 0 && tableRef.current) {
      tableRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [realtimeCount]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-4 mb-4">
              <div className="w-20 h-6 bg-gray-100 rounded animate-pulse" />
              <div className="flex-1 h-6 bg-gray-100 rounded animate-pulse" />
              <div className="w-32 h-6 bg-gray-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl border border-gray-200 p-12 text-center"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <Info className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          No activity logs found
        </h3>
        <p className="text-gray-600">
          Try adjusting your filters or check back later
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
    >
      {/* Header with Live Status */}
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold text-gray-900">Activity Logs</h3>

          {/* Live Status Badge */}
          <div className="flex items-center gap-2">
            {connectionStatus === "connected" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-full"
              >
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-2 h-2 bg-green-500 rounded-full"
                />
                <span className="text-xs font-medium text-green-700">Live</span>
                <Radio className="w-3 h-3 text-green-600" />
              </motion.div>
            )}

            {connectionStatus === "connecting" && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-100 rounded-full">
                <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-yellow-700">
                  Connecting...
                </span>
              </div>
            )}

            {connectionStatus === "disconnected" && (
              <button
                onClick={onReconnect}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                <WifiOff className="w-3 h-3 text-gray-500" />
                <span className="text-xs font-medium text-gray-600">
                  Offline
                </span>
              </button>
            )}

            {connectionStatus === "error" && (
              <button
                onClick={onReconnect}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-100 hover:bg-red-200 rounded-full transition-colors"
              >
                <WifiOff className="w-3 h-3 text-red-500" />
                <span className="text-xs font-medium text-red-600">
                  Reconnect
                </span>
              </button>
            )}
          </div>

          {/* New logs indicator */}
          {realtimeCount > 0 && (
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded-full"
            >
              +{realtimeCount} new
            </motion.span>
          )}
        </div>

        <p className="text-sm text-gray-500">{pagination.total} total logs</p>
      </div>

      {/* Table */}
      <div
        ref={tableRef}
        className="overflow-x-auto max-h-[600px] overflow-y-auto"
      >
        <table className="w-full">
          <thead className="sticky top-0 z-10">
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Severity
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Action
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actor
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <AnimatePresence mode="popLayout">
              {logs.map((log, index) => {
                const categoryConfig = CATEGORY_CONFIG[log.category];
                const severityConfig = SEVERITY_CONFIG[log.severity];
                const isNew = newLogIds.has(log.id);

                return (
                  <motion.tr
                    key={log.id}
                    initial={
                      isNew
                        ? { opacity: 0, x: -20, backgroundColor: "#FFF7ED" }
                        : { opacity: 0, y: 10 }
                    }
                    animate={{
                      opacity: 1,
                      x: 0,
                      y: 0,
                      backgroundColor: isNew ? "#FFF7ED" : "#FFFFFF",
                    }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{
                      duration: isNew ? 0.5 : 0.2,
                      delay: isNew ? 0 : index * 0.02,
                    }}
                    className={`hover:bg-gray-50 transition-colors ${isNew ? "ring-2 ring-orange-300 ring-inset" : ""}`}
                  >
                    {/* Time */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {isNew && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex-shrink-0"
                          >
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                            </span>
                          </motion.span>
                        )}
                        <Clock className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {getRelativeTime(log.createdAt)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatTime(log.createdAt)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${categoryConfig.bgColor} ${categoryConfig.color}`}
                      >
                        {categoryConfig.label}
                      </span>
                    </td>

                    {/* Severity */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${severityConfig.dotColor}`}
                        />
                        <span
                          className={`text-xs font-medium ${severityConfig.color}`}
                        >
                          {severityConfig.label}
                        </span>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                        {log.action}
                      </code>
                    </td>

                    {/* Description */}
                    <td className="px-6 py-4">
                      <p
                        className="text-sm text-gray-900 max-w-md truncate"
                        title={log.description}
                      >
                        {log.description}
                      </p>
                    </td>

                    {/* Actor */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-3 h-3 text-gray-600" />
                        </div>
                        <span className="text-xs text-gray-600 capitalize">
                          {log.actorType}
                        </span>
                      </div>
                    </td>

                    {/* Details */}
                    <td className="px-6 py-4 text-right">
                      {onViewDetails && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onViewDetails(log)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 text-gray-500" />
                        </motion.button>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing{" "}
          <span className="font-semibold">
            {(pagination.page - 1) * pagination.limit + 1}
          </span>{" "}
          to{" "}
          <span className="font-semibold">
            {Math.min(pagination.page * pagination.limit, pagination.total)}
          </span>{" "}
          of <span className="font-semibold">{pagination.total}</span> results
        </p>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="p-2 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>

          <div className="flex items-center gap-1">
            {Array.from(
              { length: Math.min(5, pagination.totalPages) },
              (_, i) => {
                let pageNum: number;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.page >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }

                return (
                  <motion.button
                    key={pageNum}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onPageChange(pageNum)}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                      pagination.page === pageNum
                        ? "bg-orange-500 text-white"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    {pageNum}
                  </motion.button>
                );
              },
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="p-2 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ActivityLogTable;
