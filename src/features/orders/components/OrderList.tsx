// // src/features/orders/components/OrdersList.tsx - COMPLETE ORDERS MANAGEMENT! 🎯
// import React, { useState, useMemo } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   Search, Filter, Download, RefreshCw, Eye,
//   ShoppingBag, DollarSign, TrendingUp, Clock,
//   User, Mail, Phone, Calendar, CreditCard, CheckCircle,
//   XCircle, AlertCircle, Package
// } from 'lucide-react';
// import { Button } from '../../../shared/components/ui/Button';
// import { Modal } from '../../../shared/components/ui/Modal';
// import { Spinner } from '../../../shared/components/ui/Spinner';
// import { Badge } from '../../../shared/components/ui/Badge';
// import { OrderDetailsModal } from './OrderDetailsModal';
// import type { Order } from '../types/order.types';

// import { useOrders } from '../hooks/useOrders';

// type SortOption = 'newest' | 'oldest' | 'amount-high' | 'amount-low';
// type FilterOption = 'all' | 'completed' | 'pending' | 'failed';

// export const OrdersList: React.FC = () => {
//   const { data, isLoading, refetch } = useOrders();
  
//   // UI State
//   const [searchQuery, setSearchQuery] = useState('');
//   const [sortBy, setSortBy] = useState<SortOption>('newest');
//   const [filterBy, setFilterBy] = useState<FilterOption>('all');
//   const [showFilters, setShowFilters] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);

//   const orders = data?.orders || [];

//   // Statistics
//   const stats = useMemo(() => {
//     const total = orders.length;
//     const completed = orders.filter(order => order.status === 'completed').length;
//     const totalRevenue = orders
//       .filter(order => order.status === 'completed')
//       .reduce((sum, order) => sum + parseFloat(order.amount), 0);
//     const pending = orders.filter(order => order.status === 'pending').length;

//     return { total, completed, totalRevenue, pending };
//   }, [orders]);

//   // Filtered and sorted orders
//   const processedOrders = useMemo(() => {
//     let filtered = orders;

//     // Apply search
//     if (searchQuery) {
//       filtered = filtered.filter(order =>
//         order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         order.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         order.giftCard.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         order.orderId.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     // Apply filter
//     if (filterBy !== 'all') {
//       filtered = filtered.filter(order => order.status === filterBy);
//     }

//     // Apply sort
//     const sorted = [...filtered].sort((a, b) => {
//       if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
//       if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
//       if (sortBy === 'amount-high') return parseFloat(b.amount) - parseFloat(a.amount);
//       if (sortBy === 'amount-low') return parseFloat(a.amount) - parseFloat(b.amount);
//       return 0;
//     });

//     return sorted;
//   }, [orders, searchQuery, filterBy, sortBy]);

//   const handleViewDetails = (order: Order) => {
//     setSelectedOrder(order);
//     setShowDetailsModal(true);
//   };

//   const handleExport = () => {
//     const csvContent = [
//       ['Order ID', 'Customer Name', 'Email', 'Gift Card', 'Amount', 'Status', 'Date'],
//       ...orders.map(order => [
//         order.orderId,
//         order.customer.name,
//         order.customer.email,
//         order.giftCard.title,
//         order.amount,
//         order.status,
//         new Date(order.createdAt).toLocaleDateString(),
//       ]),
//     ]
//       .map(row => row.join(','))
//       .join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
//     a.click();
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'completed':
//         return <CheckCircle className="w-5 h-5 text-green-600" />;
//       case 'pending':
//         return <Clock className="w-5 h-5 text-orange-600" />;
//       case 'failed':
//         return <XCircle className="w-5 h-5 text-red-600" />;
//       default:
//         return <AlertCircle className="w-5 h-5 text-gray-600" />;
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case 'completed':
//         return <Badge variant="success">Completed</Badge>;
//       case 'pending':
//         return <Badge variant="warning">Pending</Badge>;
//       case 'failed':
//         return <Badge variant="danger">Failed</Badge>;
//       default:
//         return <Badge variant="default">{status}</Badge>;
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Spinner size="lg" />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Statistics Cards */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
//       >
//         {/* Total Orders */}
//         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//           <div className="flex items-center justify-between mb-4">
//             <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
//               <ShoppingBag className="w-6 h-6 text-blue-600" />
//             </div>
//           </div>
//           <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.total}</h3>
//           <p className="text-sm text-gray-600">Total Orders</p>
//         </div>

