
// import React from 'react';
// import { motion } from 'framer-motion';
// import { ShoppingBag, Filter, Search } from 'lucide-react';
// import { DashboardLayout } from '../../shared/components/layout/DashboardLayout';
// import { Card } from '../../shared/components/ui/Card';
// import { Input } from '../../shared/components/ui/Input';
// import { MagneticButton } from '../../shared/components/animated/MagneticButton';
// import { fadeInUp, staggerContainer } from '../../shared/utils/animations';

// export const OrdersPage: React.FC = () => {
//   return (
//     <DashboardLayout>
//       <div className="p-8">
//         {/* Page Header */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-8"
//         >
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">
//                 Orders
//               </h1>
//               <p className="text-gray-600">
//                 Track and manage all gift card orders
//               </p>
//             </div>

//             <div className="flex gap-3">
//               <MagneticButton variant="outline">
//                 <Filter className="w-4 h-4 mr-2" />
//                 Filter
//               </MagneticButton>
//             </div>
//           </div>
//         </motion.div>

//         {/* Search Bar */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="mb-6"
//         >
//           <div className="relative max-w-md">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//             <Input
//               placeholder="Search orders by ID, customer, or gift card..."
//               className="pl-10"
//             />
//           </div>
//         </motion.div>

//         {/* Orders List */}
//         <motion.div
//           initial="hidden"
//           animate="visible"
//           variants={staggerContainer}
//         >
//           <Card className="p-8">
//             <div className="text-center py-12">
//               <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <ShoppingBag className="w-10 h-10 text-blue-600" />
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">
//                 No Orders Yet
//               </h3>
//               <p className="text-gray-600 mb-6">
//                 Orders will appear here when customers purchase your gift cards
//               </p>
//             </div>
//           </Card>
//         </motion.div>
//       </div>
//     </DashboardLayout>
//   );
// };





// // src/pages/merchant/OrdersPage.tsx - FULL ORDERS MANAGEMENT! 🎯
// import React from 'react';
// import { motion } from 'framer-motion';
// import { DashboardLayout } from '../../shared/components/layout/DashboardLayout';
// // import { OrdersList } from '../../features/orders/components/OrdersList';
// import { fadeInUp } from '../../shared/utils/animations';
// import { OrdersList } from '@/features/orders/components/OrderList';

// export const OrdersPage: React.FC = () => {
//   return (
//     <DashboardLayout>
//       <div className="p-8">
//         {/* Page Header */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-8"
//         >
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">
//             Orders
//           </h1>
//           <p className="text-gray-600">
//             Track and manage all gift card purchases
//           </p>
//         </motion.div>

//         {/* Orders List Component */}
//         <motion.div
//           initial="hidden"
//           animate="visible"
//           variants={fadeInUp}
//         >
//           <OrdersList />
//         </motion.div>
//       </div>
//     </DashboardLayout>
//   );
// };



// src/pages/merchant/OrdersPage.tsx - SIMPLE! JUST CREATE! 🎯
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, ShoppingBag } from 'lucide-react';
import { DashboardLayout } from '../../shared/components/layout/DashboardLayout';
import { Button } from '../../shared/components/ui/Button';
import { CreateOrderModal } from '../../features/orders/components/CreateOrderModal';
import { useCreateOrder } from '../../features/orders/hooks/useCreateOrder';
import type { CreateOrderData } from '../../features/orders/types/order.types';

export const OrdersPage: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const createOrderMutation = useCreateOrder();

  const handleCreateOrder = async (formData: CreateOrderData) => {
    try {
      await createOrderMutation.mutateAsync(formData);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Orders
              </h1>
              <p className="text-gray-600">
                Create and manage gift card orders
              </p>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Order
            </Button>
          </div>
        </motion.div>

        {/* Empty State */}
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
            Click the "Create Order" button above to start creating gift card orders for your customers
          </p>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Your First Order
          </Button>
        </motion.div>

        {/* Create Order Modal */}
        <CreateOrderModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateOrder}
          isLoading={createOrderMutation.isLoading}
        />
      </div>
    </DashboardLayout>
  );
};


// import React from 'react';
// import { Search, Filter } from 'lucide-react';
// import { Sidebar } from '@/shared/components/layout/Sidebar';

// export const OrdersPage: React.FC = () => {
//   return (
//     <div className="flex">
//       <Sidebar />
//       <main className="flex-1 p-8 bg-gray-50">
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders</h1>
//             <p className="text-gray-600">Track and manage gift card orders</p>
//           </div>
//           <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
//             <Filter className="w-4 h-4" />
//             Filter
//           </button>
//         </div>

//         {/* Search Bar */}
//         <div className="mb-6">
//           <div className="relative max-w-md">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//             <input
//               type="text"
//               placeholder="Search orders..."
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//         </div>

//         {/* Orders List */}
//         <div className="bg-white rounded-lg shadow">
//           <div className="p-8 text-center">
//             <p className="text-gray-600">No orders yet</p>
//             <p className="text-sm text-gray-500 mt-2">Orders will appear here when customers purchase gift cards</p>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };