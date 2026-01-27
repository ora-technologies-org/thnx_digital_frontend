// src/shared/components/layout/AdminLayout.tsx - WITH PROFILE DROPDOWN
import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
  Mail,
  MessageSquare,
  FileEdit,
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
    icon: Mail,
    gradient: "from-sky-500 to-sky-600",
  },
  {
    name: "Support Tickets",
    href: "/admin/support-tickets",
    icon: MessageSquare,
    gradient: "from-violet-500 to-violet-600",
  },
  {
    name: "Update Landing",
    href: "/admin/update",
    icon: FileEdit,
    gradient: "from-amber-500 to-amber-600",
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
  const { data: pendingMerchantsResponse } = usePendingMerchants({
    page: 1,
    limit: 100, // Get all pending to show accurate count
  });

  const pendingCount = pendingMerchantsResponse?.merchants?.length || 0;

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      {/* Desktop Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white transition-all duration-300 z-30 hidden lg:flex flex-col shadow-2xl ${
          isCollapsed ? "w-20" : "w-72"
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-700/50">
          {!isCollapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold">T</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Admin Panel
                </h1>
                <p className="text-xs text-gray-400">Thnx Digital</p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto shadow-lg">
              <span className="text-xl font-bold">A</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isCollapsed ? "justify-center" : ""
                } ${
                  isActive
                    ? `bg-gradient-to-r ${item.gradient} shadow-lg scale-105`
                    : "text-gray-300 hover:bg-gray-800 hover:text-white hover:scale-102"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-white/10 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <div className="relative flex items-center gap-3 w-full">
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {/* Badge on collapsed icon */}
                  {item.badge && isCollapsed && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                  <div className="flex items-center justify-between flex-1">
                    {!isCollapsed && (
                      <span className="font-medium">{item.name}</span>
                    )}
                    {/* Badge on expanded */}
                    {item.badge && !isCollapsed && (
                      <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">
                        {item.badge > 99 ? "99+" : item.badge}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center shadow-lg transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </aside>

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
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
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
              {pendingCount > 99 ? "99+" : pendingCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <>
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <aside className="lg:hidden fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white z-50 shadow-2xl">
            {/* Logo */}
            <div className="p-6 border-b border-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-xl font-bold">T</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Admin Panel
                  </h1>
                  <p className="text-xs text-gray-400">Thnx Digital</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="px-3 py-6 space-y-2 overflow-y-auto h-[calc(100vh-100px)]">
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
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium flex-1">{item.name}</span>
                    {item.badge && (
                      <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">
                        {item.badge > 99 ? "99+" : item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </>
      )}

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          isCollapsed ? "lg:ml-20" : "lg:ml-72"
        }`}
      >
        {/* Top Bar */}
        <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-20 shadow-sm">
          <div className="px-4 lg:px-8 py-4 flex items-center justify-between">
            {/* Spacer for mobile menu button */}
            <div className="lg:hidden w-12" />

            <div className="flex-1" />

            <div className="flex items-center gap-4">
              {/* Notifications with dynamic badge */}
              <NotificationBell />

              {/* User Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                  className="flex items-center gap-3 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
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
                </button>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">
                        Admin User
                      </p>
                      <p className="text-xs text-gray-500">
                        admin@thnxdigital.com
                      </p>
                    </div>

                    <Link
                      to="/admin/settings"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="text-sm font-medium">Settings</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
