import { CheckCircle, XCircle, Clock, Users } from "lucide-react";

// Status Configuration
export const statusConfig = {
  VERIFIED: {
    bg: "from-emerald-100 to-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-200",
    icon: CheckCircle,
    label: "Verified",
    gradient: "from-emerald-500 to-green-600",
  },
  PENDING_VERIFICATION: {
    bg: "from-amber-100 to-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    icon: Clock,
    label: "Pending",
    gradient: "from-amber-500 to-amber-600",
  },
  REJECTED: {
    bg: "from-rose-100 to-rose-50",
    text: "text-rose-800",
    border: "border-rose-200",
    icon: XCircle,
    label: "Rejected",
    gradient: "from-rose-500 to-red-600",
  },
};

// Stats Configuration
export const statsConfig = [
  {
    key: "total",
    label: "Total Merchants",
    gradient: "from-blue-50 to-indigo-100",
    border: "border-blue-200",
    hoverBorder: "hover:border-blue-300",
    textColor: "text-blue-600",
    valueColor: "text-blue-900",
    iconBg: "from-blue-500 to-blue-600",
    icon: Users,
    showPercentage: false,
  },
  {
    key: "verified",
    label: "Verified",
    gradient: "from-emerald-50 to-teal-100",
    border: "border-emerald-200",
    hoverBorder: "hover:border-emerald-300",
    textColor: "text-emerald-600",
    valueColor: "text-emerald-900",
    percentColor: "text-emerald-700",
    iconBg: "from-emerald-500 to-emerald-600",
    icon: CheckCircle,
    showPercentage: true,
  },
  {
    key: "pending",
    label: "Pending",
    gradient: "from-amber-50 to-orange-100",
    border: "border-amber-200",
    hoverBorder: "hover:border-amber-300",
    textColor: "text-amber-600",
    valueColor: "text-amber-900",
    percentColor: "text-amber-700",
    iconBg: "from-amber-500 to-amber-600",
    icon: Clock,
    showPercentage: true,
  },
  {
    key: "rejected",
    label: "Rejected",
    gradient: "from-rose-50 to-red-100",
    border: "border-rose-200",
    hoverBorder: "hover:border-rose-300",
    textColor: "text-rose-600",
    valueColor: "text-rose-900",
    percentColor: "text-rose-700",
    iconBg: "from-rose-500 to-rose-600",
    icon: XCircle,
    showPercentage: true,
  },
];

/// Utility Functions

/**
 * Calculates the number of days until a given expiry date
 * @param {string | Date} expiryDate - The expiry date to calculate from
 * @returns {number} Number of days until expiry (rounded up)
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
 * @param {string | Date} date - The date to format
 * @param {string} format - Format type: "long" or "short" (default: "long")
 * @returns {string} Formatted date string
 */
export const formatDate = (
  date: string | Date,
  format: string = "long",
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
 * @param {number | string} amount - The amount to format
 * @returns {string} Formatted currency string with ₹ symbol
 */
export const formatCurrency = (amount: number | string): string => {
  return `₹${parseFloat(amount.toString()).toLocaleString()}`;
};

/**
 * Gets the display name for a merchant
 * @param {Merchant} merchant - The merchant object
 * @returns {string} Business name, user name, or "Unnamed Merchant"
 */
export const getDisplayName = (merchant: Merchant): string => {
  return merchant?.businessName || merchant?.user?.name || "Unnamed Merchant";
};

/**
 * Gets the first character of a name in uppercase
 * @param {string} name - The name to get initial from
 * @returns {string} First character in uppercase or "?"
 */
export const getInitial = (name: string): string => {
  return name?.charAt(0).toUpperCase() || "?";
};

/**
 * Calculates percentage of value relative to total
 * @param {number} value - The value to calculate percentage for
 * @param {number} total - The total to calculate against
 * @returns {string} Percentage string (e.g., "75%")
 */
export const calculatePercentage = (value: number, total: number): string => {
  if (!total || total === 0) return "0%";
  return `${Math.round((value / total) * 100)}%`;
};

/**
 * Returns default card styling settings
 * @returns {CardSettings} Default card settings object
 */
export const getDefaultCardSettings = (): CardSettings => ({
  primaryColor: "#8B5CF6",
  secondaryColor: "#6366F1",
  gradientDirection: "TOP_RIGHT",
  fontFamily: "Inter",
});

/**
 * Filters cards array based on price range
 * @param {Card[]} cards - Array of card objects
 * @param {PriceFilter} priceFilter - Filter type: "all", "low", "medium", or "high"
 * @returns {Card[]} Filtered array of cards
 */
export const filterCardsByPrice = (
  cards: Card[],
  priceFilter: PriceFilter,
): Card[] => {
  if (!cards) return [];
  if (priceFilter === "all") return cards;

  return cards.filter((card: Card) => {
    const price = parseFloat(String(card.price || "0"));
    if (priceFilter === "low") return price < 1000;
    if (priceFilter === "medium") return price >= 1000 && price <= 5000;
    if (priceFilter === "high") return price > 5000;
    return true;
  });
};

/**
 * Generates pagination page numbers with ellipsis for large page counts
 * @param {number} currentPage - The current active page
 * @param {number} totalPages - Total number of pages
 * @returns {(number | string)[]} Array of page numbers and ellipsis strings
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
 * @param {StatusCounts} statusCounts - Object containing status count properties
 * @param {number} total - Total merchant count
 * @returns {StatsData} Stats object with total, verified, pending, rejected, and incomplete counts
 */
export const getStatsData = (
  statusCounts: StatusCounts,
  total: number,
): StatsData => {
  return {
    total: total || 0,
    verified: statusCounts?.VERIFIED || 0,
    pending: statusCounts?.PENDING_VERIFICATION || 0,
    rejected: statusCounts?.REJECTED || 0,
    incomplete: statusCounts?.INCOMPLETE || 0,
  };
};
