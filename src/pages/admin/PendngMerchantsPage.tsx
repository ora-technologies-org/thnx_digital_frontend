// src/pages/admin/PendingMerchantsPage.tsx

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Sparkles,
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AdminLayout } from "../../shared/components/layout/AdminLayout";
import { Button } from "../../shared/components/ui/Button";
import { Card, CardContent } from "../../shared/components/ui/Card";
import { Spinner } from "../../shared/components/ui/Spinner";
import { Modal } from "../../shared/components/ui/Modal";

import {
  usePendingMerchants,
  useApproveMerchant,
  useRejectMerchant,
} from "../../features/admin/hooks/useAdmin";
import type { MerchantUser } from "../../features/admin/api/admin.api";
import DocumentPreviewCard from "@/shared/components/modals/DocumentPreviewCard";

// ============================================================
// SUCCESS/ERROR MODAL COMPONENT
// ============================================================
interface ResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "success" | "error";
  title: string;
  message: string;
}

const ResponseModal: React.FC<ResponseModalProps> = ({
  isOpen,
  onClose,
  type,
  title,
  message,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center py-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
            type === "success"
              ? "bg-gradient-to-br from-emerald-100 to-teal-200"
              : "bg-gradient-to-br from-red-100 to-rose-200"
          }`}
        >
          {type === "success" ? (
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          ) : (
            <XCircle className="w-10 h-10 text-red-600" />
          )}
        </motion.div>

        <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 text-lg mb-6">{message}</p>

        <Button
          onClick={onClose}
          className={`w-full ${
            type === "success"
              ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              : "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700"
          }`}
        >
          Close
        </Button>
      </div>
    </Modal>
  );
};

// ============================================================
// MERCHANT LIST ITEM COMPONENT
// ============================================================
interface MerchantListItemProps {
  merchant: MerchantUser;
  onClick: (merchant: MerchantUser) => void;
}

const MerchantListItem: React.FC<MerchantListItemProps> = ({
  merchant,
  onClick,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick(merchant);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-4"
    >
      <div onClick={handleClick} className="cursor-pointer">
        <Card className="hover:shadow-lg transition-all duration-300 hover:border-amber-300 border-2">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-200 rounded-xl flex items-center justify-center">
                  <Building className="w-6 h-6 text-amber-700" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {merchant.businessName}
                  </h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {merchant.user?.name || "N/A"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {merchant.user?.email || merchant.businessEmail}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(merchant.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                  Pending
                </span>
                <ChevronRightIcon className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

// ============================================================
// PAGINATION COMPONENT
// ============================================================
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
      <div className="text-sm text-gray-600">
        Showing <span className="font-semibold">{totalItems}</span> pending
        applications
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, index) => {
              if (page === "ellipsis") {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-3 py-2 text-gray-400"
                  >
                    ...
                  </span>
                );
              }

              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => onPageChange(page as number)}
                  className={`min-w-[40px] h-10 ${
                    currentPage === page
                      ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white"
                      : "hover:bg-amber-50"
                  }`}
                >
                  {page}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
};

// ============================================================
// DETAIL MODAL COMPONENT
// ============================================================
interface DetailModalProps {
  merchant: MerchantUser;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (merchantId: string, notes: string) => Promise<void>;
  onReject: (
    merchantId: string,
    reason: string,
    notes: string,
  ) => Promise<void>;
  isApproving: boolean;
  isRejecting: boolean;
}

const getDocumentUrl = (documentPath: string | null): string | null => {
  if (!documentPath) return null;
  if (
    documentPath.startsWith("http://") ||
    documentPath.startsWith("https://")
  ) {
    return documentPath;
  }
  const API_URL = import.meta.env.VITE_DOMAIN;
  const cleanPath = documentPath.startsWith("/")
    ? documentPath
    : `${documentPath}`;
  return `${API_URL}${cleanPath}`;
};

const DetailModal: React.FC<DetailModalProps> = ({
  merchant,
  isOpen,
  onClose,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
}) => {
  const [notes, setNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  const documents = React.useMemo(() => {
    const docs = [];
    if (merchant.registrationDocument) {
      docs.push({
        type: "Business Registration Document",
        url: getDocumentUrl(merchant.registrationDocument),
        fieldName: "registrationDocument",
      });
    }
    if (merchant.taxDocument) {
      docs.push({
        type: "Tax Document",
        url: getDocumentUrl(merchant.taxDocument),
        fieldName: "taxDocument",
      });
    }
    if (merchant.identityDocument) {
      docs.push({
        type: "Identity Document",
        url: getDocumentUrl(merchant.identityDocument),
        fieldName: "identityDocument",
      });
    }
    if (
      merchant.additionalDocuments &&
      merchant.additionalDocuments.length > 0
    ) {
      merchant.additionalDocuments.forEach((doc: string, index: number) => {
        docs.push({
          type: `Additional Document ${index + 1}`,
          url: getDocumentUrl(doc),
          fieldName: `additionalDocument_${index}`,
        });
      });
    }
    return docs;
  }, [merchant]);

  const handleApprove = async () => {
    await onApprove(merchant.id, notes || "All documents verified. Approved.");
    if (!isApproving) {
      onClose();
      setNotes("");
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }
    await onReject(
      merchant.id,
      rejectionReason,
      notes || "Rejected due to incomplete/invalid documents.",
    );
    if (!isRejecting) {
      onClose();
      setRejectionReason("");
      setNotes("");
      setShowRejectForm(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-8 rounded-t-2xl z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-200 rounded-2xl flex items-center justify-center">
                    <Building className="w-8 h-8 text-amber-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {merchant.businessName}
                    </h2>
                    <p className="text-gray-600">Application Review</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-xl"
                >
                  <XCircle className="w-6 h-6" />
                </Button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              <div className="gap-8">
                {/* Business Details */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Business Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Owner Name</p>
                          <p className="font-medium">
                            {merchant.user?.name || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Mail className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">
                            {merchant.user?.email || merchant.businessEmail}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Phone className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium">
                            {merchant.businessPhone ||
                              merchant.user?.phone ||
                              "Not provided"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Business Address
                          </p>
                          <p className="font-medium">
                            {merchant.address
                              ? `${merchant.address}, ${merchant.city}, ${merchant.state}, ${merchant.country}`
                              : "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Application Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Application Date</span>
                        <span className="font-medium">
                          {new Date(merchant.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Status</span>
                        <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                          Pending Review
                        </span>
                      </div>
                      {merchant.description && (
                        <div>
                          <span className="text-gray-600">Description</span>
                          <p className="font-medium mt-1">
                            {merchant.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Documents & Actions */}
                <div className="space-y-6 mt-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Submitted Documents
                    </h3>
                    <div className="space-y-3">
                      {documents.length > 0 ? (
                        documents.map((doc, index) => (
                          <DocumentPreviewCard
                            key={index}
                            label={doc.type}
                            url={doc.url || undefined}
                          />
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-4">
                          No documents submitted
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Notes Textarea */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Verification Notes
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add notes about your verification process..."
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring focus:ring-amber-200 transition-all resize-none"
                    />
                  </div>

                  {/* Rejection Form */}
                  {showRejectForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3"
                    >
                      <label className="block text-sm font-semibold text-red-700 mb-2">
                        Rejection Reason *
                      </label>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Provide specific reason for rejection..."
                        rows={2}
                        className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:ring focus:ring-red-200 transition-all resize-none"
                        required
                      />
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowRejectForm(!showRejectForm)}
                  className={`flex-1 ${
                    showRejectForm
                      ? "border-red-500 text-red-600 hover:bg-red-50"
                      : "border-gray-300"
                  }`}
                  disabled={isApproving || isRejecting}
                >
                  {showRejectForm ? (
                    <>
                      <XCircle className="w-5 h-5 mr-2" />
                      Cancel Rejection
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 mr-2" />
                      Reject Application
                    </>
                  )}
                </Button>

                {showRejectForm ? (
                  <Button
                    onClick={handleReject}
                    disabled={isRejecting || !rejectionReason.trim()}
                    className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700"
                  >
                    {isRejecting ? (
                      <span className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Rejecting...
                      </span>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 mr-2" />
                        Confirm Rejection
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleApprove}
                    disabled={isApproving || isRejecting}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  >
                    {isApproving ? (
                      <span className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Approving...
                      </span>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Approve Application
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

// ============================================================
// MAIN PAGE COMPONENT
// ============================================================
export const PendingMerchantsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);
  console.log("", setLimit);
  console.log("", setSearchQuery);

  // Pass pagination params to hook
  const {
    data: merchantsResponse,
    isLoading,
    refetch,
  } = usePendingMerchants({
    page,
    limit,
    search: debouncedSearch || undefined,
    sortBy: "createdAt",
    order: "desc",
  });

  //  Extract data from response
  const merchants = merchantsResponse?.merchants || [];
  const pagination = merchantsResponse?.pagination;
  const totalItems = pagination?.total || 0;
  const totalPages = pagination?.totalPages || 1;

  const approveMutation = useApproveMerchant();
  const rejectMutation = useRejectMerchant();

  const [selectedMerchant, setSelectedMerchant] = useState<MerchantUser | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Response modal state
  const [responseModal, setResponseModal] = useState({
    isOpen: false,
    type: "success" as "success" | "error",
    title: "",
    message: "",
  });

  const handleMerchantClick = (merchant: MerchantUser) => {
    setSelectedMerchant(merchant);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMerchant(null);
  };

  //  Use setPage instead of setCurrentPage
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleApprove = async (merchantId: string, notes: string) => {
    try {
      const response = await approveMutation.mutateAsync({
        merchantId,
        notes,
      });

      setResponseModal({
        isOpen: true,
        type: "success",
        title: "Merchant Approved! 🎉",
        message: response.message,
      });

      // Refetch to update the list
      refetch();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ||
            "Failed to approve merchant. Please try again.";

      setResponseModal({
        isOpen: true,
        type: "error",
        title: "Approval Failed",
        message,
      });
    }
  };

  const handleReject = async (
    merchantId: string,
    reason: string,
    notes: string,
  ) => {
    try {
      const response = await rejectMutation.mutateAsync({
        merchantId,
        reason,
        notes,
      });

      setResponseModal({
        isOpen: true,
        type: "success",
        title: "Application Rejected",
        message:
          response?.message || "The merchant application has been rejected.",
      });

      //  Refetch to update the list
      refetch();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Failed to reject merchant. Please try again.";

      setResponseModal({
        isOpen: true,
        type: "error",
        title: "Rejection Failed",
        message,
      });
    }
  };

  const closeResponseModal = () => {
    setResponseModal({ ...responseModal, isOpen: false });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex flex-col justify-center items-center h-64">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Loading pending merchants...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30"
            >
              <Clock className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Pending Verifications
              </h1>
              <p className="text-gray-600 mt-1">
                Click on any merchant to review details
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl border border-amber-200"
          >
            <Sparkles className="w-5 h-5 text-amber-600" />
            <span className="text-2xl font-bold text-amber-900">
              {totalItems}
            </span>
            <span className="text-gray-600 font-medium">
              Applications Waiting
            </span>
          </motion.div>
        </motion.div>

        {/*  Use merchants directly, not currentMerchants */}
        {merchants && merchants.length > 0 ? (
          <>
            <div className="space-y-4">
              {merchants.map((merchant) => (
                <MerchantListItem
                  key={merchant.id}
                  merchant={merchant}
                  onClick={handleMerchantClick}
                />
              ))}
            </div>

            {/* ✅ UPDATED: Use pagination from API response */}
            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={totalItems}
              />
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-0 shadow-lg">
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
                  className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-emerald-100 to-teal-200 rounded-full flex items-center justify-center"
                >
                  <CheckCircle className="w-12 h-12 text-emerald-600" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  All Caught Up! 🎉
                </h3>
                <p className="text-gray-600 text-lg">
                  No pending merchant applications at the moment
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Detail Modal */}
        {selectedMerchant && (
          <DetailModal
            merchant={selectedMerchant}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onApprove={handleApprove}
            onReject={handleReject}
            isApproving={approveMutation.isPending}
            isRejecting={rejectMutation.isPending}
          />
        )}

        {/* Response Modal */}
        <ResponseModal
          isOpen={responseModal.isOpen}
          onClose={closeResponseModal}
          type={responseModal.type}
          title={responseModal.title}
          message={responseModal.message}
        />
      </div>
    </AdminLayout>
  );
};
