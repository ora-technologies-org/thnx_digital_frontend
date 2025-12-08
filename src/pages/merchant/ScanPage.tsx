
// src/pages/merchant/ScanPage.tsx - AUTH FOR REDEEM ONLY! 🎯
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  QrCode, CheckCircle, AlertCircle, 
  User, Store,
 Receipt, History
} from 'lucide-react';
import { DashboardLayout } from '../../shared/components/layout/DashboardLayout';
import { Button } from '../../shared/components/ui/Button';
import { Card, CardContent } from '../../shared/components/ui/Card';

const API_URL = import.meta.env.VITE_API_URL || '/api';

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('accessToken') || '';
};

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
  const [qrCode, setQrCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [purchaseData, setPurchaseData] = useState<PurchaseData | null>(null);
  const [error, setError] = useState('');
  
  // Redeem form
  const [showRedeemForm, setShowRedeemForm] = useState(false);
  const [amount, setAmount] = useState('');
  const [locationName, setLocationName] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redeemSuccess, setRedeemSuccess] = useState(false);

  // VERIFY - NO AUTH
  const handleVerify = async () => {
    if (!qrCode.trim()) {
      setError('Please enter QR code');
      return;
    }

    setIsLoading(true);
    setError('');
    setPurchaseData(null);

    try {
      const response = await fetch(`${API_URL}/purchases/qr/${qrCode.trim()}`);
      
      if (!response.ok) {
        throw new Error('QR code not found');
      }

      const result = await response.json();
      setPurchaseData(result.data.purchase);
      setError('');
    } catch (err) {
      setError('Invalid QR code or purchase not found');
      setPurchaseData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // REDEEM - WITH AUTH TOKEN!
  const handleRedeem = async () => {
    if (!purchaseData) return;

    const redeemAmount = parseFloat(amount);
    if (!amount || isNaN(redeemAmount) || redeemAmount <= 0) {
      setError('Please enter valid amount');
      return;
    }

    const currentBalance = parseFloat(purchaseData.currentBalance);
    if (redeemAmount > currentBalance) {
      setError(`Amount cannot exceed current balance (₹${currentBalance})`);
      return;
    }

    if (!locationName.trim() || !locationAddress.trim()) {
      setError('Please enter location details');
      return;
    }

    setIsRedeeming(true);
    setError('');

    try {
      const token = getToken();
      
      const response = await fetch(`${API_URL}/purchases/redeem`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // ← AUTH TOKEN HERE!
        },
        body: JSON.stringify({
          qrCode: purchaseData.qrCode,
          amount: redeemAmount,
          locationName: locationName.trim(),
          locationAddress: locationAddress.trim(),
          notes: notes.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to redeem');
      }

      const result = await response.json();
      setRedeemSuccess(true);

      // Refresh purchase data (NO AUTH)
      setTimeout(async () => {
        const refreshResponse = await fetch(`${API_URL}/purchases/qr/${qrCode.trim()}`);
        const refreshResult = await refreshResponse.json();
        setPurchaseData(refreshResult.data.purchase);
        
        setShowRedeemForm(false);
        setAmount('');
        setLocationName('');
        setLocationAddress('');
        setNotes('');
        setRedeemSuccess(false);
      }, 2000);

    } catch (err) {
      setError('Failed to redeem. Please try again.');
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleReset = () => {
    setQrCode('');
    setPurchaseData(null);
    setShowRedeemForm(false);
    setAmount('');
    setLocationName('');
    setLocationAddress('');
    setNotes('');
    setError('');
    setRedeemSuccess(false);
  };

  return (
    <DashboardLayout>
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <QrCode className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Scan QR Code
          </h1>
          <p className="text-gray-600">
            Enter QR code to view gift card details and redeem
          </p>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {redeemSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mb-6"
            >
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-semibold text-green-900">Redeemed Successfully!</p>
                  <p className="text-sm text-green-700">₹{amount} has been redeemed</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* QR Input */}
        {!purchaseData && (
          <Card>
            <CardContent className="p-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter QR Code
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={qrCode}
                      onChange={(e) => {
                        setQrCode(e.target.value);
                        setError('');
                      }}
                      onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
                      placeholder="THNX-DIGITAL-MI7DLDHC-FE4C3267AB391E80"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isLoading}
                    />
                    <Button
                      onClick={handleVerify}
                      isLoading={isLoading}
                      disabled={isLoading || !qrCode.trim()}
                      className="bg-blue-600 hover:bg-blue-700 px-8"
                    >
                      {isLoading ? 'Loading...' : 'Verify'}
                    </Button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Purchase Details */}
        <AnimatePresence>
          {purchaseData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Main Info */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {purchaseData.giftCard.title}
                      </h3>
                      <p className="text-gray-600">{purchaseData.giftCard.description}</p>
                    </div>
                    <div className="px-4 py-2 bg-green-100 rounded-lg">
                      <span className="font-semibold text-green-900">{purchaseData.status}</span>
                    </div>
                  </div>

                  {/* Balance */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6 border-2 border-blue-200">
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm text-gray-700 mb-1">Purchase Amount</p>
                        <p className="text-2xl font-bold text-gray-900">
                          ₹{parseFloat(purchaseData.purchaseAmount).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-700 mb-1">Current Balance</p>
                        <p className="text-3xl font-bold text-blue-600">
                          ₹{parseFloat(purchaseData.currentBalance).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-700 mb-1">Total Redeemed</p>
                        <p className="text-2xl font-bold text-gray-900">
                          ₹{parseFloat(purchaseData.totalRedeemed).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-600" />
                        Customer Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-gray-600">Name:</span> <span className="font-medium">{purchaseData.customerName}</span></p>
                        <p><span className="text-gray-600">Email:</span> <span className="font-medium">{purchaseData.customerEmail}</span></p>
                        <p><span className="text-gray-600">Phone:</span> <span className="font-medium">{purchaseData.customerPhone}</span></p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Store className="w-5 h-5 text-purple-600" />
                        Merchant Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-gray-600">Business:</span> <span className="font-medium">{purchaseData.merchant.businessName}</span></p>
                        <p><span className="text-gray-600">Phone:</span> <span className="font-medium">{purchaseData.merchant.businessPhone}</span></p>
                        <p><span className="text-gray-600">Address:</span> <span className="font-medium">{purchaseData.merchant.address}, {purchaseData.merchant.city}</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-3 gap-4 text-sm border-t pt-4">
                    <div>
                      <p className="text-gray-600">Purchased</p>
                      <p className="font-medium">{new Date(purchaseData.purchasedAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Expires</p>
                      <p className="font-medium">{new Date(purchaseData.expiresAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Last Used</p>
                      <p className="font-medium">{purchaseData.lastUsedAt ? new Date(purchaseData.lastUsedAt).toLocaleDateString() : 'Never'}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-6 pt-6 border-t">
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      className="flex-1"
                    >
                      Scan Another
                    </Button>
                    <Button
                      onClick={() => setShowRedeemForm(true)}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      disabled={parseFloat(purchaseData.currentBalance) <= 0}
                    >
                      <Receipt className="w-4 h-4 mr-2" />
                      Redeem Amount
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Redemptions */}
              {purchaseData.recentRedemptions.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <History className="w-5 h-5 text-orange-600" />
                      Recent Redemptions ({purchaseData.redemptionCount})
                    </h4>
                    <div className="space-y-4">
                      {purchaseData.recentRedemptions.map((redemption) => (
                        <div key={redemption.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-semibold text-gray-900">₹{parseFloat(redemption.amount).toFixed(2)}</p>
                              <p className="text-sm text-gray-600">{redemption.locationName}</p>
                              <p className="text-xs text-gray-500">{redemption.locationAddress}</p>
                            </div>
                            <div className="text-right text-xs text-gray-500">
                              <p>{new Date(redemption.redeemedAt).toLocaleDateString()}</p>
                              <p>{new Date(redemption.redeemedAt).toLocaleTimeString()}</p>
                            </div>
                          </div>
                          {redemption.notes && (
                            <p className="text-sm text-gray-600 mt-2">Note: {redemption.notes}</p>
                          )}
                          <div className="flex justify-between text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
                            <span>Before: ₹{redemption.balanceBefore}</span>
                            <span>After: ₹{redemption.balanceAfter}</span>
                            <span>By: {redemption.redeemedBy.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Redeem Form */}
              {showRedeemForm && (
                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Redeem Amount</h4>
                    <div className="space-y-4">
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
                            setError('');
                          }}
                          placeholder="0.00"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={isRedeeming}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Max: ₹{parseFloat(purchaseData.currentBalance).toFixed(2)}
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
                            setError('');
                          }}
                          placeholder="KFC Connaught Place"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={isRedeeming}
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
                            setError('');
                          }}
                          placeholder="Connaught Place, New Delhi"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={isRedeeming}
                        />
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
                          disabled={isRedeeming}
                        />
                      </div>

                      {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                          <p className="text-sm text-red-800">{error}</p>
                        </div>
                      )}

                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowRedeemForm(false);
                            setAmount('');
                            setLocationName('');
                            setLocationAddress('');
                            setNotes('');
                            setError('');
                          }}
                          className="flex-1"
                          disabled={isRedeeming}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleRedeem}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          isLoading={isRedeeming}
                          disabled={isRedeeming}
                        >
                          {isRedeeming ? 'Redeeming...' : 'Confirm Redeem'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};