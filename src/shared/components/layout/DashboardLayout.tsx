// src/shared/components/layout/DashboardLayout.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { DashboardSidebar } from './DashboardSidebar';
import { useAuth } from '../../../features/auth/hooks/useAuth';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Sidebar */}
      <DashboardSidebar 
        user={user ? {
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          businessName: user.merchantProfile?.businessName
        } : undefined}
        onLogout={logout}
      />

      {/* Main Content */}
      <motion.main
        className="lg:ml-64 min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>
    </div>
  );
};