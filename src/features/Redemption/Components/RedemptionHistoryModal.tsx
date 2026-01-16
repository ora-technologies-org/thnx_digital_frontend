// src/features/purchase/components/RedemptionHistoryModal.tsx
import React, { useState } from "react";
import { Modal } from "@/shared/components/ui/Modal";
import { Button } from "@/shared/components/ui/Button";
import {
  Calendar,
  MapPin,
  User,
  CreditCard,
  AlertCircle,
  Loader2,
  Download,
  Search,
} from "lucide-react";
import { RedemptionHistoryItem } from "../services/QRRedemptionHistoryService";

interface RedemptionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrCode: string;
  customerName: string;
  isLoading: boolean;
  error: string | null;
  history: RedemptionHistoryItem[];
  onRefresh: () => void;
}

export const RedemptionHistoryModal: React.FC<RedemptionHistoryModalProps> = ({
  isOpen,
  onClose,
  qrCode,
  customerName,
  isLoading,
  error,
  history,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.locationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.redeemedBy?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: string | number | undefined) => {
    if (amount === undefined || amount === null) return "N/A";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(typeof amount === "string" ? parseFloat(amount) : amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const handleExport = () => {
    // Implement export functionality
    const csvContent = [
      [
        "Date",
        "Time",
        "Amount",
        "Balance Before",
        "Balance After",
        "Location",
        "Address",
        "Notes",
        "Redeemed By",
        "Status",
      ],
      ...filteredHistory.map((item) => {
        const { date, time } = formatDate(item.redeemedAt);
        return [
          date,
          time,
          item.amount,
          item.balanceBefore,
          item.balanceAfter,
          item.locationName || "N/A",
          item.locationAddress || "N/A",
          item.notes || "",
          item.redeemedBy?.name || "Unknown",
          item.status,
        ];
      }),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `redemption-history-${qrCode}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Redemption History"
      size="xl"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                {customerName}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <CreditCard className="w-4 h-4 text-gray-500" />
                <p className="text-sm text-gray-600 font-mono">{qrCode}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Redemptions</p>
                <p className="text-2xl font-bold text-blue-600">
                  {history.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-blue-100">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by location, notes, or redeemer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <Button
              onClick={handleExport}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600">Loading redemption history...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-800 mb-2">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Error</span>
            </div>
            <p className="text-sm text-red-700">{error}</p>
            <div className="flex gap-2 mt-3">
              <Button onClick={onRefresh} variant="outline" size="sm">
                Retry
              </Button>
              <Button onClick={onClose} variant="ghost" size="sm">
                Close
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredHistory.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm || statusFilter !== "all"
                ? "No matching results"
                : "No Redemption History"}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-4">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "No redemptions have been made for this gift card yet."}
            </p>
            {(searchTerm || statusFilter !== "all") && (
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}

        {/* History List */}
        {!isLoading && !error && filteredHistory.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Showing {filteredHistory.length} of {history.length} redemptions
              </p>
              <p className="text-sm text-gray-600">
                Total:{" "}
                {formatCurrency(
                  filteredHistory.reduce(
                    (sum, item) =>
                      sum +
                      (typeof item.amount === "string"
                        ? parseFloat(item.amount)
                        : item.amount),
                    0,
                  ),
                )}
              </p>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date & Time
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Amount
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Location
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Redeemed By
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredHistory.map((item) => {
                      const { date, time } = formatDate(item.redeemedAt);
                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => {
                            /* You can add detail view here */
                          }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {date}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {time}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900">
                              {formatCurrency(item.amount)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatCurrency(item.balanceBefore)} →{" "}
                              {formatCurrency(item.balanceAfter)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {item.locationName || "N/A"}
                                </div>
                                <div className="text-xs text-gray-500 truncate max-w-[200px]">
                                  {item.locationAddress || "N/A"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {item.redeemedBy?.name || "Unknown"}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {item.redeemedBy?.email || "N/A"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(item.status || "pending")}`}
                            >
                              {item.status
                                ? item.status.charAt(0).toUpperCase() +
                                  item.status.slice(1)
                                : "Unknown"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Notes Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Transaction Notes
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {filteredHistory
                  .filter((item) => item.notes?.trim())
                  .map((item) => (
                    <div key={item.id} className="text-sm">
                      <span className="font-medium text-gray-700">
                        {formatDate(item.redeemedAt).date}:
                      </span>
                      <span className="text-gray-600 ml-2">{item.notes}</span>
                    </div>
                  ))}
                {filteredHistory.filter((item) => item.notes?.trim()).length ===
                  0 && (
                  <p className="text-sm text-gray-500 italic">
                    No transaction notes available
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-4 border-t">
          <Button
            onClick={onRefresh}
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Refresh
          </Button>
          <Button onClick={onClose} variant="gradient">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
