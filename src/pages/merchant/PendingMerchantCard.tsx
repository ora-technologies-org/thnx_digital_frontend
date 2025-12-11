// src/pages/admin/PendingMerchantsPage.tsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  Mail,
  Building,
  MapPin,
  FileText,
  CreditCard,
  Eye,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Shield,
} from 'lucide-react';
import { Button } from '../../shared/components/ui/Button';
import { Card, CardContent } from '../../shared/components/ui/Card';
import { Badge } from '../../shared/components/ui/Badge';
import type { MerchantUser } from '../../features/admin/api/admin.api';

// Get backend URL for documents
const API_URL = import.meta.env.VITE_API_URL || '/api';
const BACKEND_URL = API_URL.replace('/api', '');
// ============================================================
// PENDING MERCHANT CARD COMPONENT
// ============================================================
interface PendingMerchantCardProps {
  merchant: MerchantUser;
  index: number;
  onApprove: (merchant: MerchantUser) => void;  // <-- Receives function as prop
  onReject: (merchant: MerchantUser) => void;   // <-- Receives function as prop
}

export const PendingMerchantCard: React.FC<PendingMerchantCardProps> = ({
  merchant,
  index,
  onApprove,  // <-- Destructured from props
  onReject,   // <-- Destructured from props
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.1,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      layout
    >
      <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg">
        <CardContent className="p-0">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 p-6 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="relative flex items-start justify-between">
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  <h3 className="text-2xl font-bold mb-2">{merchant.businessName}</h3>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge className="bg-white/20 border-white/30 text-white">
                      <Clock className="w-3 h-3 mr-1" />
                      PENDING REVIEW
                    </Badge>
                    <span className="text-sm text-orange-100">
                      Applied {formatDate(merchant.createdAt)}
                    </span>
                  </div>
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + 0.3, type: 'spring' }}
                className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
              >
                <Building className="w-8 h-8 text-white" />
              </motion.div>
            </div>
          </div>

          {/* Quick Info Section */}
          <div className="p-6 bg-gradient-to-b from-gray-50 to-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.4 }}
                className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100"
              >
                <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 font-medium">Owner</p>
                  <p className="font-semibold text-gray-900 truncate">{merchant.user.name}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.5 }}
                className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100"
              >
                <div className="w-11 h-11 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Building className="w-5 h-5 text-purple-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 font-medium">Category</p>
                  <p className="font-semibold text-gray-900 truncate">
                    {merchant.businessCategory || 'Not specified'}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.6 }}
                className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100"
              >
                <div className="w-11 h-11 bg-green-100 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 font-medium">Location</p>
                  <p className="font-semibold text-gray-900 truncate">
                    {[merchant.city, merchant.state].filter(Boolean).join(', ') || 'Not specified'}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Expand/Collapse Button */}
            <motion.button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-semibold text-gray-700"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {isExpanded ? (
                <>
                  <span>Hide Details</span>
                  <ChevronUp className="w-5 h-5" />
                </>
              ) : (
                <>
                  <span>View Full Details</span>
                  <ChevronDown className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </div>

          {/* Expanded Details */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-6 border-t border-gray-100 space-y-6">
                  {/* Contact Information */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Mail className="w-4 h-4 text-blue-600" />
                      </div>
                      Contact Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-10">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 font-medium">Email</p>
                        <p className="font-medium text-gray-900">{merchant.user.email}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 font-medium">Phone</p>
                        <p className="font-medium text-gray-900">
                          {merchant.user.phone || 'Not provided'}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 font-medium">Business Email</p>
                        <p className="font-medium text-gray-900">
                          {merchant.businessEmail || 'Not provided'}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 font-medium">Business Phone</p>
                        <p className="font-medium text-gray-900">
                          {merchant.businessPhone || 'Not provided'}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Business Details */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Building className="w-4 h-4 text-purple-600" />
                      </div>
                      Business Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-10">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 font-medium">Business Type</p>
                        <p className="font-medium text-gray-900">
                          {merchant.businessType || 'Not specified'}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 font-medium">Category</p>
                        <p className="font-medium text-gray-900">
                          {merchant.businessCategory || 'Not specified'}
                        </p>
                      </div>
                      <div className="md:col-span-2 p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 font-medium">Full Address</p>
                        <p className="font-medium text-gray-900">
                          {[
                            merchant.address,
                            merchant.city,
                            merchant.state,
                            merchant.zipCode,
                            merchant.country,
                          ]
                            .filter(Boolean)
                            .join(', ') || 'Not provided'}
                        </p>
                      </div>
                      {merchant.website && (
                        <div className="md:col-span-2 p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500 font-medium">Website</p>
                          <a
                            href={merchant.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                          >
                            {merchant.website}
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Registration Info */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-orange-600" />
                      </div>
                      Registration Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-10">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 font-medium">Registration Number</p>
                        <p className="font-medium text-gray-900">
                          {merchant.businessRegistrationNumber || 'Not provided'}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 font-medium">Tax ID</p>
                        <p className="font-medium text-gray-900">{merchant.taxId || 'Not provided'}</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Bank Details */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-emerald-600" />
                      </div>
                      Banking Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-10">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 font-medium">Bank Name</p>
                        <p className="font-medium text-gray-900">
                          {merchant.bankName || 'Not provided'}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 font-medium">Account Holder</p>
                        <p className="font-medium text-gray-900">
                          {merchant.accountHolderName || 'Not provided'}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 font-medium">Account Number</p>
                        <p className="font-medium text-gray-900">
                          {merchant.accountNumber || 'Not provided'}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 font-medium">IFSC Code</p>
                        <p className="font-medium text-gray-900">
                          {merchant.ifscCode || 'Not provided'}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Documents */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <Shield className="w-4 h-4 text-indigo-600" />
                      </div>
                      Uploaded Documents
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-10">
                      {merchant.registrationDocument && (
                        <a
                          href={`${BACKEND_URL}/${merchant.registrationDocument}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all"
                        >
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Eye className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">Registration</p>
                            <p className="text-xs text-gray-500">Click to view</p>
                          </div>
                        </a>
                      )}

                      {merchant.taxDocument && (
                        <a
                          href={`${BACKEND_URL}/${merchant.taxDocument}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all"
                        >
                          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <FileText className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">Tax Document</p>
                            <p className="text-xs text-gray-500">Click to view</p>
                          </div>
                        </a>
                      )}

                      {merchant.identityDocument && (
                        <a
                          href={`${BACKEND_URL}/${merchant.identityDocument}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all"
                        >
                          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <User className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">ID Document</p>
                            <p className="text-xs text-gray-500">Click to view</p>
                          </div>
                        </a>
                      )}

                      {!merchant.registrationDocument &&
                        !merchant.taxDocument &&
                        !merchant.identityDocument && (
                          <div className="md:col-span-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-center">
                            <p className="text-amber-700 font-medium">No documents uploaded</p>
                          </div>
                        )}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ============================================================ */}
          {/* ACTION BUTTONS - These call onApprove and onReject props */}
          {/* ============================================================ */}
          <div className="p-6 bg-gray-50 border-t border-gray-100">
            <div className="flex gap-3">
              <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={() => onApprove(merchant)}  // <-- Calls the prop function
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/30 py-3"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Approve Merchant
                </Button>
              </motion.div>
              <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={() => onReject(merchant)}  // <-- Calls the prop function
                  className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-lg shadow-red-500/30 py-3"
                >
                  <XCircle className="w-5 h-5 mr-2" />
                  Reject Application
                </Button>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
