// src/routes/AppRoutes.tsx 
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