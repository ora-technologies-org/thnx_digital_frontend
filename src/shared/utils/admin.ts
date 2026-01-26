import { CheckCircle, XCircle, Clock, Users, AlertCircle } from "lucide-react";
import type {
  Merchant,
  GiftCard,
  MerchantSetting,
  StatusCounts,
  StatsData,
  MerchantStatus,
} from "@/features/giftCards/types/giftCard.types";

// ============================================================================
// TYPE DEFINITIONS (Re-export for convenience)
// ============================================================================

export type {
  Merchant,
  GiftCard as Card,
  MerchantSetting as CardSettings,
  StatusCounts,
  StatsData,
  MerchantStatus,
};

export type VerificationStatus =
  | "VERIFIED"
  | "PENDING_VERIFICATION"
  | "REJECTED";

export type PriceFilter = "all" | "low" | "medium" | "high";

// ============================================================================
// STATUS CONFIGURATION
// ============================================================================

export const statusConfig = {
  VERIFIED: {
    bg: "bg-gradient-to-r from-emerald-100 to-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-200",
    icon: CheckCircle,
    label: "Verified",
    gradient: "from-emerald-500 to-green-600",
  },
  PENDING_VERIFICATION: {
    bg: "bg-gradient-to-r from-amber-100 to-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    icon: Clock,
    label: "Pending",
    gradient: "from-amber-500 to-amber-600",
  },
  REJECTED: {
    bg: "bg-gradient-to-r from-rose-100 to-rose-50",
    text: "text-rose-800",
    border: "border-rose-200",
    icon: XCircle,
    label: "Rejected",
    gradient: "from-rose-500 to-red-600",
  },
  INCOMPLETE: {
    bg: "bg-gradient-to-r from-gray-100 to-gray-50",
    text: "text-gray-800",
    border: "border-gray-200",
    icon: AlertCircle,
    label: "Incomplete",
    gradient: "from-gray-500 to-gray-600",
  },
} as const;

// ============================================================================
// STATS CONFIGURATION
// ============================================================================

export const statsConfig = [
  {
    key: "total" as const,
    label: "Total Merchants",
    gradient: "from-purple-500/10 to-indigo-500/10",
    border: "border-purple-200",
    hoverBorder: "hover:border-purple-400",
    textColor: "text-purple-700",
    valueColor: "text-purple-900",
    iconBg: "from-purple-500 to-purple-600",
    icon: Users,
    showPercentage: false,
  },
  {
    key: "verified" as const,
    label: "Verified",
    gradient: "from-emerald-500/10 to-emerald-500/10",
    border: "border-emerald-200",
    hoverBorder: "hover:border-emerald-400",
    textColor: "text-emerald-700",
    valueColor: "text-emerald-900",
    percentColor: "text-emerald-700",
    iconBg: "from-emerald-500 to-emerald-600",
    icon: CheckCircle,
    showPercentage: true,
  },
  {
    key: "pending" as const,
    label: "Pending",
    gradient: "from-amber-500/10 to-amber-500/10",
    border: "border-amber-200",
    hoverBorder: "hover:border-amber-400",
    textColor: "text-amber-700",
    valueColor: "text-amber-900",
    percentColor: "text-amber-700",
    iconBg: "from-amber-500 to-amber-600",
    icon: Clock,
    showPercentage: true,
  },
  {
    key: "rejected" as const,
    label: "Rejected",
    gradient: "from-rose-500/10 to-rose-500/10",
    border: "border-rose-200",
    hoverBorder: "hover:border-rose-400",
    textColor: "text-rose-700",
    valueColor: "text-rose-900",
    percentColor: "text-rose-700",
    iconBg: "from-rose-500 to-rose-600",
    icon: XCircle,
    showPercentage: true,
  },
  {
    key: "incomplete" as const,
    label: "Incomplete",
    gradient: "from-gray-500/10 to-gray-500/10",
    border: "border-gray-200",
    hoverBorder: "hover:border-gray-400",
    textColor: "text-gray-700",
    valueColor: "text-gray-900",
    percentColor: "text-gray-700",
    iconBg: "from-gray-500 to-gray-600",
    icon: AlertCircle,
    showPercentage: true,
  },
] as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculates the number of days until a given expiry date
 * @param expiryDate - The expiry date to calculate from
 * @returns Number of days until expiry (rounded up)
 */
