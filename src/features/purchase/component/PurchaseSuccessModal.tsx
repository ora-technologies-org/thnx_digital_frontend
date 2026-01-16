// src/features/purchases/components/PurchaseSuccessModal.tsx - SUCCESS WITH QR CODE! 🎉
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Download, Printer, QrCode } from "lucide-react";
import { Modal } from "../../../shared/components/ui/Modal";
import { Button } from "../../../shared/components/ui/Button";
import type { GiftCard } from "../../giftCards/types/giftCard.types";

// Define a proper interface for the purchase object
interface Purchase {
  id: string;
  transactionId: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  code?: string;
  qrCode?: string;
  createdAt: string | Date;
}

interface PurchaseSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchase: Purchase;
  giftCard: GiftCard;
}

export const PurchaseSuccessModal: React.FC<PurchaseSuccessModalProps> = ({
  isOpen,
  onClose,
  purchase,
  giftCard,
}) => {
  // Get QR code from either property
  const qrCode = purchase.code || purchase.qrCode || "";

  const handleDownload = () => {
    // Create a simple text file with purchase details
    const content = `
THNX DIGITAL GIFT CARD
======================

QR Code: ${qrCode}
Gift Card: ${giftCard.title}
Amount: ₹${giftCard.price}
Transaction ID: ${purchase.transactionId}
Date: ${new Date(purchase.createdAt).toLocaleString()}

Present this QR code at the store to redeem your gift card.
    `.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `thnx-digital-${qrCode || purchase.id}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="lg">
      <div className="text-center space-y-6">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
        </motion.div>

        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Purchase Successful!
          </h2>
          <p className="text-gray-600">
            Your gift card has been purchased successfully
          </p>
        </div>

        {/* QR Code Display */}
        <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-8 border-2 border-orange-200">
          <div className="w-64 h-64 bg-white rounded-xl mx-auto mb-6 flex items-center justify-center border-4 border-gray-200 shadow-lg">
            {/* QR Code Placeholder */}
            <div className="text-center">
              <QrCode className="w-32 h-32 text-gray-400 mx-auto mb-4" />
              {qrCode ? (
                <code className="text-xs font-mono text-gray-600 break-all px-4">
                  {qrCode}
                </code>
              ) : (
                <p className="text-sm text-gray-500">No QR code available</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-2">Your Gift Card Code:</p>
            {qrCode ? (
              <code className="block text-lg font-mono font-bold text-gray-900 bg-gray-100 px-4 py-3 rounded-lg break-all">
                {qrCode}
              </code>
            ) : (
              <p className="text-sm text-gray-500 py-3">No code available</p>
            )}
          </div>

          <p className="text-sm text-gray-700">
            <strong>Save this QR code!</strong> Present it at the store to
            redeem your gift card.
          </p>
        </div>

        {/* Purchase Details */}
        <div className="bg-gray-50 rounded-lg p-6 text-left">
          <h3 className="font-semibold text-gray-900 mb-4">Purchase Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Gift Card</span>
              <span className="font-medium text-gray-900">
                {giftCard.title}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount</span>
              <span className="font-medium text-gray-900">
                ₹{parseFloat(giftCard.price.toString()).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Transaction ID</span>
              <span className="font-mono text-xs text-gray-900">
                {purchase.transactionId}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date</span>
              <span className="text-gray-900">
                {new Date(purchase.createdAt).toLocaleDateString()}
              </span>
            </div>
            {purchase.status && (
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className="text-gray-900 capitalize">
                  {purchase.status}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>📧 Email Sent!</strong>
            <br />A copy of your gift card and QR code has been sent to your
            email address.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>

        {/* Close Button */}
        <Button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700"
        >
          Done
        </Button>
      </div>
    </Modal>
  );
};
