// src/pages/merchant/SettingsPage.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Building,
  Lock,
  Bell,
  CreditCard,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { DashboardLayout } from "../../shared/components/layout/DashboardLayout";
import { Card } from "../../shared/components/ui/Card";
import { Button } from "../../shared/components/ui/Button";
import { GiftCardBuilder } from "./CardOption";

// Helper function to decode JWT token
const decodeToken = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// Helper function to get user verification status from token
const getUserVerificationStatus = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return { isVerified: false, profileStatus: "UNVERIFIED" };

  const decoded = decodeToken(token);
  if (!decoded) return { isVerified: false, profileStatus: "UNVERIFIED" };

  return {
    isVerified: decoded.isVerified || false,
    profileStatus: decoded.profileStatus || "UNVERIFIED",
  };
};

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("profile");

  // Get verification status from token
  const { isVerified, profileStatus } = getUserVerificationStatus();
  const isProfileVerified = isVerified && profileStatus === "VERIFIED";

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    {
      id: "business",
      label: "Business",
      icon: Building,
      requiresVerification: true,
    },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "payment", label: "Payment", icon: CreditCard },
  ];

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
                Settings
              </h1>
              <p className="text-gray-600">
                Manage your account and business settings
              </p>
            </div>
          </div>
        </motion.div>

        {/* Verification Warning Banner */}
        {!isProfileVerified && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-50 border border-red-200 rounded-xl p-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <ShieldAlert className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-2">
                  Profile Verification Required
                </h3>
                <p className="text-red-700 mb-3">
                  You need to verify your merchant profile to access business
                  settings and customize your gift card designs. Complete your
                  profile verification to unlock all features.
                </p>
                <Button
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-100"
                  onClick={() => {
                    window.location.href = "/merchant/dashboard";
                  }}
                >
                  Go to Profile Verification
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tabs Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  const isLocked =
                    tab.requiresVerification && !isProfileVerified;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        if (!isLocked) {
                          setActiveTab(tab.id);
                        }
                      }}
                      disabled={isLocked}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-lg
                        transition-all duration-200 relative
                        ${
                          isActive && !isLocked
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                            : isLocked
                              ? "text-gray-400 cursor-not-allowed bg-gray-50"
                              : "text-gray-700 hover:bg-gray-100"
                        }
                      `}
                      title={
                        isLocked
                          ? "Verify your profile to access this section"
                          : ""
                      }
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                      {isLocked && <ShieldAlert className="w-4 h-4 ml-auto" />}
                    </button>
                  );
                })}
              </nav>
            </Card>
          </motion.div>

          {/* Content Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            {activeTab === "business" ? (
              isProfileVerified ? (
                <GiftCardBuilder />
              ) : (
                <Card className="p-8">
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ShieldAlert className="w-10 h-10 text-red-600" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                      Verification Required
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      You need to verify your merchant profile before you can
                      customize your business settings and gift card designs.
                    </p>
                    <Button
                      onClick={() => {
                        window.location.href = "/merchant/profile";
                      }}
                      className="mx-auto"
                    >
                      <ShieldCheck className="w-5 h-5 mr-2" />
                      Verify Your Profile
                    </Button>
                  </div>
                </Card>
              )
            ) : (
              <Card className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  {tabs.find((t) => t.id === activeTab)?.label} Settings
                </h3>

                <div className="text-center py-12">
                  <p className="text-gray-600">
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
                    settings coming soon
                  </p>
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};
