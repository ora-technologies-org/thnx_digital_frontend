// src/shared/components/layout/DashboardSidebar.tsx
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Gift,
  ShoppingBag,
  BarChart3,
  DollarSign,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
  QrCode,
} from "lucide-react";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
  disabled?: boolean;
}

interface DashboardSidebarProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
    businessName?: string;
  };
  onLogout?: () => void;
}

// Separate SidebarContent component - defined OUTSIDE to prevent recreation during render
interface SidebarContentProps {
  isCollapsed: boolean;
  user?: DashboardSidebarProps["user"];
  menuItems: MenuItem[];
  currentPath: string;
  onLogout: () => void;
  onMobileMenuClose: () => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  isCollapsed,
  user,
  menuItems,
  currentPath,
  onLogout,
  onMobileMenuClose,
}) => {
  const isActive = (path: string) => currentPath === path;

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div
            className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
          >
            <Gift className="h-6 w-6 text-white" />
          </motion.div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Thnx Digital
              </h1>
              <p className="text-xs text-gray-500">Merchant Portal</p>
            </motion.div>
          )}
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const active = isActive(item.path);

          return (
            <Link key={item.id} to={item.path} onClick={onMobileMenuClose}>
              <motion.div
                className={`
                  relative flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer
                  transition-all duration-200
                  ${
                    active
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                  ${item.disabled ? "opacity-50 cursor-not-allowed" : ""}
                `}
                whileHover={!item.disabled ? { scale: 1.02, x: 5 } : {}}
                whileTap={!item.disabled ? { scale: 0.98 } : {}}
              >
                {/* Active indicator */}
                {active && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 w-1 h-8 bg-white rounded-r-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                {/* Icon */}
                <div
                  className={`flex-shrink-0 ${active ? "text-white" : "text-gray-600"}`}
                >
                  {item.icon}
                </div>

                {/* Label */}
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-1 font-medium"
                  >
                    {item.label}
                  </motion.span>
                )}

                {/* Badge */}
                {item.badge && !isCollapsed && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`
                      px-2 py-0.5 text-xs font-bold rounded-full
                      ${
                        active
                          ? "bg-white text-blue-600"
                          : "bg-blue-100 text-blue-600"
                      }
                    `}
                  >
                    {item.badge}
                  </motion.span>
                )}

                {/* Arrow icon for active */}
                {active && !isCollapsed && (
                  <motion.div
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </motion.div>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed && user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              {/* Avatar */}
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  user.name?.charAt(0).toUpperCase()
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.businessName || user.email}
                </p>
              </div>

              {/* Notification Bell */}
              <button className="relative p-2 hover:bg-gray-200 rounded-lg transition-colors">
                <Bell className="w-4 h-4 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Logout Button */}
        <motion.button
          onClick={onLogout}
          className={`
            w-full flex items-center gap-3 px-4 py-3 rounded-xl
            text-red-600 hover:bg-red-50 transition-all
            ${isCollapsed ? "justify-center" : ""}
          `}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </motion.button>
      </div>
    </div>
  );
};

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  user,
  onLogout,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: "/merchant/dashboard",
    },
    {
      id: "gift-cards",
      label: "Gift Cards",
      icon: <Gift className="w-5 h-5" />,
      path: "/merchant/gift-cards",
    },
    {
      id: "orders",
      label: "Orders",
      icon: <ShoppingBag className="w-5 h-5" />,
      path: "/merchant/orders",
    },
    {
      id: "scan",
      label: "Scan QR",
      icon: <QrCode className="w-5 h-5" />,
      path: "/merchant/scan",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: <BarChart3 className="w-5 h-5" />,
      path: "/merchant/analytics",
    },
    {
      id: "payouts",
      label: "Payouts",
      icon: <DollarSign className="w-5 h-5" />,
      path: "/merchant/payouts",
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="w-5 h-5" />,
      path: "/merchant/settings",
    },
    {
      id: "support",
      label: "Support",
      icon: <Settings className="w-5 h-5" />,
      path: "/merchant/support",
    },
  ];

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Default logout behavior
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const handleMobileMenuClose = () => {
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-xl shadow-lg border border-gray-200"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isMobileOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </motion.button>

      {/* Desktop Sidebar */}
      <motion.aside
        className={`
          hidden lg:block fixed left-0 top-0 h-screen bg-white z-40
          transition-all duration-300 border-r border-gray-200
          ${isCollapsed ? "w-20" : "w-64"}
        `}
        initial={false}
        animate={{ width: isCollapsed ? 80 : 256 }}
      >
        <SidebarContent
          isCollapsed={isCollapsed}
          user={user}
          menuItems={menuItems}
          currentPath={location.pathname}
          onLogout={handleLogout}
          onMobileMenuClose={handleMobileMenuClose}
        />

        {/* Collapse Toggle */}
        <motion.button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight
            className={`w-4 h-4 text-gray-600 transition-transform ${isCollapsed ? "" : "rotate-180"}`}
          />
        </motion.button>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Sidebar */}
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25 }}
              className="lg:hidden fixed left-0 top-0 h-screen w-64 z-50"
            >
              <SidebarContent
                isCollapsed={false}
                user={user}
                menuItems={menuItems}
                currentPath={location.pathname}
                onLogout={handleLogout}
                onMobileMenuClose={handleMobileMenuClose}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
