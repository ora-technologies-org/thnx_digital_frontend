
import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Download, Clock } from 'lucide-react';
import { DashboardLayout } from '../../shared/components/layout/DashboardLayout';
import { Card } from '../../shared/components/ui/Card';
import { MagneticButton } from '../../shared/components/animated/MagneticButton';
import { fadeInUp, staggerContainer } from '../../shared/utils/animations';

export const PayoutsPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Payouts
              </h1>
              <p className="text-gray-600">
                Manage your earnings and withdrawal history
              </p>
            </div>

            <MagneticButton variant="primary" disabled>
              <Download className="w-4 h-4 mr-2" />
              Request Payout
            </MagneticButton>
          </div>
        </motion.div>

        {/* Balance Cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div variants={fadeInUp}>
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Available Balance</p>
                    <h3 className="text-2xl font-bold text-gray-900">₹0</h3>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Ready for withdrawal
                </p>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pending</p>
                    <h3 className="text-2xl font-bold text-gray-900">₹0</h3>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Processing payouts
                </p>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Paid Out</p>
                    <h3 className="text-2xl font-bold text-gray-900">₹0</h3>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  All-time earnings
                </p>
              </Card>
            </motion.div>
          </div>

          {/* Payout History */}
          <motion.div variants={fadeInUp}>
            <Card className="p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Payout History
              </h3>
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-10 h-10 text-green-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  No Payouts Yet
                </h4>
                <p className="text-gray-600">
                  Your payout history will appear here once you start earning
                </p>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};