import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Edit3, Copy, Trash2 } from "lucide-react";

// Update the type to match your API response
interface MerchantProfile {
  businessName: string;
  businessLogo?: string; // This is the logo URL from the API
}

interface Merchant {
  id: string;
  name: string;
  merchantProfile: MerchantProfile;
}

interface GiftCardType {
  id: string;
  title: string;
  price: string;
  expiryDate: string;
  isActive: boolean;
  merchant?: Merchant;
  _count?: {
    purchases: number;
  };
}

interface GiftCardSettings {
  primaryColor: string;
  secondaryColor: string;
  gradientDirection: string;
  fontFamily: string;
}

export interface GiftCardDisplayProps {
  giftCard: GiftCardType;
  settings?: GiftCardSettings;
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  showActions?: boolean;
  clickable?: boolean;
  className?: string;
}

export const GiftCardDisplay: React.FC<GiftCardDisplayProps> = ({
  giftCard,
  settings,
  onEdit,
  onDelete,
  onDuplicate,
  showActions = true,
  clickable = true,
  className = "",
}) => {
  // Use settings if provided, otherwise use default colors
  const cardSettings = settings || {
    primaryColor: "#F54927",
    secondaryColor: "#46368A",
    gradientDirection: "TOP_RIGHT",
    fontFamily: "Inter",
  };

  // Handle card click
  const handleCardClick = () => {
    if (clickable && onEdit) {
      onEdit();
    }
  };

  // Get gradient direction class
  const getGradientDirection = (direction: string) => {
    switch (direction) {
      case "TOP_RIGHT":
        return "to top right";
      case "LEFT_RIGHT":
        return "to left right";
      case "TOP_BOTTOM":
        return "to bottom";
      case "BOTTOM_LEFT":
        return "to bottom left";
      default:
        return "to top right";
    }
  };

  // Construct the full URL for the business logo
  const getLogoUrl = (logoPath?: string) => {
    if (!logoPath) return null;

    // Check if it's already a full URL
    if (logoPath.startsWith("http")) {
      return logoPath;
    }

    // If it's a relative path, construct the full URL using VITE_DOMAIN
    const domain = import.meta.env.VITE_DOMAIN || "";

    // Clean up the domain - remove trailing slash if present
    const cleanDomain = domain.endsWith("/") ? domain.slice(0, -1) : domain;

    // Clean up the logo path - remove leading slash if present
    const cleanLogoPath = logoPath.startsWith("/")
      ? logoPath.slice(1)
      : logoPath;

    return `${cleanDomain}/${cleanLogoPath}`;
  };

  const logoUrl = getLogoUrl(giftCard.merchant?.merchantProfile?.businessLogo);
  const businessName =
    giftCard.merchant?.merchantProfile?.businessName || "Gift Card";

  return (
    <motion.div
      whileHover={clickable ? { scale: 1.03, y: -3 } : {}}
      whileTap={clickable ? { scale: 0.97 } : {}}
      className={`relative ${className}`}
    >
      {/* Card Container */}
      <motion.div
        key={`${cardSettings.primaryColor}-${cardSettings.secondaryColor}-${cardSettings.gradientDirection}-${giftCard.price}`}
        initial={{ rotateY: 0, opacity: 1 }}
        whileHover={clickable ? { rotateY: 5 } : {}}
        className={`relative w-full h-52 ${clickable ? "cursor-pointer" : ""}`}
        style={{ transformStyle: "preserve-3d" }}
        onClick={handleCardClick}
      >
        {/* Main Card */}
        <div
          className="absolute inset-0 rounded-2xl shadow-2xl p-8 flex flex-col justify-between text-white"
          style={{
            background: `linear-gradient(${getGradientDirection(cardSettings.gradientDirection)}, ${cardSettings.primaryColor}, ${cardSettings.secondaryColor})`,
            fontFamily: cardSettings.fontFamily,
          }}
        >
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 rounded-2xl opacity-50 blur-xl"
            style={{
              background: `linear-gradient(to bottom right, ${cardSettings.primaryColor}, ${cardSettings.secondaryColor})`,
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.7, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Content */}
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm overflow-hidden">
                {logoUrl ? (
                  <motion.img
                    src={logoUrl}
                    alt={businessName}
                    className="w-8 h-8 object-contain"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    onError={(e) => {
                      // If image fails to load, show fallback
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                ) : (
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-8 h-8 flex items-center justify-center"
                  >
                    <Sparkles className="w-6 h-6" />
                  </motion.div>
                )}
              </div>

              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-7 h-7" />
              </motion.div>
            </div>
          </div>

          <div className="relative z-10">
            <p className="text-sm opacity-80">Balance</p>
            <motion.p
              key={giftCard.price}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-bold"
            >
              ₹{parseFloat(giftCard.price).toLocaleString()}
            </motion.p>
          </div>

          <div className="relative mt-5 z-10 flex justify-between items-center">
            <div>
              <p className="text-xs opacity-80">
                {businessName} • Thnx Digital
              </p>
              <p className="text-xs text-white">
                Exp: {new Date(giftCard.expiryDate).toLocaleDateString()}
              </p>
            </div>

            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                giftCard.isActive
                  ? "bg-green-500/30 text-green-100"
                  : "bg-red-500/30 text-red-100"
              }`}
            >
              {giftCard.isActive ? "ACTIVE" : "INACTIVE"}
            </span>
          </div>

          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-2xl"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 2,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>

      {/* Card Info Below */}
      <div className="mt-4 px-2">
        {/* Title and purchase count */}
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-gray-900">{giftCard.title}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {giftCard._count?.purchases || 0} purchase
              {giftCard._count?.purchases !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex gap-2 mt-3">
            {onEdit && (
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center gap-2 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Edit3 className="w-4 h-4 text-gray-700" />
                <span className="text-sm font-medium text-gray-700">Edit</span>
              </motion.button>
            )}
            {onDuplicate && (
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate();
                }}
                className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center gap-2 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Copy className="w-4 h-4 text-gray-700" />
                <span className="text-sm font-medium text-gray-700">
                  Duplicate
                </span>
              </motion.button>
            )}
            {onDelete && (
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="flex-1 px-3 py-2 bg-red-50 hover:bg-red-100 rounded-lg flex items-center justify-center gap-2 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Trash2 className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-600">Delete</span>
              </motion.button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
