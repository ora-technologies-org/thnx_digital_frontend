// // src/pages/merchant/ScanPage.tsx
// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   QrCode,
//   CheckCircle,
//   AlertCircle,
//   Receipt,
//   User,
//   Store,
// } from "lucide-react";
// import { DashboardLayout } from "../../shared/components/layout/DashboardLayout";
// import { Button } from "../../shared/components/ui/Button";
// import { Card, CardContent } from "../../shared/components/ui/Card";
// import { OTPModal } from "@/features/purchase/component/OtpModal";
// import { useOTPRedeem } from "@/features/purchase/hooks/useOTPRdeem";
// import VerifyService from "@/features/purchase/services/VerifyService";

// interface PurchaseData {
//   id: string;
//   qrCode: string;
//   customerName: string;
//   customerEmail: string;
//   customerPhone: string;
//   purchaseAmount: string;
//   currentBalance: string;
//   totalRedeemed: string;
//   status: string;
//   purchasedAt: string;
//   expiresAt: string;
//   lastUsedAt: string | null;
//   giftCard: {
//     id: string;
//     title: string;
//     description: string;
//   };
//   merchant: {
//     businessName: string;
//     businessPhone: string;
//     address: string;
//     city: string;
//   };
//   recentRedemptions: Array<{
//     id: string;
//     amount: string;
//     balanceBefore: string;
//     balanceAfter: string;
//     locationName: string;
//     locationAddress: string;
//     notes: string;
//     redeemedAt: string;
//     redeemedBy: {
//       name: string;
//       email: string;
//     };
//   }>;
//   redemptionCount: number;
// }

// export const ScanPage: React.FC = () => {
//   // ==================== STATE MANAGEMENT ====================
//   const [qrCode, setQrCode] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [purchaseData, setPurchaseData] = useState<PurchaseData | null>(null);
//   const [error, setError] = useState("");
//   const [showOTPModal, setShowOTPModal] = useState(false);

//   // ==================== OTP HOOK ====================
//   const {
//     isRequestingOTP,
//     isVerifyingOTP,
//     isRedeeming,
//     otpSent,
//     otpVerified,
//     redeemSuccess,
//     otpError,
//     redeemError,
//     requestOTP,
//     verifyOTP,
//     redeemGiftCard,
//     resetOTPFlow,
//     refreshPurchaseData,
//   } = useOTPRedeem();

//   // ==================== QR CODE VERIFICATION ====================
//   const handleVerify = async () => {
//     if (!qrCode.trim()) {
//       setError("Please enter QR code");
//       return;
//     }

//     setIsLoading(true);
//     setError("");
//     setPurchaseData(null);

//     try {
//       const result = await VerifyService.verifyQRCode(qrCode);

//       if (result.success) {
//         setPurchaseData(result.data!);
//         setError("");
//       } else {
//         setError(result.message || "Invalid QR code");
//       }
//     } catch (err) {
//       console.error("QR code verification error:", err);
//       setError("Failed to verify QR code");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // ==================== REDEEM FLOW ====================
//   // ✅ Direct OTP Modal - Opens modal and requests OTP immediately
//   const handleRedeemClick = async () => {
//     if (!purchaseData) return;

//     console.log(
//       "🎯 Opening OTP Modal and requesting OTP for:",
//       purchaseData.id,
//     );

//     // Open modal first
//     setShowOTPModal(true);

//     // Request OTP immediately
//     await requestOTP(purchaseData.id);
//   };

//   // ✅ Handle OTP verification and redemption
//   // qrCode is automatically taken from purchaseData, not passed from modal
//   const handleOTPVerified = async (
//     amount: string,
//     locationName: string,
//     locationAddress: string,
//     notes: string,
//   ) => {
//     if (!purchaseData) return;

//     console.log("🎯 Redemption payload:", {
//       qrCode: purchaseData.qrCode, // QR code from the verified purchase
//       amount,
//       locationName,
//       locationAddress,
//       notes,
//     });

//     // Call redemption with qrCode from purchaseData
//     const success = await redeemGiftCard(
//       purchaseData.qrCode, // QR code from URL verification
//       amount,
//       locationName,
//       locationAddress,
//       notes,
//     );

