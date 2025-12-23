import React from "react";
import { motion } from "framer-motion";
import { Search, Filter, Calendar, X, RefreshCw } from "lucide-react";
import {
  ActivityCategory,
  ActivitySeverity,
  ActivityLogFilters as Filters,
  CATEGORY_CONFIG,
  SEVERITY_CONFIG,
} from "../../types/activityLog.types";

interface ActivityLogFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Partial<Filters>) => void;
  onReset: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const CATEGORIES: ActivityCategory[] = [
  "AUTH",
  "USER",
  "MERCHANT",
  "GIFT_CARD",
  "PURCHASE",
  "REDEMPTION",
  "SYSTEM",
];

const SEVERITIES: ActivitySeverity[] = ["INFO", "WARNING", "ERROR", "CRITICAL"];

export const ActivityLogFiltersComponent: React.FC<ActivityLogFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  onRefresh,
  isRefreshing,
}) => {
  const hasActiveFilters =
    filters.category ||
    filters.severity ||
    filters.search ||
    filters.startDate ||
    filters.endDate;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
    >
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search activities..."
            value={filters.search || ""}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring focus:ring-orange-200 transition-all bg-white"
          />
        </div>

        {/* Category Filter */}
        <div className="relative min-w-[180px]">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={filters.category || ""}
            onChange={(e) =>
              onFilterChange({
                category: e.target.value as ActivityCategory | "",
              })
            }
            className="w-full pl-10 pr-8 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring focus:ring-orange-200 transition-all cursor-pointer appearance-none bg-white"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_CONFIG[cat].label}
              </option>
            ))}
          </select>
        </div>

        {/* Severity Filter */}
        <div className="relative min-w-[160px]">
          <select
            value={filters.severity || ""}
            onChange={(e) =>
              onFilterChange({
                severity: e.target.value as ActivitySeverity | "",
              })
            }
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring focus:ring-orange-200 transition-all cursor-pointer appearance-none bg-white"
          >
            <option value="">All Severity</option>
            {SEVERITIES.map((sev) => (
              <option key={sev} value={sev}>
                {SEVERITY_CONFIG[sev].label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range */}
        <div className="flex gap-2">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={filters.startDate || ""}
              onChange={(e) => onFilterChange({ startDate: e.target.value })}
              className="pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring focus:ring-orange-200 transition-all bg-white"
              placeholder="Start Date"
            />
          </div>
          <div className="relative">
            <input
              type="date"
              value={filters.endDate || ""}
              onChange={(e) => onFilterChange({ endDate: e.target.value })}
              className="px-3 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring focus:ring-orange-200 transition-all bg-white"
              placeholder="End Date"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {hasActiveFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onReset}
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Clear</span>
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ActivityLogFiltersComponent;
