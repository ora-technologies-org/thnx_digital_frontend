// src/components/admin/MerchantCard.tsx - PROFESSIONAL MERCHANT CARD! 💼✨

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Calendar,
  Globe,
  ShieldX,
  Clock,
  ExternalLink,
  AlertTriangle,
  Building2,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "../../shared/components/ui/Card";
import { Badge } from "../../shared/components/ui/Badge";
import { Button } from "../../shared/components/ui/Button";
import type { MerchantUser } from "../../features/admin/api/admin.api";
import { useDeleteMerchant } from "../../features/admin/hooks/useAdmin";

interface MerchantCardProps {
  merchant: MerchantUser;
  index: number;
  onViewDetails?: (merchant: MerchantUser) => void;
  onEdit?: (merchant: MerchantUser) => void;
}

export const MerchantCard: React.FC<MerchantCardProps> = ({
  merchant,
  index,
  onViewDetails,
  onEdit,
}) => {
  const [showActions, setShowActions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [hardDelete, setHardDelete] = useState(false);

  const deleteMutation = useDeleteMerchant();

  // Status configuration with gradients
  const getStatusConfig = () => {
    switch (merchant.profileStatus) {
      case "VERIFIED":
        return {
          label: "Verified",
          icon: CheckCircle,
          bgBadge: "bg-emerald-100",
          textBadge: "text-emerald-700",
          borderBadge: "border-emerald-200",
          gradient: "from-emerald-500 to-teal-500",
          avatarBg: "from-emerald-500 to-teal-600",
          glow: "shadow-emerald-500/20",
        };
      case "REJECTED":
        return {
          label: "Rejected",
          icon: XCircle,
          bgBadge: "bg-red-100",
          textBadge: "text-red-700",
          borderBadge: "border-red-200",
          gradient: "from-red-500 to-rose-500",
          avatarBg: "from-red-500 to-rose-600",
          glow: "shadow-red-500/20",
        };
      case "PENDING_VERIFICATION":
        return {
          label: "Pending",
          icon: Clock,
          bgBadge: "bg-amber-100",
          textBadge: "text-amber-700",
          borderBadge: "border-amber-200",
          gradient: "from-amber-500 to-orange-500",
          avatarBg: "from-amber-500 to-orange-600",
          glow: "shadow-amber-500/20",
        };
      default:
        return {
          label: "Incomplete",
          icon: AlertTriangle,
          bgBadge: "bg-slate-100",
          textBadge: "text-slate-600",
          borderBadge: "border-slate-200",
          gradient: "from-slate-400 to-slate-500",
          avatarBg: "from-slate-400 to-slate-600",
          glow: "shadow-slate-500/20",
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync({
        merchantId: merchant.userId,
        hardDelete,
      });
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Failed to delete merchant:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          delay: index * 0.05,
          duration: 0.4,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="h-full group"
      >
        <Card
          className={`h-full bg-white border-0 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl ${statusConfig.glow} transition-all duration-300`}
        >
          {/* Gradient Status Bar */}
          <div className={`h-1.5 bg-gradient-to-r ${statusConfig.gradient}`} />

          <CardContent className="p-0">
            {/* Header Section */}
            <div className="p-5 pb-4">
              <div className="flex items-start justify-between gap-3">
                {/* Avatar & Info */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Avatar with Gradient */}
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    className="relative flex-shrink-0"
                  >
                    <div
                      className={`w-14 h-14 bg-gradient-to-br ${statusConfig.avatarBg} rounded-xl flex items-center justify-center shadow-lg overflow-hidden`}
                    >
                      {merchant.logo ? (
                        <img
                          src={merchant.logo}
                          alt={merchant.businessName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-bold text-lg">
                          {merchant.businessName.substring(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                    {/* Active Indicator */}
                    {merchant.user.isActive && merchant.isVerified && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow-md"
                      >
                        <Sparkles className="w-3 h-3 text-white" />
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Text Info */}
                  <div className="flex-1 min-w-0 pt-1">
                    <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                      {merchant.businessName}
                    </h3>
                    <p className="text-sm text-gray-500 truncate mt-0.5">
                      {merchant.user.name}
                    </p>
                  </div>
                </div>

                {/* Actions Dropdown */}
                <div className="relative flex-shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowActions(!showActions)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </motion.button>

                  <AnimatePresence>
                    {showActions && (
                      <>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 z-10"
                          onClick={() => setShowActions(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-20 overflow-hidden"
                        >
                          <button
                            onClick={() => {
                              onViewDetails?.(merchant);
                              setShowActions(false);
                            }}
                            className="w-full px-4 py-2.5 text-left hover:bg-blue-50 flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors"
                          >
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Eye className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="font-medium text-sm">
                              View Details
                            </span>
                          </button>

                          {/* Conditional Edit Button */}
                          {merchant.profileStatus === "VERIFIED" ? (
                            <button
                              onClick={() => {
                                if (onEdit) {
                                  onEdit(merchant);
                                }
                                setShowActions(false);
                              }}
                              className="w-full px-4 py-2.5 text-left hover:bg-purple-50 flex items-center gap-3 text-gray-700 hover:text-purple-600 transition-colors"
                            >
                              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Edit className="w-4 h-4 text-purple-600" />
                              </div>
                              <span className="font-medium text-sm">Edit</span>
                            </button>
                          ) : (
                            <div className="w-full px-4 py-2.5 text-left flex items-center gap-3 text-gray-400 cursor-not-allowed">
                              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                <Edit className="w-4 h-4 text-gray-400" />
                              </div>
                              <span className="font-medium text-sm">
                                Edit (Not Verified)
                              </span>
                            </div>
                          )}

                          <div className="h-px bg-gray-100 my-2 mx-4" />
                          <button
                            onClick={() => {
                              setShowDeleteModal(true);
                              setShowActions(false);
                            }}
                            className="w-full px-4 py-2.5 text-left hover:bg-red-50 flex items-center gap-3 text-red-600 transition-colors"
                          >
                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </div>
                            <span className="font-medium text-sm">Delete</span>
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-2 mt-4 flex-wrap">
                <Badge
                  className={`${statusConfig.bgBadge} ${statusConfig.textBadge} border ${statusConfig.borderBadge} text-xs font-semibold px-2.5 py-1 rounded-lg`}
                >
                  <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
                  {statusConfig.label}
                </Badge>
                {merchant.businessCategory && (
                  <Badge className="bg-blue-50 text-blue-600 border border-blue-100 text-xs font-medium px-2.5 py-1 rounded-lg">
                    <Building2 className="w-3 h-3 mr-1" />
                    {merchant.businessCategory}
                  </Badge>
                )}
              </div>
            </div>

            {/* Contact Details with Colorful Icons */}
            <div className="px-5 pb-4 space-y-3">
              {merchant.businessEmail && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-600 truncate">
                    {merchant.businessEmail}
                  </span>
                </div>
              )}
              {merchant.businessPhone && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-600">
                    {merchant.businessPhone}
                  </span>
                </div>
              )}
              {(merchant.city || merchant.state) && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-sm text-gray-600 truncate">
                    {[merchant.city, merchant.state, merchant.country]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-5" />

            {/* Footer Meta */}
            <div className="px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center">
                  <Calendar className="w-3.5 h-3.5 text-gray-500" />
                </div>
                <span>Joined {formatDate(merchant.createdAt)}</span>
              </div>
              {merchant.website && (
                <a
                  href={merchant.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Website</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {/* Action Buttons */}
            <div className="p-5 pt-3 flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onViewDetails?.(merchant)}
                className={`flex-1 px-4 py-2.5 bg-gradient-to-r ${statusConfig.avatarBg} hover:opacity-90 text-white text-sm font-semibold rounded-xl transition-all shadow-lg ${statusConfig.glow}`}
              >
                View Profile
              </motion.button>
              {/* <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-colors"
              >
                <Mail className="w-4 h-4" />
              </motion.button> */}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="p-6 pb-4 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.1 }}
                  className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-red-500/30"
                >
                  <Trash2 className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mt-5">
                  Delete Merchant
                </h3>
                <p className="text-gray-500 mt-2">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-gray-700">
                    {merchant.businessName}
                  </span>
                  ?
                </p>
              </div>

              {/* Delete Options */}
              <div className="px-6 space-y-3">
                {/* Soft Delete Option */}
                <motion.label
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    !hardDelete
                      ? "border-amber-500 bg-amber-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    checked={!hardDelete}
                    onChange={() => setHardDelete(false)}
                    className="mt-1 w-4 h-4 accent-amber-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                        <ShieldX className="w-4 h-4 text-amber-600" />
                      </div>
                      <span className="font-semibold text-gray-900">
                        Deactivate
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2 ml-10">
                      Soft delete — merchant can be reactivated later
                    </p>
                  </div>
                </motion.label>

                {/* Hard Delete Option */}
                <motion.label
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    hardDelete
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    checked={hardDelete}
                    onChange={() => setHardDelete(true)}
                    className="mt-1 w-4 h-4 accent-red-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      </div>
                      <span className="font-semibold text-gray-900">
                        Permanent Delete
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2 ml-10">
                      This action cannot be undone. All data will be lost.
                    </p>
                  </div>
                </motion.label>

                {/* Warning Message */}
                <AnimatePresence>
                  {hardDelete && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-red-800">
                            Warning
                          </p>
                          <p className="text-xs text-red-700 mt-1">
                            This will permanently delete the merchant account,
                            profile, and all associated data. This action cannot
                            be reversed.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Modal Footer */}
              <div className="p-6 flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 border-2 border-gray-200 text-gray-700 hover:bg-gray-50 py-2.5 rounded-xl font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className={`flex-1 text-white py-2.5 rounded-xl font-semibold shadow-lg ${
                    hardDelete
                      ? "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-red-500/30"
                      : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-amber-500/30"
                  }`}
                >
                  {deleteMutation.isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Deleting...
                    </span>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      {hardDelete ? "Delete Permanently" : "Deactivate"}
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MerchantCard;
