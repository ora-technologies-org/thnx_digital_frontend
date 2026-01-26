// GiftCardRedemption.tsx
// Main component for displaying gift card redemption details

import { useState, useEffect, ReactElement } from "react";
import {
  Gift,
  User,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  DollarSign,
  TrendingDown,
  RefreshCw,
} from "lucide-react";

import GiftCardService from "@/features/giftCards/services/giftCustomerService";
import {
  getQRCodeFromURL,
  formatCurrency,
  formatDate,
  GiftCardData,
  StatusType,
} from "./utils/giftcardutils";
import { Header } from "@/shared/components/layout/Header";
import { Spinner } from "@/shared/components/ui/Spinner";

export default function GiftCardRedemption() {
  const [data, setData] = useState<GiftCardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string>("");

  useEffect(() => {
    const urlQRCode = getQRCodeFromURL();

    if (!urlQRCode) {
      setError("No QR code provided in URL");
      setLoading(false);
      return;
    }

    setQrCode(urlQRCode);
    loadData(urlQRCode);
  }, []);

  const loadData = async (qrCodeParam: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const result = await GiftCardService.fetchByQRCode(qrCodeParam);

      if (
        result &&
        typeof result === "object" &&
        "merchantData" in result &&
        "giftcardHistory" in result
      ) {
        setData(result as GiftCardData);
      } else {
        setError("Invalid data format received from server");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch gift card data. Please check the URL and try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = (): void => {
    if (qrCode) {
      loadData(qrCode);
    }
  };

  const getStatusColor = (status: StatusType): string => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return "bg-emerald-100 text-emerald-700 border border-emerald-200";
      case "CANCELLED":
        return "bg-red-100 text-red-700 border border-red-200";
      case "EXPIRED":
        return "bg-gray-100 text-gray-700 border border-gray-200";
      case "PENDING":
        return "bg-amber-100 text-amber-700 border border-amber-200";
      default:
        return "bg-blue-100 text-blue-700 border border-blue-200";
    }
  };

  const getStatusIcon = (status: StatusType): ReactElement => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return <CheckCircle className="w-4 h-4" />;
      case "CANCELLED":
        return <XCircle className="w-4 h-4" />;
      case "PENDING":
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  // Loading State
  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="relative">
              <Spinner size="lg" />
            </div>
            <p className="mt-6 text-gray-700 font-medium">
              Loading gift card details...
            </p>
            <p className="mt-2 text-sm text-gray-500">Please wait a moment</p>
          </div>
        </div>
      </>
    );
  }

  // Error State
  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-8 max-w-md w-full">
            <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              Error Loading Data
            </h3>
            <p className="text-red-600 text-center mb-6">{error}</p>
            {qrCode ? (
              <>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
                  <p className="text-xs font-semibold text-gray-500 mb-2">
                    QR Code:
                  </p>
                  <p className="text-sm font-mono text-gray-900 break-all">
                    {qrCode}
                  </p>
                </div>
                <button
                  onClick={handleRefresh}
                  className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
              </>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
                <p className="text-xs text-yellow-800">
                  No QR code found in URL. Please make sure the URL contains the
                  QR code.
                </p>
                <p className="text-xs text-yellow-700 mt-2">
                  Expected format: /balance/YOUR-QR-CODE
                </p>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  // No Data State
  if (!data) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 max-w-md w-full">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              No Data Available
            </h3>
            <p className="text-gray-600 text-center">
              Please check your URL and try again.
            </p>
          </div>
        </div>
      </>
    );
  }

  const { merchantData, giftcardHistory } = data;
  const totalRedeemed = giftcardHistory.redemptions.reduce(
    (sum, r) => sum + parseFloat(r.amount.toString()),
    0,
  );
  const usagePercentage = (
    (totalRedeemed / parseFloat(giftcardHistory.purchaseAmount.toString())) *
    100
  ).toFixed(1);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-4 md:p-8">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-4 rounded-2xl shadow-lg">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Gift Card Details
                  </h1>
                  <p className="text-gray-600 mt-1">
                    View your redemption history and current balance
                  </p>
                </div>
              </div>
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Purchase Amount Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-blue-700 text-sm font-semibold uppercase tracking-wide">
                  Purchase Amount
                </span>
                <div className="bg-blue-100 p-2 rounded-lg">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(giftcardHistory.purchaseAmount)}
              </p>
              <p className="text-xs text-gray-500 mt-2">Initial value</p>
            </div>

            {/* Current Balance Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-emerald-700 text-sm font-semibold uppercase tracking-wide">
                  Current Balance
                </span>
                <div className="bg-emerald-100 p-2 rounded-lg">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(giftcardHistory.currentBalance)}
              </p>
              <p className="text-xs text-gray-500 mt-2">Available to spend</p>
            </div>

            {/* Total Redeemed Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-orange-700 text-sm font-semibold uppercase tracking-wide">
                  Total Redeemed
                </span>
                <div className="bg-orange-100 p-2 rounded-lg">
                  <TrendingDown className="w-5 h-5 text-orange-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(totalRedeemed)}
              </p>
              <div className="mt-3 bg-orange-50 rounded-lg p-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-orange-700">
                    Used
                  </span>
                  <span className="text-xs font-bold text-orange-700">
                    {usagePercentage}%
                  </span>
                </div>
                <div className="w-full bg-orange-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all"
                    style={{ width: `${usagePercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Redemptions Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-purple-700 text-sm font-semibold uppercase tracking-wide">
                  Redemptions
                </span>
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Gift className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {giftcardHistory.redemptions.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">Total transactions</p>
            </div>
          </div>

          {/* Gift Card Info Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 mb-8">
            <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {merchantData.businessName}
                </h2>
                <p className="text-gray-600 flex items-center gap-2">
                  <span className="text-gray-400">Merchant:</span>
                  <span className="font-medium">
                    {merchantData.merchantName}
                  </span>
                </p>
              </div>
              <div className="flex gap-3 flex-wrap">
                <span
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${getStatusColor(
                    giftcardHistory.status,
                  )}`}
                >
                  {getStatusIcon(giftcardHistory.status)}
                  {giftcardHistory.status}
                </span>
                <span
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${getStatusColor(
                    giftcardHistory.paymentStatus,
                  )}`}
                >
                  {getStatusIcon(giftcardHistory.paymentStatus)}
                  Payment {giftcardHistory.paymentStatus}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Customer Info */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
                <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Customer Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-white rounded-lg p-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="text-gray-900 font-medium">
                        {giftcardHistory.customerName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white rounded-lg p-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Mail className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-gray-900 text-sm">
                        {giftcardHistory.customerEmail}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white rounded-lg p-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Phone className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-gray-900 text-sm">
                        {giftcardHistory.customerPhone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Info */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6">
                <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Card Information
                </h3>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-3">
                    <div className="flex items-start gap-3">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <Gift className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">QR Code</p>
                        <p className="text-gray-900 text-sm font-mono break-all bg-gray-50 rounded px-2 py-1">
                          {giftcardHistory.qrCode}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <CreditCard className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Payment Method</p>
                        <p className="text-gray-900 text-sm font-medium">
                          {giftcardHistory.paymentMethod}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <div className="flex items-start gap-3">
                      <div className="bg-orange-100 p-2 rounded-lg">
                        <Calendar className="w-4 h-4 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-2">
                          Important Dates
                        </p>
                        <div className="space-y-1">
                          <p className="text-xs text-gray-900">
                            <span className="text-gray-500">Purchased:</span>{" "}
                            <span className="font-medium">
                              {formatDate(giftcardHistory.purchasedAt)}
                            </span>
                          </p>
                          <p className="text-xs text-gray-900">
                            <span className="text-gray-500">Expires:</span>{" "}
                            <span className="font-medium">
                              {formatDate(giftcardHistory.expiresAt)}
                            </span>
                          </p>
                          {giftcardHistory.lastUsedAt && (
                            <p className="text-xs text-gray-900">
                              <span className="text-gray-500">Last Used:</span>{" "}
                              <span className="font-medium">
                                {formatDate(giftcardHistory.lastUsedAt)}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Redemption History */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-3 rounded-xl">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Redemption History
              </h2>
            </div>

            {giftcardHistory.redemptions.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium">No redemptions yet</p>
                <p className="text-sm text-gray-500 mt-1">
                  Your transactions will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {giftcardHistory.redemptions.map((redemption, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl p-5 hover:border-purple-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            {formatCurrency(redemption.amount)}
                          </span>
                          <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium text-gray-600">
                            {formatDate(redemption.redeemedAt)}
                          </span>
                        </div>
                        {redemption.notes && (
                          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mt-3">
                            <p className="text-sm text-blue-900 italic">
                              "{redemption.notes}"
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm bg-white rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Before:</span>
                        <span className="font-bold text-gray-900">
                          {formatCurrency(redemption.balanceBefore)}
                        </span>
                      </div>
                      <span className="text-gray-400">→</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">After:</span>
                        <span className="font-bold text-emerald-600">
                          {formatCurrency(redemption.balanceAfter)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
