// src/features/auth/slices/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types/auth.types";
import {
  scheduleTokenRefresh,
  cancelTokenRefresh,
} from "../../../shared/utils/api";

/**
 * Redux state structure for authentication management
 */
interface AuthState {
  /** Current authenticated user data, null if not logged in */
  user: User | null;
  /** JWT access token for API authentication */
  accessToken: string | null;
  /** JWT refresh token for obtaining new access tokens */
  refreshToken: string | null;
  /** Flag indicating if user is currently authenticated */
  isAuthenticated: boolean;
  /** Loading state during authentication operations */
  isLoading: boolean;
  /** Error message from failed authentication operations */
  error: string | null;
}

/**
 * Initial authentication state
 * isLoading starts as true to allow AuthInitializer to check for existing session
 */
const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true, // Start true for initial auth check
  error: null,
};

/**
 * Redux slice for managing authentication state
 * Handles login, logout, token management, and user data persistence
 */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * Sets user credentials after successful login or session restoration
     *
     * This action:
     * - Updates Redux state with user data and tokens
     * - Persists tokens and user data to localStorage for session restoration
     * - Schedules automatic token refresh before expiration
     * - Marks user as authenticated and stops loading
     *
     * @param user - Authenticated user data
     * @param accessToken - JWT access token for API requests
     * @param refreshToken - JWT refresh token for obtaining new access tokens
     *
     * @example
     * ```typescript
     * dispatch(setCredentials({
     *   user: { id: '123', email: 'user@example.com', role: 'admin' },
     *   accessToken: 'eyJhbGc...',
     *   refreshToken: 'eyJhbGc...'
     * }));
     * ```
     */
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        accessToken: string;
        refreshToken: string;
      }>,
    ) => {
      // Update Redux state with authentication data
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;

      // Persist authentication data to localStorage for session restoration
      // This allows users to remain logged in after page refresh
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
      localStorage.setItem("user", JSON.stringify(action.payload.user));

      // Schedule automatic token refresh before the access token expires
      // This ensures seamless user experience without manual re-authentication
      scheduleTokenRefresh(action.payload.accessToken);

      console.log("✅ setCredentials: Tokens saved and refresh scheduled");
    },

    /**
     * Updates user data without changing tokens
     *
     * Used when user profile is updated (e.g., name, email, avatar changes)
     * without requiring re-authentication. Syncs changes to localStorage.
     *
     * @param payload - Updated user data
     *
     * @example
     * ```typescript
     * dispatch(setUser({
     *   ...currentUser,
     *   name: 'New Name',
     *   avatar: 'https://example.com/avatar.jpg'
     * }));
     * ```
     */
    setUser: (state, action: PayloadAction<User>) => {
      // Update user data in Redux state
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;

      // Persist updated user data to localStorage
      // This ensures the latest user info is available on page refresh
      localStorage.setItem("user", JSON.stringify(action.payload));

      console.log("✅ setUser: User updated in Redux and localStorage");
    },

    /**
     * Logs out the current user and clears all authentication data
     *
     * This action:
     * - Clears all authentication state in Redux
     * - Removes tokens and user data from localStorage
     * - Cancels any scheduled token refresh timers
     * - Resets loading and error states
     *
     * @example
     * ```typescript
     * dispatch(logout());
     * navigate('/login');
     * ```
     */
    logout: (state) => {
      // Clear all authentication data from Redux state
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;

      // Remove all persisted authentication data from localStorage
      // This ensures clean logout with no residual session data
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      // Cancel any scheduled token refresh timers
      // Prevents unnecessary API calls after logout
      cancelTokenRefresh();

      console.log("🚪 logout: All auth data removed and refresh cancelled");
    },

    /**
     * Updates the loading state for authentication operations
     *
     * Used to show/hide loading indicators during:
     * - Initial authentication check
     * - Login/logout operations
     * - Token refresh operations
     *
     * @param payload - Boolean indicating loading state
     *
     * @example
     * ```typescript
     * dispatch(setLoading(true));  // Show loading spinner
     * // ... perform async operation
     * dispatch(setLoading(false)); // Hide loading spinner
     * ```
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    /**
     * Sets an error message for failed authentication operations
     *
     * Automatically stops loading state when error is set.
     * Used for displaying error notifications to users.
     */
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false; // Stop loading when error occurs
    },
  },
});

// Export actions for use in components and thunks
export const { setCredentials, setUser, logout, setLoading, setError } =
  authSlice.actions;

// Export reducer for store configuration
export default authSlice.reducer;
