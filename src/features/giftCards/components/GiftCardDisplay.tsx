import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Edit3, Copy, Trash2 } from "lucide-react";
import { RootState } from "@/app/store";
import { useAppSelector } from "@/app/hooks";
import {
  GiftCardDisplayProps,
  GiftCardDisplaySettings,
  MerchantSetting,
} from "../types/giftCard.types";
import { getGradientDirectionCSS } from "@/shared/utils/giftcard";
import { GradientDirection } from "@/shared/types/giftCard.types";

export const GiftCardDisplay: React.FC<GiftCardDisplayProps> = ({
  giftCard,
  settings: propSettings,
  onEdit,
  onDelete,
  onDuplicate,
  showActions = true,
  clickable = true,
  className = "",
}) => {
  // ✅ Get settings from Redux store
  const reduxSettings = useAppSelector(
    (state: RootState) => state.giftCardSettings.settings,
  );

  const getCardSettings = (
    propSettings: GiftCardDisplaySettings | MerchantSetting | undefined,
    reduxSettings: MerchantSetting,
  ): GiftCardDisplaySettings => {
    return {
      primaryColor:
        propSettings?.primaryColor ?? reduxSettings.primaryColor ?? "#000000", // fallback
      secondaryColor:
        propSettings?.secondaryColor ??
        reduxSettings.secondaryColor ??
        "#FFFFFF",
      gradientDirection: (propSettings?.gradientDirection ??
        reduxSettings.gradientDirection) as GradientDirection,
      fontFamily:
        propSettings?.fontFamily ?? reduxSettings.fontFamily ?? "inherit",
    };
  };

  const cardSettings = getCardSettings(propSettings, reduxSettings);

  const handleCardClick = () => {
    if (clickable && onEdit) {
      onEdit();
    }
  };

  const getLogoUrl = (logoPath?: string) => {
    if (!logoPath) return null;

    if (logoPath.startsWith("http")) {
      return logoPath;
    }

    const domain = import.meta.env.VITE_DOMAIN || "";
    const cleanDomain = domain.endsWith("/") ? domain.slice(0, -1) : domain;
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
      {/* Card Container - Responsive height */}
      <motion.div
        key={`${cardSettings.primaryColor}-${cardSettings.secondaryColor}-${cardSettings.gradientDirection}-${giftCard.price}`}
        initial={{ rotateY: 0, opacity: 1 }}
        whileHover={clickable ? { rotateY: 5 } : {}}
        className={`relative w-full h-48 sm:h-52 md:h-56 lg:h-52 ${clickable ? "cursor-pointer" : ""}`}
        style={{ transformStyle: "preserve-3d" }}
        onClick={handleCardClick}
      >
        {/* Main Card */}
        <div
          className="relative rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 flex flex-col justify-between text-white overflow-hidden"
          style={{
            background: `linear-gradient(
  ${getGradientDirectionCSS(cardSettings.gradientDirection ?? "TOP_RIGHT")},
  ${cardSettings.primaryColor},
  ${cardSettings.secondaryColor}
)`,
            fontFamily: cardSettings.fontFamily,
          }}
        >
          {/* Subtle glow behind the card */}
          <div
            className="absolute -inset-1 rounded-xl sm:rounded-2xl opacity-75 blur-2xl -z-10"
            style={{
              background: `linear-gradient(
  ${getGradientDirectionCSS(cardSettings.gradientDirection ?? "TOP_RIGHT")},
  ${cardSettings.primaryColor},
  ${cardSettings.secondaryColor}
)`,
            }}
          />

          {/* Content - Responsive */}
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center overflow-hidden">
                {logoUrl ? (
                  <motion.img
                    src={logoUrl}
                    alt={businessName}
                    className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                ) : (
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center"
                  >
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                  </motion.div>
                )}
              </div>

              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-6 h-6 sm:w-7 sm:h-7" />
              </motion.div>
            </div>
          </div>

          <div className="relative z-10">
            <p className="text-xs sm:text-sm opacity-90 font-medium">Balance</p>
            <motion.p
              key={giftCard.price}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-4xl font-bold"
            >
              ₹{giftCard.price.toLocaleString()}
            </motion.p>
          </div>

          <div className="relative mt-2 sm:mt-5 z-10 flex justify-between items-center gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm opacity-90 font-medium truncate">
                {giftCard.title} • Thnx Digital
              </p>
              <p className="text-xs text-white/90 mt-0.5">
                Exp: {new Date(giftCard.expiryDate).toLocaleDateString()}
              </p>
            </div>

            <span
              className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap flex-shrink-0 ${
                giftCard.isActive
                  ? "bg-green-400/30 text-green-50 border border-green-300/50"
                  : "bg-red-400/30 text-red-50 border border-red-300/50"
              }`}
            >
              {giftCard.isActive ? "ACTIVE" : "INACTIVE"}
            </span>
          </div>

          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-xl sm:rounded-2xl pointer-events-none"
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

      {/* Card Info Below - Responsive */}
      <div className="mt-3 sm:mt-4 px-1 sm:px-2">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 min-w-0 pt-6 pr-2">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
              {giftCard.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              {giftCard._count?.purchases || 0} purchase
              {giftCard._count?.purchases !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Action Buttons - Responsive */}
        {showActions && (
          <div className="flex gap-1.5 sm:gap-2 mt-3">
            {onEdit && (
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="flex-1 px-2 sm:px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center gap-1 sm:gap-2 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">
                  Edit
                </span>
              </motion.button>
            )}
            {onDuplicate && (
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate();
                }}
                className="flex-1 px-2 sm:px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center gap-1 sm:gap-2 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700" />
                <span className="text-xs sm:text-sm font-medium text-gray-700 hidden sm:inline">
                  Duplicate
                </span>
                <span className="text-xs font-medium text-gray-700 sm:hidden">
                  Copy
                </span>
              </motion.button>
            )}
            {onDelete && (
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="flex-1 px-2 sm:px-3 py-2 bg-red-50 hover:bg-red-100 rounded-lg flex items-center justify-center gap-1 sm:gap-2 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" />
                <span className="text-xs sm:text-sm font-medium text-red-600">
                  Delete
                </span>
              </motion.button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
