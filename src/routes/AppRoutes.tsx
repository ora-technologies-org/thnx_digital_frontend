// src/routes/AppRoutes.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "../features/auth/components/ProtectedRoute";
import { ROUTES } from "./routePaths";

// Pages
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/auth/LoginPage";
import { RegisterPage } from "../pages/auth/RegisterPage";
import { BrowsePage } from "../pages/customer/BrowsePage";
import { PurchasePage } from "../pages/customer/PurchasePage";
import { DashboardPage } from "../pages/merchant/DashboardPage";
import { GiftCardsPage } from "../pages/merchant/GiftCardsPage";
import { RedemptionsPage } from "../pages/merchant/RedemptionsPage";
import { OrdersPage } from "../pages/merchant/OrdersPage";
import { ScanPage } from "../pages/merchant/ScanPage";
import { AnalyticsPage } from "../pages/merchant/AnalyticsPage";
import { PayoutsPage } from "../pages/merchant/PayoutsPage";
import { SettingsPage } from "../pages/merchant/SettingsPage";
import { CompleteProfilePage } from "../pages/auth/CompleteProfilePage";
import { AdminDashboardPage } from "../features/admin/AdminDashboardPage";
import { PendingMerchantsPage } from "@/pages/admin/PendngMerchantsPage";
import { AllMerchantsPage } from "@/pages/admin/AllMerchantsPage";
import { CreateMerchantPage } from "@/pages/admin/CreateMerchantPage";
import GiftPages from "@/pages/admin/GiftPages";
import RevenuePage from "@/pages/admin/RevenuePage";
import AdminAnalyticsPage from "@/pages/admin/AdminAnalyticsPage";
import ActivityLogPage from "@/pages/admin/ActitivityPage";
import AdminSettingPage from "@/pages/admin/SettingPage";
import { ForgotPasswordPage } from "@/pages/merchant/ForgotPasswordPage";
import { ResetPasswordPage } from "@/pages/merchant/ResetPasswordPage";
import { VerifyOtpPage } from "@/pages/merchant/VerifyOtpPage";
import NotificationsPage from "@/pages/NotificationsPage";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      <Route path={ROUTES.BROWSE} element={<BrowsePage />} />
      <Route path={ROUTES.PURCHASE} element={<PurchasePage />} />

      {/* Auth & Password Reset Routes */}
      <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
      <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
      <Route path={ROUTES.VERIFY_OTP} element={<VerifyOtpPage />} />

      {/* Merchant Routes - ALL WITH /merchant/ PREFIX */}
      <Route path={ROUTES.MERCHANT_DASHBOARD} element={<DashboardPage />} />
      <Route path={ROUTES.MERCHANT_GIFT_CARDS} element={<GiftCardsPage />} />
      <Route path={ROUTES.MERCHANT_ORDERS} element={<OrdersPage />} />
      <Route path={ROUTES.MERCHANT_SCAN} element={<ScanPage />} />
      <Route path={ROUTES.MERCHANT_ANALYTICS} element={<AnalyticsPage />} />
      <Route path={ROUTES.MERCHANT_PAYOUTS} element={<PayoutsPage />} />
      <Route path={ROUTES.MERCHANT_REDEMPTIONS} element={<RedemptionsPage />} />
      <Route path={ROUTES.MERCHANT_SETTINGS} element={<SettingsPage />} />
      <Route path={ROUTES.COMPLETE_PROFILE} element={<CompleteProfilePage />} />

      <Route
        path="/admin/notifications"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <NotificationsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/notifications"
        element={
          <ProtectedRoute requiredRole="MERCHANT">
            <NotificationsPage />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path={ROUTES.ADMIN_DASHBOARD}
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.ADMIN_CREATE_MERCHANT}
        element={<CreateMerchantPage />}
      />
      <Route
        path={ROUTES.ADMIN_PENDING}
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <PendingMerchantsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.ADMIN_GIFTCARDS}
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <GiftPages />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.ADMIN_REVENUE}
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <RevenuePage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.ADMIN_ANALYTICS}
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminAnalyticsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.ADMIN_ACTIVITY}
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <ActivityLogPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.ADMIN_SETTINGS}
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminSettingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.ADMIN_MERCHANTS}
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AllMerchantsPage />
          </ProtectedRoute>
        }
      />

      {/* Default Redirects */}
      <Route
        path={ROUTES.MERCHANT_BASE}
        element={<Navigate to={ROUTES.MERCHANT_DASHBOARD} replace />}
      />
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
};

export default AppRoutes;
