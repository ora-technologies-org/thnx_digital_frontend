import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  Store,
  Search,
  ArrowLeft,
  X,
  ShoppingBag,
  Calendar,
  Tag,
  Filter,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Users,
} from "lucide-react";
import { merchantService } from "@/features/admin/services/merchantService";
import { AdminLayout } from "@/shared/components/layout/AdminLayout";

// Status Configuration
const statusConfig = {
  VERIFIED: {
    bg: "from-emerald-100 to-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-200",
    icon: <CheckCircle className="w-3.5 h-3.5" />,
    label: "Verified",
    gradient: "from-emerald-500 to-green-600",
  },
  PENDING_VERIFICATION: {
    bg: "from-amber-100 to-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    icon: <Clock className="w-3.5 h-3.5" />,
    label: "Pending",
    gradient: "from-amber-500 to-amber-600",
  },
  REJECTED: {
    bg: "from-rose-100 to-rose-50",
    text: "text-rose-800",
    border: "border-rose-200",
    icon: <XCircle className="w-3.5 h-3.5" />,
    label: "Rejected",
    gradient: "from-rose-500 to-red-600",
  },
};

// Status Badge Component
const StatusBadge = ({ status, className = "" }) => {
  const config = statusConfig[status] || statusConfig.INCOMPLETE;

  return (
    <span
      className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold border flex items-center gap-1.5 shadow-sm ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
};

// Active Badge Component
const ActiveBadge = ({ isActive }) => (
  <span
    className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-semibold shadow-sm ${
      isActive
        ? "bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-800 border border-emerald-200"
        : "bg-gradient-to-r from-rose-100 to-rose-50 text-rose-800 border border-rose-200"
    }`}
  >
    {isActive ? "Active" : "Inactive"}
  </span>
);

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5;

    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border-2 border-gray-200 hover:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {getPageNumbers().map((page, index) =>
        page === "..." ? (
          <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              currentPage === page
                ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg"
                : "border-2 border-gray-200 hover:border-purple-500 text-gray-700"
            }`}
          >
            {page}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border-2 border-gray-200 hover:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

// Loading Skeleton
const MerchantCardSkeleton = () => (
  <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border border-gray-200 animate-pulse flex flex-col h-full">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-12 h-12 sm:w-13 sm:h-13 lg:w-14 lg:h-14 rounded-xl bg-gray-200 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 sm:h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
    <div className="flex-1 flex flex-col justify-between">
      <div className="space-y-2 mb-4">
        <div className="h-3 sm:h-4 bg-gray-200 rounded w-full" />
        <div className="h-6 bg-gray-200 rounded-full w-24" />
        <div className="h-10 sm:h-11">
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-full mb-2" />
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
      <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-200">
        <div className="h-6 sm:h-7 bg-gray-200 rounded-full w-20" />
        <div className="h-7 sm:h-8 bg-gray-200 rounded-lg w-24 sm:w-28" />
      </div>
    </div>
  </div>
);

// Error Message Component
const ErrorMessage = ({ message, onRetry }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center p-12"
  >
    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
      <X className="w-8 h-8 text-red-600" />
    </div>
    <p className="text-lg text-red-600 mb-4">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Retry
      </button>
    )}
  </motion.div>
);

