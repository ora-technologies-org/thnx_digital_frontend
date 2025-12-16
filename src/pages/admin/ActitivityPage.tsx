// src/pages/admin/ActivityLogPage.tsx

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Activity, Radio, Wifi, WifiOff } from 'lucide-react';
import { AdminLayout } from '../../shared/components/layout/AdminLayout';
import { useActivityLogs, useActivityStats } from '../../features/admin/hooks/useActivityLogs';
import { useActivityLogSocket } from '../../features/admin/hooks/useActivityLogSocket';
import { ActivityLogStats } from '../../features/admin/components/activityLog/ActivityLogStats';
import { ActivityLogFiltersComponent } from '../../features/admin/components/activityLog/ActivityLogFilters';
import { ActivityLogTable } from '../../features/admin/components/activityLog/ActivityLogTable';
import { ActivityLogDetailModal } from '../../features/admin/components/activityLog/ActivityLogDetailModal';
import { ActivityLog } from '../../features/admin/types/activityLog.types';

const ActivityLogPage: React.FC = () => {
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLiveEnabled, setIsLiveEnabled] = useState(true);

  // Activity logs hook
  const {
    logs,
    pagination,
    isLoading,
    isFetching,
    filters,
    updateFilters,
    resetFilters,
    setPage,
    refresh,
    addRealtimeLog,
    newLogIds,
    realtimeCount,
  } = useActivityLogs();

  // Stats hook
  const { data: statsData, isLoading: isStatsLoading } = useActivityStats();

  // Handle new log from websocket
  const handleNewLog = useCallback((log: ActivityLog) => {
    addRealtimeLog(log);
  }, [addRealtimeLog]);

  // WebSocket hook
  const {
    isConnected,
    connectionStatus,
    error: socketError,
    reconnect,
  } = useActivityLogSocket({
    enabled: isLiveEnabled,
    onNewLog: handleNewLog,
  });

  // Handlers
  const handleViewDetails = (log: ActivityLog) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLog(null);
  };

  const toggleLive = () => {
    setIsLiveEnabled(!isLiveEnabled);
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30"
              >
                <Activity className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-gray-900">Activity Log</h1>
                  
                  {/* Connection Status */}
                  {isLiveEnabled && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      {connectionStatus === 'connected' && (
                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                          Live
                        </span>
                      )}
                      {connectionStatus === 'connecting' && (
                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                          <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse" />
                          Connecting
                        </span>
                      )}
                      {connectionStatus === 'error' && (
                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                          Error
                        </span>
                      )}
                    </motion.div>
                  )}
                </div>
                <p className="text-gray-600 mt-1">
                  Monitor and track all system activities
                  {isLiveEnabled && isConnected && ' • Updates in real-time'}
                </p>
              </div>
            </div>

            {/* Live Toggle Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={toggleLive}
              className={`flex items-center gap-3 px-5 py-2.5 rounded-xl font-medium transition-all ${
                isLiveEnabled
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isLiveEnabled ? (
                <>
                  <Radio className={`w-5 h-5 ${isConnected ? 'animate-pulse' : ''}`} />
                  <span>Live</span>
                  <Wifi className="w-4 h-4" />
                </>
              ) : (
                <>
                  <WifiOff className="w-5 h-5" />
                  <span>Paused</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Stats */}
          <ActivityLogStats stats={statsData?.data} isLoading={isStatsLoading} />

          {/* Filters */}
          <ActivityLogFiltersComponent
            filters={filters}
            onFilterChange={updateFilters}
            onReset={resetFilters}
            onRefresh={refresh}
            isRefreshing={isFetching}
          />
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-4 flex items-center justify-between"
        >
          <p className="text-gray-600">
            Showing{' '}
            <span className="font-bold text-gray-900">{logs.length}</span> of{' '}
            <span className="font-bold text-gray-900">{pagination.total}</span>{' '}
            activity logs
          </p>
          
          {realtimeCount > 0 && (
            <motion.p
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm text-orange-600 font-medium"
            >
              {realtimeCount} new {realtimeCount === 1 ? 'activity' : 'activities'} arrived
            </motion.p>
          )}
        </motion.div>

        {/* Table with real-time integration */}
        <ActivityLogTable
          logs={logs}
          pagination={pagination}
          onPageChange={setPage}
          isLoading={isLoading}
          onViewDetails={handleViewDetails}
          newLogIds={newLogIds}
          isConnected={isConnected}
          connectionStatus={connectionStatus}
          onReconnect={reconnect}
          realtimeCount={realtimeCount}
        />

        {/* Detail Modal */}
        <ActivityLogDetailModal
          log={selectedLog}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </AdminLayout>
  );
};

export default ActivityLogPage;