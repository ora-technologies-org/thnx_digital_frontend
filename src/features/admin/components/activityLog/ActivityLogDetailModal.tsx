
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Clock,
  User,
  Globe,
  Monitor,
  Tag,
  FileText,
  Hash,
  MapPin,
} from 'lucide-react';
import {
  ActivityLog,
  CATEGORY_CONFIG,
  SEVERITY_CONFIG,
} from '../../types/activityLog.types';

interface ActivityLogDetailModalProps {
  log: ActivityLog | null;
  isOpen: boolean;
  onClose: () => void;
}

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export const ActivityLogDetailModal: React.FC<ActivityLogDetailModalProps> = ({
  log,
  isOpen,
  onClose,
}) => {
  if (!log) return null;

  const categoryConfig = CATEGORY_CONFIG[log.category];
  const severityConfig = SEVERITY_CONFIG[log.severity];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-orange-500 to-red-600">
                <h2 className="text-xl font-bold text-white">Activity Details</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                <div className="flex flex-wrap gap-3 mb-6">
                  <span
                    className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full ${categoryConfig.bgColor} ${categoryConfig.color}`}
                  >
                    {categoryConfig.label}
                  </span>
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full ${severityConfig.bgColor} ${severityConfig.color}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${severityConfig.dotColor}`} />
                    {severityConfig.label}
                  </span>
                  <code className="px-4 py-2 bg-gray-100 rounded-full text-sm font-mono">
                    {log.action}
                  </code>
                </div>

                <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Description</p>
                      <p className="text-gray-900">{log.description}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Timestamp</p>
                        <p className="text-gray-900">{formatDateTime(log.createdAt)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Actor</p>
                        <p className="text-gray-900 capitalize">{log.actorType}</p>
                        {log.actorId && (
                          <p className="text-xs text-gray-500 font-mono">{log.actorId}</p>
                        )}
                      </div>
                    </div>
                  </div>

               
                  {log.resourceType && (
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Tag className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Resource</p>
                          <p className="text-gray-900">{log.resourceType}</p>
                          {log.resourceId && (
                            <p className="text-xs text-gray-500 font-mono">{log.resourceId}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                
                  {log.ipAddress && (
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">IP Address</p>
                          <p className="text-gray-900 font-mono">{log.ipAddress}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              
                {log.userAgent && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Monitor className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium text-gray-500 mb-1">User Agent</p>
                        <p className="text-gray-900 text-sm break-all">{log.userAgent}</p>
                      </div>
                    </div>
                  </div>
                )}

            
                {log.metadata && Object.keys(log.metadata).length > 0 && (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Hash className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 mb-2">Metadata</p>
                        <pre className="text-sm bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                          {JSON.stringify(log.metadata, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}

           
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-400 font-mono">Log ID: {log.id}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ActivityLogDetailModal;