//     if (success) {
//       // Refresh purchase data after successful redemption
//       setTimeout(async () => {
//         const refreshedData = await refreshPurchaseData(purchaseData.qrCode);
//         if (refreshedData) {
//           setPurchaseData(refreshedData);
//         }

//         // Close modal and reset OTP flow
//         setShowOTPModal(false);

//         setTimeout(() => {
//           resetOTPFlow();
//         }, 3000);
//       }, 1000);
//     }
//   };

//   // ==================== RESET HANDLER ====================
//   const handleReset = () => {
//     setQrCode("");
//     setPurchaseData(null);
//     setError("");
//     setShowOTPModal(false);
//     resetOTPFlow();
//   };

//   return (
//     <DashboardLayout>
//       <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
//         {/* ==================== HEADER SECTION ==================== */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-6 sm:mb-8 text-center"
//         >
//           <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
//             <QrCode className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
//           </div>
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
//             Scan QR Code
//           </h1>
//           <p className="text-sm sm:text-base text-gray-600 px-4">
//             Enter QR code to view gift card details and redeem
//           </p>
//         </motion.div>

//         {/* ==================== SUCCESS MESSAGE ==================== */}
//         <AnimatePresence>
//           {redeemSuccess && (
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.9 }}
//               className="mb-4 sm:mb-6"
//             >
//               <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
//                 <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
//                 <div>
//                   <p className="font-semibold text-sm sm:text-base text-green-900">
//                     Redeemed Successfully!
//                   </p>
//                   <p className="text-xs sm:text-sm text-green-700">
//                     Amount has been redeemed
//                   </p>
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* ==================== ERROR MESSAGE ==================== */}
//         <AnimatePresence>
//           {redeemError && (
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//               className="mb-4 sm:mb-6"
//             >
//               <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
//                 <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 flex-shrink-0" />
//                 <div>
//                   <p className="font-semibold text-sm sm:text-base text-red-900">
//                     Redemption Failed
//                   </p>
//                   <p className="text-xs sm:text-sm text-red-800">
//                     {redeemError}
//                   </p>
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* ==================== QR CODE INPUT ==================== */}
//         {!purchaseData && (
//           <Card>
//             <CardContent className="p-4 sm:p-6 lg:p-8">
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Enter QR Code
//                   </label>
//                   <div className="flex flex-col sm:flex-row gap-3">
//                     <input
//                       type="text"
//                       value={qrCode}
//                       onChange={(e) => {
//                         setQrCode(e.target.value);
//                         setError("");
//                       }}
//                       onKeyPress={(e) => e.key === "Enter" && handleVerify()}
//                       placeholder="THNX-DIGITAL-..."
//                       className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
//                       disabled={isLoading}
//                     />
//                     <Button
//                       onClick={handleVerify}
//                       isLoading={isLoading}
//                       disabled={isLoading || !qrCode.trim()}
//                       className="bg-blue-600 hover:bg-blue-700 px-8 w-full sm:w-auto"
//                     >
//                       {isLoading ? "Loading..." : "Verify"}
//                     </Button>
//                   </div>
//                 </div>

