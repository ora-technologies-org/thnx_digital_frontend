// // src/pages/admin/PendingMerchantsPage.tsx - PENDING MERCHANTS! ⏳
// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { 
//   CheckCircle, XCircle, Clock, User, Mail, Phone, 
//   Building, MapPin, FileText, CreditCard, Eye
// } from 'lucide-react';
// import { AdminLayout } from '../../shared/components/layout/AdminLayout';
// import { Button } from '../../shared/components/ui/Button';
// import { Card, CardContent } from '../../shared/components/ui/Card';
// import { Spinner } from '../../shared/components/ui/Spinner';
// import { Badge } from '../../shared/components/ui/Badge';
// import { usePendingMerchants, useApproveMerchant, useRejectMerchant } from '../../features/admin/hooks/useAdmin';
// import type { MerchantUser } from '../../features/admin/api/admin.api';

// export const PendingMerchantsPage: React.FC = () => {
//   const { data: merchants, isLoading } = usePendingMerchants();
//   const approveMutation = useApproveMerchant();
//   const rejectMutation = useRejectMerchant();

//   const [selectedMerchant, setSelectedMerchant] = useState<MerchantUser | null>(null);
//   const [showApproveModal, setShowApproveModal] = useState(false);
//   const [showRejectModal, setShowRejectModal] = useState(false);
//   const [notes, setNotes] = useState('');
//   const [rejectionReason, setRejectionReason] = useState('');

//   const handleApprove = async () => {
//     if (!selectedMerchant) return;
    
//     try {
//       await approveMutation.mutateAsync({
//         merchantId: selectedMerchant.userId,
//         notes: notes || 'All documents verified. Approved.',
//       });
//       setShowApproveModal(false);
//       setSelectedMerchant(null);
//       setNotes('');
//       alert('Merchant approved successfully!');
//     } catch (error) {
//       alert('Failed to approve merchant');
//     }
//   };

//   const handleReject = async () => {
//     if (!selectedMerchant || !rejectionReason.trim()) {
//       alert('Please provide a rejection reason');
//       return;
//     }
    
//     try {
//       await rejectMutation.mutateAsync({
//         merchantId: selectedMerchant.userId,
//         reason: rejectionReason,
//         notes: notes || 'Rejected due to incomplete/invalid documents.',
//       });
//       setShowRejectModal(false);
//       setSelectedMerchant(null);
//       setRejectionReason('');
//       setNotes('');
//       alert('Merchant rejected successfully!');
//     } catch (error) {
//       alert('Failed to reject merchant');
//     }
//   };

//   if (isLoading) {
//     return (
//       <AdminLayout>
//         <div className="flex justify-center items-center h-64">
//           <Spinner size="lg" />
//         </div>
//       </AdminLayout>
//     );
//   }

//   return (
//     <AdminLayout>
//       <div>
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
//             <Clock className="w-8 h-8 text-orange-600" />
//             Pending Merchant Verifications
//           </h1>
//           <p className="text-gray-600 mt-2">
//             Review and verify merchant applications
//           </p>
//           <div className="mt-4">
//             <Badge variant="warning" className="text-lg px-4 py-2">
//               {merchants?.length || 0} Pending
//             </Badge>
//           </div>
//         </div>

//         {/* Merchants List */}
//         {merchants && merchants.length > 0 ? (
//           <div className="grid gap-6">
//             {merchants.map((merchant) => (
//               <motion.div
//                 key={merchant.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//               >
//                 <Card>
//                   <CardContent className="p-6">
//                     <div className="flex items-start justify-between mb-6">
//                       <div>
//                         <h3 className="text-2xl font-bold text-gray-900 mb-2">
//                           {merchant.businessName}
//                         </h3>
//                         <Badge variant="warning">PENDING VERIFICATION</Badge>
//                       </div>
//                       <div className="text-right text-sm text-gray-500">
//                         <p>Applied on</p>
//                         <p className="font-medium text-gray-900">
//                           {new Date(merchant.createdAt).toLocaleDateString()}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-2 gap-6 mb-6">
//                       {/* Owner Info */}
//                       <div>
//                         <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
//                           <User className="w-5 h-5 text-blue-600" />
//                           Owner Information
//                         </h4>
//                         <div className="space-y-2 text-sm">
//                           <p>
//                             <span className="text-gray-600">Name:</span>{' '}
//                             <span className="font-medium">{merchant.user.name}</span>
//                           </p>
//                           <p>
//                             <span className="text-gray-600">Email:</span>{' '}
//                             <span className="font-medium">{merchant.user.email}</span>
//                           </p>
//                           <p>
//                             <span className="text-gray-600">Phone:</span>{' '}
//                             <span className="font-medium">{merchant.user.phone}</span>
//                           </p>
//                         </div>
//                       </div>

//                       {/* Business Info */}
//                       <div>
//                         <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
//                           <Building className="w-5 h-5 text-purple-600" />
//                           Business Information
//                         </h4>
//                         <div className="space-y-2 text-sm">
//                           <p>
//                             <span className="text-gray-600">Type:</span>{' '}
//                             <span className="font-medium">{merchant.businessType}</span>
//                           </p>
//                           <p>
//                             <span className="text-gray-600">Category:</span>{' '}
//                             <span className="font-medium">{merchant.businessCategory}</span>
//                           </p>
//                           <p>
//                             <span className="text-gray-600">Phone:</span>{' '}
//                             <span className="font-medium">{merchant.businessPhone}</span>
//                           </p>
//                           <p>
//                             <span className="text-gray-600">Email:</span>{' '}
//                             <span className="font-medium">{merchant.businessEmail}</span>
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Location */}
//                     <div className="mb-6 pb-6 border-b border-gray-200">
//                       <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
//                         <MapPin className="w-5 h-5 text-green-600" />
//                         Location
//                       </h4>
//                       <p className="text-sm text-gray-700">
//                         {merchant.address}, {merchant.city}, {merchant.state} {merchant.zipCode}, {merchant.country}
//                       </p>
//                     </div>

//                     {/* Registration Info */}
//                     <div className="mb-6 pb-6 border-b border-gray-200">
//                       <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
//                         <FileText className="w-5 h-5 text-orange-600" />
//                         Registration Details
//                       </h4>
//                       <div className="grid grid-cols-2 gap-4 text-sm">
//                         <div>
//                           <p className="text-gray-600">Registration Number</p>
//                           <p className="font-medium">{merchant.businessRegistrationNumber}</p>
//                         </div>
//                         <div>
//                           <p className="text-gray-600">Tax ID</p>
//                           <p className="font-medium">{merchant.taxId}</p>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Bank Info */}
//                     <div className="mb-6 pb-6 border-b border-gray-200">
//                       <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
//                         <CreditCard className="w-5 h-5 text-red-600" />
//                         Bank Details
//                       </h4>
//                       <div className="grid grid-cols-2 gap-4 text-sm">
//                         <div>
//                           <p className="text-gray-600">Bank Name</p>
//                           <p className="font-medium">{merchant.bankName}</p>
//                         </div>
//                         <div>
//                           <p className="text-gray-600">Account Holder</p>
//                           <p className="font-medium">{merchant.accountHolderName}</p>
//                         </div>
//                         <div>
//                           <p className="text-gray-600">Account Number</p>
//                           <p className="font-medium">{merchant.accountNumber}</p>
//                         </div>
//                         <div>
//                           <p className="text-gray-600">IFSC Code</p>
//                           <p className="font-medium">{merchant.ifscCode}</p>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Documents */}
//                     <div className="mb-6">
//                       <h4 className="font-semibold text-gray-900 mb-3">Documents</h4>
//                       <div className="grid grid-cols-3 gap-4">
//                         <a
//                           href={`http://localhost:4001/${merchant.registrationDocument}`}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
//                         >
//                           <Eye className="w-4 h-4 text-blue-600" />
//                           <span className="text-sm">Registration Doc</span>
//                         </a>
//                         <a
//                           href={`http://localhost:4001/${merchant.taxDocument}`}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
//                         >
//                           <Eye className="w-4 h-4 text-blue-600" />
//                           <span className="text-sm">Tax Document</span>
//                         </a>
//                         <a
//                           href={`http://localhost:4001/${merchant.identityDocument}`}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
//                         >
//                           <Eye className="w-4 h-4 text-blue-600" />
//                           <span className="text-sm">Identity Document</span>
//                         </a>
//                       </div>
//                     </div>

