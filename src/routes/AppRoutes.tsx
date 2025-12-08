// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { ProtectedRoute } from '../features/auth/components/ProtectedRoute';
// import { ROUTES } from './routePaths';

// // Pages
// import { HomePage } from '../pages/HomePage';
// import { LoginPage } from '../pages/auth/LoginPage';
// import { RegisterPage } from '../pages/auth/RegisterPage';
// import { BrowsePage } from '../pages/customer/BrowsePage';
// import { PurchasePage } from '../pages/customer/PurchasePage';
// import { DashboardPage } from '../pages/merchant/DashboardPage';
// import { GiftCardsPage } from '../pages/merchant/GiftCardsPage';
// import { RedemptionsPage } from '../pages/merchant/RedemptionsPage';
// import { AdminDashboardPage } from '@/features/admin/AdminDashboardPage';
// import { CompleteProfilePage } from '@/pages/auth/CompleteProfilePage';
// import { OrdersPage } from '@/pages/merchant/OrdersPage';
// import { ScanPage } from '@/pages/merchant/ScanPage';
// import { AnalyticsPage } from '@/pages/merchant/AnalyticsPage';
// import { PayoutsPage } from '@/pages/merchant/PayoutsPage';
// import { SettingsPage } from '@/pages/merchant/SettingsPage';
// const AppRoutes: React.FC = () => {
//   return (
//     <Routes>
//       {/* Public Routes */}
//       <Route path={ROUTES.HOME} element={<HomePage />} />
//       <Route path={ROUTES.LOGIN} element={<LoginPage />} />
//       <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
//       <Route path={ROUTES.BROWSE} element={<BrowsePage />} />
//       <Route path={ROUTES.PURCHASE} element={<PurchasePage />} />

//       <Route path={ROUTES.COMPLETE_PROFILE} element={<CompleteProfilePage />} />




//       {/* Merchant Routes */}
//       <Route
//         path={ROUTES.MERCHANT_DASHBOARD}
//         element={
//           // <ProtectedRoute requiredRole="MERCHANT">
//             <DashboardPage />
//           // </ProtectedRoute>
//         }
//       />
//       <Route
//         path={ROUTES.MERCHANT_GIFT_CARDS}
//         element={
//           <ProtectedRoute requiredRole="MERCHANT">
//             <GiftCardsPage />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path={ROUTES.MERCHANT_REDEMPTIONS}
//         element={
//           <ProtectedRoute requiredRole="MERCHANT">
//             <RedemptionsPage />
//           </ProtectedRoute>
//         }
//       />



//       <Route path="/dashboard" element={<DashboardPage />} />
      
//       {/* Gift Cards */}
//       <Route path="/gift-cards" element={<GiftCardsPage />} />
      
//       {/* Orders */}
//       <Route path="/orders" element={<OrdersPage />} />
      
//       {/* Scan QR */}
//       <Route path="/scan" element={<ScanPage />} />
      
//       {/* Analytics */}
//       <Route path="/analytics" element={<AnalyticsPage />} />
      
//       {/* Payouts */}
//       <Route path="/payouts" element={<PayoutsPage />} />
      
//       {/* Settings */}
//       <Route path="/settings" element={<SettingsPage />} />
      
//       {/* Complete Profile */}
//       <Route path="/complete-profile" element={<CompleteProfilePage />} />
      
//       {/* Default redirect */}
//       <Route path="/" element={<Navigate to="/merchant/dashboard" replace />} />
//       <Route path="*" element={<Navigate to="/merchant/dashboard" replace />} />
  

//       {/* <Route path={ROUTES.MERCHANT_DASHBOARD} element={<DashboardPage />} />
//       <Route path={ROUTES.MERCHANT_GIFT_CARDS} element={<GiftCardsPage />} />
//       <Route path={ROUTES.MERCHANT_REDEMPTIONS} element={<RedemptionsPage />} /> */}
      

//       {/* Admin Routes */}
//       <Route
//         path="/admin/dashboard"
//         element={
//           <ProtectedRoute requiredRole="ADMIN">
//             <AdminDashboardPage />
//           </ProtectedRoute>
//         }
//       />


//             {/* <Route path="/admin/dashboard" element={<AdminDashboardPage />} /> */}


//       {/* Fallback */}
//       <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
//     </Routes>
//   );
// };

// export default AppRoutes;


// src/routes/AppRoutes.tsx - FIXED VERSION
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute';
import { ROUTES } from './routePaths';

// Pages
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { BrowsePage } from '../pages/customer/BrowsePage';
import { PurchasePage } from '../pages/customer/PurchasePage';
import { DashboardPage } from '../pages/merchant/DashboardPage';
import { GiftCardsPage } from '../pages/merchant/GiftCardsPage';
import { RedemptionsPage } from '../pages/merchant/RedemptionsPage';
import { OrdersPage } from '../pages/merchant/OrdersPage';
import { ScanPage } from '../pages/merchant/ScanPage';
import { AnalyticsPage } from '../pages/merchant/AnalyticsPage';
import { PayoutsPage } from '../pages/merchant/PayoutsPage';
import { SettingsPage } from '../pages/merchant/SettingsPage';
import { CompleteProfilePage } from '../pages/auth/CompleteProfilePage';
import { AdminDashboardPage } from '../features/admin/AdminDashboardPage';
import { BrowseGiftCardsPage } from '@/pages/customer/BrowseGiftCardsPage';
import { PendingMerchantsPage } from '@/pages/admin/PendngMerchantsPage';
import { AllMerchantsPage } from '@/pages/admin/AllMerchantsPage';
import { CreateMerchantPage } from '@/pages/admin/CreateMerchantPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      <Route path={ROUTES.BROWSE} element={<BrowsePage />} />
      <Route path={ROUTES.PURCHASE} element={<PurchasePage />} />

      {/* Merchant Routes - ALL WITH /merchant/ PREFIX */}
      <Route path="/merchant/dashboard" element={<DashboardPage />} />
      <Route path="/merchant/gift-cards" element={<GiftCardsPage />} />
      <Route path="/merchant/orders" element={<OrdersPage />} />
      <Route path="/merchant/scan" element={<ScanPage />} />
      <Route path="/merchant/analytics" element={<AnalyticsPage />} />
      <Route path="/merchant/payouts" element={<PayoutsPage />} />
      <Route path="/merchant/redemptions" element={<RedemptionsPage />} />
      <Route path="/merchant/settings" element={<SettingsPage />} />
      <Route path="/merchant/complete-profile" element={<CompleteProfilePage />} />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route path = "/admin/create-merchant" element = {<CreateMerchantPage />}/>


{/* <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      /> */}
      <Route
        path="/admin/pending"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <PendingMerchantsPage />
          </ProtectedRoute>
        }
      />


      <Route
        path="/admin/merchants"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AllMerchantsPage />
          </ProtectedRoute>
        }
      />
      {/* Default Redirects */}
      <Route path="/merchant" element={<Navigate to="/merchant/dashboard" replace />} />
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
};

export default AppRoutes;