// src/features/giftCards/components/EnhancedGiftCardList.tsx
import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  Grid,
  List,
  Download,
  TrendingUp,
  DollarSign,
  Gift,
  AlertCircle,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import type { AxiosError } from "axios";
import { Button } from "../../../shared/components/ui/Button";
import { Modal } from "../../../shared/components/ui/Modal";
import { Spinner } from "../../../shared/components/ui/Spinner";
import { useModal } from "../../../shared/hooks/useModal";
import { useGiftCards } from "../hooks/useGiftCards";
import { useCreateGiftCard } from "../hooks/useCreateGiftCard";
import { useUpdateGiftCard } from "../hooks/useUpdateGiftCard";
import { useDeleteGiftCard } from "../hooks/useDeleteGiftCard";

import { GiftCardForm } from "./GiftCardForm";
import type {
  GiftCard,
  CreateGiftCardData,
  UpdateGiftCardData,
} from "../types/giftCard.types";
import { GiftCardDisplay } from "./GiftCardDisplay";
import { GiftCardListItem } from "./GiftCardListItem";
import { useGiftCardSettings } from "@/features/merchant/hooks/useGiftCardSetting";

// Type definitions for view modes, sorting and filtering options
type ViewMode = "grid" | "list";
type SortOption = "newest" | "oldest" | "price-high" | "price-low" | "expiry";
type FilterOption = "all" | "active" | "inactive" | "expiring";

interface NotificationState {
  isOpen: boolean;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  onConfirm?: () => void;
  showActions?: boolean;
  confirmText?: string;
  autoClose?: boolean; // Added for auto-close functionality
}

interface DeleteConfirmState {
  isOpen: boolean;
  giftCard: GiftCard | null;
  title: string;
  message: string;
}

/**
 * Decodes JWT token to extract user verification status
 * @param token - JWT access token
 * @returns Decoded token payload or null if decoding fails
 */
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

/**
 * Extracts user verification status from JWT token stored in localStorage
 * @returns Object containing verification status and profile status
 */
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

/**
 * Main component for displaying and managing gift cards
 * Includes filtering, sorting, creation, editing, and deletion functionality
 */
