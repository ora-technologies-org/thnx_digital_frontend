import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../../features/auth/hooks/useAuth';

interface MainLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, showSidebar = false }) => {
  const { user } = useAuth();
  const shouldShowSidebar = showSidebar && user?.role === 'MERCHANT';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        {shouldShowSidebar && <Sidebar />}
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};