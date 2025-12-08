import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Gift, History } from 'lucide-react';

const menuItems = [
  { path: '/merchant/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/merchant/gift-cards', label: 'Gift Cards', icon: Gift },
  { path: '/merchant/redemptions', label: 'Redemptions', icon: History },
  
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};