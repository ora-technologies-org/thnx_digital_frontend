// // src/features/auth/slices/authSlice.ts
// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { User } from "../types/auth.types";

// interface AuthState {
//   user: User | null;
//   accessToken: string | null;
//   refreshToken: string | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   error: string | null;
// }

// const initialState: AuthState = {
//   user: null,
//   accessToken: null,
//   refreshToken: null,
//   isAuthenticated: false,
//   isLoading: true, // Start as true for AuthInitializer
//   error: null,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setCredentials: (
//       state,
//       action: PayloadAction<{
//         user: User;
//         accessToken: string;
//         refreshToken: string;
//       }>,
//     ) => {
//       state.user = action.payload.user;
//       state.accessToken = action.payload.accessToken;
//       state.refreshToken = action.payload.refreshToken;
//       state.isAuthenticated = true;
//       state.isLoading = false;
//       state.error = null;

//       // ✅ Save EVERYTHING to localStorage (including user)
//       localStorage.setItem("accessToken", action.payload.accessToken);
//       localStorage.setItem("refreshToken", action.payload.refreshToken);
//       localStorage.setItem("user", JSON.stringify(action.payload.user));

//       console.log("✅ setCredentials: Tokens AND user saved to localStorage");
//     },

//     setUser: (state, action: PayloadAction<User>) => {
//       state.user = action.payload;
//       state.isAuthenticated = true;
//       state.isLoading = false;
//       state.error = null;

//       // ✅ Also save user to localStorage when updating
//       localStorage.setItem("user", JSON.stringify(action.payload));

//       console.log("✅ setUser: User updated in Redux and localStorage");
//     },

//     logout: (state) => {
//       state.user = null;
//       state.accessToken = null;
//       state.refreshToken = null;
//       state.isAuthenticated = false;
//       state.isLoading = false;
//       state.error = null;

//       // ✅ Clear ALL auth data from localStorage
//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("refreshToken");
//       localStorage.removeItem("user");

//       console.log("🚪 logout: All auth data removed from localStorage");
//     },

//     setLoading: (state, action: PayloadAction<boolean>) => {
//       state.isLoading = action.payload;
//     },

//     setError: (state, action: PayloadAction<string>) => {
//       state.error = action.payload;
//       state.isLoading = false;
//     },
//   },
// });

// export const { setCredentials, setUser, logout, setLoading, setError } =
//   authSlice.actions;

// export default authSlice.reducer;
// src/features/auth/slices/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types/auth.types";
import {
  scheduleTokenRefresh,
  cancelTokenRefresh,
} from "../../../shared/utils/api";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        accessToken: string;
        refreshToken: string;
      }>,
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;

      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
      localStorage.setItem("user", JSON.stringify(action.payload.user));

      // ✅ NEW: Schedule automatic token refresh
      scheduleTokenRefresh(action.payload.accessToken);

      console.log("✅ setCredentials: Tokens saved and refresh scheduled");
    },

    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;

      localStorage.setItem("user", JSON.stringify(action.payload));

      console.log("✅ setUser: User updated in Redux and localStorage");
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      // ✅ NEW: Cancel token refresh timer
      cancelTokenRefresh();

      console.log("🚪 logout: All auth data removed and refresh cancelled");
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setCredentials, setUser, logout, setLoading, setError } =
  authSlice.actions;

export default authSlice.reducer;
