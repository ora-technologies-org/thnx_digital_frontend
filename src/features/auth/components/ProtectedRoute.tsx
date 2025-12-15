// src/features/auth/components/ProtectedRoute.tsx
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../../app/hooks";
import { Spinner } from "../../../shared/components/ui/Spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "USER" | "MERCHANT" | "ADMIN";
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    console.log("🛡️ ProtectedRoute check:", {
      path: location.pathname,
      isLoading,
      isAuthenticated,
      userRole: user?.role,
      requiredRole,
      hasToken: !!localStorage.getItem("accessToken"),
    });
  }, [isLoading, isAuthenticated, user, requiredRole, location.pathname]);

  // Show loading spinner during auth initialization
  if (isLoading) {
    console.log("⏳ ProtectedRoute: Still checking authentication...");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="lg" />
        <p className="ml-3 text-gray-600">Checking authentication...</p>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated || !user) {
    console.log("❌ ProtectedRoute: Not authenticated, redirecting to /login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role if required
  if (requiredRole && user.role !== requiredRole) {
    console.log(
      `❌ ProtectedRoute: Role mismatch. Required: ${requiredRole}, User: ${user.role}`
    );

    // Redirect based on actual role
    if (user.role === "ADMIN") {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === "MERCHANT") {
      return <Navigate to="/merchant/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  console.log("✅ ProtectedRoute: Access granted!");
  return <>{children}</>;
};
