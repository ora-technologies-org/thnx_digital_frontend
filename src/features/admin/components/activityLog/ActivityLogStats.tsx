
import React from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  XCircle,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';
import { CATEGORY_CONFIG, SEVERITY_CONFIG } from '../../types/activityLog.types';

interface StatsData {
  today: number;
  byCategory: Record<string, number>;
  bySeverity: Record<string, number>;
  recentErrors: any[];
}

interface ActivityLogStatsProps {
  stats: StatsData | undefined;
  isLoading: boolean;
}

export const ActivityLogStats: React.FC<ActivityLogStatsProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  const errorCount = (stats?.bySeverity?.ERROR || 0) + (stats?.bySeverity?.CRITICAL || 0);
  const warningCount = stats?.bySeverity?.WARNING || 0;
  const infoCount = stats?.bySeverity?.INFO || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
    >
     
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-4 bg-gradient-to-br from-orange-50 to-red-100 rounded-xl border border-orange-200"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-orange-600 font-medium">Today</p>
            <p className="text-3xl font-bold text-orange-900">{stats?.today || 0}</p>
          </div>
          <Activity className="w-8 h-8 text-orange-600" />
        </div>
      </motion.div>

    
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-4 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border border-blue-200"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-600 font-medium">Info</p>
            <p className="text-3xl font-bold text-blue-900">{infoCount}</p>
          </div>
          <CheckCircle className="w-8 h-8 text-blue-600" />
        </div>
      </motion.div>

    
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-4 bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl border border-amber-200"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-amber-600 font-medium">Warnings</p>
            <p className="text-3xl font-bold text-amber-900">{warningCount}</p>
          </div>
          <AlertTriangle className="w-8 h-8 text-amber-600" />
        </div>
      </motion.div>

   
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-4 bg-gradient-to-br from-red-50 to-rose-100 rounded-xl border border-red-200"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-red-600 font-medium">Errors</p>
            <p className="text-3xl font-bold text-red-900">{errorCount}</p>
          </div>
          <XCircle className="w-8 h-8 text-red-600" />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ActivityLogStats;