//                 {/* Error Display */}
//                 {error && (
//                   <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
//                     <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
//                     <p className="text-xs sm:text-sm text-red-800">{error}</p>
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* ==================== PURCHASE DETAILS ==================== */}
//         <AnimatePresence>
//           {purchaseData && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="space-y-4 sm:space-y-6"
//             >
//               <Card>
//                 <CardContent className="p-4 sm:p-6">
//                   <div className="flex flex-col sm:flex-row items-start justify-between mb-4 sm:mb-6 gap-3">
//                     <div>
//                       <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
//                         {purchaseData.giftCard.title}
//                       </h3>
//                       <p className="text-sm sm:text-base text-gray-600">
//                         {purchaseData.giftCard.description}
//                       </p>
//                     </div>
//                     <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-100 rounded-lg">
//                       <span className="text-sm sm:text-base font-semibold text-green-900">
//                         {purchaseData.status}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 border-2 border-blue-200">
//                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
//                       <div>
//                         <p className="text-xs sm:text-sm text-gray-700 mb-1">
//                           Purchase Amount
//                         </p>
//                         <p className="text-xl sm:text-2xl font-bold text-gray-900">
//                           ₹{parseFloat(purchaseData.purchaseAmount).toFixed(2)}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-xs sm:text-sm text-gray-700 mb-1">
//                           Current Balance
//                         </p>
//                         <p className="text-2xl sm:text-3xl font-bold text-blue-600">
//                           ₹{parseFloat(purchaseData.currentBalance).toFixed(2)}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-xs sm:text-sm text-gray-700 mb-1">
//                           Total Redeemed
//                         </p>
//                         <p className="text-xl sm:text-2xl font-bold text-gray-900">
//                           ₹{parseFloat(purchaseData.totalRedeemed).toFixed(2)}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
//                     {/* Customer Details */}
//                     <div>
//                       <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
//                         <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
//                         Customer Details
//                       </h4>
//                       <div className="space-y-2 text-xs sm:text-sm">
//                         <p>
//                           <span className="text-gray-600">Name:</span>{" "}
//                           <span className="font-medium">
//                             {purchaseData.customerName}
//                           </span>
//                         </p>
//                         <p className="break-all">
//                           <span className="text-gray-600">Email:</span>{" "}
//                           <span className="font-medium">
//                             {purchaseData.customerEmail}
//                           </span>
//                         </p>
//                         <p>
//                           <span className="text-gray-600">Phone:</span>{" "}
//                           <span className="font-medium">
//                             {purchaseData.customerPhone}
//                           </span>
//                         </p>
//                       </div>
//                     </div>

//                     {/* Merchant Details */}
//                     <div>
//                       <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
//                         <Store className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
//                         Merchant Details
//                       </h4>
//                       <div className="space-y-2 text-xs sm:text-sm">
//                         <p>
//                           <span className="text-gray-600">Business:</span>{" "}
//                           <span className="font-medium">
//                             {purchaseData.merchant.businessName}
//                           </span>
//                         </p>
//                         <p>
//                           <span className="text-gray-600">Phone:</span>{" "}
//                           <span className="font-medium">
//                             {purchaseData.merchant.businessPhone}
//                           </span>
//                         </p>
//                         <p>
//                           <span className="text-gray-600">Address:</span>{" "}
//                           <span className="font-medium">
//                             {purchaseData.merchant.address},{" "}
//                             {purchaseData.merchant.city}
//                           </span>
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm border-t pt-4">
//                     <div>
//                       <p className="text-gray-600">Purchased</p>
//                       <p className="font-medium">
//                         {new Date(
//                           purchaseData.purchasedAt,
//                         ).toLocaleDateString()}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-gray-600">Expires</p>
//                       <p className="font-medium">
//                         {new Date(purchaseData.expiresAt).toLocaleDateString()}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-gray-600">Last Used</p>
//                       <p className="font-medium">
//                         {purchaseData.lastUsedAt
//                           ? new Date(
//                               purchaseData.lastUsedAt,
//                             ).toLocaleDateString()
//                           : "Never"}
//                       </p>
//                     </div>
//                   </div>

//                   {/* ========== ACTION BUTTONS ========== */}
//                   <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t">
//                     <Button
//                       onClick={handleReset}
//                       variant="outline"
//                       className="flex-1"
//                     >
//                       Scan Another
//                     </Button>
//                     <Button
//                       onClick={handleRedeemClick}
//                       className="flex-1 bg-green-600 hover:bg-green-700"
//                       disabled={parseFloat(purchaseData.currentBalance) <= 0}
//                     >
//                       <Receipt className="w-4 h-4 mr-2" />
//                       Redeem Amount
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>