//                     {/* Actions */}
//                     <div className="flex gap-3">
//                       <Button
//                         onClick={() => {
//                           setSelectedMerchant(merchant);
//                           setShowApproveModal(true);
//                         }}
//                         className="flex-1 bg-green-600 hover:bg-green-700"
//                         disabled={approveMutation.isLoading || rejectMutation.isLoading}
//                       >
//                         <CheckCircle className="w-5 h-5 mr-2" />
//                         Approve
//                       </Button>
//                       <Button
//                         onClick={() => {
//                           setSelectedMerchant(merchant);
//                           setShowRejectModal(true);
//                         }}
//                         className="flex-1 bg-red-600 hover:bg-red-700"
//                         disabled={approveMutation.isLoading || rejectMutation.isLoading}
//                       >
//                         <XCircle className="w-5 h-5 mr-2" />
//                         Reject
//                       </Button>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             ))}
//           </div>
//         ) : (
//           <Card>
//             <CardContent className="p-12 text-center">
//               <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">
//                 No Pending Verifications
//               </h3>
//               <p className="text-gray-600">
//                 All merchant applications have been processed
//               </p>
//             </CardContent>
//           </Card>
//         )}

//         {/* Approve Modal */}
//         {showApproveModal && selectedMerchant && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-xl max-w-md w-full p-6">
//               <h3 className="text-xl font-bold text-gray-900 mb-4">
//                 Approve Merchant
//               </h3>
//               <p className="text-gray-600 mb-4">
//                 Are you sure you want to approve <strong>{selectedMerchant.businessName}</strong>?
//               </p>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Verification Notes (Optional)
//                 </label>
//                 <textarea
//                   value={notes}
//                   onChange={(e) => setNotes(e.target.value)}
//                   placeholder="All documents verified. Approved."
//                   rows={3}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//                 />
//               </div>
//               <div className="flex gap-3">
//                 <Button
//                   variant="outline"
//                   onClick={() => {
//                     setShowApproveModal(false);
//                     setSelectedMerchant(null);
//                     setNotes('');
//                   }}
//                   className="flex-1"
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   onClick={handleApprove}
//                   className="flex-1 bg-green-600 hover:bg-green-700"
//                   isLoading={approveMutation.isLoading}
//                 >
//                   Confirm Approve
//                 </Button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Reject Modal */}
//         {showRejectModal && selectedMerchant && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-xl max-w-md w-full p-6">
//               <h3 className="text-xl font-bold text-gray-900 mb-4">
//                 Reject Merchant
//               </h3>
//               <p className="text-gray-600 mb-4">
//                 Reject <strong>{selectedMerchant.businessName}</strong>?
//               </p>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Rejection Reason *
//                 </label>
//                 <textarea
//                   value={rejectionReason}
//                   onChange={(e) => setRejectionReason(e.target.value)}
//                   placeholder="Identity document is not clear. Please resubmit."
//                   rows={3}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Verification Notes (Optional)
//                 </label>
//                 <textarea
//                   value={notes}
//                   onChange={(e) => setNotes(e.target.value)}
//                   placeholder="Rejected due to unclear documentation."
//                   rows={2}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//                 />
//               </div>
//               <div className="flex gap-3">
//                 <Button
//                   variant="outline"
//                   onClick={() => {
//                     setShowRejectModal(false);
//                     setSelectedMerchant(null);
//                     setRejectionReason('');
//                     setNotes('');
//                   }}
//                   className="flex-1"
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   onClick={handleReject}
//                   className="flex-1 bg-red-600 hover:bg-red-700"
//                   isLoading={rejectMutation.isLoading}
//                 >
//                   Confirm Reject
//                 </Button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </AdminLayout>
//   );
// };



