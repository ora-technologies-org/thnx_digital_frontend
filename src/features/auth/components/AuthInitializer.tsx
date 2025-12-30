// src/features/auth/components/AuthInitializer.tsx - FIXED VERSION
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setCredentials, setLoading } from "../slices/authSlice";
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

      // ✅ If we have cached user data, restore immediately
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

          // DON'T validate in background - let api interceptor handle token refresh
          // The interceptor will automatically refresh tokens when they expire

          return;
        } catch (error) {
          console.error("❌ Failed to parse cached user:", error);
          // Clear invalid cache
          localStorage.removeItem("user");
          dispatch(setLoading(false));
        }
      } else {
        // No cached user but have tokens - shouldn't happen normally
        // Clear tokens to force fresh login
        console.warn("⚠️ Have tokens but no cached user - clearing tokens");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
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
