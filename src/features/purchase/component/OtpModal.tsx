import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, CheckCircle, Clock, AlertCircle, Receipt } from "lucide-react";
import { Modal } from "@/shared/components/ui/Modal";
import { Button } from "@/shared/components/ui/Button";

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchaseId: string;
  qrCode: string;
  customerEmail?: string;
  customerPhone?: string;
  currentBalance: string;
  merchantAddress?: string; // NEW: merchant address
  merchantCity?: string; // NEW: merchant city
  onOTPVerified: (
    amount: string,
    locationName: string,
    locationAddress: string,
    notes: string,
  ) => void;
  onRequestOTP: (purchaseId: string) => Promise<void>;
  onVerifyOTP: (otp: string, purchaseId: string) => Promise<boolean>;
  isRequestingOTP: boolean;
  isVerifyingOTP: boolean;
  otpSent: boolean;
  otpVerified: boolean;
  otpError: string;
}

export const OTPModal: React.FC<OTPModalProps> = ({
  isOpen,
  onClose,
  purchaseId,
  customerEmail,
  customerPhone,
  currentBalance,
  merchantAddress = "",
  merchantCity = "",
  onOTPVerified,
  onRequestOTP,
  onVerifyOTP,
  isRequestingOTP,
  isVerifyingOTP,
  otpSent,
  otpVerified,
  otpError,
}) => {
  // ==================== STATE MANAGEMENT ====================
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [amount, setAmount] = useState("");
  const [locationName, setLocationName] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [formError, setFormError] = useState("");

  // Track when to reset timer - increment this to restart countdown
  const [timerResetKey, setTimerResetKey] = useState(0);

  // Refs
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // ==================== TIMER COMPONENT ====================
  const TimerCountdown: React.FC<{ onComplete: () => void }> = ({
    onComplete,
  }) => {
    const [seconds, setSeconds] = useState(60);

    useEffect(() => {
      if (seconds === 0) {
        onComplete();
        return;
      }

      const interval = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }, [seconds, onComplete]);

    return (
      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
        <Clock className="w-4 h-4" />
        <span>Resend OTP in {seconds}s</span>
      </div>
    );
  };

  const [canResend, setCanResend] = useState(false);

  // ==================== PREFILL LOCATION ADDRESS ====================
  useEffect(() => {
    if (isOpen && merchantAddress && merchantCity && !locationAddress) {
      const fullAddress = `${merchantAddress}`;
      const locationName = `${merchantCity}`;
      setLocationAddress(fullAddress);
      setLocationName(locationName);
    }
  }, [isOpen, merchantAddress, merchantCity, locationAddress]);

  // ==================== HANDLERS ====================

  const handleClose = useCallback(() => {
    // Reset all state
    setOtp(["", "", "", "", "", ""]);
    setAmount("");
    setLocationName("");
    setLocationAddress("");
    setNotes("");
    setFormError("");
    setTimerResetKey(0);
    setCanResend(false);

    // Clear interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    onClose();
  }, [onClose]);

  const handleRequestOTP = async () => {
    console.log("🔄 Manually requesting OTP for:", purchaseId);

    // Reset UI state
    setOtp(["", "", "", "", "", ""]);
    setCanResend(false);

    await onRequestOTP(purchaseId);

    // Increment key to reset timer
    setTimerResetKey((prev) => prev + 1);
  };

  const handleOTPChange = (index: number, value: string) => {
    // Allow alphanumeric characters (letters and numbers)
    if (!/^[a-zA-Z0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    // Convert to uppercase for consistency
    newOtp[index] = value.toUpperCase();
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Handle cut (Ctrl+X) - move focus to previous field
    if (e.ctrlKey && e.key === "x") {
      e.preventDefault();
      // Clear current field
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);

      // Move focus to previous field if current is empty
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleCut = (index: number, e: React.ClipboardEvent) => {
    e.preventDefault();

    // Clear current field
    const newOtp = [...otp];
    newOtp[index] = "";
    setOtp(newOtp);

    // Move focus to previous field
    if (index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").toUpperCase();

    // Filter only alphanumeric characters
    const filteredData = pastedData.replace(/[^A-Z0-9]/g, "");

    // Take only first 6 characters
    const otpArray = filteredData.slice(0, 6).split("");

    // Update OTP state
    const newOtp = [...otp];
    otpArray.forEach((char, index) => {
      if (index < 6) {
        newOtp[index] = char;
      }
    });
    setOtp(newOtp);

    // Focus on the next empty field or the last field
    const nextEmptyIndex = newOtp.findIndex((char) => !char);
    if (nextEmptyIndex !== -1 && nextEmptyIndex < 6) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      console.warn("⚠️ OTP incomplete:", otpString.length);
      return;
    }

    console.log("✅ Verifying OTP:", otpString);
    await onVerifyOTP(otpString, purchaseId);
  };

  const handleFinalSubmit = () => {
    const redeemAmount = parseFloat(amount);
    if (!amount || isNaN(redeemAmount) || redeemAmount <= 0) {
      setFormError("Please enter valid amount");
      return;
    }

    const balance = parseFloat(currentBalance);
    if (redeemAmount > balance) {
      setFormError(`Amount cannot exceed current balance (₹${balance})`);
      return;
    }

    if (!locationName.trim() || !locationAddress.trim()) {
      setFormError("Please enter location details");
      return;
    }

    console.log("✅ All validations passed. Proceeding with redemption...");
    // Only pass form fields - qrCode is already available in parent
    onOTPVerified(amount, locationName, locationAddress, notes);
  };

  const formatPhone = (phone?: string) => {
    if (!phone) return "";
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-***-$3");
  };

  // ==================== EFFECTS ====================

  // Initialize timer when OTP is sent for the first time
  useEffect(() => {
    if (otpSent && timerResetKey === 0) {
      setTimerResetKey(1);
    }
  }, [otpSent, timerResetKey]);

  // Auto-focus first input when OTP is sent
  useEffect(() => {
    if (otpSent && isOpen) {
      const timeoutId = setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [otpSent, isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <div className="p-6">
        {/* ========== HEADER ========== */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {otpVerified ? "Enter Redemption Details" : "OTP Verification"}
              </h3>
              <p className="text-sm text-gray-600">
                {otpVerified ? "Complete the redemption" : "Secure redemption"}
              </p>
            </div>
          </div>
        </div>

        {/* OTP VERIFICATION ========== */}
        {!otpVerified && (
          <div>
            {isRequestingOTP && (
              <div className="mb-6 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent" />
                  <span className="text-sm font-medium text-blue-700">
                    Sending OTP...
                  </span>
                </div>
              </div>
            )}

            {otpSent && !isRequestingOTP && (
              <div className="mb-6">
                <p className="text-gray-700 mb-2">
                  Enter the 6-character OTP sent to:
                </p>
                {customerPhone && (
                  <p className="font-medium text-gray-900 mb-1">
                    📱 {formatPhone(customerPhone)}
                  </p>
                )}
                {customerEmail && (
                  <p className="font-medium text-gray-900">
                    ✉️ {customerEmail}
                  </p>
                )}
              </div>
            )}

            {otpSent && !isRequestingOTP && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Enter OTP
                </label>
                <div className="flex gap-2 justify-center">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => void (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOTPChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      onCut={(e) => handleCut(index, e)}
                      className="w-12 h-14 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                      disabled={isVerifyingOTP}
                    />
                  ))}
                </div>
              </div>
            )}

            {otpSent && !isRequestingOTP && (
              <div className="mb-6">
                {!canResend ? (
                  <TimerCountdown
                    key={timerResetKey}
                    onComplete={() => setCanResend(true)}
                  />
                ) : (
                  <button
                    onClick={handleRequestOTP}
                    disabled={isRequestingOTP}
                    className="w-full py-3 text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 transition-colors"
                  >
                    {isRequestingOTP ? "Sending..." : "Resend OTP"}
                  </button>
                )}
              </div>
            )}

            <AnimatePresence>
              {otpError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4"
                >
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-800">{otpError}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={isVerifyingOTP || isRequestingOTP}
              >
                Cancel
              </Button>
              <Button
                onClick={handleVerifyOTP}
                isLoading={isVerifyingOTP}
                disabled={
                  otp.some((digit) => !digit) ||
                  isVerifyingOTP ||
                  !otpSent ||
                  isRequestingOTP
                }
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isVerifyingOTP ? "Verifying..." : "Verify OTP"}
              </Button>
            </div>
          </div>
        )}

        {/* ========== STEP 2: REDEMPTION FORM ========== */}
        {otpVerified && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-sm text-green-800 font-medium">
                  OTP Verified Successfully!
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setFormError("");
                  }}
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Max: ₹{parseFloat(currentBalance).toFixed(2)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location Name *
                </label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => {
                    setLocationName(e.target.value);
                    setFormError("");
                  }}
                  placeholder="KFC Connaught Place"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location Address *
                </label>
                <input
                  type="text"
                  value={locationAddress}
                  onChange={(e) => {
                    setLocationAddress(e.target.value);
                    setFormError("");
                  }}
                  placeholder="Connaught Place, New Delhi"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {merchantAddress && merchantCity && <p></p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Order #1234 - 2 Zinger Burgers"
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {formError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-800">{formError}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleFinalSubmit}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Receipt className="w-4 h-4 mr-2" />
                Complete Redemption
              </Button>
            </div>
          </motion.div>
        )}

        <p className="text-xs text-gray-500 text-center mt-4">
          For security reasons, OTP expires in 10 minutes
        </p>
      </div>
    </Modal>
  );
};
