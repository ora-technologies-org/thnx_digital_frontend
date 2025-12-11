// src/pages/admin/PendingMerchantsPage.tsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { AdminLayout } from '../../shared/components/layout/AdminLayout';
import { Button } from '../../shared/components/ui/Button';
import { Card, CardContent } from '../../shared/components/ui/Card';
import { Spinner } from '../../shared/components/ui/Spinner';
import {
  usePendingMerchants,
  useApproveMerchant,
  useRejectMerchant,
} from '../../features/admin/hooks/useAdmin';
import type { MerchantUser } from '../../features/admin/api/admin.api';
import { PendingMerchantCard } from '../merchant/PendingMerchantCard';


// ============================================================
// MAIN PAGE COMPONENT - Where the functions are DEFINED
// ============================================================
export const PendingMerchantsPage: React.FC = () => {
  // Fetch pending merchants
  const { data: merchants, isLoading } = usePendingMerchants();
  
  // Mutation hooks for approve/reject
  const approveMutation = useApproveMerchant();
  const rejectMutation = useRejectMerchant();

  // State for modals
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantUser | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  // ============================================================
  // APPROVE HANDLER - Called when user confirms approval
  // ============================================================
  const handleApprove = async () => {
    if (!selectedMerchant) return;

    try {
      await approveMutation.mutateAsync({
        merchantId: selectedMerchant.userId,
        notes: notes || 'All documents verified. Approved.',
      });
      
      // Reset state after success
      setShowApproveModal(false);
      setSelectedMerchant(null);
      setNotes('');
    } catch (error) {
      console.error('Failed to approve merchant:', error);
    }
  };

  // ============================================================
  // REJECT HANDLER - Called when user confirms rejection
  // ============================================================
  const handleReject = async () => {
    if (!selectedMerchant || !rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      await rejectMutation.mutateAsync({
        merchantId: selectedMerchant.userId,
        reason: rejectionReason,
        notes: notes || 'Rejected due to incomplete/invalid documents.',
      });
      
      // Reset state after success
      setShowRejectModal(false);
      setSelectedMerchant(null);
      setRejectionReason('');
      setNotes('');
    } catch (error) {
      console.error('Failed to reject merchant:', error);
    }
  };

  // Loading state
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
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30"
            >
              <Clock className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Pending Verifications</h1>
              <p className="text-gray-600 mt-1">Review and approve merchant applications</p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl border border-amber-200"
          >
            <Sparkles className="w-5 h-5 text-amber-600" />
            <span className="text-2xl font-bold text-amber-900">{merchants?.length || 0}</span>
            <span className="text-gray-600 font-medium">Applications Waiting</span>
          </motion.div>
        </motion.div>

        {/* Merchants List */}
        {merchants && merchants.length > 0 ? (
          <div className="space-y-6">
            {merchants.map((merchant, index) => (
              <PendingMerchantCard
                key={merchant.id}
                merchant={merchant}
                index={index}
                // ============================================================
                // PASSING FUNCTIONS AS PROPS
                // These open the modals and set the selected merchant
                // ============================================================
                onApprove={(m) => {
                  setSelectedMerchant(m);      // Set which merchant to approve
                  setShowApproveModal(true);   // Open approve modal
                }}
                onReject={(m) => {
                  setSelectedMerchant(m);      // Set which merchant to reject
                  setShowRejectModal(true);    // Open reject modal
                }}
              />
            ))}
          </div>
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
                <h3 className="text-2xl font-bold text-gray-900 mb-2">All Caught Up! 🎉</h3>
                <p className="text-gray-600 text-lg">No pending merchant applications at the moment</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ============================================================ */}
        {/* APPROVE MODAL */}
        {/* ============================================================ */}
        <AnimatePresence>
          {showApproveModal && selectedMerchant && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setShowApproveModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl"
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">Approve Merchant</h3>
                <p className="text-gray-600 mb-6 text-center">
                  Confirm approval for <strong>{selectedMerchant.businessName}</strong>
                </p>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Verification Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="All documents verified. Approved for platform access."
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring focus:ring-emerald-200 transition-all resize-none"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowApproveModal(false);
                      setSelectedMerchant(null);
                      setNotes('');
                    }}
                    className="flex-1 border-2 py-2.5"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleApprove}  // <-- Calls the actual approve API
                    disabled={approveMutation.isPending}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 py-2.5"
                  >
                    {approveMutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Approving...
                      </span>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Approve
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ============================================================ */}
        {/* REJECT MODAL */}
        {/* ============================================================ */}
        <AnimatePresence>
          {showRejectModal && selectedMerchant && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setShowRejectModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl"
              >
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                  Reject Application
                </h3>
                <p className="text-gray-600 mb-6 text-center">
                  Provide a reason for rejecting <strong>{selectedMerchant.businessName}</strong>
                </p>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Rejection Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="e.g., Identity document is unclear. Please resubmit with a clearer copy."
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring focus:ring-red-200 transition-all resize-none"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Internal notes for reference"
                    rows={2}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring focus:ring-red-200 transition-all resize-none"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowRejectModal(false);
                      setSelectedMerchant(null);
                      setRejectionReason('');
                      setNotes('');
                    }}
                    className="flex-1 border-2 py-2.5"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleReject}  // <-- Calls the actual reject API
                    disabled={rejectMutation.isPending || !rejectionReason.trim()}
                    className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 py-2.5 disabled:opacity-50"
                  >
                    {rejectMutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Rejecting...
                      </span>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 mr-2" />
                        Reject
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
};