export const calculateDaysUntilExpiry = (expiryDate: string | Date): number => {
  const expiry = new Date(expiryDate);
  const today = new Date();
  return Math.ceil(
    (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
};

/**
 * Formats a date into a localized string
 * @param date - The date to format
 * @param format - Format type: "long" or "short" (default: "long")
 * @returns Formatted date string
 */
export const formatDate = (
  date: string | Date,
  format: "long" | "short" = "long",
): string => {
  const dateObj = new Date(date);

  if (format === "short") {
    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "2-digit",
    });
  }

  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Formats a number as currency in Indian Rupees
 * @param amount - The amount to format
 * @returns Formatted currency string with ₹ symbol
 */
export const formatCurrency = (amount: number | string): string => {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numAmount);
};

/**
 * Gets the display name for a merchant
 * @param merchant - The merchant object
 * @returns Business name, user name, or "Unnamed Merchant"
 */
export const getDisplayName = (merchant: Merchant): string => {
  return merchant?.businessName || merchant?.user?.name || "Unnamed Merchant";
};

/**
 * Gets the first character of a name in uppercase
 * @param name - The name to get initial from
 * @returns First character in uppercase or "?"
 */
export const getInitial = (name: string): string => {
  return name?.charAt(0).toUpperCase() || "?";
};

/**
 * Calculates percentage of value relative to total
 * @param value - The value to calculate percentage for
 * @param total - The total to calculate against
 * @returns Percentage string (e.g., "75%")
 */
export const calculatePercentage = (value: number, total: number): string => {
  if (!total || total === 0) return "0%";
  return `${((value / total) * 100).toFixed(1)}%`;
};

/**
 * Returns default card styling settings
 * @returns Default card settings object
 */
export const getDefaultCardSettings = (): MerchantSetting => ({
  primaryColor: "#8B5CF6",
  secondaryColor: "#6366F1",
  gradientDirection: "TOP_RIGHT",
  fontFamily: "Inter",
});

/**
 * Filters cards array based on price range
 * @param cards - Array of card objects
 * @param priceFilter - Filter type: "all", "low", "medium", or "high"
 * @returns Filtered array of cards
 */
export const filterCardsByPrice = (
  cards: GiftCard[],
  priceFilter: PriceFilter,
): GiftCard[] => {
  if (!cards) return [];
  if (priceFilter === "all") return cards;

  return cards.filter((card: GiftCard) => {
    const price = parseFloat(String(card.price || "0"));
    if (priceFilter === "low") return price < 1000;
    if (priceFilter === "medium") return price >= 1000 && price <= 5000;
    if (priceFilter === "high") return price > 5000;
    return true;
  });
};

/**
 * Generates pagination page numbers with ellipsis for large page counts
 * @param currentPage - The current active page
 * @param totalPages - Total number of pages
 * @returns Array of page numbers and ellipsis strings
 */
export const getPaginationNumbers = (
  currentPage: number,
  totalPages: number,
): (number | string)[] => {
  const pages: (number | string)[] = [];
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

/**
 * Aggregates merchant status counts into a stats object
 * @param statusCounts - Object containing status count properties
 * @param total - Total merchant count
 * @returns Stats object with total, verified, pending, rejected, and incomplete counts
 */
export const getStatsData = (
  statusCounts: StatusCounts,
  total?: number,
): StatsData => {
  return {
    total: total || 0,
    verified: statusCounts?.VERIFIED || 0,
    pending: statusCounts?.PENDING_VERIFICATION || 0,
    rejected: statusCounts?.REJECTED || 0,
    incomplete: statusCounts?.INCOMPLETE || 0,
  };
};
