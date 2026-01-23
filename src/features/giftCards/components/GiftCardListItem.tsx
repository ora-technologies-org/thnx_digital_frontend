// src/features/giftCards/components/GiftCardListItem.tsx
import React from "react";
import { motion } from "framer-motion";
import {
  Gift,
  Edit3,
  Copy,
  Trash2,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  ShoppingBag,
} from "lucide-react";
import type { GiftCard as GiftCardType } from "../types/giftCard.types";
import type { GiftCardSettings } from "@/features/merchant/slices/giftCardSlice";

export interface GiftCardListItemProps {
  giftCard: GiftCardType;
  settings?: GiftCardSettings;
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
}

export const GiftCardListItem: React.FC<GiftCardListItemProps> = ({
  giftCard,
  settings,
  onEdit,
  onDelete,
  onDuplicate,
}) => {
  const cardSettings = settings || {
    primaryColor: "#3B82F6",
    secondaryColor: "#8B5CF6",
    gradientDirection: "to right",
    fontFamily: "Inter",
  };

  // Calculate expiry status
  const expiryDate = new Date(giftCard.expiryDate);
  const now = new Date();
  const daysUntilExpiry = Math.ceil(
    (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );
  const isExpired = daysUntilExpiry < 0;
  const isExpiringSoon = daysUntilExpiry > 0 && daysUntilExpiry <= 30;

  // Add state to track image loading
  const [imageError, setImageError] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  // Get the logo URL - try multiple sources
  const getLogoUrl = () => {
    // Try imageUrl first (if it exists in future)
    if (giftCard.imageUrl) {
      return giftCard.imageUrl;
    }

    // Try merchant business logo
    if (giftCard.merchant?.merchantProfile?.businessLogo) {
      const logo = giftCard.merchant.merchantProfile.businessLogo;

      // Debug: log the raw logo path
      console.log("🔍 Raw logo path:", logo);

      // Check if it's already a full URL
      if (logo.startsWith("http://") || logo.startsWith("https://")) {
        return logo;
      }

      // Construct URL properly
      const baseUrl =
        import.meta.env.VITE_API_BASE_URL ||
        import.meta.env.VITE_DOMAIN ||
        window.location.origin;

      console.log("🔍 Base URL:", baseUrl);

      // Remove trailing slash from baseUrl if present
      const cleanBaseUrl = baseUrl.endsWith("/")
        ? baseUrl.slice(0, -1)
        : baseUrl;

      // Remove leading slash from logo path if present
      const cleanLogoPath = logo.startsWith("/") ? logo.slice(1) : logo;

      const finalUrl = `${cleanBaseUrl}/${cleanLogoPath}`;
      console.log("🔍 Final URL:", finalUrl);

      return finalUrl;
    }

    return null;
  };
  const logoUrl = getLogoUrl();

  React.useEffect(() => {
    setImageError(false);
    setImageLoaded(false);

    if (logoUrl) {
      console.log("🖼️ Logo URL for testing:", logoUrl);

      // Instead of HEAD request, just log it
      console.log("✅ Logo URL constructed:", logoUrl);

      // Test with Image object instead
      const img = new Image();
      img.onload = () => {
        console.log("✅ Image can be loaded:", logoUrl);
      };
      img.onerror = () => {
        console.error("❌ Image cannot be loaded:", logoUrl);
      };
      img.src = logoUrl;
    }
  }, [logoUrl]);

  // Get status display
  const getStatusDisplay = () => {
    if (isExpired) {
      return {
        icon: XCircle,
        color: "text-red-600 bg-red-50 border-red-200",
        text: "Expired",
        badgeColor: "bg-red-100 text-red-800 border-red-200",
      };
    }
    if (isExpiringSoon) {
      return {
        icon: AlertCircle,
        color: "text-orange-600 bg-orange-50 border-orange-200",
        text: "Expiring Soon",
        badgeColor: "bg-orange-100 text-orange-800 border-orange-200",
      };
    }
    if (giftCard.isActive) {
      return {
        icon: CheckCircle,
        color: "text-green-600 bg-green-50 border-green-200",
        text: "Active",
        badgeColor: "bg-green-100 text-green-800 border-green-200",
      };
    }
    return {
      icon: XCircle,
      color: "text-gray-600 bg-gray-50 border-gray-200",
      text: "Inactive",
      badgeColor: "bg-gray-100 text-gray-800 border-gray-200",
    };
  };

  const statusDisplay = getStatusDisplay();
  const StatusIcon = statusDisplay.icon;

  // Determine what to show
  const shouldShowImage = logoUrl && !imageError;
  const shouldShowPlaceholder = !logoUrl || imageError;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ y: -2 }}
      className=" rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row items-stretch">
        {/* Visual Preview Section with Image/Logo */}
        <div className="sm:w-48 flex-shrink-0 relative">
          <div
            className="h-full min-h-[140px] sm:min-h-full flex items-center justify-center p-6 relative overflow-hidden"
            style={{
              background: `linear-gradient(${cardSettings.gradientDirection || "to bottom right"}, ${cardSettings.primaryColor || "#3B82F6"}, ${cardSettings.secondaryColor || "#8B5CF6"})`,
            }}
          >
            {/* Logo/Image */}
            {shouldShowImage ? (
              <div className="relative">
                <img
                  src={logoUrl}
                  alt={
                    giftCard.merchant?.merchantProfile?.businessName ||
                    giftCard.title
                  }
                  className={`w-20 h-20 object-contain rounded-lg bg-white/20 backdrop-blur-sm p-2 shadow-lg transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                  onError={() => {
                    console.error("❌ Image failed to load:", logoUrl);
                    setImageError(true);
                  }}
                  onLoad={() => {
                    console.log("✅ Image loaded successfully:", logoUrl);
                    setImageLoaded(true);
                  }}
                />
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/30">
                      <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            {shouldShowPlaceholder && (
              <div className="flex items-center justify-center">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/30">
                  <Gift className="w-10 h-10 text-white" />
                </div>
              </div>
            )}

            {/* Decorative Elements */}
            <div className="absolute top-2 right-2 w-16 h-16 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-2 left-2 w-20 h-20 bg-white/10 rounded-full blur-3xl" />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-5">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 truncate mb-1">
                  {giftCard.title}
                </h3>
                {giftCard.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {giftCard.description}
                  </p>
                )}
              </div>

              {/* Status Badge */}
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap ${statusDisplay.badgeColor}`}
              >
                <StatusIcon className="w-3.5 h-3.5" />
                {statusDisplay.text}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {/* Price */}
              <div className="flex items-center gap-2 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-3 border border-blue-200">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Gift className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-blue-700 font-medium">Price</p>
                  <p className="text-sm font-bold text-blue-900 truncate">
                    ₹{parseFloat(giftCard.price).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Expiry */}
              <div
                className={`flex items-center gap-2 rounded-lg p-3 border ${
                  isExpired
                    ? "bg-gradient-to-br from-red-50 to-red-100/50 border-red-200"
                    : isExpiringSoon
                      ? "bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200"
                      : "bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isExpired
                      ? "bg-red-500"
                      : isExpiringSoon
                        ? "bg-orange-500"
                        : "bg-purple-500"
                  }`}
                >
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <p
                    className={`text-xs font-medium ${
                      isExpired
                        ? "text-red-700"
                        : isExpiringSoon
                          ? "text-orange-700"
                          : "text-purple-700"
                    }`}
                  >
                    {isExpired ? "Expired" : "Expires"}
                  </p>
                  <p
                    className={`text-xs font-bold truncate ${
                      isExpired
                        ? "text-red-900"
                        : isExpiringSoon
                          ? "text-orange-900"
                          : "text-purple-900"
                    }`}
                  >
                    {isExpired
                      ? `${Math.abs(daysUntilExpiry)}d ago`
                      : daysUntilExpiry <= 30
                        ? `${daysUntilExpiry}d left`
                        : new Date(giftCard.expiryDate).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" },
                          )}
                  </p>
                </div>
              </div>

              {/* Purchases */}
              <div className="flex items-center gap-2 bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg p-3 border border-green-200">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-green-700 font-medium">Sales</p>
                  <p className="text-sm font-bold text-green-900 truncate">
                    {giftCard._count?.purchases || 0}
                  </p>
                </div>
              </div>

              {/* Created Date */}
              <div className="flex items-center gap-2 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg p-3 border border-gray-200">
                <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-700 font-medium">Created</p>
                  <p className="text-xs font-bold text-gray-900 truncate">
                    {new Date(giftCard.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-auto pt-3 border-t border-gray-100">
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors font-medium text-sm border border-blue-200"
                  title="Edit"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>
              )}
              {onDuplicate && (
                <button
                  onClick={onDuplicate}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg transition-colors font-medium text-sm border border-purple-200"
                  title="Duplicate"
                >
                  <Copy className="w-4 h-4" />
                  Duplicate
                </button>
              )}
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg transition-colors font-medium text-sm border border-red-200"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
