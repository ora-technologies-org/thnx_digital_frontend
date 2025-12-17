import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/slices/authSlice";
import giftCardReducer from "../features/giftCards/slices/giftCardSlice";
import merchantReducer from "../features/admin/slices/MerchantCreateSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    giftCards: giftCardReducer,
    merchant: merchantReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

if (process.env.NODE_ENV === "development") {
  store.subscribe(() => {
    console.log("🏪 Redux State Updated:", store.getState().auth);
  });
}
