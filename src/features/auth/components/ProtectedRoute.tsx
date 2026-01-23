// src/features/auth/components/ProtectedRoute.tsx
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../../app/hooks";

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
    (state) => state.auth,
  );

  // 🔍 DEBUG: Log every render
  useEffect(() => {
    console.log("🛡️ ProtectedRoute - Current State:", {
      pathname: location.pathname,
      search: location.search,
      fullPath: location.pathname + location.search,
      isLoading,
      isAuthenticated,
      userRole: user?.role,
      requiredRole,
      hasToken: !!localStorage.getItem("accessToken"),
    });
  }, [location, isLoading, isAuthenticated, user, requiredRole]);

  // Show loading spinner during auth initialization
  if (isLoading) {
    console.log("⏳ ProtectedRoute: Still checking authentication...");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login WITH LOCATION STATE
  if (!isAuthenticated || !user) {
    console.log("❌ ProtectedRoute: Not authenticated, redirecting to /login");
    console.log("💾 Saving location state:", {
      pathname: location.pathname,
      search: location.search,
      fullLocation: location,
    });

    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role if required
  if (requiredRole && user.role !== requiredRole) {
    console.log(
      `❌ ProtectedRoute: Role mismatch. Required: ${requiredRole}, User: ${user.role}`,
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
