// src/shared/components/layout/DashboardLayout.tsx
import React from "react";
import { motion } from "framer-motion";
import { DashboardSidebar } from "./DashboardSidebar";
import { useAuth } from "../../../features/auth/hooks/useAuth";
import NotificationBell from "../notifications/NotificationBell";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Sidebar */}
      <DashboardSidebar
        user={
          user
            ? {
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                businessName: user.merchantProfile?.businessName,
              }
            : undefined
        }
        onLogout={logout}
      />

      {/* Main Content */}
      <motion.main
        className="lg:ml-64 min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Top Header Bar */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - can add breadcrumbs or title later */}
            <div className="lg:hidden">
              {/* Mobile menu button placeholder */}
            </div>

            {/* Right side - Notifications & User */}
            <div className="flex items-center gap-4 ml-auto">
              {/* Notification Bell */}
              <NotificationBell />

              {/* User Info (optional) */}
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-gray-100 rounded-xl">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user?.name?.charAt(0) || "M"}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">
                    {user?.name || "Merchant"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.merchantProfile?.businessName || user?.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        {children}
      </motion.main>
    </div>
  );
};
