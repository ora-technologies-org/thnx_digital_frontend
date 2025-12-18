// src/pages/admin/AllMerchantsPage.tsx - ENHANCED ALL MERCHANTS PAGE! 👥✨
import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  Building,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  SortAsc,
  RefreshCw,
  X,
  Mail,
  Phone,
  Globe,
  MapPin,
  FileText,
  Banknote,
  Calendar,
  User,
  Shield,
  AlertCircle,
  AlertTriangle,
  Edit2,
  Download,
  Send,
  TrendingUp,
} from "lucide-react";
import { AdminLayout } from "../../shared/components/layout/AdminLayout";
import { Card, CardContent } from "../../shared/components/ui/Card";
import { Button } from "../../shared/components/ui/Button";
import { useAllMerchants } from "../../features/admin/hooks/useAdmin";
import { MerchantUser } from "../../features/admin/api/admin.api";
import MerchantCard from "../merchant/MerchantCard";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateFormData } from "@/features/admin/slices/MerchantCreateSlice";
import { AppDispatch } from "@/app/store";
import DocumentPreviewCard from "@/shared/components/modals/DocumentPreviewCard";

// Types for filters
type FilterStatus = "all" | "verified" | "pending" | "rejected" | "incomplete";
type SortBy = "date" | "name" | "status";

