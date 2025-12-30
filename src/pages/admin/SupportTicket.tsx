// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import {
//   Search,
//   Eye,
//   Filter,
//   AlertCircle,
//   CheckCircle2,
//   Clock,
//   ChevronLeft,
//   ChevronRight,
//   ChevronsLeft,
//   ChevronsRight,
// } from "lucide-react";
// import { useQuery } from "@tanstack/react-query";
// import { Card } from "@/shared/components/ui/Card";
// import AdminLayout from "@/shared/components/layout/AdminLayout";
// import { TicketDetailModal } from "./TicketDetailModal";
// import {
//   fetchSupportTickets,
//   SupportTicket,
// } from "@/features/admin/services/adminTicketService";
// import { Spinner } from "@/shared/components/ui/Spinner";

// export const AdminSupportTicketPage: React.FC = () => {
//   // Search and sort state
//   const [searchTerm, setSearchTerm] = useState("");
//   const [order, setOrder] = useState<"asc" | "desc">("desc");
//   const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

//   // Pagination state
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);

//   // Filter state
//   const [statusFilter, setStatusFilter] = useState("ALL");

//   // Fetch tickets with all parameters
//   // React Query will automatically refetch when any dependency changes
//   const { data, isLoading, error, refetch } = useQuery({
//     queryKey: ["supportTickets", searchTerm, page, limit],
//     queryFn: () =>
//       fetchSupportTickets({
//         search: searchTerm || undefined,
//         order: "desc", // Always fetch in desc order, we'll sort on frontend
//         page,
//         limit,
//         status: undefined, // Fetch all statuses, we'll filter on frontend
//       }),
//     refetchOnMount: true,
//     refetchOnWindowFocus: false,
//   });

//   // Map API response to component format
//   const allTickets: SupportTicket[] = Array.isArray(data?.data?.data)
//     ? data.data.data.map((ticket: any) => ({
//         id: ticket.id,
//         title: ticket.title,
//         query: ticket.merchantQuery,
//         status: ticket.status,
//         createdAt: ticket.createdAt,
//         updatedAt: ticket.updatedAt,
//         merchantName:
//           ticket.merchant?.user?.name || ticket.merchant?.businessName,
//         merchantEmail: ticket.merchant?.user?.email,
//         businessName: ticket.merchant?.businessName,
//         adminResponse: ticket.adminResponse,
//       }))
//     : [];

//   // Client-side filtering by status
//   const filteredTickets =
//     statusFilter === "ALL"
//       ? allTickets
//       : allTickets.filter((ticket) => ticket.status === statusFilter);

//   // Client-side sorting
//   const tickets = [...filteredTickets].sort((a, b) => {
//     const dateA = new Date(a.createdAt).getTime();
//     const dateB = new Date(b.createdAt).getTime();
//     return order === "desc" ? dateB - dateA : dateA - dateB;
//   });

//   // Extract pagination info from API response
//   const pagination = data?.data?.pagination || {
//     total: 0,
//     page: 1,
//     limit: 10,
//     totalPages: 1,
//   };

//   // Handle search submission
//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     setPage(1); // Reset to first page when searching
//     // React Query will auto-refetch due to queryKey dependency
//   };

//   // Handle status filter change
//   const handleStatusFilterChange = (newStatus: string) => {
//     setStatusFilter(newStatus);
//     // No need to reset page - filtering happens on current data
//   };

//   // Handle items per page change
//   const handleLimitChange = (newLimit: number) => {
//     setLimit(newLimit);
//     setPage(1); // Reset to first page when limit changes
//   };

//   // Pagination navigation functions
//   const goToFirstPage = () => setPage(1);
//   const goToLastPage = () => setPage(pagination.totalPages);
//   const goToPreviousPage = () => setPage(Math.max(1, page - 1));
//   const goToNextPage = () => setPage(Math.min(pagination.totalPages, page + 1));
//   const goToPage = (pageNum: number) => setPage(pageNum);

//   /**
//    * Generate array of page numbers to display
//    * Logic: Show current page with 2 pages on each side (max 5 pages total)
//    */
//   const getPageNumbers = (): number[] => {
//     const pages: number[] = [];
//     const maxPagesToShow = 5;

