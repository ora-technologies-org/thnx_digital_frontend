// src/shared/components/layout/AdminLayout.tsx - WITH PROFILE DROPDOWN

import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  CheckCircle,
  LogOut,
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity,
  Gift,
  DollarSign,
  BarChart3,
  Menu,
  X,
  UserPlus,
  ChevronDown,
} from "lucide-react";
import { usePendingMerchants } from "../../../features/admin/hooks/useAdmin";
import NotificationBell from "../notifications/NotificationBell";

interface AdminLayoutProps {
  children: React.ReactNode;
}

// Navigation items - Settings and Logout REMOVED from sidebar
const getNavigation = (pendingCount: number) => [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    gradient: "from-blue-500 to-blue-600",
  },
  {
    name: "All Merchants",
    href: "/admin/merchants",
    icon: CheckCircle,
    gradient: "from-green-500 to-green-600",
  },
  {
    name: "Create Merchant",
    href: "/admin/create-merchant",
    icon: UserPlus,
    gradient: "from-indigo-500 to-purple-600",
  },
  {
    name: "Pending Merchants",
    href: "/admin/pending",
    icon: Users,
    gradient: "from-orange-500 to-orange-600",
    badge: pendingCount > 0 ? pendingCount : undefined,
  },
  {
    name: "Gift Cards",
    href: "/admin/giftcards",
    icon: Gift,
    gradient: "from-purple-500 to-purple-600",
  },
  {
    name: "Revenue",
    href: "/admin/revenue",
    icon: DollarSign,
    gradient: "from-emerald-500 to-emerald-600",
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    gradient: "from-pink-500 to-pink-600",
  },
  {
    name: "Activity Log",
    href: "/admin/activity",
    icon: Activity,
    gradient: "from-cyan-500 to-cyan-600",
  },
  {
    name: "Contact us",
    href: "/admin/contact-us",
    icon: Activity,
    gradient: "from-cyan-500 to-cyan-600",
  },
  {
    name: "Support Tickets",
    href: "/admin/support-tickets",
    icon: Activity,
    gradient: "from-cyan-500 to-cyan-600",
  },
  {
    name: "Update Landing",
    href: "/admin/update",
    icon: Activity,
    gradient: "from-cyan-500 to-cyan-600",
  },
];

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch pending merchants count
  const { data: pendingMerchants } = usePendingMerchants();
  const pendingCount = pendingMerchants?.length || 0;

  // Get navigation with dynamic badge
  const navigation = getNavigation(pendingCount);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // FIXED LOGOUT FUNCTION
  const handleLogout = () => {
    try {
      console.log("Initiating logout...");

      // Clear all localStorage items
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      console.log("localStorage cleared successfully");

      // Close dropdowns
      setIsProfileDropdownOpen(false);
      setIsMobileMenuOpen(false);

      // Navigate to login with replace to prevent back button issues
      navigate("/login", { replace: true });

      // Fallback: Force redirect if navigate doesn't work
      setTimeout(() => {
        if (window.location.pathname !== "/login") {
          console.log("Fallback redirect triggered");
          window.location.href = "/login";
        }
      }, 100);
    } catch (error) {
      console.error("Logout error:", error);
      // Force redirect on error
      window.location.href = "/login";
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Desktop Sidebar */}
      <motion.div
        initial={false}
        animate={{ width: isCollapsed ? "80px" : "280px" }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex flex-col bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-white shadow-2xl relative"
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <AnimatePresence mode="wait">
            {!isCollapsed ? (
              <motion.div
                key="expanded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Admin Panel
                </h1>
                <p className="text-sm text-gray-400 mt-1">Thnx Digital</p>
              </motion.div>
            ) : (
              <motion.div
                key="collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex justify-center"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center font-bold text-lg">
                  A
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigation.map((item, index) => {
            const isActive = location.pathname === item.href;
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group ${
                    isActive
                      ? "bg-gradient-to-r " + item.gradient + " shadow-lg"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-xl"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                  <div className="relative">
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {/* Badge on collapsed icon */}
                    {item.badge && isCollapsed && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                      >
                        {item.badge > 99 ? "99+" : item.badge}
                      </motion.span>
                    )}
                  </div>
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="font-medium whitespace-nowrap overflow-hidden"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {/* Badge on expanded */}
                  {item.badge && !isCollapsed && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto min-w-[24px] h-6 px-2 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                    >
                      {item.badge > 99 ? "99+" : item.badge}
                    </motion.span>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center shadow-lg transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-white" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-white" />
          )}
        </button>
      </motion.div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-3 bg-gray-900 text-white rounded-xl shadow-lg relative"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
          {/* Show badge on mobile menu button when closed */}
          {!isMobileMenuOpen && pendingCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {pendingCount > 99 ? "99+" : pendingCount}
            </span>
          )}
        </motion.button>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-80 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-white shadow-2xl z-50 flex flex-col"
            >
              {/* Logo */}
              <div className="p-6 border-b border-gray-800">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Admin Panel
                </h1>
                <p className="text-sm text-gray-400 mt-1">Thnx Digital</p>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        isActive
                          ? "bg-gradient-to-r " + item.gradient + " shadow-lg"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                      {item.badge && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto min-w-[24px] h-6 px-2 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                        >
                          {item.badge > 99 ? "99+" : item.badge}
                        </motion.span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Spacer for mobile menu button */}
              <div className="lg:hidden w-12" />
              <div className="hidden lg:block w-64">
                <input
                  type="search"
                  placeholder="Search..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Notifications with dynamic badge */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {pendingCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                  >
                    {pendingCount > 9 ? "9+" : pendingCount}
                  </motion.span>
                )}
              </motion.button>
              <NotificationBell />

              {/* User Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                  className="flex items-center gap-3 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    A
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-semibold text-gray-900">
                      Admin User
                    </p>
                    <p className="text-xs text-gray-500">
                      admin@thnxdigital.com
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-600 transition-transform ${
                      isProfileDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </motion.button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                    >
                      <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                        <p className="text-sm font-semibold text-gray-900">
                          Admin User
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          admin@thnxdigital.com
                        </p>
                      </div>

                      <div className="py-2">
                        <Link
                          to="/admin/settings"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          <span className="text-sm font-medium">Settings</span>
                        </Link>
                      </div>

                      <div className="border-t border-gray-100">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors w-full"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm font-medium">Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
