// // src/pages/merchant/GiftCardsPage.tsx - WITH SIDEBAR! 🎨
import React from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "../../shared/components/layout/DashboardLayout";
import { fadeInUp } from "../../shared/utils/animations";
import EnhancedGiftCardList from "../../features/giftCards/components/GiftCardList";

export const GiftCardsPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gift Cards</h1>
          <p className="text-gray-600">Create and manage your gift cards</p>
        </motion.div>

        {/* Gift Card List Component */}
        <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
          <EnhancedGiftCardList />
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

// // src/pages/merchant/GiftCardsPage.tsx
// // ============================================
// import React from 'react';
// import { GiftCardList } from '../../features/giftCards/components/GiftCardList';
// import { Sidebar } from '@/shared/components/layout/Sidebar';

// export const GiftCardsPage: React.FC = () => {
//   return (
//     <div className="flex">
//       <Sidebar />
//       <main className="flex-1 p-8 bg-gray-50">
//         <GiftCardList />
//       </main>
//     </div>
//   );
// };
// src/pages/merchant/GiftCardsPage.tsx