//     if (pagination.totalPages <= maxPagesToShow) {
//       // Show all pages if total is less than max
//       for (let i = 1; i <= pagination.totalPages; i++) {
//         pages.push(i);
//       }
//     } else {
//       // Calculate range to show
//       let startPage = Math.max(1, page - 2);
//       let endPage = Math.min(pagination.totalPages, page + 2);

//       // Adjust range if near start or end
//       if (page <= 3) {
//         endPage = maxPagesToShow;
//       } else if (page >= pagination.totalPages - 2) {
//         startPage = pagination.totalPages - maxPagesToShow + 1;
//       }

//       for (let i = startPage; i <= endPage; i++) {
//         pages.push(i);
//       }
//     }

//     return pages;
//   };

//   /**
//    * Returns appropriate badge styling based on ticket status
//    */
//   const getStatusBadge = (status: string) => {
//     const badges = {
//       OPEN: {
//         bg: "bg-blue-100",
//         text: "text-blue-700",
//         icon: AlertCircle,
//       },
//       IN_PROGRESS: {
//         bg: "bg-yellow-100",
//         text: "text-yellow-700",
//         icon: Clock,
//       },
//       CLOSE: {
//         bg: "bg-green-100",
//         text: "text-green-700",
//         icon: CheckCircle2,
//       },
//     };

//     const badge = badges[status as keyof typeof badges] || badges.OPEN;
//     const Icon = badge.icon;

//     return (
//       <span
//         className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}
//       >
//         <Icon className="w-3 h-3" />
//         {status.replace("_", " ")}
//       </span>
//     );
//   };

//   return (
//     <AdminLayout>
//       <div className="p-4 sm:p-6 lg:p-8">
//         {/* Page Header */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-6 sm:mb-8"
//         >
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
//             Support Tickets
//           </h1>
//           <p className="text-sm sm:text-base text-gray-600">
//             Manage and respond to merchant tickets
//           </p>
//         </motion.div>

//         {/* Search, Filter, and Sort Bar */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="mb-4 sm:mb-6"
//         >
//           <Card className="p-4 sm:p-6">
//             <div className="space-y-4">
//               {/* Search Input Row */}
//               <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
//                 <div className="flex-1 relative">
//                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
//                   <input
//                     type="text"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
//                     placeholder="Search by name, email, or title..."
//                     className="w-2/3 pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 {/* <button
//                   onClick={handleSearch}
//                   className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm sm:text-base font-medium hover:shadow-lg transition-all duration-200 whitespace-nowrap"
//                 >
//                   Search
//                 </button> */}
//               </div>

//               {/* Filters Row */}
//               <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
//                 {/* Status Filter */}
//                 <div className="flex items-center gap-2 flex-1">
//                   <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
//                   <select
//                     value={statusFilter}
//                     onChange={(e) => handleStatusFilterChange(e.target.value)}
//                     className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="ALL">All Status</option>
//                     <option value="OPEN">Open</option>
//                     <option value="IN_PROGRESS">In Progress</option>
//                     <option value="CLOSE">Closed</option>
//                   </select>
//                 </div>

//                 {/* Sort Order */}
//                 <div className="flex-1">
//                   <select
//                     value={order}
//                     onChange={(e) => setOrder(e.target.value as "asc" | "desc")}
//                     className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="desc">Newest First</option>
//                     <option value="asc">Oldest First</option>
//                   </select>
//                 </div>

//                 {/* Items per page */}
//                 <div className="flex-1">
//                   <select
//                     value={limit}
//                     onChange={(e) => handleLimitChange(Number(e.target.value))}
//                     className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value={10}>10 per page</option>
//                     <option value={20}>20 per page</option>
//                     <option value={50}>50 per page</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </Card>
//         </motion.div>