// Merchant Details Modal Component - ENHANCED UI
const MerchantDetailsModal: React.FC<{
  merchant: MerchantUser | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (merchant: MerchantUser) => void;
}> = ({ merchant, isOpen, onClose, onEdit }) => {
  if (!merchant || !isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return "bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-800 border-emerald-200";
      case "PENDING_VERIFICATION":
        return "bg-gradient-to-r from-amber-100 to-amber-50 text-amber-800 border-amber-200";
      case "REJECTED":
        return "bg-gradient-to-r from-rose-100 to-rose-50 text-rose-800 border-rose-200";
      case "INCOMPLETE":
        return "bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 border-gray-200";
      default:
        return "bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return <CheckCircle className="w-4 h-4" />;
      case "PENDING_VERIFICATION":
        return <Clock className="w-4 h-4" />;
      case "REJECTED":
        return <XCircle className="w-4 h-4" />;
      case "INCOMPLETE":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const isVerified = merchant.profileStatus === "VERIFIED";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Enhanced Header with Gradient */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 border-4 border-white"
              >
                {merchant.logo ? (
                  <img
                    src={merchant.logo}
                    alt={merchant.businessName}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <Building className="w-8 h-8 text-white" />
                )}
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {merchant.businessName}
                </h2>
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <span
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold border flex items-center gap-1.5 ${getStatusColor(merchant.profileStatus)} shadow-sm`}
                  >
                    {getStatusIcon(merchant.profileStatus)}
                    {merchant.profileStatus.replace("_", " ")}
                  </span>
                  {merchant.isVerified && (
                    <span className="px-3 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5 shadow-sm">
                      <Shield className="w-3.5 h-3.5" />
                      Verified Merchant
                    </span>
                  )}
                  <span
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm ${
                      merchant.user.isActive
                        ? "bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-gradient-to-r from-rose-100 to-rose-50 text-rose-800 border border-rose-200"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mr-1.5 ${merchant.user.isActive ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}
                    />
                    {merchant.user.isActive
                      ? "Active Account"
                      : "Inactive Account"}
                  </span>
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2.5 bg-white hover:bg-gray-50 rounded-xl transition-all duration-200 border border-gray-200 shadow-sm"
            >
              <X className="w-5 h-5 text-gray-600" />
            </motion.button>
          </div>
        </div>

        {/* Enhanced Content with Better Layout */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Basic Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Business Information Card */}
              <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <Building className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          Business Information
                        </h3>
                        <p className="text-sm text-gray-500">
                          Company details and structure
                        </p>
                      </div>
                    </div>
                    {isVerified && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onEdit(merchant)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-600 rounded-xl transition-all flex items-center gap-2 text-sm font-semibold border border-blue-200"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </motion.button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3.5 bg-gradient-to-r from-blue-50/50 to-blue-100/30 rounded-xl border border-blue-100">
                      <p className="text-xs text-blue-600 font-semibold mb-1.5">
                        Business Name
                      </p>
                      <p className="font-bold text-gray-900">
                        {merchant.businessName}
                      </p>
                    </div>
                    <div className="p-3.5 bg-gradient-to-r from-blue-50/50 to-blue-100/30 rounded-xl border border-blue-100">
                      <p className="text-xs text-blue-600 font-semibold mb-1.5">
                        Registration Number
                      </p>
                      <p className="font-bold text-gray-900">
                        {merchant.businessRegistrationNumber || "Not provided"}
                      </p>
                    </div>
                    <div className="p-3.5 bg-gradient-to-r from-amber-50/50 to-amber-100/30 rounded-xl border border-amber-100">
                      <p className="text-xs text-amber-600 font-semibold mb-1.5">
                        Tax ID
                      </p>
                      <p className="font-bold text-gray-900">
                        {merchant.taxId || "Not provided"}
                      </p>
                    </div>
                    <div className="p-3.5 bg-gradient-to-r from-amber-50/50 to-amber-100/30 rounded-xl border border-amber-100">
                      <p className="text-xs text-amber-600 font-semibold mb-1.5">
                        Business Type
                      </p>
                      <p className="font-bold text-gray-900">
                        {merchant.businessType || "Not specified"}
                      </p>
                    </div>
                    <div className="p-3.5 bg-gradient-to-r from-purple-50/50 to-purple-100/30 rounded-xl border border-purple-100">
                      <p className="text-xs text-purple-600 font-semibold mb-1.5">
                        Category
                      </p>
                      <p className="font-bold text-gray-900">
                        {merchant.businessCategory || "Not specified"}
                      </p>
                    </div>
                    <div className="p-3.5 bg-gradient-to-r from-purple-50/50 to-purple-100/30 rounded-xl border border-purple-100">
                      <p className="text-xs text-purple-600 font-semibold mb-1.5">
                        Gift Card Limit
                      </p>
                      <p className="font-bold text-gray-900">
                        {merchant.giftCardLimit || 10}
                      </p>
                    </div>
                  </div>
                  {merchant.description && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <p className="text-sm font-semibold text-gray-900">
                          Business Description
                        </p>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl border border-gray-200">
                        <p className="text-gray-700 leading-relaxed">
                          {merchant.description}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contact & Address Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
                  <CardContent className="p-6 h-full">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          Contact Information
                        </h3>
                        <p className="text-sm text-gray-500">
                          Primary contact details
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50/50 to-emerald-100/30 rounded-xl border border-green-100">
                        <Mail className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-green-600 font-semibold mb-0.5">
                            Business Email
                          </p>
                          <p className="font-medium text-gray-900 truncate">
                            {merchant.businessEmail || merchant.user.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50/50 to-blue-100/30 rounded-xl border border-blue-100">
                        <Phone className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-blue-600 font-semibold mb-0.5">
                            Business Phone
                          </p>
                          <p className="font-medium text-gray-900">
                            {merchant.businessPhone ||
                              merchant.user.phone ||
                              "Not provided"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50/50 to-purple-100/30 rounded-xl border border-purple-100">
                        <Globe className="w-5 h-5 text-purple-600 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-purple-600 font-semibold mb-0.5">
                            Website
                          </p>
                          <p className="font-medium text-gray-900 truncate">
                            {merchant.website || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Address Information */}
                <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
                  <CardContent className="p-6 h-full">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          Address
                        </h3>
                        <p className="text-sm text-gray-500">
                          Business location
                        </p>
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-orange-50/50 to-red-100/30 rounded-xl border border-orange-100 h-full">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs text-orange-600 font-semibold mb-0.5">
                              Address
                            </p>
                            <p className="font-medium text-gray-900">
                              {merchant.address || "Not provided"}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs text-gray-500 font-medium mb-0.5">
                              City
                            </p>
                            <p className="font-medium text-gray-900">
                              {merchant.city || "—"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium mb-0.5">
                              State
                            </p>
                            <p className="font-medium text-gray-900">
                              {merchant.state || "—"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium mb-0.5">
                              Zip Code
                            </p>
                            <p className="font-medium text-gray-900">
                              {merchant.zipCode || "—"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium mb-0.5">
                              Country
                            </p>
                            <p className="font-medium text-gray-900">
                              {merchant.country || "—"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Bank Information */}
              <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center">
                        <Banknote className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          Bank Details
                        </h3>
                        <p className="text-sm text-gray-500">
                          Financial information
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 text-amber-600 rounded-xl transition-all flex items-center gap-2 text-sm font-semibold border border-amber-200"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </motion.button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3.5 bg-gradient-to-r from-amber-50/50 to-amber-100/30 rounded-xl border border-amber-100">
                      <p className="text-xs text-amber-600 font-semibold mb-1.5">
                        Bank Name
                      </p>
                      <p className="font-bold text-gray-900">
                        {merchant.bankName || "Not provided"}
                      </p>
                    </div>
                    <div className="p-3.5 bg-gradient-to-r from-amber-50/50 to-amber-100/30 rounded-xl border border-amber-100">
                      <p className="text-xs text-amber-600 font-semibold mb-1.5">
                        Account Number
                      </p>
                      <p className="font-bold text-gray-900 text-lg tracking-wider">
                        {merchant.accountNumber || "Not provided"}
                      </p>
                    </div>
                    <div className="p-3.5 bg-gradient-to-r from-yellow-50/50 to-yellow-100/30 rounded-xl border border-yellow-100">
                      <p className="text-xs text-yellow-600 font-semibold mb-1.5">
                        Account Holder
                      </p>
                      <p className="font-bold text-gray-900">
                        {merchant.accountHolderName || "Not provided"}
                      </p>
                    </div>
                    <div className="p-3.5 bg-gradient-to-r from-yellow-50/50 to-yellow-100/30 rounded-xl border border-yellow-100">
                      <p className="text-xs text-yellow-600 font-semibold mb-1.5">
                        IFSC Code
                      </p>
                      <p className="font-bold text-gray-900">
                        {merchant.ifscCode || "Not provided"}
                      </p>
                    </div>
                    {merchant.swiftCode && (
                      <div className="p-3.5 bg-gradient-to-r from-yellow-50/50 to-yellow-100/30 rounded-xl border border-yellow-100 md:col-span-2">
                        <p className="text-xs text-yellow-600 font-semibold mb-1.5">
                          SWIFT Code
                        </p>
                        <p className="font-bold text-gray-900">
                          {merchant.swiftCode}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - User Info & Documents */}
            <div className="space-y-6">
              {/* User Information Card */}
              <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          Account Owner
                        </h3>
                        <p className="text-sm text-gray-500">
                          User information
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-100 hover:from-indigo-100 hover:to-purple-200 text-indigo-600 rounded-xl transition-all flex items-center gap-2 text-sm font-semibold border border-indigo-200"
                    >
                      <Send className="w-4 h-4" />
                      Message
                    </motion.button>
                  </div>
                  <div className="space-y-4">
                    <div className="p-3.5 bg-gradient-to-r from-indigo-50/50 to-purple-100/30 rounded-xl border border-indigo-100">
                      <p className="text-xs text-indigo-600 font-semibold mb-1">
                        Full Name
                      </p>
                      <p className="font-bold text-gray-900 text-lg">
                        {merchant.user.name}
                      </p>
                    </div>
                    <div className="p-3.5 bg-gradient-to-r from-indigo-50/50 to-purple-100/30 rounded-xl border border-indigo-100">
                      <p className="text-xs text-indigo-600 font-semibold mb-1">
                        Email Address
                      </p>
                      <p className="font-medium text-gray-900 truncate">
                        {merchant.user.email}
                      </p>
                    </div>
                    <div className="p-3.5 bg-gradient-to-r from-indigo-50/50 to-purple-100/30 rounded-xl border border-indigo-100">
                      <p className="text-xs text-indigo-600 font-semibold mb-1">
                        Phone Number
                      </p>
                      <p className="font-medium text-gray-900">
                        {merchant.user.phone || "Not provided"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl border border-gray-200">
                      <div>
                        <p className="text-xs text-gray-600 font-semibold mb-0.5">
                          Account Status
                        </p>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${merchant.user.isActive ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}
                          />
                          <span className="font-bold text-gray-900">
                            {merchant.user.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                      <Calendar className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="p-3.5 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl border border-gray-200">
                      <p className="text-xs text-gray-600 font-semibold mb-1">
                        Registered On
                      </p>
                      <p className="font-medium text-gray-900 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {formatDate(merchant.user.createdAt)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Documents Card */}
              {/* Documents Card */}
              <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          Documents
                        </h3>
                        <p className="text-sm text-gray-500">Uploaded files</p>
                      </div>
                    </div>
                    <div className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
                      {
                        [
                          merchant.registrationDocument,
                          merchant.taxDocument,
                          merchant.identityDocument,
                          ...(merchant.additionalDocuments || []),
                        ].filter(Boolean).length
                      }{" "}
                      files
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      {
                        label: "Registration Document",
                        url: merchant.registrationDocument,
                      },
                      { label: "Tax Document", url: merchant.taxDocument },
                      {
                        label: "Identity Document",
                        url: merchant.identityDocument,
                      },
                    ].map((doc, index) => (
                      <DocumentPreviewCard
                        key={index}
                        label={doc.label}
                        url={doc.url}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Verification History Card */}
              <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Verification Timeline
                      </h3>
                      <p className="text-sm text-gray-500">
                        Account status history
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-white" />
                        </div>
                        <div className="h-full w-0.5 bg-gradient-to-b from-blue-500 to-emerald-500 mx-auto mt-2"></div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">
                          Profile Created
                        </p>
                        <p className="text-sm text-gray-600 mt-0.5">
                          {formatDate(merchant.createdAt)}
                        </p>
                      </div>
                    </div>
                    {merchant.verifiedAt && (
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <div className="h-full w-0.5 bg-gradient-to-b from-emerald-500 to-rose-500 mx-auto mt-2"></div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">
                            Verified Account
                          </p>
                          <p className="text-sm text-gray-600 mt-0.5">
                            {formatDate(merchant.verifiedAt)}
                          </p>
                          {merchant.verificationNotes && (
                            <p className="text-xs text-emerald-700 bg-emerald-50 p-2 rounded-lg mt-2 border border-emerald-200">
                              {merchant.verificationNotes}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    {merchant.rejectedAt && (
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-red-600 rounded-full flex items-center justify-center">
                            <XCircle className="w-4 h-4 text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">
                            Rejected Account
                          </p>
                          <p className="text-sm text-gray-600 mt-0.5">
                            {formatDate(merchant.rejectedAt)}
                          </p>
                          {merchant.rejectionReason && (
                            <p className="text-xs text-rose-700 bg-rose-50 p-2 rounded-lg mt-2 border border-rose-200">
                              {merchant.rejectionReason}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Enhanced Footer Actions */}
        <div className="sticky bottom-0 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white p-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-gray-400" />
            <p className="text-sm text-gray-600">
              Merchant ID:{" "}
              <span className="font-semibold text-gray-900">{merchant.id}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="px-5 py-2.5 border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 rounded-xl font-semibold transition-all duration-200"
            >
              Close
            </motion.button>
            {isVerified ? (
              <motion.button
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.3)",
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onEdit(merchant)}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25 transition-all duration-200 flex items-center gap-2"
              >
                <Edit2 className="w-4.5 h-4.5" />
                Edit Merchant
              </motion.button>
            ) : (
              <div className="px-5 py-2.5 bg-gray-100 text-gray-500 rounded-xl font-semibold flex items-center gap-2">
                <AlertCircle className="w-4.5 h-4.5" />
                Edit Disabled (Not Verified)
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const AllMerchantsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: merchants,
    isLoading,
    refetch,
    isRefetching,
  } = useAllMerchants();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantUser | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (merchant: MerchantUser) => {
    setSelectedMerchant(merchant);
    setIsModalOpen(true);
  };

  const handleEdit = (merchant: MerchantUser) => {
    // Only allow editing for verified merchants
    if (merchant.profileStatus !== "VERIFIED") {
      alert("Only verified merchants can be edited!");
      return;
    }

    // Map merchant data to form structure
    const formData = {
      email: merchant.user.email || "",
      password: "", // Leave empty, user will need to update if needed
      name: merchant.user.name || "",
      phone: merchant.user.phone || "",
      businessName: merchant.businessName || "",
      businessRegistrationNumber: merchant.businessRegistrationNumber || "",
      taxId: merchant.taxId || "",
      businessType: merchant.businessType || "",
      businessCategory: merchant.businessCategory || "",
      address: merchant.address || "",
      city: merchant.city || "",
      state: merchant.state || "",
      zipCode: merchant.zipCode || "",
      country: merchant.country || "",
      businessPhone: merchant.businessPhone || "",
      businessEmail: merchant.businessEmail || "",
      website: merchant.website || "",
      description: merchant.description || "",
      bankName: merchant.bankName || "",
      accountNumber: merchant.accountNumber || "",
      accountHolderName: merchant.accountHolderName || "",
      ifscCode: merchant.ifscCode || "",
      swiftCode: merchant.swiftCode || "",
      registrationDocument: merchant.registrationDocument || undefined,
      taxDocument: merchant.taxDocument || undefined,
      identityDocument: merchant.identityDocument || undefined,
      additionalDocuments: merchant.additionalDocuments || undefined,
    };

    // Populate the Redux store with merchant data
    dispatch(updateFormData(formData));

    // Navigate to create merchant page (which will now show prefilled data)
    navigate(`/admin/merchants/edit/${merchant.id}`);
  };

  const filteredAndSortedMerchants = useMemo(() => {
    if (!merchants) return [];

    let filtered = merchants;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.businessName.toLowerCase().includes(query) ||
          m.businessEmail?.toLowerCase().includes(query) ||
          m.user.email.toLowerCase().includes(query) ||
          m.city?.toLowerCase().includes(query) ||
          m.user.name.toLowerCase().includes(query),
      );
    }

    // Status filter
    switch (filterStatus) {
      case "verified":
        filtered = filtered.filter((m) => m.profileStatus === "VERIFIED");
        break;
      case "pending":
        filtered = filtered.filter(
          (m) => m.profileStatus === "PENDING_VERIFICATION",
        );
        break;
      case "rejected":
        filtered = filtered.filter((m) => m.profileStatus === "REJECTED");
        break;
      case "incomplete":
        filtered = filtered.filter((m) => m.profileStatus === "INCOMPLETE");
        break;
    }

    // Sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.businessName.localeCompare(b.businessName);
        case "date":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "status":
          return a.profileStatus.localeCompare(b.profileStatus);
        default:
          return 0;
      }
    });

    return sorted;
  }, [merchants, searchQuery, filterStatus, sortBy]);

  // Stats
  const stats = useMemo(() => {
    if (!merchants)
      return { total: 0, verified: 0, pending: 0, rejected: 0, incomplete: 0 };
    return {
      total: merchants.length,
      verified: merchants.filter((m) => m.profileStatus === "VERIFIED").length,
      pending: merchants.filter(
        (m) => m.profileStatus === "PENDING_VERIFICATION",
      ).length,
      rejected: merchants.filter((m) => m.profileStatus === "REJECTED").length,
      incomplete: merchants.filter((m) => m.profileStatus === "INCOMPLETE")
        .length,
    };
  }, [merchants]);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex flex-col justify-center items-center h-[80vh]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mb-4"
          />
          <p className="text-lg text-gray-600 font-medium">
            Loading merchants...
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Please wait while we fetch your data
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="pb-8">
        {/* Merchant Details Modal */}
        <MerchantDetailsModal
          merchant={selectedMerchant}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onEdit={handleEdit} // Add this prop
        />

        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-5">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-18 h-18 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30 border-4 border-white"
              >
                <Users className="w-9 h-9 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Merchant Directory
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage and monitor all registered merchants in your network
                </p>
              </div>
            </div>

            {/* Enhanced Refresh Button */}
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#f3f4f6" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => refetch()}
              disabled={isRefetching}
              className="px-5 py-3 bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl hover:border-gray-300 transition-all shadow-sm flex items-center gap-3"
            >
              <RefreshCw
                className={`w-5 h-5 text-gray-600 ${isRefetching ? "animate-spin" : ""}`}
              />
              <span className="font-medium text-gray-700">
                {isRefetching ? "Refreshing..." : "Refresh"}
              </span>
            </motion.button>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-5 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl border border-blue-200 hover:border-blue-300 transition-all shadow-sm hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-semibold mb-2">
                    Total Merchants
                  </p>
                  <p className="text-4xl font-bold text-blue-900">
                    {stats.total}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-5 bg-gradient-to-br from-emerald-50 to-teal-100 rounded-2xl border border-emerald-200 hover:border-emerald-300 transition-all shadow-sm hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-600 font-semibold mb-2">
                    Verified
                  </p>
                  <p className="text-4xl font-bold text-emerald-900">
                    {stats.verified}
                  </p>
                  <p className="text-xs text-emerald-700 font-medium mt-1">
                    {stats.total > 0
                      ? `${Math.round((stats.verified / stats.total) * 100)}%`
                      : "0%"}{" "}
                    of total
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-5 bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl border border-amber-200 hover:border-amber-300 transition-all shadow-sm hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-600 font-semibold mb-2">
                    Pending
                  </p>
                  <p className="text-4xl font-bold text-amber-900">
                    {stats.pending}
                  </p>
                  <p className="text-xs text-amber-700 font-medium mt-1">
                    {stats.total > 0
                      ? `${Math.round((stats.pending / stats.total) * 100)}%`
                      : "0%"}{" "}
                    of total
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-md">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-5 bg-gradient-to-br from-rose-50 to-red-100 rounded-2xl border border-rose-200 hover:border-rose-300 transition-all shadow-sm hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-rose-600 font-semibold mb-2">
                    Rejected
                  </p>
                  <p className="text-4xl font-bold text-rose-900">
                    {stats.rejected}
                  </p>
                  <p className="text-xs text-rose-700 font-medium mt-1">
                    {stats.total > 0
                      ? `${Math.round((stats.rejected / stats.total) * 100)}%`
                      : "0%"}{" "}
                    of total
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center shadow-md">
                  <XCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-5 bg-gradient-to-br from-gray-50 to-slate-100 rounded-2xl border border-gray-200 hover:border-gray-300 transition-all shadow-sm hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-2">
                    Incomplete
                  </p>
                  <p className="text-4xl font-bold text-gray-900">
                    {stats.incomplete}
                  </p>
                  <p className="text-xs text-gray-700 font-medium mt-1">
                    {stats.total > 0
                      ? `${Math.round((stats.incomplete / stats.total) * 100)}%`
                      : "0%"}{" "}
                    of total
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center shadow-md">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Enhanced Search and Filters Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-200 p-5 shadow-sm"
          >
            <div className="flex flex-col lg:flex-row gap-5">
              {/* Search */}
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Search Merchants
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by business name, email, location, or contact..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl transition-all bg-white shadow-sm"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="lg:w-64">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Filter by Status
                </label>
                <div className="relative">
                  <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) =>
                      setFilterStatus(e.target.value as FilterStatus)
                    }
                    className="w-full pl-10 pr-8 py-3.5 border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl transition-all cursor-pointer appearance-none bg-white shadow-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="verified">Verified</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                    <option value="incomplete">Incomplete</option>
                  </select>
                </div>
              </div>

              {/* Sort */}
              <div className="lg:w-64">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sort By
                </label>
                <div className="relative">
                  <SortAsc className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortBy)}
                    className="w-full pl-10 pr-8 py-3.5 border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl transition-all cursor-pointer appearance-none bg-white shadow-sm"
                  >
                    <option value="date">Newest First</option>
                    <option value="name">Business Name (A-Z)</option>
                    <option value="status">Status</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Results Count - Enhanced */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Merchant Results
              </h3>
              <p className="text-gray-600">
                Found{" "}
                <span className="font-bold text-gray-900">
                  {filteredAndSortedMerchants.length}
                </span>{" "}
                of{" "}
                <span className="font-bold text-gray-900">
                  {merchants?.length || 0}
                </span>{" "}
                merchants
              </p>
            </div>
            {filteredAndSortedMerchants.length > 0 && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">Sorted by: </span>
                <span className="font-semibold text-gray-900">
                  {sortBy === "date"
                    ? "Newest First"
                    : sortBy === "name"
                      ? "Business Name"
                      : "Status"}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Merchants Grid - FIXED VISIBILITY */}
        {filteredAndSortedMerchants.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {filteredAndSortedMerchants.map((merchant, index) => (
                <MerchantCard
                  key={merchant.id}
                  merchant={merchant}
                  index={index}
                  onViewDetails={handleViewDetails}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-16"
          >
            <Card className="border-0 shadow-xl bg-gradient-to-br from-gray-50 to-white">
              <CardContent className="p-16 text-center">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                  className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-lg"
                >
                  <Search className="w-16 h-16 text-gray-400" />
                </motion.div>
                <h3 className="text-3xl font-bold text-gray-900 mb-3">
                  No merchants found
                </h3>
                <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                  We couldn't find any merchants matching your search criteria
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => {
                      setSearchQuery("");
                      setFilterStatus("all");
                    }}
                    variant="outline"
                    className="px-8 py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 rounded-xl font-semibold"
                  >
                    Clear All Filters
                  </Button>
                  <Button
                    onClick={() => refetch()}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold shadow-lg"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AllMerchantsPage;
