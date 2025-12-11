// src/pages/admin/AdminDashboardPage.tsx - STUNNING ADMIN DASHBOARD WITH MERCHANT COLORS! 📊✨
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, CheckCircle, Clock, XCircle, TrendingUp,
   DollarSign, Gift, ShoppingBag, Activity,
  ArrowUpRight, ArrowDownRight, UserCheck
} from 'lucide-react';
import { 
 BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
   ResponsiveContainer 
} from 'recharts';
import { AdminLayout } from '../../shared/components/layout/AdminLayout';
import { Card } from '../../shared/components/ui/Card';
import { Spinner } from '../../shared/components/ui/Spinner';
import { usePendingMerchants, useAllMerchants } from '../../features/admin/hooks/useAdmin';
import { Link } from 'react-router-dom';

// Mock data for charts
const revenueData = [
  { month: 'Jan', revenue: 45000, orders: 120 },
  { month: 'Feb', revenue: 52000, orders: 145 },
  { month: 'Mar', revenue: 48000, orders: 132 },
  { month: 'Apr', revenue: 61000, orders: 168 },
  { month: 'May', revenue: 55000, orders: 152 },
  { month: 'Jun', revenue: 67000, orders: 189 },
  { month: 'Jul', revenue: 72000, orders: 203 },
];

const merchantGrowthData = [
  { month: 'Jan', merchants: 12 },
  { month: 'Feb', merchants: 19 },
  { month: 'Mar', merchants: 25 },
  { month: 'Apr', merchants: 32 },
  { month: 'May', merchants: 41 },
  { month: 'Jun', merchants: 48 },
  { month: 'Jul', merchants: 56 },
];

const giftCardData = [
  { name: 'Active', value: 450, color: '#10b981' },
  { name: 'Redeemed', value: 280, color: '#3b82f6' },
  { name: 'Expired', value: 45, color: '#ef4444' },
  { name: 'Pending', value: 125, color: '#f59e0b' },
];

const categoryData = [
  { category: 'Food & Dining', sales: 45 },
  { category: 'Retail', sales: 38 },
  { category: 'Entertainment', sales: 28 },
  { category: 'Health & Beauty', sales: 22 },
  { category: 'Services', sales: 18 },
];

