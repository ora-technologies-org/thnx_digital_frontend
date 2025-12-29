// src/features/merchant/slices/giftCardSettingsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type GradientDirection =
  | "LEFT_RIGHT"
  | "TOP_BOTTOM"
  | "TOP_RIGHT"
  | "BOTTOM_LEFT";

export interface GiftCardSettings {
  id?: string; // Make ID optional
  primaryColor: string;
  secondaryColor: string;
  gradientDirection: GradientDirection;
  fontFamily: string;
  amount: number;
}

interface GiftCardSettingsState {
  settings: GiftCardSettings;
  isExistingSettings: boolean;
}

const initialState: GiftCardSettingsState = {
  settings: {
    primaryColor: "#F54927",
    secondaryColor: "#46368A",
    gradientDirection: "TOP_RIGHT",
    fontFamily: "Inter",
    amount: 500,
  },
  isExistingSettings: false,
};

const giftCardSettingsSlice = createSlice({
  name: "giftCardSettings",
  initialState,
  reducers: {
    setPrimaryColor: (state, action: PayloadAction<string>) => {
      console.log("🔴 Redux: Setting primary color to", action.payload);
      state.settings.primaryColor = action.payload;
    },
    setSecondaryColor: (state, action: PayloadAction<string>) => {
      console.log("🟣 Redux: Setting secondary color to", action.payload);
      state.settings.secondaryColor = action.payload;
    },
    setGradientDirection: (state, action: PayloadAction<GradientDirection>) => {
      console.log("📐 Redux: Setting gradient direction to", action.payload);
      state.settings.gradientDirection = action.payload;
    },
    setFontFamily: (state, action: PayloadAction<string>) => {
      console.log("🔤 Redux: Setting font family to", action.payload);
      state.settings.fontFamily = action.payload;
    },
    setAmount: (state, action: PayloadAction<number>) => {
      console.log("💰 Redux: Setting amount to", action.payload);
      state.settings.amount = action.payload;
    },
    setAllSettings: (
      state,
      action: PayloadAction<Partial<GiftCardSettings>>,
    ) => {
      console.log("⚙️ Redux: Setting all settings to", action.payload);
      state.settings = { ...state.settings, ...action.payload };

      // Update isExistingSettings based on whether we have an ID
      const hasId = !!action.payload.id;
      if (hasId !== state.isExistingSettings) {
        state.isExistingSettings = hasId;
        console.log("🔄 Redux: isExistingSettings changed to", hasId);
      }
    },
    setIsExistingSettings: (state, action: PayloadAction<boolean>) => {
      console.log("🔄 Redux: isExistingSettings set to", action.payload);
      state.isExistingSettings = action.payload;
    },
  },
});

export const {
  setPrimaryColor,
  setSecondaryColor,
  setGradientDirection,
  setFontFamily,
  setAmount,
  setAllSettings,
  setIsExistingSettings,
} = giftCardSettingsSlice.actions;

export default giftCardSettingsSlice.reducer;
