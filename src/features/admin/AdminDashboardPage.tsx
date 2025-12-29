// src/pages/admin/AdminDashboardPage.tsx - DYNAMIC DASHBOARD WITH REAL API DATA! 📊✨
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  DollarSign,
  Gift,
  ShoppingBag,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  UserCheck,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AdminLayout } from "../../shared/components/layout/AdminLayout";
import { Card } from "../../shared/components/ui/Card";
import { Spinner } from "../../shared/components/ui/Spinner";
import { useDashboardData } from "../../features/admin/hooks/useAdmin";
import { Link } from "react-router-dom";

// ==================== STAT CARD COMPONENT ====================
interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string | number;
  change?: number;
  changeType?: "up" | "down";
  delay: number;
  gradient: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  title,
  value,
  change,
  changeType,
  delay,
  gradient,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
  >
    <Card className="p-6 hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
      <div
        className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
      />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <motion.div
            className={`w-14 h-14 ${gradient} rounded-2xl flex items-center justify-center shadow-lg`}
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
          >
            <Icon className="w-7 h-7 text-white" />
          </motion.div>
          {change !== undefined && change !== null && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.2, type: "spring" }}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                changeType === "up"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {changeType === "up" ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              {change}%
            </motion.div>
          )}
        </div>

        <div>
          <p className="text-sm text-gray-600 font-medium mb-2">{title}</p>
          <motion.h3
            className="text-3xl font-bold text-gray-900 mb-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.2 }}
          >
            {value}
          </motion.h3>
          <p className="text-xs text-gray-500">
            {title.includes("Revenue") ? "Total" : "This period"}
          </p>
        </div>
      </div>
    </Card>
  </motion.div>
);