// src/pages/admin/PendingMerchantsPage.tsx - STUNNING PENDING MERCHANTS! ⏳✨
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, XCircle, Clock, User, Mail, Phone, 
  Building, MapPin, FileText, CreditCard, Eye, ChevronDown,
  ChevronUp, AlertCircle, Download, ExternalLink, Sparkles
} from 'lucide-react';
import { AdminLayout } from '../../shared/components/layout/AdminLayout';
import { Button } from '../../shared/components/ui/Button';
import { Card, CardContent } from '../../shared/components/ui/Card';
import { Spinner } from '../../shared/components/ui/Spinner';
import { Badge } from '../../shared/components/ui/Badge';
import { usePendingMerchants, useApproveMerchant, useRejectMerchant } from '../../features/admin/hooks/useAdmin';
import type { MerchantUser } from '../../features/admin/api/admin.api';

const MerchantCard = ({ 
  merchant, 
  index,
  onApprove,
  onReject 
}: { 
  merchant: MerchantUser; 
  index: number;
  onApprove: (merchant: MerchantUser) => void;
  onReject: (merchant: MerchantUser) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: index * 0.1, 
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }}
      layout
    >
      <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <CardContent className="p-0">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  <h3 className="text-2xl font-bold mb-2">{merchant.businessName}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="warning" className="bg-white/20 border-white/30">
                      PENDING REVIEW
                    </Badge>
                    <span className="text-sm text-orange-100">
                      Applied {new Date(merchant.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + 0.3, type: 'spring' }}
                className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
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
                className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Owner</p>
                  <p className="font-semibold text-gray-900 truncate">{merchant.user.name}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.5 }}
                className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Building className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Category</p>
                  <p className="font-semibold text-gray-900 truncate">{merchant.businessCategory}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.6 }}
                className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="font-semibold text-gray-900 truncate">{merchant.city}, {merchant.state}</p>
                </div>
              </motion.div>
            </div>

            {/* Expand/Collapse Button */}
            <motion.button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium text-gray-700"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
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
                <div className="p-6 border-t border-gray-200 space-y-6">
                  {/* Contact Information */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Mail className="w-5 h-5 text-blue-600" />
                      Contact Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-gray-900">{merchant.user.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium text-gray-900">{merchant.user.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Business Email</p>
                        <p className="font-medium text-gray-900">{merchant.businessEmail}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Business Phone</p>
                        <p className="font-medium text-gray-900">{merchant.businessPhone}</p>
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
                      <Building className="w-5 h-5 text-purple-600" />
                      Business Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                      <div>
                        <p className="text-sm text-gray-500">Business Type</p>
                        <p className="font-medium text-gray-900">{merchant.businessType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Category</p>
                        <p className="font-medium text-gray-900">{merchant.businessCategory}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium text-gray-900">
                          {merchant.address}, {merchant.city}, {merchant.state} {merchant.zipCode}, {merchant.country}
                        </p>
                      </div>
                      {merchant.website && (
                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-500">Website</p>
                          <a 
                            href={merchant.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-blue-600 hover:underline flex items-center gap-1"
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
                      <FileText className="w-5 h-5 text-orange-600" />
                      Registration Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                      <div>
                        <p className="text-sm text-gray-500">Registration Number</p>
                        <p className="font-medium text-gray-900">{merchant.businessRegistrationNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Tax ID</p>
                        <p className="font-medium text-gray-900">{merchant.taxId}</p>
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
                      <CreditCard className="w-5 h-5 text-red-600" />
                      Banking Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                      <div>
                        <p className="text-sm text-gray-500">Bank Name</p>
                        <p className="font-medium text-gray-900">{merchant.bankName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Account Holder</p>
                        <p className="font-medium text-gray-900">{merchant.accountHolderName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Account Number</p>
                        <p className="font-medium text-gray-900">{merchant.accountNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">IFSC Code</p>
                        <p className="font-medium text-gray-900">{merchant.ifscCode}</p>
                      </div>
                      {merchant.swiftCode && (
                        <div>
                          <p className="text-sm text-gray-500">SWIFT Code</p>
                          <p className="font-medium text-gray-900">{merchant.swiftCode}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Documents */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-indigo-600" />
                      Uploaded Documents
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-7">
                      <a
                        href={`http://localhost:4001/${merchant.registrationDocument}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all"
                      >
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Eye className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">Registration</p>
                          <p className="text-xs text-gray-500">Click to view</p>
                        </div>
                      </a>

                      <a
                        href={`http://localhost:4001/${merchant.taxDocument}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all"
                      >
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <FileText className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">Tax Document</p>
                          <p className="text-xs text-gray-500">Click to view</p>
                        </div>
                      </a>

                      <a
                        href={`http://localhost:4001/${merchant.identityDocument}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all"
                      >
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <User className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">ID Document</p>
                          <p className="text-xs text-gray-500">Click to view</p>
                        </div>
                      </a>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex gap-3">
              <motion.div 
                className="flex-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => onApprove(merchant)}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg shadow-green-500/30"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Approve Merchant
                </Button>
              </motion.div>
              <motion.div 
                className="flex-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => onReject(merchant)}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg shadow-red-500/30"
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

export const PendingMerchantsPage: React.FC = () => {
  const { data: merchants, isLoading } = usePendingMerchants();
  const approveMutation = useApproveMerchant();
  const rejectMutation = useRejectMerchant();

  const [selectedMerchant, setSelectedMerchant] = useState<MerchantUser | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const handleApprove = async () => {
    if (!selectedMerchant) return;
    
    try {
      await approveMutation.mutateAsync({
        merchantId: selectedMerchant.userId,
        notes: notes || 'All documents verified. Approved.',
      });
      setShowApproveModal(false);
      setSelectedMerchant(null);
      setNotes('');
    } catch (error) {
      console.error('Failed to approve merchant:', error);
    }
  };

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
      setShowRejectModal(false);
      setSelectedMerchant(null);
      setRejectionReason('');
      setNotes('');
    } catch (error) {
      console.error('Failed to reject merchant:', error);
    }
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
      <div>
        {/* Animated Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <Clock className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Pending Verifications
              </h1>
              <p className="text-gray-600 mt-1 text-lg">
                Review and approve merchant applications
              </p>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-100 to-orange-50 rounded-2xl border-2 border-orange-200"
          >
            <Sparkles className="w-6 h-6 text-orange-600" />
            <span className="text-2xl font-bold text-orange-900">{merchants?.length || 0}</span>
            <span className="text-gray-600 font-medium">Applications Waiting</span>
          </motion.div>
        </motion.div>

        {/* Merchants List */}
        {merchants && merchants.length > 0 ? (
          <div className="space-y-6">
            {merchants.map((merchant, index) => (
              <MerchantCard
                key={merchant.id}
                merchant={merchant}
                index={index}
                onApprove={(m) => {
                  setSelectedMerchant(m);
                  setShowApproveModal(true);
                }}
                onReject={(m) => {
                  setSelectedMerchant(m);
                  setShowRejectModal(true);
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
            <Card>
              <CardContent className="p-16 text-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                  className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center"
                >
                  <CheckCircle className="w-12 h-12 text-green-600" />
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

        {/* Approve Modal */}
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
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                  Approve Merchant
                </h3>
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
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring focus:ring-green-200 transition-all"
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
                    className="flex-1 border-2"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleApprove}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                    isLoading={approveMutation.isLoading}
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Approve
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reject Modal */}
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
                    Rejection Reason *
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="e.g., Identity document is unclear. Please resubmit with a clearer copy."
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring focus:ring-red-200 transition-all"
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
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring focus:ring-red-200 transition-all"
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
                    className="flex-1 border-2"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleReject}
                    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                    isLoading={rejectMutation.isLoading}
                  >
                    <XCircle className="w-5 h-5 mr-2" />
                    Reject
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