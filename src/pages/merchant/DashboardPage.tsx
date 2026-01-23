import React, { useState, useEffect } from "react";
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
  Sparkles,
  X,
} from "lucide-react";
import { Card } from "../../shared/components/ui/Card";
import { MagneticButton } from "../../shared/components/animated/MagneticButton";
import { DashboardLayout } from "../../shared/components/layout/DashboardLayout";
import { ProfileIncompleteAlert } from "../../shared/components/alerts/ProfileIncompleteAlert";
import { CompleteProfileModal } from "../../shared/components/modals/CompleteProfileModal";
import { useProfileStatus } from "../../features/merchant/hooks/useProfileStatus";

import { fadeInUp, staggerContainer } from "../../shared/utils/animations";
import { useDashboardStats } from "@/features/merchant/hooks/useDahboard";

export const DashboardPage: React.FC = () => {
  // Hook to get profile status and permissions
  const { status, canCreateGiftCards, canEdit, rejectionReason, isLoading } =
    useProfileStatus();

  // Hook to get dashboard statistics (only fetches if verified)
  const {
    stats,
    isLoading: statsLoading,
    error: statsError,
    refresh: refreshStats,
  } = useDashboardStats();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [showIncompleteAlert, setShowIncompleteAlert] = useState(true);
  const [showCustomizeBanner, setShowCustomizeBanner] = useState(false);
  const [bannerLoading, setBannerLoading] = useState(true);

  /**
   * Get user ID from access token in localStorage
   * Returns the userId from the JWT token
   */
  const getUserIdFromToken = (): string | null => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return null;

      // Decode JWT token (format: header.payload.signature)
      const payloadBase64 = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));

      return decodedPayload.userId || null;
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  };

  /**
   * Check if the "Customize Gift Card" banner should be shown
   * Only shown once when merchant becomes verified for the first time
   * Uses user-specific key to track per user
   */
  useEffect(() => {
    const checkCustomizeBanner = () => {
      const userId = getUserIdFromToken();
      console.log("Checking banner status...", {
        status,
        canCreateGiftCards,
        userId,
      });

      if (status === "approved" && canCreateGiftCards && userId) {
        try {
          // Check if banner has been shown before using user-specific localStorage key
          const storageKey = `customize_banner_shown_${userId}`;
          const bannerShown = localStorage.getItem(storageKey);
          console.log(
            `LocalStorage check - Key: ${storageKey}, Value: ${bannerShown}`,
          );

          if (bannerShown !== "true") {
            // Banner hasn't been shown yet, show it
            console.log(
              "✅ Showing banner - not found in localStorage for this user",
            );
            setShowCustomizeBanner(true);
          } else {
            console.log("❌ Banner already shown for this user - hiding");
            setShowCustomizeBanner(false);
          }
        } catch (error) {
          // If localStorage fails, show the banner
          console.log("LocalStorage error, showing banner:", error);
          setShowCustomizeBanner(true);
        }
      } else {
        console.log("Banner not shown - conditions not met", {
          isApproved: status === "approved",
          canCreate: canCreateGiftCards,
          hasUserId: !!userId,
        });
      }
      setBannerLoading(false);
    };

    if (!isLoading) {
      checkCustomizeBanner();
    }
  }, [status, canCreateGiftCards, isLoading]);

  /**
   * Handle dismissing the customize banner
   * Saves to localStorage with user-specific key so it won't be shown again
   */
  const handleDismissCustomizeBanner = () => {
    setShowCustomizeBanner(false);
    const userId = getUserIdFromToken();

    if (!userId) {
      console.error("Cannot dismiss banner - no userId found");
      return;
    }

    try {
      const storageKey = `customize_banner_shown_${userId}`;
      localStorage.setItem(storageKey, "true");
      console.log(
        `✅ Banner dismissed for user ${userId} - Key: ${storageKey}`,
      );
    } catch (error) {
      console.error("Failed to save banner dismissal:", error);
    }
  };

  /**
   * Navigate to settings page to customize gift card
   * Marks banner as dismissed permanently for this user before navigation
   */
  const handleCustomizeGiftCard = () => {
    // Hide banner immediately in UI
    setShowCustomizeBanner(false);

    const userId = getUserIdFromToken();

    if (!userId) {
      console.error("Cannot save banner state - no userId found");
      window.location.href = "/merchant/settings?tab=business";
      return;
    }

    try {
      // Save to localStorage with user-specific key to ensure it's marked as shown permanently
      const storageKey = `customize_banner_shown_${userId}`;
      localStorage.setItem(storageKey, "true");
      console.log(
        `✅ Banner customize clicked for user ${userId} - Key: ${storageKey}`,
      );
    } catch (error) {
      console.error("Failed to save banner state:", error);
    }

    // Navigate after a short delay to ensure storage is saved
    setTimeout(() => {
      window.location.href = "/merchant/settings?tab=business";
    }, 100);
  };

  /**
   * Handle protected actions that require profile completion/verification
   * Shows modal if profile is not complete, otherwise executes callback
   */
  const handleProtectedAction = (action: string, callback?: () => void) => {
    if (!canCreateGiftCards) {
      setModalAction(action);
      setShowProfileModal(true);
    } else {
      callback?.();
    }
  };

  /**
   * Navigate to profile edit page
   */
  const handleEditProfile = () => {
    window.location.href = "/merchant/complete-profile";
  };

  /**
   * Format currency value with proper formatting
   * @param value - String or number to format as currency
   * @returns Formatted currency string (e.g., "₹1,01,377")
   */
  const formatCurrency = (value: string | number): string => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(numValue)) return "₹0";
    return `₹${numValue.toLocaleString("en-IN")}`;
  };

  /**
   * Format number with proper formatting
   * @param value - Number to format
   * @returns Formatted number string (e.g., "1,234")
   */
  const formatNumber = (value: number): string => {
    return value.toLocaleString("en-IN");
  };

  // Show loading spinner while fetching profile status
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

        {/* Customize Gift Card Banner - Shows only once for newly verified merchants */}
        {showCustomizeBanner && !bannerLoading && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl p-6 mb-6 relative overflow-hidden"
          >
            {/* Animated background effect */}
            <motion.div
              className="absolute inset-0 opacity-30"
              animate={{
                background: [
                  "radial-gradient(circle at 0% 0%, rgba(255,255,255,0.3) 0%, transparent 50%)",
                  "radial-gradient(circle at 100% 100%, rgba(255,255,255,0.3) 0%, transparent 50%)",
                  "radial-gradient(circle at 0% 0%, rgba(255,255,255,0.3) 0%, transparent 50%)",
                ],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <motion.div
                  className="w-14 h-14 bg-white rounded-full flex items-center justify-center flex-shrink-0"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-7 h-7 text-purple-600" />
                </motion.div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-lg mb-1 flex items-center gap-2">
                    🎉 Congratulations! Your Profile is Verified
                  </h3>
                  <p className="text-white/90 text-sm">
                    Ready to make your gift cards uniquely yours? Customize your
                    gift card design, colors, and branding to match your
                    business!
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 ml-4">
                <MagneticButton
                  variant="primary"
                  onClick={handleCustomizeGiftCard}
                  className="bg-white text-purple-600 hover:bg-gray-100 font-semibold shadow-lg whitespace-nowrap"
                >
                  <Gift className="w-4 h-4 mr-2" />
                  Customize Gift Card
                </MagneticButton>

                <button
                  onClick={handleDismissCustomizeBanner}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors flex-shrink-0"
                  aria-label="Dismiss banner"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Alerts Section */}
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
          {/* Stats Overview - Dynamic Data */}
          <motion.div variants={fadeInUp}>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Sales Card */}
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Total Sales</p>
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {canCreateGiftCards
                    ? statsLoading
                      ? "..."
                      : stats
                        ? formatCurrency(stats.totalSales)
                        : "₹0"
                    : "---"}
                </p>
                <p className="text-xs text-gray-500 mt-1">This month</p>
              </Card>

              {/* Active Gift Cards Card */}
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Gift Cards</p>
                  <Gift className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {canCreateGiftCards
                    ? statsLoading
                      ? "..."
                      : stats
                        ? formatNumber(stats.activeGiftCards)
                        : "0"
                    : "---"}
                </p>
                <p className="text-xs text-gray-500 mt-1">Active cards</p>
              </Card>

              {/* Redemptions Card */}
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Redemptions</p>
                  <ShoppingBag className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {canCreateGiftCards
                    ? statsLoading
                      ? "..."
                      : stats
                        ? formatNumber(stats.redemptions)
                        : "0"
                    : "---"}
                </p>
                <p className="text-xs text-gray-500 mt-1">This month</p>
              </Card>

              {/* Revenue Card */}
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Revenue</p>
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {canCreateGiftCards
                    ? statsLoading
                      ? "..."
                      : stats
                        ? formatCurrency(stats.revenue)
                        : "₹0"
                    : "---"}
                </p>
                <p className="text-xs text-gray-500 mt-1">This month</p>
              </Card>
            </div>

            {/* Error Message (if stats failed to load) */}
            {canCreateGiftCards && statsError && !statsLoading && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-sm text-red-700">
                    Failed to load dashboard statistics. {statsError}
                  </p>
                </div>
                <button
                  onClick={refreshStats}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Retry
                </button>
              </div>
            )}
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
                      window.location.href = "/merchant/gift-cards";
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
                      window.location.href = "/merchant/analytics";
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
                      window.location.href = "/merchant/scan";
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