//         {/* Completed */}
//         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//           <div className="flex items-center justify-between mb-4">
//             <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
//               <CheckCircle className="w-6 h-6 text-green-600" />
//             </div>
//             <span className="text-green-600 text-sm font-medium">
//               {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
//             </span>
//           </div>
//           <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.completed}</h3>
//           <p className="text-sm text-gray-600">Completed</p>
//         </div>

//         {/* Total Revenue */}
//         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//           <div className="flex items-center justify-between mb-4">
//             <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
//               <DollarSign className="w-6 h-6 text-purple-600" />
//             </div>
//           </div>
//           <h3 className="text-2xl font-bold text-gray-900 mb-1">
//             ₹{stats.totalRevenue.toFixed(2)}
//           </h3>
//           <p className="text-sm text-gray-600">Total Revenue</p>
//         </div>

//         {/* Pending */}
//         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//           <div className="flex items-center justify-between mb-4">
//             <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
//               <Clock className="w-6 h-6 text-orange-600" />
//             </div>
//           </div>
//           <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.pending}</h3>
//           <p className="text-sm text-gray-600">Pending</p>
//         </div>
//       </motion.div>

//       {/* Controls Bar */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.1 }}
//         className="bg-white rounded-xl shadow-sm p-4 border border-gray-200"
//       >
//         <div className="flex flex-col lg:flex-row gap-4">
//           {/* Search */}
//           <div className="flex-1">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 placeholder="Search by customer, email, order ID, or gift card..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="flex gap-2 flex-wrap">
//             {/* Filter Button */}
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
//                 showFilters
//                   ? 'bg-blue-50 border-blue-300 text-blue-700'
//                   : 'border-gray-300 text-gray-700 hover:bg-gray-50'
//               }`}
//             >
//               <Filter className="w-4 h-4" />
//               Filters
//             </button>

//             {/* Refresh */}
//             <button
//               onClick={() => refetch()}
//               className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//             >
//               <RefreshCw className="w-5 h-5" />
//             </button>

//             {/* Export */}
//             <button
//               onClick={handleExport}
//               disabled={orders.length === 0}
//               className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <Download className="w-4 h-4" />
//               Export
//             </button>
//           </div>
//         </div>

//         {/* Filters Panel */}
//         <AnimatePresence>
//           {showFilters && (
//             <motion.div
//               initial={{ height: 0, opacity: 0 }}
//               animate={{ height: 'auto', opacity: 1 }}
//               exit={{ height: 0, opacity: 0 }}
//               className="mt-4 pt-4 border-t border-gray-200"
//             >
//               <div className="flex flex-wrap gap-4">
//                 {/* Filter By Status */}
//                 <div className="flex-1 min-w-[200px]">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Status
//                   </label>
//                   <select
//                     value={filterBy}
//                     onChange={(e) => setFilterBy(e.target.value as FilterOption)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="all">All Orders</option>
//                     <option value="completed">Completed</option>
//                     <option value="pending">Pending</option>
//                     <option value="failed">Failed</option>
//                   </select>
//                 </div>

//                 {/* Sort By */}
//                 <div className="flex-1 min-w-[200px]">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Sort By
//                   </label>
//                   <select
//                     value={sortBy}
//                     onChange={(e) => setSortBy(e.target.value as SortOption)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="newest">Newest First</option>
//                     <option value="oldest">Oldest First</option>
//                     <option value="amount-high">Amount: High to Low</option>
//                     <option value="amount-low">Amount: Low to High</option>
//                   </select>
//                 </div>

//                 {/* Clear Filters */}
//                 {(searchQuery || filterBy !== 'all' || sortBy !== 'newest') && (
//                   <div className="flex items-end">
//                     <button
//                       onClick={() => {
//                         setSearchQuery('');
//                         setFilterBy('all');
//                         setSortBy('newest');
//                       }}
//                       className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
//                     >
//                       Clear All Filters
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.div>

//       {/* Results Info */}
//       {searchQuery || filterBy !== 'all' ? (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="flex items-center justify-between text-sm text-gray-600"
//         >
//           <span>
//             Showing {processedOrders.length} of {orders.length} orders
//           </span>
//         </motion.div>
//       ) : null}