// Merchant Card Component
const MerchantCard = ({ merchant, onClick }) => {
  const displayName =
    merchant.businessName || merchant.user?.name || "Unnamed Merchant";
  const initial = displayName.charAt(0).toUpperCase();
  const status = merchant.profileStatus || "INCOMPLETE";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: "0 25px 50px rgba(139, 92, 246, 0.15)" }}
      onClick={onClick}
      className="bg-gradient-to-br from-white to-purple-50/30 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 cursor-pointer border-2 border-purple-100 hover:border-purple-300 transition-all shadow-sm hover:shadow-xl flex flex-col h-full"
    >
      {/* Header Section - Fixed Height */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 sm:w-13 sm:h-13 lg:w-14 lg:h-14 rounded-xl bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 flex items-center justify-center text-white text-lg sm:text-xl lg:text-2xl font-bold shadow-lg flex-shrink-0 ring-4 ring-purple-100">
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 truncate leading-tight">
            {displayName}
          </h3>
          {merchant.user?.name &&
            merchant.businessName &&
            merchant.user.name !== merchant.businessName && (
              <p className="text-xs text-gray-500 truncate mt-0.5">
                Owner: {merchant.user.name}
              </p>
            )}
        </div>
      </div>

      {/* Content Section - Grows to fill space */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-3 mb-4">
          <p className="text-xs sm:text-sm text-gray-600 truncate flex items-center gap-1.5">
            <span className="text-purple-500 text-sm">✉</span>
            <span className="truncate">
              {merchant.businessEmail || merchant.user?.email || "No email"}
            </span>
          </p>

          {merchant.businessCategory && (
            <span className="inline-block px-2.5 py-1 bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 text-xs font-semibold rounded-full border border-purple-200">
              {merchant.businessCategory}
            </span>
          )}

          {/* Description with fixed height and ellipsis */}
          <div className="h-10 sm:h-11">
            <p className="text-xs sm:text-sm text-gray-700 line-clamp-2">
              {merchant.description || "No description available"}
            </p>
          </div>
        </div>

        {/* Footer Section - Fixed at Bottom */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 sm:pt-4 border-t border-purple-100 gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={status} />
            <ActiveBadge isActive={merchant.user?.isActive} />
          </div>
          <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs sm:text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all whitespace-nowrap flex-shrink-0 mt-2 sm:mt-0">
            View Cards →
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Gift Card Display Component
const GiftCardDisplay = ({ giftCard, settings, onClick }) => {
  const cardSettings = settings || {
    primaryColor: "#8B5CF6",
    secondaryColor: "#6366F1",
    gradientDirection: "TOP_RIGHT",
    fontFamily: "Inter",
  };

  const expiryDate = new Date(giftCard.expiryDate);
  const today = new Date();
  const daysUntilExpiry = Math.ceil(
    (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
  console.log("", daysUntilExpiry);
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -3 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <div
        className="relative w-full h-44 sm:h-48 lg:h-52 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-5 lg:p-6 flex flex-col justify-between text-white"
        style={{
          background: `linear-gradient(to bottom right, ${cardSettings.primaryColor}, ${cardSettings.secondaryColor})`,
        }}
      >
        <div className="flex justify-between items-start">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <span
            className={`px-2 py-0.5 sm:py-1 rounded text-xs font-medium ${giftCard.isActive ? "bg-green-500/30 text-green-100" : "bg-red-500/30 text-red-100"}`}
          >
            {giftCard.isActive ? "ACTIVE" : "INACTIVE"}
          </span>
        </div>

        <div>
          <p className="text-xs sm:text-sm opacity-80">Balance</p>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-1">
            ₹{parseFloat(giftCard.price).toLocaleString()}
          </p>
        </div>

        <div className="flex justify-between items-end text-xs">
          <div className="flex-1 min-w-0">
            <p className="opacity-80 truncate text-xs sm:text-sm">
              {giftCard.title}
            </p>
            <p className="text-xs mt-0.5">
              Exp:{" "}
              {expiryDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "2-digit",
              })}
            </p>
          </div>
          <p className="text-xs whitespace-nowrap ml-2">
            {giftCard._count?.purchases || 0} sales
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// Gift Card Modal
const GiftCardModal = ({ isOpen, onClose, card, settings }) => {
  if (!card) return null;

  const expiryDate = new Date(card.expiryDate);
  const today = new Date();
  const daysUntilExpiry = Math.ceil(
    (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex justify-between items-start p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {card.title}
                </h2>
                <p className="text-sm text-gray-500 mt-1">Gift Card Details</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div
                className="rounded-xl p-6 text-white"
                style={{
                  background: `linear-gradient(to bottom right, ${settings?.primaryColor || "#8B5CF6"}, ${settings?.secondaryColor || "#6366F1"})`,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="w-5 h-5" />
                  <span className="text-sm font-medium opacity-90">Price</span>
                </div>
                <div className="text-4xl font-bold">
                  ₹{parseFloat(card.price).toLocaleString()}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">Expiry Date</span>
                  </div>
                  <div className="text-gray-900 font-semibold text-sm sm:text-base">
                    {expiryDate.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div className="mt-2">
                    {daysUntilExpiry > 0 ? (
                      <span className="text-sm text-orange-600 font-medium">
                        Expires in {daysUntilExpiry} day
                        {daysUntilExpiry !== 1 ? "s" : ""}
                      </span>
                    ) : (
                      <span className="text-sm text-red-600 font-medium">
                        Expired
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <ShoppingBag className="w-4 h-4" />
                    <span className="text-sm font-medium">Status</span>
                  </div>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${card.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  >
                    {card.isActive ? "✓ Active" : "✗ Inactive"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={onClose}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Stats Cards Component
const StatsCards = ({ statusCounts, total }) => {
  const stats = {
    total: total || 0,
    verified: statusCounts?.VERIFIED || 0,
    pending: statusCounts?.PENDING_VERIFICATION || 0,
    rejected: statusCounts?.REJECTED || 0,
    incomplete: statusCounts?.INCOMPLETE || 0,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 mb-6 sm:mb-8">
      {/* Total Merchants */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-4 sm:p-5 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl sm:rounded-2xl border border-blue-200 hover:border-blue-300 transition-all shadow-sm hover:shadow-md"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm text-blue-600 font-semibold mb-1 sm:mb-2">
              Total Merchants
            </p>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-900">
              {stats.total}
            </p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
        </div>
      </motion.div>

      {/* Verified */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-4 sm:p-5 bg-gradient-to-br from-emerald-50 to-teal-100 rounded-xl sm:rounded-2xl border border-emerald-200 hover:border-emerald-300 transition-all shadow-sm hover:shadow-md"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm text-emerald-600 font-semibold mb-1 sm:mb-2">
              Verified
            </p>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-900">
              {stats.verified}
            </p>
            <p className="text-xs text-emerald-700 font-medium mt-0.5 sm:mt-1">
              {stats.total > 0
                ? `${Math.round((stats.verified / stats.total) * 100)}%`
                : "0%"}{" "}
              of total
            </p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
        </div>
      </motion.div>

      {/* Pending */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-4 sm:p-5 bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl sm:rounded-2xl border border-amber-200 hover:border-amber-300 transition-all shadow-sm hover:shadow-md"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm text-amber-600 font-semibold mb-1 sm:mb-2">
              Pending
            </p>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-900">
              {stats.pending}
            </p>
            <p className="text-xs text-amber-700 font-medium mt-0.5 sm:mt-1">
              {stats.total > 0
                ? `${Math.round((stats.pending / stats.total) * 100)}%`
                : "0%"}{" "}
              of total
            </p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-md">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
        </div>
      </motion.div>

      {/* Rejected */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-4 sm:p-5 bg-gradient-to-br from-rose-50 to-red-100 rounded-xl sm:rounded-2xl border border-rose-200 hover:border-rose-300 transition-all shadow-sm hover:shadow-md"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm text-rose-600 font-semibold mb-1 sm:mb-2">
              Rejected
            </p>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-rose-900">
              {stats.rejected}
            </p>
            <p className="text-xs text-rose-700 font-medium mt-0.5 sm:mt-1">
              {stats.total > 0
                ? `${Math.round((stats.rejected / stats.total) * 100)}%`
                : "0%"}{" "}
              of total
            </p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center shadow-md">
            <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Merchants Page
const MerchantsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const itemsPerPage = 9;

  const { data, error, refetch, isLoading } = useQuery({
    queryKey: [
      "merchants",
      currentPage,
      searchTerm,
      statusFilter,
      activeFilter,
    ],
    queryFn: () =>
      merchantService.getMerchants({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm || undefined,
        profileStatus: statusFilter || undefined,
        active: activeFilter === "" ? undefined : activeFilter === "true",
      }),
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <ErrorMessage message="Failed to load merchants" onRetry={refetch} />
        </div>
      </AdminLayout>
    );
  }

  if (selectedMerchant) {
    return (
      <AdminLayout>
        <MerchantGiftCardsPage
          merchant={selectedMerchant}
          onBack={() => setSelectedMerchant(null)}
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
                >
                  <Store className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Gift Cards Marketplace
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Browse merchants and their gift cards
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => refetch()}
                disabled={data === undefined}
                className="px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl hover:border-gray-300 transition-all shadow-sm flex items-center gap-2 sm:gap-3"
              >
                <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-600`} />
                <span className="font-medium text-gray-700 text-sm sm:text-base">
                  Refresh
                </span>
              </motion.button>
            </div>

            {/* Stats Cards */}
            {data?.statusCounts && (
              <StatsCards
                statusCounts={data.statusCounts}
                total={data.pagination?.total}
              />
            )}

            {/* Search and Filters */}
            <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 mb-6 shadow-sm">
              <div className="flex flex-col gap-4">
                {/* Search Bar */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Search Merchants
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by business name, email, category..."
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-sm sm:text-base"
                    />
                  </div>
                </div>

                {/* Filter Row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                    <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
                    <span className="font-medium text-gray-700 text-sm sm:text-base">
                      Filters:
                    </span>

                    <select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none text-sm sm:text-base"
                    >
                      <option value="">All Status</option>
                      <option value="VERIFIED">Verified</option>
                      <option value="PENDING_VERIFICATION">Pending</option>
                      <option value="REJECTED">Rejected</option>
                    </select>

                    <select
                      value={activeFilter}
                      onChange={(e) => {
                        setActiveFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none text-sm sm:text-base"
                    >
                      <option value="">All Merchants</option>
                      <option value="true">Active Only</option>
                      <option value="false">Inactive Only</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Pagination Info */}
          {data && (
            <div className="mb-4 text-xs sm:text-sm text-gray-600">
              Showing {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, data.pagination.total)} of{" "}
              {data.pagination.total} merchants
            </div>
          )}

          {/* Merchants Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {[...Array(itemsPerPage)].map((_, i) => (
                <MerchantCardSkeleton key={i} />
              ))}
            </div>
          ) : data?.merchants && data.merchants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {data.merchants.map((merchant) => (
                <MerchantCard
                  key={merchant.id}
                  merchant={merchant}
                  onClick={() => setSelectedMerchant(merchant)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full mb-4">
                <Search className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
              </div>
              <p className="text-sm sm:text-base text-gray-500">
                No merchants found
              </p>
            </div>
          )}

          {/* Pagination */}
          {data && data.pagination.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={data.pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

// Merchant Gift Cards Page
const MerchantGiftCardsPage = ({ merchant, onBack }) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [priceFilter, setPriceFilter] = useState("all");

  const { data, error, refetch, isLoading } = useQuery({
    queryKey: ["merchant-gift-cards", merchant.userId],
    queryFn: () => merchantService.MerchantGiftCard(merchant.userId),
    enabled: !!merchant.userId,
  });

  const filterCards = (cards) => {
    if (!cards) return [];
    if (priceFilter === "all") return cards;
    return cards.filter((card) => {
      const price = parseFloat(card.price || "0");
      if (priceFilter === "low") return price < 1000;
      if (priceFilter === "medium") return price >= 1000 && price <= 5000;
      if (priceFilter === "high") return price > 5000;
      return true;
    });
  };

  const filteredCards = filterCards(data?.giftCards || []);

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <button
          onClick={onBack}
          className="mb-6 px-4 py-2 hover:bg-purple-50 rounded-lg transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Merchants
        </button>
        <ErrorMessage message="Failed to load gift cards" onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="pb-8">
      <div className="mb-4 sm:mb-6">
        <button
          onClick={onBack}
          className="mb-4 px-3 sm:px-4 py-2 hover:bg-purple-50 rounded-lg transition-colors flex items-center gap-2 text-sm sm:text-base font-medium text-gray-700"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          Back to Merchants
        </button>
      </div>

      <div className="bg-white rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {merchant.businessName || merchant.user?.name || "Merchant"}'s
              Gift Cards
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              {merchant.businessEmail || merchant.user?.email}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <StatusBadge status={merchant.profileStatus} />
              <ActiveBadge isActive={merchant.user?.isActive} />
              {merchant.businessCategory && (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                  {merchant.businessCategory}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 sm:p-6 mb-6 shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
            <span className="font-medium text-gray-700 text-sm sm:text-base">
              Filter by Price:
            </span>
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="px-3 sm:px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none text-sm sm:text-base"
            >
              <option value="all">All Prices</option>
              <option value="low">Under ₹1,000</option>
              <option value="medium">₹1,000 - ₹5,000</option>
              <option value="high">Over ₹5,000</option>
            </select>
          </div>
          <div className="text-xs sm:text-sm text-gray-600 font-medium">
            Showing {filteredCards.length} of {data?.giftCards?.length || 0}{" "}
            cards
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {[...Array(6)].map((_, i) => (
            <MerchantCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredCards.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {filteredCards.map((card) => (
            <GiftCardDisplay
              key={card.id}
              giftCard={card}
              settings={data?.setting}
              onClick={() => {
                setSelectedCard(card);
                setIsModalOpen(true);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 sm:py-16">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full mb-4">
            <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
          </div>
          <p className="text-sm sm:text-base text-gray-500">
            No gift cards found
          </p>
        </div>
      )}

      <GiftCardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        card={selectedCard}
        settings={data?.setting}
      />
    </div>
  );
};

export default MerchantsPage;
