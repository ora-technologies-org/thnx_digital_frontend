import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, ShoppingBag, Search, X, AlertCircle } from "lucide-react";
import { DashboardLayout } from "../../shared/components/layout/DashboardLayout";
import { Button } from "../../shared/components/ui/Button";
import { CreateOrderModal } from "../../features/orders/components/CreateOrderModal";

import { useCreateOrder } from "../../features/orders/hooks/useCreateOrder";
import { useOrders } from "../../features/orders/hooks/useOrders";
import type { CreateOrderData } from "../../features/orders/types/order.types";
import { OrderDetailModal } from "@/features/orders/components/OrderModal";

/**
 * Type definition for Order object
 */
interface Order {
  id: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  purchaseAmount?: number;
  amount?: number;
  status?: "ACTIVE" | "USED" | "EXPIRED";
  qrCode?: string;
}

/**
 * Helper function to decode JWT token
 */
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

/**
 * OrdersPage Component
 * Main page for displaying and managing gift card orders
 * Features: Order listing, search, filtering, stats display, and order creation
 */
export const OrdersPage: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  /** Mutation hook for creating new orders */
  const createOrderMutation = useCreateOrder();

  /** Query hook for fetching orders data in descending order */
  const { data: ordersData, isLoading, error } = useOrders("desc");

  /**
   * Check user verification status on component mount
   */
  const [isVerified, setIsVerified] = useState<boolean>(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return false;

    const decoded = decodeToken(accessToken);
    return typeof decoded?.isVerified === "boolean"
      ? decoded.isVerified
      : false;
  });
  console.log("hello", setIsVerified);
  /**
   * Handles the submission of create order form
   */
  const handleCreateOrder = async (formData: CreateOrderData) => {
    try {
      await createOrderMutation.mutateAsync(formData);
      setShowCreateModal(false);
    } catch (error) {
      console.error("Failed to create order:", error);
      throw error;
    }
  };

  /**
   * Opens the detail modal with the selected order
   */
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  /**
   * Closes the detail modal and clears selected order
   */
  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedOrder(null);
  };

  /**
   * Handles create order button click
   */
  const handleCreateOrderClick = () => {
    if (isVerified) {
      setShowCreateModal(true);
    }
  };

  // ============================================================================
  // Helper Functions
  // ============================================================================

  /**
   * Returns the appropriate Tailwind CSS classes for order status badge
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "USED":
        return "bg-gray-100 text-gray-800";
      case "EXPIRED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // ============================================================================
  // Data Processing
  // ============================================================================

  /**
   * Extract orders array from the API response
   * Handles different possible response structures from the backend
   */
  const orders: Order[] =
    ordersData?.orders || ordersData?.data || ordersData || [];

  /**
   * Filter orders based on search query and status filter
   * Search matches: customer name, phone number, or QR code
   */
  const filteredOrders = Array.isArray(orders)
    ? orders.filter((order: Order) => {
        // Check if order matches search query
        const matchesSearch =
          searchQuery === "" ||
          order.customerName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          order.customer?.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          order.customerPhone?.includes(searchQuery) ||
          order.customer?.phone?.includes(searchQuery) ||
          order.qrCode?.toLowerCase().includes(searchQuery.toLowerCase());

        // Check if order matches status filter
        const matchesStatus =
          statusFilter === "all" || order.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
    : [];

  /**
   * Calculate statistics for all orders
   * Used to display stats cards at the top of the page
   */
  const stats = {
    total: orders.length,
    active: orders.filter((o: Order) => o.status === "ACTIVE").length,
    used: orders.filter((o: Order) => o.status === "USED").length,
    expired: orders.filter((o: Order) => o.status === "EXPIRED").length,
  };

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            {/* Left side: Icon and title */}
            <div className="flex items-center gap-4">
              {/* Animated icon container */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30"
              >
                <ShoppingBag className="w-8 h-8 text-white" />
              </motion.div>

              {/* Title and description */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
                <p className="text-gray-600 mt-1">
                  Create and manage gift card orders
                </p>
              </div>
            </div>

            {/* Right side: Create order button */}
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

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Total Orders Card */}
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

            {/* Active Orders Card */}
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

            {/* Used Orders Card */}
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

            {/* Expired Orders Card */}
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

          {/* ================================================================
              Filters Section
              Search input, status filter dropdown, and reset button
          ================================================================ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                {/* Search icon */}
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

                {/* Search input field */}
                <input
                  type="text"
                  placeholder="Search by customer name, phone, or QR code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                {/* Clear search button - only shown when there's a search query */}
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Status Filter Dropdown */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="all">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="USED">Used</option>
                <option value="EXPIRED">Expired</option>
              </select>

              {/* Reset Filters Button - only shown when filters are active */}
              {(searchQuery || statusFilter !== "all") && (
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-4"
        >
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-bold text-gray-900">
              {filteredOrders.length}
            </span>{" "}
            of <span className="font-bold text-gray-900">{stats.total}</span>{" "}
            orders
          </p>
        </motion.div>

        {/* ====================================================================
            Loading State
            Displayed while orders are being fetched from the API
        ==================================================================== */}
        {isLoading && (
          <div className="bg-white rounded-2xl shadow-sm p-16 text-center border border-gray-200">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading orders...</p>
          </div>
        )}

        {/* ====================================================================
            Error State
            Displayed when there's an error fetching orders
        ==================================================================== */}
        {error && (
          <div className="bg-red-50 rounded-2xl shadow-sm p-8 text-center border border-red-200">
            <p className="text-red-600">
              Failed to load orders: {error.message || "Unknown error"}
            </p>
          </div>
        )}

        {!isLoading &&
          !error &&
          filteredOrders.length === 0 &&
          stats.total === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm p-16 text-center border border-gray-200"
            >
              {/* Icon */}
              <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-12 h-12 text-blue-600" />
              </div>

              {/* Message */}
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                Ready to Create Orders
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {isVerified
                  ? 'Click the "Create Order" button above to start creating gift card orders for your customers'
                  : "Please verify your account to start creating gift card orders"}
              </p>

              {/* Call to action button */}
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

        {!isLoading &&
          !error &&
          filteredOrders.length === 0 &&
          stats.total > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-200"
            >
              {/* Search icon */}
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />

              {/* Message */}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No orders found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or filters
              </p>

              {/* Clear filters button */}
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </motion.div>
          )}

        {!isLoading && !error && filteredOrders.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                {/* Table Header */}
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
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((order: Order) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleViewDetails(order)}
                    >
                      {/* Customer Name & Email Column */}
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {order.customerName || order.customer?.name || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.customerEmail || order.customer?.email || ""}
                        </div>
                      </td>

                      {/* Phone Number Column */}
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {order.customerPhone || order.customer?.phone || "N/A"}
                      </td>

                      {/* Amount Column */}
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        Rs.{" "}
                        {parseFloat(
                          String(order.purchaseAmount || order.amount || 0),
                        ).toLocaleString()}
                      </td>

                      {/* Status Column */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status || "ACTIVE")}`}
                        >
                          {order.status || "N/A"}
                        </span>
                      </td>

                      {/* Actions Column */}
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
        )}

        {/* Create Order Modal */}
        <CreateOrderModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateOrder}
          isLoading={createOrderMutation.isLoading}
        />

        {/* Order Detail Modal */}
        <OrderDetailModal
          order={selectedOrder}
          isOpen={showDetailModal}
          onClose={handleCloseDetailModal}
        />
      </div>
    </DashboardLayout>
  );
};