//       {/* Orders Table/List */}
//       {processedOrders.length === 0 ? (
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200"
//         >
//           <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <ShoppingBag className="w-10 h-10 text-blue-600" />
//           </div>
//           <h3 className="text-xl font-semibold text-gray-900 mb-2">
//             {searchQuery || filterBy !== 'all' ? 'No orders found' : 'No orders yet'}
//           </h3>
//           <p className="text-gray-600">
//             {searchQuery || filterBy !== 'all'
//               ? 'Try adjusting your search or filters'
//               : 'Orders will appear here when customers purchase gift cards'}
//           </p>
//         </motion.div>
//       ) : (
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//           {/* Desktop Table */}
//           <div className="hidden lg:block overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50 border-b border-gray-200">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Order ID
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Customer
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Gift Card
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Amount
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Date
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 <AnimatePresence mode="popLayout">
//                   {processedOrders.map((order) => (
//                     <motion.tr
//                       key={order.id}
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       exit={{ opacity: 0 }}
//                       className="hover:bg-gray-50 transition-colors"
//                     >
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center gap-2">
//                           <Package className="w-4 h-4 text-gray-400" />
//                           <span className="text-sm font-medium text-gray-900">
//                             {order.orderId}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div>
//                           <div className="flex items-center gap-2 mb-1">
//                             <User className="w-4 h-4 text-gray-400" />
//                             <span className="text-sm font-medium text-gray-900">
//                               {order.customer.name}
//                             </span>
//                           </div>
//                           <div className="flex items-center gap-2 text-xs text-gray-500">
//                             <Mail className="w-3 h-3" />
//                             {order.customer.email}
//                           </div>
//                           {order.customer.phone && (
//                             <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
//                               <Phone className="w-3 h-3" />
//                               {order.customer.phone}
//                             </div>
//                           )}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="text-sm text-gray-900">{order.giftCard.title}</div>
//                         <div className="text-xs text-gray-500">Qty: {order.quantity}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center gap-1">
//                           <DollarSign className="w-4 h-4 text-gray-400" />
//                           <span className="text-sm font-semibold text-gray-900">
//                             ₹{parseFloat(order.amount).toFixed(2)}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         {getStatusBadge(order.status)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center gap-2 text-sm text-gray-600">
//                           <Calendar className="w-4 h-4" />
//                           {new Date(order.createdAt).toLocaleDateString()}
//                         </div>
//                         <div className="text-xs text-gray-500">
//                           {new Date(order.createdAt).toLocaleTimeString()}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => handleViewDetails(order)}
//                         >
//                           <Eye className="w-4 h-4 mr-1" />
//                           View
//                         </Button>
//                       </td>
//                     </motion.tr>
//                   ))}
//                 </AnimatePresence>
//               </tbody>
//             </table>
//           </div>

//           {/* Mobile Cards */}
//           <div className="lg:hidden divide-y divide-gray-200">
//             {processedOrders.map((order) => (
//               <motion.div
//                 key={order.id}
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="p-4"
//               >
//                 <div className="flex items-start justify-between mb-3">
//                   <div>
//                     <div className="flex items-center gap-2 mb-1">
//                       <Package className="w-4 h-4 text-gray-400" />
//                       <span className="text-sm font-medium text-gray-900">
//                         {order.orderId}
//                       </span>
//                     </div>
//                     {getStatusBadge(order.status)}
//                   </div>
//                   <span className="text-lg font-bold text-gray-900">
//                     ₹{parseFloat(order.amount).toFixed(2)}
//                   </span>
//                 </div>

//                 <div className="space-y-2 mb-3">
//                   <div className="flex items-center gap-2 text-sm">
//                     <User className="w-4 h-4 text-gray-400" />
//                     <span className="font-medium">{order.customer.name}</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-sm text-gray-600">
//                     <Mail className="w-4 h-4 text-gray-400" />
//                     {order.customer.email}
//                   </div>
//                   <div className="text-sm text-gray-900">
//                     <strong>Gift Card:</strong> {order.giftCard.title}
//                   </div>
//                   <div className="flex items-center gap-2 text-sm text-gray-600">
//                     <Calendar className="w-4 h-4 text-gray-400" />
//                     {new Date(order.createdAt).toLocaleDateString()} at{' '}
//                     {new Date(order.createdAt).toLocaleTimeString()}
//                   </div>
//                 </div>

//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => handleViewDetails(order)}
//                   className="w-full"
//                 >
//                   <Eye className="w-4 h-4 mr-2" />
//                   View Details
//                 </Button>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Order Details Modal */}
//       {selectedOrder && (
//         <OrderDetailsModal
//           order={selectedOrder}
//           isOpen={showDetailsModal}
//           onClose={() => {
//             setShowDetailsModal(false);
//             setSelectedOrder(null);
//           }}
//         />
//       )}
//     </div>
//   );
// };


