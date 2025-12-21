// src/features/giftCards/components/GiftCardListItem.tsx
import React from "react";
import { motion } from "framer-motion";
import { Gift, Edit3, Copy, Trash2 } from "lucide-react";
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
    primaryColor: "#F54927",
    secondaryColor: "#46368A",
    gradientDirection: "TOP_RIGHT",
    fontFamily: "Inter",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-4">
        {/* Color Indicator */}
        <div
          className="w-4 h-12 rounded-lg"
          style={{
            background: `linear-gradient(to bottom, ${cardSettings.primaryColor}, ${cardSettings.secondaryColor})`,
          }}
        />

        {/* Card Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-gray-900 truncate">
              {giftCard.title}
            </h3>
            <span
              className={`px-2 py-0.5 rounded text-xs font-medium ${
                giftCard.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {giftCard.isActive ? "Active" : "Inactive"}
            </span>
          </div>
          {giftCard.description && (
            <p className="text-sm text-gray-600 truncate mt-1">
              {giftCard.description}
            </p>
          )}
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Gift className="w-3 h-3" />₹
              {parseFloat(giftCard.price).toLocaleString()}
            </span>
            <span>•</span>
            <span>
              Expires: {new Date(giftCard.expiryDate).toLocaleDateString()}
            </span>
            <span>•</span>
            <span>{giftCard._count?.purchases || 0} purchases</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}
          {onDuplicate && (
            <button
              onClick={onDuplicate}
              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              title="Duplicate"
            >
              <Copy className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
