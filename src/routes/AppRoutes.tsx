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
import { OrdersPage } from "../pages/merchant/OrdersPage";
import { ScanPage } from "../pages/merchant/ScanPage";
import { AnalyticsPage } from "../pages/merchant/AnalyticsPage";
import { PayoutsPage } from "../pages/merchant/PayoutsPage";
import { SettingsPage } from "../pages/merchant/SettingsPage";
import { CompleteProfilePage } from "../pages/auth/CompleteProfilePage";
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
import { UserHomePage } from "@/pages/merchant/userHomePage";
import { NotFoundPage } from "@/shared/components/common/NotFound";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes - No authentication required */}
      <Route path={ROUTES.HOME} element={<UserHomePage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      <Route path={ROUTES.BROWSE} element={<BrowsePage />} />
      <Route path={ROUTES.PURCHASE} element={<PurchasePage />} />
      <Route path={ROUTES.MERCHANTS} element={<HomePage />} />
      <Route path={ROUTES.BALANCE} element={<GiftCardRedemption />} />

      {/* Password Reset Routes - Public */}
      <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
      <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
      <Route path={ROUTES.VERIFY_OTP} element={<VerifyOtpPage />} />

      {/* Merchant Routes - ALL PROTECTED */}
      <Route
        path={ROUTES.MERCHANT_DASHBOARD}
        element={
          <ProtectedRoute requiredRole="MERCHANT">
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.MERCHANT_SUPPORT}
        element={
          <ProtectedRoute requiredRole="MERCHANT">
            <SupportTicketPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.MERCHANT_GIFT_CARDS}
        element={
          <ProtectedRoute requiredRole="MERCHANT">
            <GiftCardsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.MERCHANT_ORDERS}
        element={
          <ProtectedRoute requiredRole="MERCHANT">
            <OrdersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.MERCHANT_SCAN_QR}
        element={
          <ProtectedRoute requiredRole="MERCHANT">
            <ScanPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.MERCHANT_SCAN}
        element={
          <ProtectedRoute requiredRole="MERCHANT">
            <ScanPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.MERCHANT_ANALYTICS}
        element={
          <ProtectedRoute requiredRole="MERCHANT">
            <AnalyticsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.MERCHANT_PAYOUTS}
        element={
          <ProtectedRoute requiredRole="MERCHANT">
            <PayoutsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.MERCHANT_SETTINGS}
        element={
          <ProtectedRoute requiredRole="MERCHANT">
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.MERCHANT_COMPLETE_PROFILE}
        element={
          <ProtectedRoute requiredRole="MERCHANT">
            <CompleteProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.MERCHANT_NOTIFICATIONS}
        element={
          <ProtectedRoute requiredRole="MERCHANT">
            <NotificationsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.CHANGE_PASSWORD}
        element={
          <ProtectedRoute requiredRole="MERCHANT">
            <ChangePasswordPage />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes - ALL PROTECTED */}
      <Route
        path={ROUTES.ADMIN_DASHBOARD}
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <NotificationsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.ADMIN_UPDATE}
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <UpdateLandingPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.ADMIN_CREATE_MERCHANT}
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <CreateMerchantPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.ADMIN_EDIT_MERCHANT}
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <CreateMerchantPage />
          </ProtectedRoute>
        }
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
        path={ROUTES.ADMIN_GIFT_CARDS}
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <MerchantsAndCardsApp />
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
        path={ROUTES.ADMIN_SUPPORT_TICKETS}
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminSupportTicketPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.ADMIN_CONTACT_US}
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <ContactUsPage />
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

      <Route
        path={ROUTES.ADMIN_NOTIFICATIONS}
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <NotificationsPage />
          </ProtectedRoute>
        }
      />

      {/* Default Redirects */}
      <Route
        path="/merchant"
        element={<Navigate to={ROUTES.MERCHANT_DASHBOARD} replace />}
      />
      <Route
        path="/admin"
        element={<Navigate to={ROUTES.ADMIN_DASHBOARD} replace />}
      />

      {/* 404 Not Found - Catch all unmatched routes */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
