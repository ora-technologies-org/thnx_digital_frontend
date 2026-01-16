import React, { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Calendar,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  TrendingUp,
  CreditCard,
  Eye,
} from "lucide-react";
import { format } from "date-fns";
import { RedemptionHistory } from "@/features/Redemption/Services/redemptionService";
import { Button } from "@/shared/components/ui/Button";
import { RedemptionDetailsModal } from "@/features/Redemption/Components/RedemptionDetails";
import {
  useRedemptions,
  useExportRedemptions,
} from "@/features/Redemption/Hooks/useRedemption";
import { DashboardLayout } from "@/shared/components/layout/DashboardLayout";

// Define the expected API response type structure
interface RedemptionsResponse {
  data: RedemptionHistory[]; // Array of redemption records
  totalRedemptions: number; // Total count of redemptions
  totalRevenue: string; // Total revenue as string
  averageRedemption: string; // Average redemption amount
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const AnalyticsPage: React.FC = () => {
  // State management for UI components
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRedemption, setSelectedRedemption] =
    useState<RedemptionHistory | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  // Custom hooks for data fetching and mutations
  const {
    data, // This is now a RedemptionsResponse object
    isLoading,
    isError,
    params,
    handlePageChange,
    handleSearch,
    handleSort,
    updateParams,
  } = useRedemptions();

  const exportMutation = useExportRedemptions();

  // Type assertion to ensure we're working with the correct type
  const response = data as RedemptionsResponse | undefined;

