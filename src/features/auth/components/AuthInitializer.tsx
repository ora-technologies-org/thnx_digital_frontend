// src/features/auth/components/AuthInitializer.tsx
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setCredentials, setLoading } from "../slices/authSlice";
import { Spinner } from "../../../shared/components/ui/Spinner";

/**
 * AuthInitializer Component
 *
 * Handles authentication state restoration on application startup.
 * This component runs once when the app loads and attempts to restore
 * the user's session from localStorage if valid tokens exist.
 *
 * Flow:
 * 1. Check localStorage for access/refresh tokens and cached user data
 * 2. If tokens exist, restore session immediately from cache
 * 3. Token validation/refresh is handled automatically by API interceptor
 * 4. Shows loading spinner during initialization
 *
 * @param children - Child components to render after auth initialization
 */
export const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    /**
     * Initializes authentication state by checking localStorage
     * and restoring session if valid credentials exist
     */
    const initAuth = async () => {
      console.log("🔄 AuthInitializer: Starting authentication check...");

      // Retrieve stored authentication data from localStorage
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      const cachedUserStr = localStorage.getItem("user");

      console.log("🔑 Found in localStorage:", {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        hasCachedUser: !!cachedUserStr,
      });

      // Early exit: No tokens means user is not authenticated
      if (!accessToken || !refreshToken) {
        console.log("❌ No tokens found, user not authenticated");
        dispatch(setLoading(false));
        return;
      }

      // Fast path: Restore session from cached user data
      if (cachedUserStr) {
        try {
          // Parse cached user object from JSON string
          const cachedUser = JSON.parse(cachedUserStr);

          console.log("⚡ Fast restore from localStorage:", {
            id: cachedUser.id,
            email: cachedUser.email,
            role: cachedUser.role,
          });

          // Immediately restore authentication state to Redux store
          // This provides instant session restoration without API calls
          dispatch(
            setCredentials({
              user: cachedUser,
              accessToken,
              refreshToken,
            }),
          );

          console.log("✅ Session restored instantly from cache!");

          // Note: Token validation is delegated to API interceptor
          // The interceptor will automatically refresh expired tokens
          // when API requests are made, eliminating the need for
          // upfront validation and reducing initial load time

          return;
        } catch (error) {
          // Handle corrupted cache data gracefully
          console.error("❌ Failed to parse cached user:", error);

          // Clear invalid cache to prevent future parsing errors
          localStorage.removeItem("user");
          dispatch(setLoading(false));
        }
      } else {
        // Edge case: Tokens exist but no cached user data
        // This shouldn't happen in normal flow - indicates incomplete logout
        // or corrupted state, so we clear tokens to force fresh authentication
        console.warn("⚠️ Have tokens but no cached user - clearing tokens");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        dispatch(setLoading(false));
      }
    };

    // Execute authentication initialization on component mount
    initAuth();
  }, [dispatch]);

  // Show loading screen while authentication state is being initialized
  // Prevents flash of login screen for authenticated users
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

  // Render child components after authentication check completes
  return <>{children}</>;
};
