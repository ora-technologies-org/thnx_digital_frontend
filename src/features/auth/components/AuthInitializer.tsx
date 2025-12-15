// // src/features/auth/components/AuthInitializer.tsx
// import { useEffect } from 'react';
// import { useAppDispatch } from '../../../app/hooks';
// import { setUser, logout, setLoading } from '../slices/authSlice';
// import { authService } from '../services/authService';

// export const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const dispatch = useAppDispatch();

//   useEffect(() => {
//     const initAuth = async () => {
//       console.log('🔄 AuthInitializer: Starting authentication check...');

//       const accessToken = localStorage.getItem('accessToken');
//       console.log('🔑 Access token exists:', !!accessToken);

//       if (!accessToken) {
//         console.log('❌ No access token found, user not authenticated');
//         dispatch(logout());
//         return;
//       }

//       try {
//         console.log('📡 Fetching current user from backend...');
//         dispatch(setLoading(true));

//         const user = await authService.getCurrentUser();

//         console.log('✅ User fetched successfully:', user);
//         dispatch(setUser(user));

//       } catch (error: any) {
//         console.error('❌ Auth initialization failed:', error);
//         console.log('Token might be expired or invalid, logging out...');
//         dispatch(logout());
//       }
//     };

//     initAuth();
//   }, [dispatch]);

//   return <>{children}</>;
// };

// src/features/auth/components/AuthInitializer.tsx
// src/features/auth/components/AuthInitializer.tsx
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setCredentials, setLoading } from "../slices/authSlice";
import { authService } from "../services/authService";
import { Spinner } from "../../../shared/components/ui/Spinner";

export const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const { isLoading, isAuthenticated, user } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    const initAuth = async () => {
      console.log("🔄 AuthInitializer: Starting authentication check...");
      console.log("📊 Initial Redux State:", {
        isLoading,
        isAuthenticated,
        hasUser: !!user,
      });

      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      console.log("🔑 Tokens in localStorage:", {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        accessTokenPreview: accessToken
          ? accessToken.substring(0, 20) + "..."
          : "null",
      });

      if (!accessToken || !refreshToken) {
        console.log("❌ No tokens found, user not authenticated");
        dispatch(setLoading(false));
        return;
      }

      try {
        console.log("📡 Calling authService.getCurrentUser()...");

        const user = await authService.getCurrentUser();

        console.log("✅ User fetched successfully:", {
          id: user.id,
          email: user.email,
          role: user.role,
          businessName: user.businessName,
        });

        console.log("💾 Dispatching setCredentials with:", {
          hasUser: !!user,
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
        });

        // ✅ IMPORTANT: Restore tokens to Redux state along with user
        dispatch(
          setCredentials({
            user,
            accessToken,
            refreshToken,
          })
        );

        console.log("✅ Auth initialization complete!");
      } catch (error: any) {
        console.error("❌ Auth initialization failed:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          stack: error.stack,
        });

        console.log("🧹 Clearing invalid tokens from localStorage...");

        // Clear invalid tokens
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        // Stop loading so user can access public routes
        dispatch(setLoading(false));

        console.log("⚠️ User will need to login again");
      }
    };

    initAuth();
  }, [dispatch]);

  // Add logging when loading state changes
  useEffect(() => {
    console.log("🔄 Auth State Changed:", {
      isLoading,
      isAuthenticated,
      hasUser: !!user,
      userRole: user?.role,
    });
  }, [isLoading, isAuthenticated, user]);

  // ✅ Show loading screen while checking authentication
  if (isLoading) {
    console.log("⏳ Showing loading screen...");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="lg" />
        <p className="ml-3 text-gray-600">Checking authentication...</p>
      </div>
    );
  }

  console.log("✅ Auth initialized, rendering children");
  return <>{children}</>;
};