// ==================== MAIN COMPONENT ====================
export const AdminDashboardPage: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("1y");
  const { data: dashboardData, isLoading } =
    useDashboardData(selectedTimeframe);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  const data = dashboardData?.data;
  if (!data) {
    return (
      <AdminLayout>
        <div className="p-8 text-center">
          <p className="text-red-600">Failed to load dashboard data</p>
        </div>
      </AdminLayout>
    );
  }

  // Extract data
  const {
    overview,
    verificationStatus,
    salesAnalytics,
    merchantGrowth,
    giftCardStatus,
  } = data;

  // Format revenue
  const formatRevenue = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value}`;
  };

  // Map gift card status to colors
  const giftCardColors: Record<string, string> = {
    ACTIVE: "#10b981",
    FULLY_REDEEMED: "#3b82f6",
    EXPIRED: "#ef4444",
    CANCELLED: "#f59e0b",
  };

  const giftCardDataForChart = giftCardStatus.map((item) => ({
    name: item.status.replace(/_/g, " "),
    value: item.count,
    color: giftCardColors[item.status] || "#6b7280",
  }));

  // Mock recent activity (since it's not in the API response)
  const recentActivity = [
    {
      id: 1,
      merchant: "Recent Merchant",
      action: "New merchant registered",
      time: "2 hours ago",
      type: "new",
    },
    {
      id: 2,
      merchant: "Gift Card Purchase",
      action: "Gift card purchased",
      time: "3 hours ago",
      type: "purchase",
    },
  ];

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Animated Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome back! Here's what's happening with your platform today.
              </p>
            </div>
            <div className="flex gap-2">
              {[
                { key: "24h", label: "24H" },
                { key: "7d", label: "7D" },
                { key: "30d", label: "30D" },
                { key: "1y", label: "1Y" },
              ].map((tf) => (
                <button
                  key={tf.key}
                  onClick={() => setSelectedTimeframe(tf.key)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    selectedTimeframe === tf.key
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Pending Alert */}
        {verificationStatus.pending > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-400 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <motion.div
                  className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Clock className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">
                    ⚠️ {verificationStatus.pending} Merchant
                    {verificationStatus.pending > 1 ? "s" : ""} Awaiting
                    Verification
                  </h3>
                  <p className="text-gray-700">
                    Review and approve pending merchant applications to keep
                    your platform growing.
                  </p>
                </div>
              </div>
              <Link to="/admin/pending">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold transition-colors whitespace-nowrap"
                >
                  Review Now
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}

        {/* Main Stats Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={Users}
              title="Total Merchants"
              value={overview.totalMerchants}
              change={merchantGrowth.percentageChange}
              changeType={merchantGrowth.percentageChange >= 0 ? "up" : "down"}
              delay={0}
              gradient="bg-gradient-to-br from-blue-500 to-purple-600"
            />
            <StatCard
              icon={DollarSign}
              title="Total Revenue"
              value={formatRevenue(overview.totalRevenue.value)}
              change={overview.totalRevenue.percentageChange}
              changeType={
                overview.totalRevenue.percentageChange >= 0 ? "up" : "down"
              }
              delay={0.1}
              gradient="bg-gradient-to-br from-green-500 to-teal-600"
            />
            <StatCard
              icon={Gift}
              title="Gift Cards Sold"
              value={overview.giftCardsSold.value}
              change={overview.giftCardsSold.percentageChange}
              changeType={
                overview.giftCardsSold.percentageChange >= 0 ? "up" : "down"
              }
              delay={0.2}
              gradient="bg-gradient-to-br from-purple-500 to-pink-600"
            />
            <StatCard
              icon={ShoppingBag}
              title="Total Orders"
              value={overview.totalOrders.value}
              change={overview.totalOrders.percentageChange}
              changeType={
                overview.totalOrders.percentageChange >= 0 ? "up" : "down"
              }
              delay={0.3}
              gradient="bg-gradient-to-br from-orange-500 to-red-600"
            />
          </div>
        </div>

        {/* Verification Stats */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Verification Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={Clock}
              title="Pending"
              value={verificationStatus.pending}
              delay={0.4}
              gradient="bg-gradient-to-br from-amber-500 to-yellow-600"
            />
            <StatCard
              icon={CheckCircle}
              title="Verified"
              value={verificationStatus.verified}
              delay={0.5}
              gradient="bg-gradient-to-br from-emerald-500 to-green-600"
            />
            <StatCard
              icon={XCircle}
              title="Rejected"
              value={verificationStatus.rejected}
              delay={0.6}
              gradient="bg-gradient-to-br from-red-500 to-pink-600"
            />
            <StatCard
              icon={UserCheck}
              title="Active Customers"
              value={verificationStatus.activeCustomers.value}
              change={verificationStatus.activeCustomers.percentageChange}
              changeType={
                verificationStatus.activeCustomers.percentageChange >= 0
                  ? "up"
                  : "down"
              }
              delay={0.7}
              gradient="bg-gradient-to-br from-cyan-500 to-blue-600"
            />
          </div>
        </div>

        {/* Charts Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Sales Analytics
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Revenue Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Revenue Overview
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Monthly revenue trends
                    </p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-xl">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-700">
                      {salesAnalytics.percentageChange >= 0 ? "+" : ""}
                      {salesAnalytics.percentageChange.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={salesAnalytics.monthlyRevenueTrends}>
                    <defs>
                      <linearGradient
                        id="colorRevenue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#10b981"
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="95%"
                          stopColor="#10b981"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="month"
                      stroke="#6b7280"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                        padding: "12px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10b981"
                      strokeWidth={3}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>

            {/* Merchant Growth Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Merchant Growth
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      New merchants over time
                    </p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 rounded-xl">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-semibold text-purple-700">
                      {merchantGrowth.percentageChange >= 0 ? "+" : ""}
                      {merchantGrowth.percentageChange.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={merchantGrowth.trends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="month"
                      stroke="#6b7280"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                        padding: "12px",
                      }}
                    />
                    <Bar dataKey="count" fill="#a855f7" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Gift Card Status */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-bold text-gray-900 mb-6">
                  Gift Card Status
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={giftCardDataForChart}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {giftCardDataForChart.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                        padding: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {giftCardDataForChart.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900">
                          {item.value}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {item.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Recent Activity Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Activity className="w-6 h-6 text-blue-600" />
                    Recent Activity
                  </h2>
                </div>
                <div className="space-y-3">
                  <AnimatePresence>
                    {recentActivity.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.2 + index * 0.1 }}
                        className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            activity.type === "new"
                              ? "bg-blue-100"
                              : activity.type === "purchase"
                                ? "bg-green-100"
                                : "bg-gray-100"
                          }`}
                        >
                          {activity.type === "new" && (
                            <UserCheck className="w-5 h-5 text-blue-600" />
                          )}
                          {activity.type === "purchase" && (
                            <ShoppingBag className="w-5 h-5 text-green-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900">
                            {activity.merchant}
                          </p>
                          <p className="text-sm text-gray-600">
                            {activity.action}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {activity.time}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