//       {/* ==================== OTP MODAL ==================== */}
//       {/* qrCode is passed to modal but NOT shown in form - only used for payload */}
//       <OTPModal
//         isOpen={showOTPModal}
//         onClose={() => {
//           setShowOTPModal(false);
//           resetOTPFlow();
//         }}
//         purchaseId={purchaseData?.id || ""}
//         qrCode={purchaseData?.qrCode || ""} // Pass qrCode but don't show in form
//         customerEmail={purchaseData?.customerEmail}
//         customerPhone={purchaseData?.customerPhone}
//         currentBalance={purchaseData?.currentBalance || "0"}
//         onOTPVerified={handleOTPVerified} // Only receives form fields
//         onRequestOTP={requestOTP}
//         onVerifyOTP={verifyOTP}
//         isRequestingOTP={isRequestingOTP}
//         isVerifyingOTP={isVerifyingOTP}
//         otpSent={otpSent}
//         otpVerified={otpVerified}
//         otpError={otpError}
//       />

//       {/* ==================== REDEMPTION LOADING ==================== */}
//       {isRedeeming && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
//             <div className="flex items-center gap-3">
//               <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent" />
//               <span className="font-medium">Processing redemption...</span>
//             </div>
//           </div>
//         </div>
//       )}
//     </DashboardLayout>
//   );
// };
// src/pages/merchant/ScanPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // 👈 CHANGED: useParams instead of useSearchParams
import { motion, AnimatePresence } from "framer-motion";
import {
  QrCode,
  CheckCircle,
  AlertCircle,
  Receipt,
  User,
  Store,
} from "lucide-react";
import { DashboardLayout } from "../../shared/components/layout/DashboardLayout";
import { Button } from "../../shared/components/ui/Button";
import { Card, CardContent } from "../../shared/components/ui/Card";
import { OTPModal } from "@/features/purchase/component/OtpModal";
import { useOTPRedeem } from "@/features/purchase/hooks/useOTPRdeem";
import VerifyService from "@/features/purchase/services/VerifyService";
import { useAppSelector } from "@/app/hooks";

interface PurchaseData {
  id: string;
  qrCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  purchaseAmount: string;
  currentBalance: string;
  totalRedeemed: string;
  status: string;
  purchasedAt: string;
  expiresAt: string;
  lastUsedAt: string | null;
  giftCard: {
    id: string;
    title: string;
    description: string;
  };
  merchant: {
    businessName: string;
    businessPhone: string;
    address: string;
    city: string;
  };
  recentRedemptions: Array<{
    id: string;
    amount: string;
    balanceBefore: string;
    balanceAfter: string;
    locationName: string;
    locationAddress: string;
    notes: string;
    redeemedAt: string;
    redeemedBy: {
      name: string;
      email: string;
    };
  }>;
  redemptionCount: number;
}

