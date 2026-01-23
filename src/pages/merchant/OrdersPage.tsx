import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  ShoppingBag,
  Search,
  X,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { DashboardLayout } from "../../shared/components/layout/DashboardLayout";
import { Button } from "../../shared/components/ui/Button";
import { CreateOrderModal } from "../../features/orders/components/CreateOrderModal";
import { useCreateOrder } from "../../features/orders/hooks/useCreateOrder";
import { useOrders } from "../../features/orders/hooks/useOrders";
import type {
  CreateOrderData,
  Order,
} from "../../features/orders/types/order.types";
import { OrderDetailModal } from "@/features/orders/components/OrderModal";
import { getOrderStatusColor } from "@/shared/utils/helpers";

// Decode JWT token to extract user verification status
const decodeToken = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const OrdersPage: React.FC = () => {
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Filter and pagination states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Debounced search to avoid excessive API calls
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input (500ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to first page on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const createOrderMutation = useCreateOrder();

  // Fetch orders with applied filters and pagination
  const {
    data: ordersData,
    isLoading,
    error,
    refetch,
  } = useOrders({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearch || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    sortBy: "purchasedAt",
    sortOrder: "desc",
  });

  // Check if merchant account is verified
  const [isVerified] = useState<boolean>(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return false;
    const decoded = decodeToken(accessToken);
    return typeof decoded?.isVerified === "boolean"
      ? decoded.isVerified
      : false;
  });

  // Handle order creation submission
  const handleCreateOrder = async (formData: CreateOrderData) => {
    const result = await createOrderMutation.mutateAsync(formData);
    setShowCreateModal(false);
    refetch(); // Refresh orders list
    return result;
  };

  // Open order detail modal
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  // Close order detail modal
  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedOrder(null);
  };

  // Only allow verified merchants to create orders
  const handleCreateOrderClick = () => {
    if (isVerified) {
      setShowCreateModal(true);
    }
  };

  // Extract data from API response
  const orders: Order[] = ordersData?.orders || [];
  const totalPages = ordersData?.pagination?.totalPages || 1;
  const totalOrders = ordersData?.pagination?.total || 0;

  // Calculate statistics for current page
  const stats = {
    total: totalOrders,
    active: orders.filter((o: Order) => o.status === "ACTIVE").length,
    used: orders.filter((o: Order) => o.status === "USED").length,
    expired: orders.filter((o: Order) => o.status === "EXPIRED").length,
  };

  // Pagination navigation handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  // Generate visible page numbers for pagination UI
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30"
              >
                <ShoppingBag className="w-8 h-8 text-white" />
              </motion.div>

              <div>
                <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
                <p className="text-gray-600 mt-1">
                  Create and manage gift card orders
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <Button
                onClick={handleCreateOrderClick}
                className={`${
                  isVerified
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                size="lg"
                disabled={!isVerified}
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Order
              </Button>
              {!isVerified && (
                <div className="flex items-center gap-1 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>Account verification required</span>
                </div>
              )}
            </div>
          </div>

          {/* Verification Warning Banner */}
          {!isVerified && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-yellow-900 mb-1">
                  Account Verification Required
                </h3>
                <p className="text-sm text-yellow-800">
                  Please verify your account to create orders. Check your email
                  for verification instructions.
                </p>
              </div>
            </motion.div>
          )}

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
            >
              <div className="text-sm text-gray-600 mb-1">Total Orders</div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.total}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
            >
              <div className="text-sm text-gray-600 mb-1">Active</div>
              <div className="text-2xl font-bold text-green-600">
                {stats.active}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
            >
              <div className="text-sm text-gray-600 mb-1">Used</div>
              <div className="text-2xl font-bold text-gray-600">
                {stats.used}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
            >
              <div className="text-sm text-gray-600 mb-1">Expired</div>
              <div className="text-2xl font-bold text-red-600">
                {stats.expired}
              </div>
            </motion.div>
          </div>

          {/* Search and Filter Controls */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by customer name, phone, or QR code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="all">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="USED">Used</option>
                <option value="EXPIRED">Expired</option>
              </select>

              {(searchQuery || statusFilter !== "all") && (
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setCurrentPage(1);
                  }}
                  variant="outline"
                  className="whitespace-nowrap"
                >
                  Reset Filters
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-4 flex justify-between items-center"
        >
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-bold text-gray-900">
              {orders.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}
            </span>{" "}
            to{" "}
            <span className="font-bold text-gray-900">
              {Math.min(currentPage * itemsPerPage, totalOrders)}
            </span>{" "}
            of <span className="font-bold text-gray-900">{totalOrders}</span>{" "}
            orders
          </p>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-2xl shadow-sm p-16 text-center border border-gray-200">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading orders...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 rounded-2xl shadow-sm p-8 text-center border border-red-200">
            <p className="text-red-600">
              Failed to load orders: {error.message || "Unknown error"}
            </p>
          </div>
        )}

        {/* Empty State - No Orders */}
        {!isLoading && !error && orders.length === 0 && totalOrders === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm p-16 text-center border border-gray-200"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-blue-600" />
            </div>

            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              Ready to Create Orders
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {isVerified
                ? 'Click the "Create Order" button above to start creating gift card orders for your customers'
                : "Please verify your account to start creating gift card orders"}
            </p>

            {isVerified && (
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Order
              </Button>
            )}
          </motion.div>
        )}

        {/* Empty State - No Results */}
        {!isLoading && !error && orders.length === 0 && totalOrders > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-200"
          >
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No orders found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filters
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setCurrentPage(1);
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </motion.div>
        )}

        {/* Orders Table */}
        {!isLoading && !error && orders.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Phone
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Balance
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {orders.map((order: Order) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleViewDetails(order)}
                      >
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {order.customerName ||
                              order.customer?.name ||
                              "N/A"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.customerEmail || order.customer?.email || ""}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-900">
                          {order.customerPhone ||
                            order.customer?.phone ||
                            "N/A"}
                        </td>

                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          Rs.{" "}
                          {parseFloat(
                            String(order.purchaseAmount || order.amount || 0),
                          ).toLocaleString()}
                        </td>

                        <td className="px-6 py-4 text-sm font-semibold text-blue-600">
                          Rs.{" "}
                          {parseFloat(
                            String(order.currentBalance || order.amount || 0),
                          ).toLocaleString()}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getOrderStatusColor(order.status || "ACTIVE")}`}
                          >
                            {order.status || "N/A"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(order);
                            }}
                            variant="gradient"
                            size="sm"
                          >
                            View Details
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 flex items-center justify-between"
              >
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    variant="gradient"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>

                  <div className="flex gap-1">
                    {getPageNumbers().map((page) => (
                      <Button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                        }`}
                        variant="ghost"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </>
        )}

        {/* Modals */}
        <CreateOrderModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateOrder}
          isLoading={createOrderMutation.isPending}
        />

        <OrderDetailModal
          order={selectedOrder}
          isOpen={showDetailModal}
          onClose={handleCloseDetailModal}
        />
      </div>
    </DashboardLayout>
  );
};
