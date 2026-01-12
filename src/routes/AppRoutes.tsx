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

import RevenuePage from "@/pages/admin/RevenuePage";
import AdminAnalyticsPage from "@/pages/admin/AdminAnalyticsPage";
import ActivityLogPage from "@/pages/admin/ActitivityPage";

import { ForgotPasswordPage } from "@/pages/merchant/ForgotPasswordPage";
import { ResetPasswordPage } from "@/pages/merchant/ResetPasswordPage";
import { VerifyOtpPage } from "@/pages/merchant/VerifyOtpPage";
import MerchantsAndCardsApp from "@/pages/admin/GiftPages";
import { AdminSettingPage } from "@/pages/admin/SettingPage";
import { SupportTicketPage } from "@/pages/merchant/SupportTicket";
import { AdminSupportTicketPage } from "@/pages/admin/SupportTicket";
import ContactUsPage from "@/pages/admin/ContactUsPage";
import { ChangePasswordPage } from "@/pages/merchant/ChangePasswordPage";
import NotificationsPage from "@/pages/merchant/NotificationsPage";
import UpdateLandingPage from "@/pages/admin/UpdateLandingPage";
import GiftCardRedemption from "@/pages/customer/Myredemption";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes - No authentication required */}
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      <Route path={ROUTES.BROWSE} element={<BrowsePage />} />
      <Route path={ROUTES.PURCHASE} element={<PurchasePage />} />
      <Route path="/balance/:qrCode" element={<GiftCardRedemption />} />
      {/* Password Reset Routes - Public */}
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/verify-otp" element={<VerifyOtpPage />} />

      {/* Merchant Routes - ALL PROTECTED */}
      <Route
        path="/merchant/dashboard"
        element={
          <ProtectedRoute requiredRole="MERCHANT">
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/support"
        element={
          <ProtectedRoute requiredRole="MERCHANT">
            <SupportTicketPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/gift-cards"
        element={
          <ProtectedRoute requiredRole="MERCHANT">
            <GiftCardsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/orders"
        element={
          <ProtectedRoute requiredRole="MERCHANT">
            <OrdersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/merchant/scan/:qrCode"
        element={
          <ProtectedRoute requiredRole="MERCHANT">
            <ScanPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/scan"
        element={
          <ProtectedRoute requiredRole="MERCHANT">
            <ScanPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/analytics"
        element={
          <ProtectedRoute requiredRole="MERCHANT">
            <AnalyticsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/payouts"
        element={
          <ProtectedRoute requiredRole="MERCHANT">
            <PayoutsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/redemptions"
        element={
          <ProtectedRoute requiredRole="MERCHANT">
            <RedemptionsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/settings"
        element={
          <ProtectedRoute requiredRole="MERCHANT">
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/complete-profile"
        element={
          <ProtectedRoute requiredRole="MERCHANT">
            <CompleteProfilePage />
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

      <Route
        path={ROUTES.CHANGE}
        element={
          <ProtectedRoute requiredRole="MERCHANT">
            <ChangePasswordPage />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes - ALL PROTECTED */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/update"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <UpdateLandingPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/create-merchant"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <CreateMerchantPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/merchants/edit/:id"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <CreateMerchantPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/pending"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <PendingMerchantsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/giftcards"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <MerchantsAndCardsApp />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/revenue"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <RevenuePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminAnalyticsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/activity"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <ActivityLogPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminSettingPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/support-tickets"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminSupportTicketPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/contact-us"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <ContactUsPage />
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

      <Route
        path="/admin/notifications"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <NotificationsPage />
          </ProtectedRoute>
        }
      />

      {/* Default Redirects */}
      <Route
        path="/merchant"
        element={<Navigate to="/merchant/dashboard" replace />}
      />
      <Route
        path="/admin"
        element={<Navigate to="/admin/dashboard" replace />}
      />
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
};

export default AppRoutes;