//         {/* Tickets List */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//         >
//           {isLoading ? (
//             <Card className="p-8 sm:p-12">
//               <div className="flex flex-col items-center justify-center text-gray-500">
//                 <Spinner size="lg" />
//               </div>
//             </Card>
//           ) : error ? (
//             <Card className="p-8 sm:p-12">
//               <div className="flex flex-col items-center justify-center text-red-500">
//                 <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 mb-4" />
//                 <p className="text-sm sm:text-base text-center">
//                   {(error as Error).message}
//                 </p>
//               </div>
//             </Card>
//           ) : tickets.length === 0 ? (
//             <Card className="p-8 sm:p-12">
//               <div className="flex flex-col items-center justify-center text-gray-500">
//                 <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 mb-4" />
//                 <p className="text-sm sm:text-base">No tickets found</p>
//               </div>
//             </Card>
//           ) : (
//             <>
//               {/* Tickets List */}
//               <div className="space-y-3 sm:space-y-4 mb-6">
//                 {tickets.map((ticket, index) => (
//                   <motion.div
//                     key={ticket.id}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: index * 0.05 }}
//                   >
//                     <Card className="p-4 sm:p-6 hover:shadow-lg transition-all duration-200">
//                       <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-center gap-3 mb-2 flex-wrap">
//                             <h3 className="text-base sm:text-lg font-semibold text-gray-900">
//                               {ticket.title}
//                             </h3>
//                             {getStatusBadge(ticket.status)}
//                           </div>

//                           <p className="text-sm sm:text-base text-gray-600 mb-3 line-clamp-2">
//                             {ticket.query}
//                           </p>

//                           <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-4 text-xs sm:text-sm text-gray-500">
//                             {ticket.merchantName && (
//                               <span className="truncate">
//                                 From: {ticket.merchantName}
//                               </span>
//                             )}
//                             {ticket.merchantEmail && (
//                               <span className="truncate">
//                                 <span className="hidden xs:inline">• </span>
//                                 {ticket.merchantEmail}
//                               </span>
//                             )}
//                             <span className="whitespace-nowrap">
//                               <span className="hidden xs:inline">• </span>
//                               {new Date(ticket.createdAt).toLocaleDateString()}
//                             </span>
//                           </div>
//                         </div>

//                         <button
//                           onClick={() => setSelectedTicketId(ticket.id)}
//                           className="flex items-center justify-center gap-2 px-4 py-2 sm:py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm sm:text-base font-medium hover:shadow-lg transition-all duration-200 w-full sm:w-auto sm:flex-shrink-0"
//                         >
//                           <Eye className="w-4 h-4" />
//                           View
//                         </button>
//                       </div>
//                     </Card>
//                   </motion.div>
//                 ))}
//               </div>

//               {/* Pagination Controls */}
//               {pagination.totalPages > 1 && (
//                 <Card className="p-4">
//                   <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//                     {/* Results info */}
//                     <div className="text-sm text-gray-600">
//                       Showing {(page - 1) * limit + 1} to{" "}
//                       {Math.min(page * limit, pagination.total)} of{" "}
//                       {pagination.total} results
//                     </div>

//                     {/* Pagination buttons */}
//                     <div className="flex items-center gap-2">
//                       {/* First page */}
//                       <button
//                         onClick={goToFirstPage}
//                         disabled={page === 1}
//                         className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                         title="First page"
//                       >
//                         <ChevronsLeft className="w-4 h-4" />
//                       </button>

//                       {/* Previous page */}
//                       <button
//                         onClick={goToPreviousPage}
//                         disabled={page === 1}
//                         className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                         title="Previous page"
//                       >
//                         <ChevronLeft className="w-4 h-4" />
//                       </button>

//                       {/* Page numbers */}
//                       <div className="flex items-center gap-1">
//                         {getPageNumbers().map((pageNum) => (
//                           <button
//                             key={pageNum}
//                             onClick={() => goToPage(pageNum)}
//                             className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
//                               pageNum === page
//                                 ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
//                                 : "border border-gray-300 hover:bg-gray-50"
//                             }`}
//                           >
//                             {pageNum}
//                           </button>
//                         ))}
//                       </div>

//                       {/* Next page */}
//                       <button
//                         onClick={goToNextPage}
//                         disabled={page === pagination.totalPages}
//                         className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                         title="Next page"
//                       >
//                         <ChevronRight className="w-4 h-4" />
//                       </button>