  // Event handlers
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchTerm);
  };

  const handleExport = () => {
    exportMutation.mutate({
      ...params,
      startDate: dateRange.start,
      endDate: dateRange.end,
    });
  };

  const handleDateFilter = () => {
    updateParams({
      startDate: dateRange.start,
      endDate: dateRange.end,
      page: 1, // Reset to first page when filtering
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDateRange({ start: "", end: "" });
    updateParams({
      search: undefined,
      startDate: undefined,
      endDate: undefined,
      page: 1, // Reset to first page
    });
  };

  // Utility functions for formatting
  const formatCurrency = (amount: string) => {
    return `Rs. ${parseFloat(amount).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy HH:mm");
  };

  // Error state handling
  if (isError) {
    return (
      <div className="flex items-center justify-center h-96 p-4">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to load redemptions
          </h3>
          <p className="text-gray-600">Please try again later</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      {/* Main content container with responsive padding */}
      <div className="p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* ========== HEADER SECTION ========== */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Redemption History
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              Track all gift card redemptions and transactions
            </p>
          </div>

          {/* ========== STATS CARDS SECTION ========== */}
          {/* Responsive grid: 2 columns on mobile, 4 on medium+ screens */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 md:mb-8">
            {/* Card 1: Total Redemptions */}
            <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-600">
                    Total Redemptions
                  </p>
                  <p className="text-xl md:text-3xl font-bold text-gray-900 mt-1 md:mt-2">
                    {response?.totalRedemptions || 0}
                  </p>
                </div>
                <div className="p-2 md:p-3 bg-blue-100 rounded-lg">
                  <CreditCard className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Card 2: Total Revenue */}
            <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-600">
                    Total Revenue
                  </p>
                  <p className="text-xl md:text-3xl font-bold text-gray-900 mt-1 md:mt-2">
                    {response?.totalRevenue
                      ? `Rs. ${parseFloat(response.totalRevenue).toFixed(2)}`
                      : "Rs. 0.00"}
                  </p>
                </div>
                <div className="p-2 md:p-3 bg-green-100 rounded-lg">
                  <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                </div>
              </div>
            </div>

            {/* Card 3: Average Redemption */}
            <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-600">
                    Average Redemption
                  </p>
                  <p className="text-xl md:text-3xl font-bold text-gray-900 mt-1 md:mt-2">
                    {response?.averageRedemption
                      ? `Rs. ${parseFloat(response.averageRedemption).toFixed(2)}`
                      : "Rs. 0.00"}
                  </p>
                </div>
                <div className="p-2 md:p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Card 4: Current Page */}
            <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-600">
                    Current Page
                  </p>
                  <p className="text-xl md:text-3xl font-bold text-gray-900 mt-1 md:mt-2">
                    {response?.pagination.page || 1} /{" "}
                    {response?.pagination.totalPages || 1}
                  </p>
                </div>
                <div className="p-2 md:p-3 bg-amber-100 rounded-lg">
                  <Calendar className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />
                </div>
              </div>
            </div>
          </div>

          {/* ========== CONTROLS SECTION ========== */}
          <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Form */}
              <form onSubmit={handleSearchSubmit} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by customer name, email, location..."
                    className="w-full pl-9 md:pl-10 pr-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </form>

              {/* Filter and Export Buttons */}
              <div className="flex gap-2 md:gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 flex-1 md:flex-none"
                  size="sm"
                >
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">Filters</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={handleExport}
                  disabled={exportMutation.isPending}
                  className="flex items-center gap-2 flex-1 md:flex-none"
                  size="sm"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {exportMutation.isPending ? "Exporting..." : "Export"}
                  </span>
                </Button>
              </div>
            </div>

            {/* Date Range Filters - Collapsible */}
            {showFilters && (
              <div className="mt-4 md:mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) =>
                        setDateRange((prev) => ({
                          ...prev,
                          start: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) =>
                        setDateRange((prev) => ({
                          ...prev,
                          end: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-end gap-2">
                    <Button
                      onClick={handleDateFilter}
                      className="w-full sm:w-auto"
                    >
                      Apply Date Filter
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={clearFilters}
                      className="w-full sm:w-auto"
                    >
                      Clear All
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ========== DATA TABLE SECTION ========== */}
          <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Table container with horizontal scroll on mobile */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50">
                    {/* Date & Time column with sort functionality */}
                    <th className="py-3 px-4 md:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() =>
                          handleSort(
                            "redeemedAt",
                            params.sortOrder === "asc" ? "desc" : "asc",
                          )
                        }
                        className="flex items-center gap-1 hover:text-gray-700 w-full text-left"
                      >
                        <span className="truncate">Date & Time</span>
                        {params.sortBy === "redeemedAt" && (
                          <span className="text-primary shrink-0">
                            {params.sortOrder === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </button>
                    </th>

                    {/* Customer column */}
                    <th className="py-3 px-4 md:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>

                    {/* Amount column with sort functionality */}
                    <th className="py-3 px-4 md:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() =>
                          handleSort(
                            "amount",
                            params.sortOrder === "asc" ? "desc" : "asc",
                          )
                        }
                        className="flex items-center gap-1 hover:text-gray-700 w-full text-left"
                      >
                        <span className="truncate">Amount</span>
                        {params.sortBy === "amount" && (
                          <span className="text-primary shrink-0">
                            {params.sortOrder === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </button>
                    </th>

                    {/* Location column */}
                    <th className="py-3 px-4 md:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>

                    {/* Actions column */}
                    <th className="py-3 px-4 md:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {/* Loading state skeleton */}
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <tr key={index}>
                        <td className="py-4 px-4 md:px-6">
                          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        </td>
                        <td className="py-4 px-4 md:px-6">
                          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        </td>
                        <td className="py-4 px-4 md:px-6">
                          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        </td>
                        <td className="py-4 px-4 md:px-6">
                          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        </td>
                        <td className="py-4 px-4 md:px-6">
                          <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                        </td>
                      </tr>
                    ))
                  ) : response?.data.length === 0 ? (
                    // Empty state
                    <tr>
                      <td colSpan={5} className="py-8 md:py-12 text-center">
                        <div className="text-gray-400">
                          <CreditCard className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-3 md:mb-4" />
                          <p className="text-base md:text-lg font-medium">
                            No redemptions found
                          </p>
                          <p className="text-xs md:text-sm mt-1">
                            Try adjusting your filters or search terms
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    // Data rows
                    response?.data.map((redemption) => (
                      <tr key={redemption.id} className="hover:bg-gray-50">
                        {/* Date cell with responsive formatting */}
                        <td className="py-4 px-4 md:px-6">
                          <div className="text-sm text-gray-900">
                            <div className="font-medium hidden sm:block">
                              {formatDate(redemption.redeemedAt)}
                            </div>
                            <div className="font-medium sm:hidden text-xs">
                              {format(
                                new Date(redemption.redeemedAt),
                                "MM/dd/yy HH:mm",
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Customer cell with truncation for mobile */}
                        <td className="py-4 px-4 md:px-6">
                          <div>
                            <div className="text-sm font-medium text-gray-900 truncate max-w-[120px] md:max-w-none">
                              {redemption.purchasedGiftCard.customerName}
                            </div>
                            <div className="text-xs md:text-sm text-gray-500 truncate max-w-[120px] md:max-w-none">
                              {redemption.purchasedGiftCard.customerEmail}
                            </div>
                          </div>
                        </td>

                        {/* Amount cell with responsive balance display */}
                        <td className="py-4 px-4 md:px-6">
                          <div className="text-sm font-semibold text-green-600">
                            {formatCurrency(redemption.amount)}
                          </div>
                          <div className="text-xs text-gray-500 hidden sm:block">
                            {formatCurrency(redemption.balanceBefore)} →{" "}
                            {formatCurrency(redemption.balanceAfter)}
                          </div>
                        </td>

                        {/* Location cell with truncation for mobile */}
                        <td className="py-4 px-4 md:px-6">
                          <div>
                            <div className="text-sm font-medium text-gray-900 truncate max-w-[120px] md:max-w-none">
                              {redemption.locationName}
                            </div>
                            <div className="text-xs md:text-sm text-gray-500 truncate max-w-[120px] md:max-w-none">
                              {redemption.locationAddress}
                            </div>
                          </div>
                        </td>

                        {/* Actions cell with responsive button */}
                        <td className="py-4 px-4 md:px-6">
                          <Button
                            variant="gradient"
                            size="sm"
                            onClick={() => setSelectedRedemption(redemption)}
                            className="flex items-center gap-1 w-full sm:w-auto"
                          >
                            <Eye className="w-4 h-4" />
                            <span className="">View</span>
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* ========== PAGINATION SECTION ========== */}
            {response?.pagination && response.pagination.totalPages > 1 && (
              <div className="border-t border-gray-200 px-4 md:px-6 py-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Results count */}
                  <div className="text-sm text-gray-700 text-center sm:text-left">
                    Showing{" "}
                    <span className="font-medium">
                      {(response.pagination.page - 1) *
                        response.pagination.limit +
                        1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(
                        response.pagination.page * response.pagination.limit,
                        response.pagination.total,
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                      {response.pagination.total}
                    </span>{" "}
                    results
                  </div>

                  {/* Pagination controls */}
                  <div className="flex flex-col xs:flex-row items-center gap-3">
                    <div className="flex items-center gap-1 order-2 xs:order-1">
                      {/* Previous button */}
                      <Button
                        variant="outline"
                        onClick={() =>
                          handlePageChange(response.pagination.page - 1)
                        }
                        disabled={response.pagination.page === 1}
                        className="flex items-center gap-1"
                        size="sm"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Previous</span>
                        <span className="sm:hidden">Prev</span>
                      </Button>

                      {/* Page numbers - responsive: show 3 pages on mobile, 5 on desktop */}
                      <div className="flex items-center gap-1">
                        {Array.from(
                          {
                            length: Math.min(3, response.pagination.totalPages),
                          },
                          (_, i) => {
                            let pageNum;
                            if (response.pagination.totalPages <= 3) {
                              pageNum = i + 1;
                            } else if (response.pagination.page === 1) {
                              pageNum = i + 1;
                            } else if (
                              response.pagination.page ===
                              response.pagination.totalPages
                            ) {
                              pageNum = response.pagination.totalPages - 2 + i;
                            } else {
                              pageNum = response.pagination.page - 1 + i;
                            }
                            return (
                              <Button
                                key={pageNum}
                                variant={
                                  response.pagination.page === pageNum
                                    ? "primary"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => handlePageChange(pageNum)}
                                className="min-w-[40px]"
                              >
                                {pageNum}
                              </Button>
                            );
                          },
                        )}
                      </div>

                      {/* Next button */}
                      <Button
                        variant="outline"
                        onClick={() =>
                          handlePageChange(response.pagination.page + 1)
                        }
                        disabled={
                          response.pagination.page ===
                          response.pagination.totalPages
                        }
                        className="flex items-center gap-1"
                        size="sm"
                      >
                        <span className="hidden sm:inline">Next</span>
                        <span className="sm:hidden">Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Current page indicator for mobile */}
                    {response.pagination.totalPages > 3 && (
                      <div className="text-xs text-gray-500 order-1 xs:order-2">
                        Page {response.pagination.page} of{" "}
                        {response.pagination.totalPages}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========== REDEMPTION DETAILS MODAL ========== */}
        <RedemptionDetailsModal
          isOpen={!!selectedRedemption}
          onClose={() => setSelectedRedemption(null)}
          redemption={selectedRedemption}
        />
      </div>
    </DashboardLayout>
  );
};
