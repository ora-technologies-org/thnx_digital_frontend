
// ============================================
// src/pages/merchant/AnalyticsPage.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, DollarSign, Users } from 'lucide-react';
import { DashboardLayout } from '../../shared/components/layout/DashboardLayout';
import { Card } from '../../shared/components/ui/Card';
import { fadeInUp, staggerContainer } from '../../shared/utils/animations';

export const AnalyticsPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Analytics
          </h1>
          <p className="text-gray-600">
            Track your business performance and insights
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-6"
        >
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div variants={fadeInUp}>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-green-600 text-sm font-medium">
                    +0%
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">₹0</h3>
                <p className="text-sm text-gray-600">Total Revenue</p>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-blue-600 text-sm font-medium">
                    +0%
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">0</h3>
                <p className="text-sm text-gray-600">Total Sales</p>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-purple-600 text-sm font-medium">
                    +0%
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">0</h3>
                <p className="text-sm text-gray-600">Customers</p>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-orange-600" />
                  </div>
                  <span className="text-orange-600 text-sm font-medium">
                    ₹0
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">₹0</h3>
                <p className="text-sm text-gray-600">Avg. Order Value</p>
              </Card>
            </motion.div>
          </div>

          {/* Charts Placeholder */}
          <motion.div variants={fadeInUp}>
            <Card className="p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Sales Overview
              </h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">
                    Charts will appear here once you have sales data
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Additional Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div variants={fadeInUp}>
              <Card className="p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Popular Gift Cards
                </h3>
                <div className="h-48 flex items-center justify-center bg-gray-50 rounded-xl">
                  <p className="text-gray-600 text-sm">No data yet</p>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Customer Activity
                </h3>
                <div className="h-48 flex items-center justify-center bg-gray-50 rounded-xl">
                  <p className="text-gray-600 text-sm">No data yet</p>
                </div>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};
