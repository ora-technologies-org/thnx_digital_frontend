import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Eye,
  Filter,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/shared/components/ui/Card";
import AdminLayout from "@/shared/components/layout/AdminLayout";
import { TicketDetailModal } from "./TicketDetailModal";
import {
  fetchSupportTickets,
  SupportTicket,
} from "@/features/admin/services/adminTicketService";

/**
 * AdminSupportTicketPage Component
 * Displays and manages support tickets with search, filter, and detail view capabilities
 * Now fully responsive for mobile, tablet, and desktop devices
 */
export const AdminSupportTicketPage: React.FC = () => {
  // State management for search, sorting, and modal
  const [searchTerm, setSearchTerm] = useState("");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  // Fetch tickets with React Query - automatically refetches when dependencies change
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["supportTickets", searchTerm, order],
    queryFn: () => fetchSupportTickets({ search: searchTerm, order }),
  });

  const tickets: SupportTicket[] = data?.data || [];

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };

  /**
   * Returns appropriate badge styling based on ticket status
   * Current ticket status (OPEN, IN_PROGRESS, CLOSE)
   */
  const getStatusBadge = (status: string) => {
    const badges = {
      OPEN: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        icon: AlertCircle,
      },
      IN_PROGRESS: {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        icon: Clock,
      },
      CLOSE: {
        bg: "bg-green-100",
        text: "text-green-700",
        icon: CheckCircle2,
      },
    };

    const badge = badges[status as keyof typeof badges] || badges.OPEN;
    const Icon = badge.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}
      >
        <Icon className="w-3 h-3" />
        {status.replace("_", " ")}
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Page Header with animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Support Tickets
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Manage and respond to merchant tickets
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4 sm:mb-6"
        >
          <Card className="p-4 sm:p-6">
            <form
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email, or title..."
                  className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Sort and Search Button Row */}
              <div className="flex gap-3 sm:gap-2">
                {/* Sort Order Dropdown */}
                <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                  <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <select
                    value={order}
                    onChange={(e) => setOrder(e.target.value as "asc" | "desc")}
                    className="flex-1 sm:flex-initial px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                  </select>
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm sm:text-base font-medium hover:shadow-lg transition-all duration-200 whitespace-nowrap"
                >
                  Search
                </button>
              </div>
            </form>
          </Card>
        </motion.div>

        {/* Tickets List with conditional rendering */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Loading State */}
          {isLoading ? (
            <Card className="p-8 sm:p-12">
              <div className="flex flex-col items-center justify-center text-gray-500">
                <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin mb-4" />
                <p className="text-sm sm:text-base">Loading tickets...</p>
              </div>
            </Card>
          ) : error ? (
            // Error State
            <Card className="p-8 sm:p-12">
              <div className="flex flex-col items-center justify-center text-red-500">
                <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 mb-4" />
                <p className="text-sm sm:text-base text-center">
                  {(error as Error).message}
                </p>
              </div>
            </Card>
          ) : tickets.length === 0 ? (
            // Empty State
            <Card className="p-8 sm:p-12">
              <div className="flex flex-col items-center justify-center text-gray-500">
                <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 mb-4" />
                <p className="text-sm sm:text-base">No tickets found</p>
              </div>
            </Card>
          ) : (
            // Tickets List - staggered animation for each ticket
            <div className="space-y-3 sm:space-y-4">
              {tickets.map((ticket, index) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-4 sm:p-6 hover:shadow-lg transition-all duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                      {/* Ticket Information */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                            {ticket.title}
                          </h3>
                          {getStatusBadge(ticket.status)}
                        </div>

                        {/* Truncate query to 2 lines */}
                        <p className="text-sm sm:text-base text-gray-600 mb-3 line-clamp-2">
                          {ticket.query}
                        </p>

                        {/* Ticket Metadata - Stack on mobile, inline on larger screens */}
                        <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-4 text-xs sm:text-sm text-gray-500">
                          {ticket.merchantName && (
                            <span className="truncate">
                              From: {ticket.merchantName}
                            </span>
                          )}
                          {ticket.merchantEmail && (
                            <span className="truncate">
                              <span className="hidden xs:inline">• </span>
                              {ticket.merchantEmail}
                            </span>
                          )}
                          <span className="whitespace-nowrap">
                            <span className="hidden xs:inline">• </span>
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* View Button - Full width on mobile, auto on larger screens */}
                      <button
                        onClick={() => setSelectedTicketId(ticket.id)}
                        className="flex items-center justify-center gap-2 px-4 py-2 sm:py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm sm:text-base font-medium hover:shadow-lg transition-all duration-200 w-full sm:w-auto sm:flex-shrink-0"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Ticket Detail Modal - conditionally rendered when ticket is selected */}
      {selectedTicketId && (
        <TicketDetailModal
          ticketId={selectedTicketId}
          isOpen={!!selectedTicketId}
          onClose={() => setSelectedTicketId(null)}
          onUpdate={refetch} // Refetch tickets after update
        />
      )}
    </AdminLayout>
  );
};