export const ScanPage: React.FC = () => {
  const navigate = useNavigate();
  const { qrCode: qrCodeParam } = useParams<{ qrCode?: string }>(); // 👈 CHANGED: Get QR from URL path parameter
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // ==================== STATE MANAGEMENT ====================
  const [qrCode, setQrCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [purchaseData, setPurchaseData] = useState<PurchaseData | null>(null);
  const [error, setError] = useState("");
  const [showOTPModal, setShowOTPModal] = useState(false);

  // ==================== OTP HOOK ====================
  const {
    isRequestingOTP,
    isVerifyingOTP,
    isRedeeming,
    otpSent,
    otpVerified,
    redeemSuccess,
    otpError,
    redeemError,
    requestOTP,
    verifyOTP,
    redeemGiftCard,
    resetOTPFlow,
    refreshPurchaseData,
  } = useOTPRedeem();

  // ==================== AUTO-VERIFY QR FROM URL ====================
  useEffect(() => {
    console.log("🔍 ScanPage mounted:", {
      qrCodeParam,
      isAuthenticated,
      userRole: user?.role,
    });

    if (qrCodeParam) {
      // QR code found in URL path
      console.log("✅ QR code found in URL path:", qrCodeParam);
      setQrCode(qrCodeParam);

      // Auto-verify the QR code
      autoVerifyQR(qrCodeParam);
    }
  }, [qrCodeParam, isAuthenticated, user]);

  // ==================== AUTO VERIFY FUNCTION ====================
  const autoVerifyQR = async (code: string) => {
    console.log("🚀 Auto-verifying QR code:", code);

    setIsLoading(true);
    setError("");
    setPurchaseData(null);

    try {
      const result = await VerifyService.verifyQRCode(code);

      if (result.success) {
        console.log("✅ QR verified successfully:", result.data);
        setPurchaseData(result.data!);
        setError("");
      } else {
        console.log("❌ QR verification failed:", result.message);
        setError(result.message || "Invalid QR code");
      }
    } catch (err) {
      console.error("❌ QR code verification error:", err);
      setError("Failed to verify QR code");
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== MANUAL QR CODE VERIFICATION ====================
  const handleVerify = async () => {
    if (!qrCode.trim()) {
      setError("Please enter QR code");
      return;
    }

    setIsLoading(true);
    setError("");
    setPurchaseData(null);

    try {
      const result = await VerifyService.verifyQRCode(qrCode);

      if (result.success) {
        setPurchaseData(result.data!);
        setError("");
      } else {
        setError(result.message || "Invalid QR code");
      }
    } catch (err) {
      console.error("QR code verification error:", err);
      setError("Failed to verify QR code");
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== REDEEM FLOW ====================
  const handleRedeemClick = async () => {
    if (!purchaseData) return;

    console.log(
      "🎯 Opening OTP Modal and requesting OTP for:",
      purchaseData.id,
    );
    setShowOTPModal(true);
    await requestOTP(purchaseData.id);
  };

  const handleOTPVerified = async (
    amount: string,
    locationName: string,
    locationAddress: string,
    notes: string,
  ) => {
    if (!purchaseData) return;

    console.log("🎯 Redemption payload:", {
      qrCode: purchaseData.qrCode,
      amount,
      locationName,
      locationAddress,
      notes,
    });

    const success = await redeemGiftCard(
      purchaseData.qrCode,
      amount,
      locationName,
      locationAddress,
      notes,
    );

    if (success) {
      setTimeout(async () => {
        const refreshedData = await refreshPurchaseData(purchaseData.qrCode);
        if (refreshedData) {
          setPurchaseData(refreshedData);
        }

        setShowOTPModal(false);
        setTimeout(() => {
          resetOTPFlow();
        }, 3000);
      }, 1000);
    }
  };

  // ==================== RESET HANDLER ====================
  const handleReset = () => {
    setQrCode("");
    setPurchaseData(null);
    setError("");
    setShowOTPModal(false);
    resetOTPFlow();

    // Clear URL params
    navigate("/merchant/scan", { replace: true });
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        {/* ==================== HEADER SECTION ==================== */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8 text-center"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <QrCode className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Scan QR Code
          </h1>
          <p className="text-sm sm:text-base text-gray-600 px-4">
            Enter QR code to view gift card details and redeem
          </p>
        </motion.div>

        {/* ==================== SUCCESS MESSAGE ==================== */}
        <AnimatePresence>
          {redeemSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mb-4 sm:mb-6"
            >
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm sm:text-base text-green-900">
                    Redeemed Successfully!
                  </p>
                  <p className="text-xs sm:text-sm text-green-700">
                    Amount has been redeemed
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ==================== ERROR MESSAGE ==================== */}
        <AnimatePresence>
          {redeemError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 sm:mb-6"
            >
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm sm:text-base text-red-900">
                    Redemption Failed
                  </p>
                  <p className="text-xs sm:text-sm text-red-800">
                    {redeemError}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ==================== QR CODE INPUT ==================== */}
        {!purchaseData && (
          <Card>
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter QR Code
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={qrCode}
                      onChange={(e) => {
                        setQrCode(e.target.value);
                        setError("");
                      }}
                      onKeyPress={(e) => e.key === "Enter" && handleVerify()}
                      placeholder="THNX-DIGITAL-..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                      disabled={isLoading}
                    />
                    <Button
                      onClick={handleVerify}
                      isLoading={isLoading}
                      disabled={isLoading || !qrCode.trim()}
                      className="bg-blue-600 hover:bg-blue-700 px-8 w-full sm:w-auto"
                    >
                      {isLoading ? "Loading..." : "Verify"}
                    </Button>
                  </div>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs sm:text-sm text-red-800">{error}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ==================== PURCHASE DETAILS ==================== */}
        <AnimatePresence>
          {purchaseData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 sm:space-y-6"
            >
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start justify-between mb-4 sm:mb-6 gap-3">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                        {purchaseData.giftCard.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600">
                        {purchaseData.giftCard.description}
                      </p>
                    </div>
                    <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-100 rounded-lg">
                      <span className="text-sm sm:text-base font-semibold text-green-900">
                        {purchaseData.status}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 border-2 border-blue-200">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-700 mb-1">
                          Purchase Amount
                        </p>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900">
                          ₹{parseFloat(purchaseData.purchaseAmount).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-700 mb-1">
                          Current Balance
                        </p>
                        <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                          ₹{parseFloat(purchaseData.currentBalance).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-700 mb-1">
                          Total Redeemed
                        </p>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900">
                          ₹{parseFloat(purchaseData.totalRedeemed).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                    {/* Customer Details */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                        Customer Details
                      </h4>
                      <div className="space-y-2 text-xs sm:text-sm">
                        <p>
                          <span className="text-gray-600">Name:</span>{" "}
                          <span className="font-medium">
                            {purchaseData.customerName}
                          </span>
                        </p>
                        <p className="break-all">
                          <span className="text-gray-600">Email:</span>{" "}
                          <span className="font-medium">
                            {purchaseData.customerEmail}
                          </span>
                        </p>
                        <p>
                          <span className="text-gray-600">Phone:</span>{" "}
                          <span className="font-medium">
                            {purchaseData.customerPhone}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Merchant Details */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
                        <Store className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                        Merchant Details
                      </h4>
                      <div className="space-y-2 text-xs sm:text-sm">
                        <p>
                          <span className="text-gray-600">Business:</span>{" "}
                          <span className="font-medium">
                            {purchaseData.merchant.businessName}
                          </span>
                        </p>
                        <p>
                          <span className="text-gray-600">Phone:</span>{" "}
                          <span className="font-medium">
                            {purchaseData.merchant.businessPhone}
                          </span>
                        </p>
                        <p>
                          <span className="text-gray-600">Address:</span>{" "}
                          <span className="font-medium">
                            {purchaseData.merchant.address},{" "}
                            {purchaseData.merchant.city}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm border-t pt-4">
                    <div>
                      <p className="text-gray-600">Purchased</p>
                      <p className="font-medium">
                        {new Date(
                          purchaseData.purchasedAt,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Expires</p>
                      <p className="font-medium">
                        {new Date(purchaseData.expiresAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Last Used</p>
                      <p className="font-medium">
                        {purchaseData.lastUsedAt
                          ? new Date(
                              purchaseData.lastUsedAt,
                            ).toLocaleDateString()
                          : "Never"}
                      </p>
                    </div>
                  </div>

                  {/* ========== ACTION BUTTONS ========== */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t">
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      className="flex-1"
                    >
                      Scan Another
                    </Button>
                    <Button
                      onClick={handleRedeemClick}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      disabled={parseFloat(purchaseData.currentBalance) <= 0}
                    >
                      <Receipt className="w-4 h-4 mr-2" />
                      Redeem Amount
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ==================== OTP MODAL ==================== */}
      <OTPModal
        isOpen={showOTPModal}
        onClose={() => {
          setShowOTPModal(false);
          resetOTPFlow();
        }}
        purchaseId={purchaseData?.id || ""}
        qrCode={purchaseData?.qrCode || ""}
        customerEmail={purchaseData?.customerEmail}
        customerPhone={purchaseData?.customerPhone}
        currentBalance={purchaseData?.currentBalance || "0"}
        onOTPVerified={handleOTPVerified}
        onRequestOTP={requestOTP}
        onVerifyOTP={verifyOTP}
        isRequestingOTP={isRequestingOTP}
        isVerifyingOTP={isVerifyingOTP}
        otpSent={otpSent}
        otpVerified={otpVerified}
        otpError={otpError}
      />

      {/* ==================== REDEMPTION LOADING ==================== */}
      {isRedeeming && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent" />
              <span className="font-medium">Processing redemption...</span>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