//                       {/* Last page */}
//                       <button
//                         onClick={goToLastPage}
//                         disabled={page === pagination.totalPages}
//                         className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                         title="Last page"
//                       >
//                         <ChevronsRight className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </div>
//                 </Card>
//               )}
//             </>
//           )}
//         </motion.div>
//       </div>

//       {/* Ticket Detail Modal */}
//       {selectedTicketId && (
//         <TicketDetailModal
//           ticketId={selectedTicketId}
//           isOpen={!!selectedTicketId}
//           onClose={() => setSelectedTicketId(null)}
//           onUpdate={refetch}
//         />
//       )}
//     </AdminLayout>
//   );
// };
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Eye,
  Filter,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/shared/components/ui/Card";
import AdminLayout from "@/shared/components/layout/AdminLayout";
import { TicketDetailModal } from "./TicketDetailModal";
import {
  fetchSupportTickets,
  SupportTicket,
} from "@/features/admin/services/adminTicketService";
import { Spinner } from "@/shared/components/ui/Spinner";

// Interface for API response ticket
interface ApiTicket {
  id: string;
  title: string;
  merchantQuery: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  merchant?: {
    user?: {
      name?: string;
      email?: string;
    };
    businessName?: string;
  };
  adminResponse?: string;
}

export const AdminSupportTicketPage: React.FC = () => {
  // Search and sort state
  const [searchTerm, setSearchTerm] = useState("");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Filter state
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Fetch tickets with all parameters
  // React Query will automatically refetch when any dependency changes
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["supportTickets", searchTerm, page, limit],
    queryFn: () =>
      fetchSupportTickets({
        search: searchTerm || undefined,
        order: "desc", // Always fetch in desc order, we'll sort on frontend
        page,
        limit,
        status: undefined, // Fetch all statuses, we'll filter on frontend
      }),
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  // Map API response to component format
  const allTickets: SupportTicket[] = Array.isArray(data?.data?.data)
    ? data.data.data.map((ticket: ApiTicket) => ({
        id: ticket.id,
        title: ticket.title,
        query: ticket.merchantQuery,
        status: ticket.status,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt,
        merchantName:
          ticket.merchant?.user?.name || ticket.merchant?.businessName,
        merchantEmail: ticket.merchant?.user?.email,
        businessName: ticket.merchant?.businessName,
        adminResponse: ticket.adminResponse,
      }))
    : [];

  // Client-side filtering by status
  const filteredTickets =
    statusFilter === "ALL"
      ? allTickets
      : allTickets.filter((ticket) => ticket.status === statusFilter);

  // Client-side sorting
  const tickets = [...filteredTickets].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return order === "desc" ? dateB - dateA : dateA - dateB;
  });

  // Extract pagination info from API response
  const pagination = data?.data?.pagination || {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  };

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page when searching
    // React Query will auto-refetch due to queryKey dependency
  };

  // Handle status filter change
  const handleStatusFilterChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    // No need to reset page - filtering happens on current data
  };

  // Handle items per page change
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when limit changes
  };

  // Pagination navigation functions
  const goToFirstPage = () => setPage(1);
  const goToLastPage = () => setPage(pagination.totalPages);
  const goToPreviousPage = () => setPage(Math.max(1, page - 1));
  const goToNextPage = () => setPage(Math.min(pagination.totalPages, page + 1));
  const goToPage = (pageNum: number) => setPage(pageNum);

  /**
   * Generate array of page numbers to display
   * Logic: Show current page with 2 pages on each side (max 5 pages total)
   */
  const getPageNumbers = (): number[] => {
    const pages: number[] = [];
    const maxPagesToShow = 5;

    if (pagination.totalPages <= maxPagesToShow) {
      // Show all pages if total is less than max
      for (let i = 1; i <= pagination.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Calculate range to show
      let startPage = Math.max(1, page - 2);
      let endPage = Math.min(pagination.totalPages, page + 2);

      // Adjust range if near start or end
      if (page <= 3) {
        endPage = maxPagesToShow;
      } else if (page >= pagination.totalPages - 2) {
        startPage = pagination.totalPages - maxPagesToShow + 1;
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  /**
   * Returns appropriate badge styling based on ticket status
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
        {/* Page Header */}
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

        {/* Search, Filter, and Sort Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4 sm:mb-6"
        >
          <Card className="p-4 sm:p-6">
            <div className="space-y-4">
              {/* Search Input Row */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
                    placeholder="Search by name, email, or title..."
                    className="w-2/3 pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* <button
                  onClick={handleSearch}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm sm:text-base font-medium hover:shadow-lg transition-all duration-200 whitespace-nowrap"
                >
                  Search
                </button> */}
              </div>

              {/* Filters Row */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                {/* Status Filter */}
                <div className="flex items-center gap-2 flex-1">
                  <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                  <select
                    value={statusFilter}
                    onChange={(e) => handleStatusFilterChange(e.target.value)}
                    className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ALL">All Status</option>
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="CLOSE">Closed</option>
                  </select>
                </div>

                {/* Sort Order */}
                <div className="flex-1">
                  <select
                    value={order}
                    onChange={(e) => setOrder(e.target.value as "asc" | "desc")}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                  </select>
                </div>

                {/* Items per page */}
                <div className="flex-1">
                  <select
                    value={limit}
                    onChange={(e) => handleLimitChange(Number(e.target.value))}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                    <option value={50}>50 per page</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Tickets List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {isLoading ? (
            <Card className="p-8 sm:p-12">
              <div className="flex flex-col items-center justify-center text-gray-500">
                <Spinner size="lg" />
              </div>
            </Card>
          ) : error ? (
            <Card className="p-8 sm:p-12">
              <div className="flex flex-col items-center justify-center text-red-500">
                <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 mb-4" />
                <p className="text-sm sm:text-base text-center">
                  {(error as Error).message}
                </p>
              </div>
            </Card>
          ) : tickets.length === 0 ? (
            <Card className="p-8 sm:p-12">
              <div className="flex flex-col items-center justify-center text-gray-500">
                <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 mb-4" />
                <p className="text-sm sm:text-base">No tickets found</p>
              </div>
            </Card>
          ) : (
            <>
              {/* Tickets List */}
              <div className="space-y-3 sm:space-y-4 mb-6">
                {tickets.map((ticket, index) => (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="p-4 sm:p-6 hover:shadow-lg transition-all duration-200">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                              {ticket.title}
                            </h3>
                            {getStatusBadge(ticket.status)}
                          </div>

                          <p className="text-sm sm:text-base text-gray-600 mb-3 line-clamp-2">
                            {ticket.query}
                          </p>

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

              {/* Pagination Controls */}
              {pagination.totalPages > 1 && (
                <Card className="p-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Results info */}
                    <div className="text-sm text-gray-600">
                      Showing {(page - 1) * limit + 1} to{" "}
                      {Math.min(page * limit, pagination.total)} of{" "}
                      {pagination.total} results
                    </div>

                    {/* Pagination buttons */}
                    <div className="flex items-center gap-2">
                      {/* First page */}
                      <button
                        onClick={goToFirstPage}
                        disabled={page === 1}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="First page"
                      >
                        <ChevronsLeft className="w-4 h-4" />
                      </button>

                      {/* Previous page */}
                      <button
                        onClick={goToPreviousPage}
                        disabled={page === 1}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Previous page"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      {/* Page numbers */}
                      <div className="flex items-center gap-1">
                        {getPageNumbers().map((pageNum) => (
                          <button
                            key={pageNum}
                            onClick={() => goToPage(pageNum)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                              pageNum === page
                                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                                : "border border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {pageNum}
                          </button>
                        ))}
                      </div>

                      {/* Next page */}
                      <button
                        onClick={goToNextPage}
                        disabled={page === pagination.totalPages}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Next page"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      {/* Last page */}
                      <button
                        onClick={goToLastPage}
                        disabled={page === pagination.totalPages}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Last page"
                      >
                        <ChevronsRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              )}
            </>
          )}
        </motion.div>
      </div>

      {/* Ticket Detail Modal */}
      {selectedTicketId && (
        <TicketDetailModal
          ticketId={selectedTicketId}
          isOpen={!!selectedTicketId}
          onClose={() => setSelectedTicketId(null)}
          onUpdate={refetch}
        />
      )}
    </AdminLayout>
  );
};