// src/features/orders/components/OrdersList.tsx - WITH CREATE ORDER BUTTON! 🎯
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Download, RefreshCw, Eye, Plus,
  ShoppingBag, DollarSign, CheckCircle, Clock,
  User, Mail, Phone, Calendar, Package
} from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button';
import { Spinner } from '../../../shared/components/ui/Spinner';
import { Badge } from '../../../shared/components/ui/Badge';
import { useOrders } from '../hooks/useOrders';
import { useCreateOrder } from '../hooks/useCreateOrder';
import { OrderDetailsModal } from './OrderDetailsModal';
import { CreateOrderModal } from './CreateOrderModal';
import type { Order, CreateOrderData } from '../types/order.types';

type SortOption = 'newest' | 'oldest' | 'amount-high' | 'amount-low';
type FilterOption = 'all' | 'completed' | 'pending' | 'failed';

export const OrdersList: React.FC = () => {
  const { data, isLoading, refetch } = useOrders();
  const createOrderMutation = useCreateOrder();
  
  // UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const orders = data?.orders || [];

  // Statistics
  const stats = useMemo(() => {
    const total = orders.length;
    const completed = orders.filter(order => order.status === 'completed').length;
    const totalRevenue = orders
      .filter(order => order.status === 'completed')
      .reduce((sum, order) => sum + parseFloat(order.amount), 0);
    const pending = orders.filter(order => order.status === 'pending').length;

    return { total, completed, totalRevenue, pending };
  }, [orders]);

  // Filtered and sorted orders
  const processedOrders = useMemo(() => {
    let filtered = orders;

    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.giftCard.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.orderId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterBy !== 'all') {
      filtered = filtered.filter(order => order.status === filterBy);
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === 'amount-high') return parseFloat(b.amount) - parseFloat(a.amount);
      if (sortBy === 'amount-low') return parseFloat(a.amount) - parseFloat(b.amount);
      return 0;
    });

    return sorted;
  }, [orders, searchQuery, filterBy, sortBy]);

  const handleCreateOrder = (formData: CreateOrderData) => {
    createOrderMutation.mutate(formData, {
      onSuccess: () => {
        setShowCreateModal(false);
        refetch();
      },
    });
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleExport = () => {
    const csvContent = [
      ['Order ID', 'Customer Name', 'Email', 'Gift Card', 'Amount', 'Status', 'Date'],
      ...orders.map(order => [
        order.orderId,
        order.customer.name,
        order.customer.email,
        order.giftCard.title,
        order.amount,
        order.status,
        new Date(order.createdAt).toLocaleDateString(),
      ]),
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'failed':
        return <Badge variant="danger">Failed</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.total}</h3>
          <p className="text-sm text-gray-600">Total Orders</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-green-600 text-sm font-medium">
              {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.completed}</h3>
          <p className="text-sm text-gray-600">Completed</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            ₹{stats.totalRevenue.toFixed(2)}
          </h3>
          <p className="text-sm text-gray-600">Total Revenue</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.pending}</h3>
          <p className="text-sm text-gray-600">Pending</p>
        </div>
      </motion.div>

      {/* Controls Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm p-4 border border-gray-200"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by customer, email, order ID, or gift card..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-wrap">
            {/* CREATE ORDER BUTTON */}
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Order
            </Button>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                showFilters
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>

            <button
              onClick={() => refetch()}
              className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>

            <button
              onClick={handleExport}
              disabled={orders.length === 0}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value as FilterOption)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Orders</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="amount-high">Amount: High to Low</option>
                    <option value="amount-low">Amount: Low to High</option>
                  </select>
                </div>

                {(searchQuery || filterBy !== 'all' || sortBy !== 'newest') && (
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setFilterBy('all');
                        setSortBy('newest');
                      }}
                      className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Orders Table */}
      {processedOrders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200"
        >
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchQuery || filterBy !== 'all' ? 'No orders found' : 'No orders yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || filterBy !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Create your first order to get started'}
          </p>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Order
          </Button>
        </motion.div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gift Card</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {processedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{order.orderId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">{order.customer.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Mail className="w-3 h-3" />
                          {order.customer.email}
                        </div>
                        {order.customer.phone && (
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <Phone className="w-3 h-3" />
                            {order.customer.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{order.giftCard.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">
                        ₹{parseFloat(order.amount).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(order)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Order Modal */}
      <CreateOrderModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateOrder}
        isLoading={createOrderMutation.isLoading}
      />

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
};