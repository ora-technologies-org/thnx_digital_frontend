// src/features/auth/components/AuthInitializer.tsx - OPTIMIZED VERSION
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setCredentials, setLoading, logout } from "../slices/authSlice";
import { authService } from "../services/authService";
import { Spinner } from "../../../shared/components/ui/Spinner";

export const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const initAuth = async () => {
      console.log("🔄 AuthInitializer: Starting authentication check...");

      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      const cachedUserStr = localStorage.getItem("user");

      console.log("🔑 Found in localStorage:", {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        hasCachedUser: !!cachedUserStr,
      });

      // No tokens = not authenticated
      if (!accessToken || !refreshToken) {
        console.log("❌ No tokens found, user not authenticated");
        dispatch(setLoading(false));
        return;
      }

      // ✅ OPTIMIZATION: If we have cached user data, restore immediately
      if (cachedUserStr) {
        try {
          const cachedUser = JSON.parse(cachedUserStr);

          console.log("⚡ Fast restore from localStorage:", {
            id: cachedUser.id,
            email: cachedUser.email,
            role: cachedUser.role,
          });

          dispatch(
            setCredentials({
              user: cachedUser,
              accessToken,
              refreshToken,
            }),
          );

          console.log("✅ Session restored instantly from cache!");

          // Optional: Validate token in background (don't await)
          authService.getCurrentUser().catch((error) => {
            console.warn("⚠️ Background token validation failed:", error);
            console.log("🧹 Token expired, logging out...");
            dispatch(logout());
          });

          return;
        } catch (error) {
          console.error("❌ Failed to parse cached user:", error);
          // Continue to API call below
        }
      }

      // No cached user - fetch from API (e.g., first login)
      try {
        console.log("📡 No cached user, fetching from API...");

        const user = await authService.getCurrentUser();

        console.log("✅ User fetched from API:", {
          id: user.id,
          email: user.email,
          role: user.role,
        });

        dispatch(
          setCredentials({
            user,
            accessToken,
            refreshToken,
          }),
        );

        console.log("✅ Auth initialization complete!");
      } catch (error) {
        console.error("❌ Auth initialization failed:", error);
        console.log("🧹 Clearing invalid tokens...");

        // Clear invalid tokens
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        dispatch(setLoading(false));
      }
    };

    initAuth();
  }, [dispatch]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