const recentActivity = [
  { id: 1, merchant: 'Pizza Palace', action: 'New merchant registered', time: '2 hours ago', type: 'new' },
  { id: 2, merchant: 'Fashion Hub', action: 'Gift card purchased', time: '3 hours ago', type: 'purchase' },
  { id: 3, merchant: 'Spa Serenity', action: 'Merchant verified', time: '5 hours ago', type: 'verified' },
  { id: 4, merchant: 'Coffee Corner', action: 'Gift card redeemed', time: '6 hours ago', type: 'redeemed' },
  { id: 5, merchant: 'Book Store', action: 'Payout processed', time: '8 hours ago', type: 'payout' },
];

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'up' | 'down';
  delay: number;
  gradient: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, change, changeType, delay, gradient }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
  >
    <Card className="p-6 hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
      <div className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <motion.div 
            className={`w-14 h-14 ${gradient} rounded-2xl flex items-center justify-center shadow-lg`}
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
          >
            <Icon className="w-7 h-7 text-white" />
          </motion.div>
          {change && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.2, type: 'spring' }}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                changeType === 'up' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {changeType === 'up' ? (
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
          <p className="text-xs text-gray-500">This month</p>
        </div>
      </div>
    </Card>
  </motion.div>
);

export const AdminDashboardPage: React.FC = () => {
  const { data: pendingMerchants, isLoading: pendingLoading } = usePendingMerchants();
  const { data: allMerchants, isLoading: allLoading } = useAllMerchants();
  const [selectedTimeframe, setSelectedTimeframe] = useState('7days');

  const isLoading = pendingLoading || allLoading;

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  const totalMerchants = allMerchants?.length || 0;
  const pendingCount = pendingMerchants?.length || 0;
  const verifiedCount = allMerchants?.filter(m => m.isVerified).length || 0;
  const rejectedCount = allMerchants?.filter(m => m.profileStatus === 'REJECTED').length || 0;

  // Mock calculations (replace with real data from your API)
  const totalRevenue = 72000;
  const totalGiftCards = 900;
  const totalOrders = 203;
  const activeCustomers = 1234;

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
              {['24h', '7days', '30days', '1year'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setSelectedTimeframe(tf)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    selectedTimeframe === tf
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {tf === '24h' ? '24H' : tf === '7days' ? '7D' : tf === '30days' ? '30D' : '1Y'}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Pending Alert */}
        {pendingCount > 0 && (
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
                    ⚠️ {pendingCount} Merchant{pendingCount > 1 ? 's' : ''} Awaiting Verification
                  </h3>
                  <p className="text-gray-700">
                    Review and approve pending merchant applications to keep your platform growing.
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
              value={totalMerchants}
              change={12.5}
              changeType="up"
              delay={0}
              gradient="bg-gradient-to-br from-blue-500 to-purple-600"
            />
            <StatCard
              icon={DollarSign}
              title="Total Revenue"
              value={`$${(totalRevenue / 1000).toFixed(1)}k`}
              change={8.2}
              changeType="up"
              delay={0.1}
              gradient="bg-gradient-to-br from-green-500 to-teal-600"
            />
            <StatCard
              icon={Gift}
              title="Gift Cards Sold"
              value={totalGiftCards}
              change={15.3}
              changeType="up"
              delay={0.2}
              gradient="bg-gradient-to-br from-purple-500 to-pink-600"
            />
            <StatCard
              icon={ShoppingBag}
              title="Total Orders"
              value={totalOrders}
              change={5.7}
              changeType="up"
              delay={0.3}
              gradient="bg-gradient-to-br from-orange-500 to-red-600"
            />
          </div>
        </div>

        {/* Verification Stats */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Verification Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={Clock}
              title="Pending"
              value={pendingCount}
              delay={0.4}
              gradient="bg-gradient-to-br from-amber-500 to-yellow-600"
            />
            <StatCard
              icon={CheckCircle}
              title="Verified"
              value={verifiedCount}
              delay={0.5}
              gradient="bg-gradient-to-br from-emerald-500 to-green-600"
            />
            <StatCard
              icon={XCircle}
              title="Rejected"
              value={rejectedCount}
              delay={0.6}
              gradient="bg-gradient-to-br from-red-500 to-pink-600"
            />
            <StatCard
              icon={TrendingUp}
              title="Active Customers"
              value={activeCustomers}
              change={18.4}
              changeType="up"
              delay={0.7}
              gradient="bg-gradient-to-br from-cyan-500 to-blue-600"
            />
        </div>
        </div>

        {/* Charts Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Sales Analytics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Revenue Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Revenue Overview</h3>
                    <p className="text-sm text-gray-600 mt-1">Monthly revenue trends</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-xl">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-700">+24.5%</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: 'none', 
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                        padding: '12px'
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
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Merchant Growth</h3>
                    <p className="text-sm text-gray-600 mt-1">New merchants over time</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 rounded-xl">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-semibold text-purple-700">+32.1%</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={merchantGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: 'none', 
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                        padding: '12px'
                      }}
                    />
                    <Bar 
                      dataKey="merchants" 
                      fill="#a855f7" 
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* More Charts */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Gift Card Status Pie Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Gift Card Status</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={giftCardData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent}) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {giftCardData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: 'none', 
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                        padding: '12px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {giftCardData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{item.value}</p>
                        <p className="text-xs text-gray-600 truncate">{item.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Category Performance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Top Categories</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={categoryData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <YAxis dataKey="category" type="category" width={120} stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: 'none', 
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                        padding: '12px'
                      }}
                    />
                    <Bar dataKey="sales" fill="#10b981" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Activity className="w-6 h-6 text-blue-600" />
                Recent Activity
              </h2>
              <Link 
                to="/admin/activity"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                View all
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              <AnimatePresence>
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.3 + index * 0.1 }}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.type === 'new' ? 'bg-blue-100' :
                      activity.type === 'purchase' ? 'bg-green-100' :
                      activity.type === 'verified' ? 'bg-purple-100' :
                      activity.type === 'redeemed' ? 'bg-orange-100' :
                      'bg-gray-100'
                    }`}>
                      {activity.type === 'new' && <UserCheck className="w-5 h-5 text-blue-600" />}
                      {activity.type === 'purchase' && <ShoppingBag className="w-5 h-5 text-green-600" />}
                      {activity.type === 'verified' && <CheckCircle className="w-5 h-5 text-purple-600" />}
                      {activity.type === 'redeemed' && <Gift className="w-5 h-5 text-orange-600" />}
                      {activity.type === 'payout' && <DollarSign className="w-5 h-5 text-gray-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900">{activity.merchant}</p>
                      <p className="text-sm text-gray-600">{activity.action}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  );
};