export const EnhancedGiftCardList: React.FC = () => {
  // Data fetching and mutations
  const { data, isLoading, refetch } = useGiftCards();
  const createMutation = useCreateGiftCard();
  const updateMutation = useUpdateGiftCard();
  const deleteMutation = useDeleteGiftCard();
  const { settings: cardSettings } = useGiftCardSettings();

  // Modal states
  const createModal = useModal();
  const editModal = useModal();

  // Load Google Fonts
  useEffect(() => {
    const fonts = [
      "Inter",
      "Roboto",
      "Poppins",
      "Montserrat",
      "Open Sans",
      "Lato",
    ];
    const link = document.createElement("link");
    link.href = `https://fonts.googleapis.com/css2?${fonts.map((font) => `family=${font.replace(" ", "+")}`).join("&")}&display=swap`;
    link.rel = "stylesheet";

    if (!document.querySelector(`link[href="${link.href}"]`)) {
      document.head.appendChild(link);
    }
  }, []);

  // Notification and delete confirmation states
  const [notification, setNotification] = useState<NotificationState>({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    showActions: false,
    autoClose: true, // Default to auto-close
  });

  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmState>({
    isOpen: false,
    giftCard: null,
    title: "Delete Gift Card",
    message: "",
  });

  // Component state
  const [selectedCard, setSelectedCard] = useState<GiftCard | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Capture current time once on mount (pure because it's a lazy initializer)
  const [currentTime] = useState(() => Date.now());
  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, isOpen: false }));
  };
  // Auto-close notifications after 3 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (
      notification.isOpen &&
      notification.autoClose &&
      !notification.showActions
    ) {
      timer = setTimeout(() => {
        closeNotification();
      }, 3000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [notification.isOpen, notification.autoClose, notification.showActions]);

  // Extract gift cards from API response with memoization
  const giftCards = useMemo(
    () => data?.data.giftCards || [],
    [data?.data.giftCards],
  );
  const canCreateMore = (data?.data.remaining || 0) > 0;

  // Get user verification status
  const { isVerified, profileStatus } = getUserVerificationStatus();
  const isProfileVerified = isVerified && profileStatus === "VERIFIED";

  // Calculate statistics from API data
  const stats = useMemo(() => {
    if (!data?.data) {
      return { total: 0, active: 0, totalValue: 0, expiringSoon: 0 };
    }

    return {
      total: data.data.totalGiftCards || 0,
      active: data.data.activeCards || 0,
      totalValue: parseFloat(data.data.totalValue || "0"),
      expiringSoon: data.data.expiringSoon || 0,
    };
  }, [data?.data]);

  /**
   * Shows a notification modal
   * @param type - Type of notification (success, error, warning, info)
   * @param title - Modal title
   * @param message - Modal message
   * @param showActions - Whether to show action buttons
   * @param onConfirm - Callback for confirm action
   * @param confirmText - Text for confirm button
   * @param autoClose - Whether to auto-close the notification
   */
  const showNotification = (
    type: NotificationState["type"],
    title: string,
    message: string,
    showActions: boolean = false,
    onConfirm?: () => void,
    confirmText: string = "OK",
    autoClose: boolean = !showActions, // Auto-close by default for non-action notifications
  ) => {
    setNotification({
      isOpen: true,
      type,
      title,
      message,
      showActions,
      onConfirm,
      confirmText,
      autoClose,
    });
  };

  /**
   * Closes the notification modal
   */

  /**
   * Shows delete confirmation modal
   * @param giftCard - Gift card to delete
   */
  const showDeleteConfirm = (giftCard: GiftCard) => {
    const expiryDate = new Date(giftCard.expiryDate);
    const isExpired = expiryDate < new Date();
    const hasPurchases = (giftCard._count?.purchases || 0) > 0;

    let message = "Are you sure you want to delete this gift card? ";

    if (hasPurchases) {
      message += `This card has ${giftCard._count?.purchases} purchase(s). `;
    }

    if (isExpired) {
      message += "This card has already expired. ";
    }

    message += "This action cannot be undone.";

    setDeleteConfirm({
      isOpen: true,
      giftCard,
      title: `Delete "${giftCard.title}"`,
      message,
    });
  };

  /**
   * Closes the delete confirmation modal
   */
  const closeDeleteConfirm = () => {
    setDeleteConfirm((prev) => ({ ...prev, isOpen: false }));
  };

  // Process and filter gift cards based on search, filter, and sort criteria
  const processedCards = useMemo(() => {
    let filtered = giftCards;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (card) =>
          card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          card.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          card.price.toLowerCase().includes(searchQuery),
      );
    }

    // Apply status filter
    if (filterBy !== "all") {
      filtered = filtered.filter((card) => {
        if (filterBy === "active") return card.isActive;
        if (filterBy === "inactive") return !card.isActive;
        if (filterBy === "expiring") {
          const expiryDate = new Date(card.expiryDate);
          const daysUntilExpiry = Math.ceil(
            (expiryDate.getTime() - currentTime) / (1000 * 60 * 60 * 24),
          );
          return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
        }
        return true;
      });
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "newest")
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      if (sortBy === "oldest")
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      if (sortBy === "price-high")
        return parseFloat(b.price) - parseFloat(a.price);
      if (sortBy === "price-low")
        return parseFloat(a.price) - parseFloat(b.price);
      if (sortBy === "expiry")
        return (
          new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
        );
      return 0;
    });

    return sorted;
  }, [giftCards, searchQuery, filterBy, sortBy, currentTime]);

  /**
   * Handles gift card creation
   * @param formData - Data for the new gift card
   */
  const handleCreate = (formData: CreateGiftCardData) => {
    createMutation.mutate(formData, {
      onSuccess: (response) => {
        showNotification(
          "success",
          "Gift Card Created",
          response?.message || "Gift card created successfully!",
          false,
          () => {
            createModal.close();
            refetch();
          },
          "Continue",
          true, // Auto-close
        );
        createModal.close();
        refetch();
      },
      onError: (error: AxiosError<{ message?: string }>) => {
        showNotification(
          "error",
          "Creation Failed",
          error.response?.data?.message ||
            error.message ||
            "Failed to create gift card. Please try again.",
          true, // Show actions for errors
          undefined,
          "Try Again",
          false, // Don't auto-close error messages with actions
        );
      },
    });
  };

  /**
   * Handles gift card edit initiation
   * @param giftCard - The gift card to edit
   */
  const handleEdit = (giftCard: GiftCard) => {
    setSelectedCard(giftCard);
    editModal.open();
  };

  /**
   * Handles gift card update
   * @param formData - Updated data for the gift card
   */
  const handleUpdate = (formData: UpdateGiftCardData) => {
    if (!selectedCard) return;

    updateMutation.mutate(
      { id: selectedCard.id, data: formData },
      {
        onSuccess: (response) => {
          showNotification(
            "success",
            "Gift Card Updated",
            response?.message || "Gift card updated successfully!",
            false,
            () => {
              editModal.close();
              setSelectedCard(null);
              refetch();
            },
            "Continue",
            true, // Auto-close
          );
          editModal.close();
          setSelectedCard(null);
          refetch();
        },
        onError: (error: AxiosError<{ message?: string }>) => {
          showNotification(
            "error",
            "Update Failed",
            error.response?.data?.message ||
              error.message ||
              "Failed to update gift card. Please try again.",
            true, // Show actions for errors
            undefined,
            "Try Again",
            false, // Don't auto-close error messages with actions
          );
        },
      },
    );
  };

  /**
   * Handles gift card deletion
   * @param id - ID of the gift card to delete
   */
  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: (response) => {
        showNotification(
          "success",
          "Gift Card Deleted",
          response?.message || "Gift card deleted successfully!",
          false,
          () => {
            refetch();
          },
          "OK",
          true, // Auto-close
        );
        refetch();
        closeDeleteConfirm();
      },
      onError: (error: AxiosError<{ message?: string }>) => {
        showNotification(
          "error",
          "Deletion Failed",
          error.response?.data?.message ||
            error.message ||
            "Failed to delete gift card. Please try again.",
          true, // Show actions for errors
          undefined,
          "Try Again",
          false, // Don't auto-close error messages with actions
        );
        closeDeleteConfirm();
      },
    });
  };

  /**
   * Handles gift card duplication
   * @param card - Gift card to duplicate
   */
  const handleDuplicate = (card: GiftCard) => {
    const duplicateData = {
      title: `${card.title} (Copy)`,
      description: card.description,
      price: parseFloat(card.price),
      expiryDate: card.expiryDate,
      isActive: card.isActive,
    };
    createMutation.mutate(duplicateData, {
      onSuccess: (response) => {
        showNotification(
          "success",
          "Gift Card Duplicated",
          response?.message || "Gift card duplicated successfully!",
          false,
          () => {
            refetch();
          },
          "OK",
          true, // Auto-close
        );
        refetch();
      },
      onError: (error: AxiosError<{ message?: string }>) => {
        showNotification(
          "error",
          "Duplication Failed",
          error.response?.data?.message ||
            error.message ||
            "Failed to duplicate gift card. Please try again.",
          true, // Show actions for errors
          undefined,
          "Try Again",
          false, // Don't auto-close error messages with actions
        );
      },
    });
  };

  /**
   * Exports gift cards to CSV format
   */
  const handleExport = () => {
    const csvContent = [
      ["Title", "Price", "Status", "Expiry Date", "Created At", "Purchases"],
      ...giftCards.map((card) => [
        `"${card.title}"`,
        card.price,
        card.isActive ? "Active" : "Inactive",
        new Date(card.expiryDate).toISOString().split("T")[0],
        new Date(card.createdAt).toISOString().split("T")[0],
        card._count?.purchases || 0,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gift-cards-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    showNotification(
      "success",
      "Export Successful",
      `${giftCards.length} gift cards exported successfully!`,
      false,
      undefined,
      "OK",
      true, // Auto-close
    );
  };

  /**
   * Clears all filters and search query
   */
  const clearAllFilters = () => {
    setSearchQuery("");
    setFilterBy("all");
    setSortBy("newest");
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 overflow-x-hidden max-w-full px-2 sm:px-0">
      {/* Verification Status Banner */}
      {!isVerified && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 mb-6 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-yellow-900 mb-1">
              Account Verification Required
            </h3>
            <p className="text-sm text-yellow-800">
              Please verify your account to create orders. Check your email for
              verification instructions.
            </p>
          </div>
        </motion.div>
      )}

      {/* Profile Verification Status */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            isProfileVerified
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {isProfileVerified ? (
            <>
              <ShieldCheck className="w-5 h-5" />
              <span className="font-medium">Profile Verified</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-5 h-5" />
              <span className="font-medium">Profile Not Verified</span>
            </>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Gift className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">
              {data?.data.totalGiftCards}/{data?.data.limitAllowed}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {stats.total}
          </h3>
          <p className="text-sm text-gray-600">Total Gift Cards</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-green-600 text-sm font-medium">
              {stats.total > 0
                ? Math.round((stats.active / stats.total) * 100)
                : 0}
              %
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {stats.active}
          </h3>
          <p className="text-sm text-gray-600">Active Cards</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            ₹{stats.totalValue.toLocaleString()}
          </h3>
          <p className="text-sm text-gray-600">Total Value</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {stats.expiringSoon}
          </h3>
          <p className="text-sm text-gray-600">Expiring Soon (30 days)</p>
        </div>
      </motion.div>

      {/* Search and Filter Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200"
      >
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search gift cards by title, description, or price..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-2 sm:gap-3 flex-wrap">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-3 rounded-lg border transition-colors text-sm ${
                showFilters
                  ? "bg-blue-50 border-blue-300 text-blue-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>

            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 transition-colors ${
                  viewMode === "grid"
                    ? "bg-blue-50 text-blue-600 border-r border-gray-300"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                title="Grid View"
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-3 transition-colors ${
                  viewMode === "list"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                title="List View"
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={() => refetch()}
              className="p-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5" />
            </button>

            <button
              onClick={handleExport}
              disabled={giftCards.length === 0}
              className="flex items-center gap-2 px-3 sm:px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              title="Export to CSV"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>

            <Button
              onClick={createModal.open}
              disabled={!canCreateMore || !isProfileVerified}
              className="px-3 sm:px-6 text-sm"
              title={
                !isProfileVerified
                  ? "Please verify your profile to create gift cards"
                  : !canCreateMore
                    ? "You have reached the maximum limit of gift cards"
                    : ""
              }
            >
              <Plus className="h-5 w-5 sm:mr-2" />
              <span className="hidden sm:inline">Create Card</span>
              {!isProfileVerified && <ShieldAlert className="h-4 w-4 ml-2" />}
            </Button>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-6 pt-6 border-t border-gray-200 overflow-hidden"
            >
              <div className="flex flex-wrap gap-6">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Status
                  </label>
                  <select
                    value={filterBy}
                    onChange={(e) =>
                      setFilterBy(e.target.value as FilterOption)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Cards</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                    <option value="expiring">Expiring Soon (≤ 30 days)</option>
                  </select>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="expiry">Expiry Date (Soonest)</option>
                  </select>
                </div>

                {(searchQuery || filterBy !== "all" || sortBy !== "newest") && (
                  <div className="flex items-end">
                    <button
                      onClick={clearAllFilters}
                      className="px-6 py-3 text-blue-600 hover:text-blue-700 font-medium hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Results Summary */}
      {(searchQuery || filterBy !== "all" || sortBy !== "newest") && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between"
        >
          <span className="text-sm text-gray-600">
            Showing {processedCards.length} of {giftCards.length} gift cards
            {searchQuery && ` matching "${searchQuery}"`}
          </span>
        </motion.div>
      )}

      {/* Gift Cards List/Grid */}
      {processedCards.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-sm p-6 sm:p-12 text-center border border-gray-200"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Gift className="w-12 h-12 text-blue-600" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">
            {searchQuery || filterBy !== "all"
              ? "No results found"
              : "No gift cards yet"}
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {searchQuery || filterBy !== "all"
              ? "Try adjusting your search or filters to find what you're looking for."
              : isProfileVerified
                ? "Create your first gift card to start selling to customers."
                : "Verify your profile to create gift cards."}
          </p>
          {!searchQuery && filterBy === "all" && isProfileVerified && (
            <Button onClick={createModal.open} size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Gift Card
            </Button>
          )}
        </motion.div>
      ) : (
        <motion.div
          layout
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8"
              : "space-y-4"
          }
        >
          <AnimatePresence mode="popLayout">
            {processedCards.map((giftCard) => (
              <motion.div
                key={giftCard.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                {viewMode === "grid" ? (
                  <GiftCardDisplay
                    giftCard={giftCard}
                    settings={cardSettings}
                    onEdit={() => handleEdit(giftCard)}
                    onDelete={() => showDeleteConfirm(giftCard)}
                    onDuplicate={() => handleDuplicate(giftCard)}
                  />
                ) : (
                  <GiftCardListItem
                    giftCard={giftCard}
                    settings={cardSettings}
                    onEdit={() => handleEdit(giftCard)}
                    onDelete={() => showDeleteConfirm(giftCard)}
                    onDuplicate={() => handleDuplicate(giftCard)}
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Create Gift Card Modal */}
      <Modal
        isOpen={createModal.isOpen}
        onClose={createModal.close}
        title="Create Gift Card"
        size="xl"
      >
        {isProfileVerified ? (
          <GiftCardForm
            onSubmit={handleCreate}
            isLoading={createMutation.isPending}
            submitLabel="Create Gift Card"
          />
        ) : (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Profile Verification Required
            </h3>
            <p className="text-gray-600 mb-6">
              You need to verify your merchant profile before you can create
              gift cards.
            </p>
            <Button
              onClick={() => {
                createModal.close();
                window.location.href = "/merchant/profile";
              }}
            >
              Go to Profile Verification
            </Button>
          </div>
        )}
      </Modal>

      {/* Edit Gift Card Modal */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={() => {
          editModal.close();
          setSelectedCard(null);
        }}
        title="Edit Gift Card"
        size="xl"
      >
        {selectedCard && (
          <div className="space-y-6">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-700 mt-1">
                <strong>Created:</strong>{" "}
                {new Date(selectedCard.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-700 mt-1">
                <strong>Purchases:</strong>{" "}
                {selectedCard._count?.purchases || 0}
              </p>
            </div>
            <GiftCardForm
              initialData={selectedCard}
              onSubmit={handleUpdate}
              isLoading={updateMutation.isPending}
              submitLabel="Update Gift Card"
            />
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirm.isOpen}
        onClose={closeDeleteConfirm}
        title={deleteConfirm.title}
        type="error"
        showActions={true}
        onConfirm={() => {
          if (deleteConfirm.giftCard) {
            handleDelete(deleteConfirm.giftCard.id);
          }
        }}
        confirmText="Delete"
        cancelText="Cancel"
        size="md"
      >
        <div className="text-center py-4">
          <p className="text-gray-700 mb-2">{deleteConfirm.message}</p>
          {deleteConfirm.giftCard && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900">
                {deleteConfirm.giftCard.title}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Price: ₹{deleteConfirm.giftCard.price}
              </p>
              <p className="text-sm text-gray-600">
                Expires:{" "}
                {new Date(
                  deleteConfirm.giftCard.expiryDate,
                ).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </Modal>

      {/* Notification Modal for Success/Error Messages */}
      <Modal
        isOpen={notification.isOpen}
        onClose={closeNotification}
        title={notification.title}
        type={notification.type}
        showActions={notification.showActions}
        onConfirm={notification.onConfirm}
        confirmText={notification.confirmText}
        cancelText="Close"
        size="md"
      >
        <div className="text-center py-4">
          <p className="text-gray-700">{notification.message}</p>
          {!notification.showActions && notification.autoClose && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-1">
                <motion.div
                  className="bg-blue-500 h-1 rounded-full"
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 3, ease: "linear" }}
                />
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default EnhancedGiftCardList;
