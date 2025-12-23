import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Gift,
  Plus,
  BarChart3,
  QrCode,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Clock,
  AlertCircle,
  Edit,
} from "lucide-react";
import { Card } from "../../shared/components/ui/Card";
import { MagneticButton } from "../../shared/components/animated/MagneticButton";
import { DashboardLayout } from "../../shared/components/layout/DashboardLayout";
import { ProfileIncompleteAlert } from "../../shared/components/alerts/ProfileIncompleteAlert";
import { CompleteProfileModal } from "../../shared/components/modals/CompleteProfileModal";
import { useProfileStatus } from "../../features/merchant/hooks/useProfileStatus";
import { fadeInUp, staggerContainer } from "../../shared/utils/animations";

export const DashboardPage: React.FC = () => {
  const { status, canCreateGiftCards, canEdit, rejectionReason, isLoading } =
    useProfileStatus();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [showIncompleteAlert, setShowIncompleteAlert] = useState(true);

  // Handle action attempts (create gift card, etc.)
  const handleProtectedAction = (action: string, callback?: () => void) => {
    if (!canCreateGiftCards) {
      setModalAction(action);
      setShowProfileModal(true);
    } else {
      callback?.();
    }
  };

  // Navigate to profile edit page
  const handleEditProfile = () => {
    window.location.href = "/merchant/complete-profile";
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full"
          />
        </div>
      </DashboardLayout>
    );
  }

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
                Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome back! Here's what's happening with your business today.
              </p>
            </div>

            {/* Status Badge & Edit Button */}
            <div className="flex items-center gap-3">
              {/* Edit Button (shown when canEdit is true) */}
              {canEdit && (
                <MagneticButton
                  variant="secondary"
                  onClick={handleEditProfile}
                  className="flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </MagneticButton>
              )}

              {/* Status Badge */}
              <div>
                {status === "incomplete" && (
                  <div className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Profile Incomplete
                  </div>
                )}
                {status === "pending" && (
                  <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Verification Pending
                  </div>
                )}
                {status === "approved" && (
                  <div className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    ✅ Verified
                  </div>
                )}
                {status === "rejected" && (
                  <div className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Verification Failed
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Alerts */}
        {status === "incomplete" && showIncompleteAlert && (
          <ProfileIncompleteAlert
            onDismiss={() => setShowIncompleteAlert(false)}
          />
        )}

        {status === "pending" && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-400 rounded-2xl p-6 mb-6"
          >
            <div className="flex items-center gap-4">
              <motion.div
                className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Clock className="w-6 h-6 text-white" />
              </motion.div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1">
                  🎉 Profile Submitted Successfully!
                </h3>
                <p className="text-gray-700">
                  Your profile is under review by our admin team. You'll be
                  notified once approved (typically within 24-48 hours).
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {status === "rejected" && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-400 rounded-2xl p-6 mb-6"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">
                    Profile Verification Failed
                  </h3>
                  <p className="text-gray-700">
                    Your profile was rejected and needs to be updated.
                  </p>
                  {rejectionReason && (
                    <div className="mt-3 p-3 bg-white/60 rounded-lg">
                      <p className="text-sm font-semibold text-gray-800 mb-1">
                        Rejection Reason:
                      </p>
                      <p className="text-sm text-gray-700">{rejectionReason}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end">
                <MagneticButton
                  variant="primary"
                  onClick={handleEditProfile}
                  className="flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit & Resubmit Profile
                </MagneticButton>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-6"
        >
          {/* Stats Overview */}
          <motion.div variants={fadeInUp}>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Total Sales</p>
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {canCreateGiftCards ? "₹0" : "---"}
                </p>
                <p className="text-xs text-gray-500 mt-1">This month</p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Gift Cards</p>
                  <Gift className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {canCreateGiftCards ? "0" : "---"}
                </p>
                <p className="text-xs text-gray-500 mt-1">Active cards</p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Redemptions</p>
                  <ShoppingBag className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {canCreateGiftCards ? "0" : "---"}
                </p>
                <p className="text-xs text-gray-500 mt-1">This month</p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Revenue</p>
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {canCreateGiftCards ? "₹0" : "---"}
                </p>
                <p className="text-xs text-gray-500 mt-1">This month</p>
              </Card>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={fadeInUp}>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Create Gift Card */}
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div
                  onClick={() =>
                    handleProtectedAction("create a gift card", () => {
                      console.log("Navigate to create gift card page");
                    })
                  }
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Create Gift Card
                  </h3>
                  <p className="text-sm text-gray-600">
                    Set up a new gift card for your business
                  </p>
                  {!canCreateGiftCards && (
                    <p className="text-xs text-yellow-600 mt-2 font-medium">
                      {status === "incomplete" && "🔒 Complete profile first"}
                      {status === "pending" && "⏳ Awaiting verification"}
                      {status === "rejected" && "❌ Update & resubmit profile"}
                    </p>
                  )}
                </div>
              </Card>

              {/* View Analytics */}
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div
                  onClick={() =>
                    handleProtectedAction("view sales analytics", () => {
                      console.log("Navigate to analytics page");
                    })
                  }
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center mb-4">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    View Analytics
                  </h3>
                  <p className="text-sm text-gray-600">
                    Track your sales and performance
                  </p>
                  {!canCreateGiftCards && (
                    <p className="text-xs text-yellow-600 mt-2 font-medium">
                      {status === "incomplete" && "🔒 Complete profile first"}
                      {status === "pending" && "⏳ Awaiting verification"}
                      {status === "rejected" && "❌ Update & resubmit profile"}
                    </p>
                  )}
                </div>
              </Card>

              {/* Scan QR */}
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div
                  onClick={() =>
                    handleProtectedAction("scan QR codes", () => {
                      console.log("Navigate to QR scanner");
                    })
                  }
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                    <QrCode className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Scan QR Code
                  </h3>
                  <p className="text-sm text-gray-600">
                    Redeem customer gift cards
                  </p>
                  {!canCreateGiftCards && (
                    <p className="text-xs text-yellow-600 mt-2 font-medium">
                      {status === "incomplete" && "🔒 Complete profile first"}
                      {status === "pending" && "⏳ Awaiting verification"}
                      {status === "rejected" && "❌ Update & resubmit profile"}
                    </p>
                  )}
                </div>
              </Card>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={fadeInUp}>
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Recent Activity
              </h2>

              {!canCreateGiftCards ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-8 h-8 text-gray-400" />
                  </div>
                  {status === "incomplete" && (
                    <>
                      <p className="text-gray-600 mb-4">
                        Complete your profile to start tracking activity
                      </p>
                      <MagneticButton
                        variant="primary"
                        onClick={() => handleProtectedAction("view activity")}
                      >
                        Complete Profile
                      </MagneticButton>
                    </>
                  )}
                  {status === "pending" && (
                    <p className="text-gray-600">
                      Waiting for admin verification to unlock features...
                    </p>
                  )}
                  {status === "rejected" && (
                    <>
                      <p className="text-gray-600 mb-4">
                        Update your profile to unlock features
                      </p>
                      <MagneticButton
                        variant="primary"
                        onClick={handleEditProfile}
                        className="flex items-center gap-2 mx-auto"
                      >
                        <Edit className="w-4 h-4" />
                        Edit Profile
                      </MagneticButton>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600">
                    No activity yet. Create your first gift card to get started!
                  </p>
                </div>
              )}
            </Card>
          </motion.div>
        </motion.div>
      </div>

      {/* Complete Profile Modal */}
      <CompleteProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        action={modalAction}
      />
    </DashboardLayout>
  );
};
