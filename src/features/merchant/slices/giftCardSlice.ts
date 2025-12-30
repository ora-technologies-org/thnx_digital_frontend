// src/features/merchant/slices/giftCardSettingsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type GradientDirection =
  | "LEFT_RIGHT"
  | "TOP_BOTTOM"
  | "TOP_RIGHT"
  | "BOTTOM_LEFT";

export interface GiftCardSettings {
  id?: string;
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

const STORAGE_KEY = "giftCardSettings";

// Load from localStorage or use defaults
const loadInitialState = (): GiftCardSettingsState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log("📦 Loaded settings from localStorage:", parsed);
      return parsed;
    }
  } catch (error) {
    console.error("Failed to load settings from localStorage:", error);
  }

  // Return default state
  return {
    settings: {
      primaryColor: "#F54927",
      secondaryColor: "#46368A",
      gradientDirection: "TOP_RIGHT",
      fontFamily: "Inter",
      amount: 500,
    },
    isExistingSettings: false,
  };
};

const initialState: GiftCardSettingsState = loadInitialState();

// Save to localStorage helper
const saveToLocalStorage = (state: GiftCardSettingsState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    console.log("💾 Saved settings to localStorage");
  } catch (error) {
    console.error("Failed to save settings to localStorage:", error);
  }
};

const giftCardSettingsSlice = createSlice({
  name: "giftCardSettings",
  initialState,
  reducers: {
    setPrimaryColor: (state, action: PayloadAction<string>) => {
      console.log("🔴 Redux: Setting primary color to", action.payload);
      state.settings.primaryColor = action.payload;
      saveToLocalStorage(state);
    },
    setSecondaryColor: (state, action: PayloadAction<string>) => {
      console.log("🟣 Redux: Setting secondary color to", action.payload);
      state.settings.secondaryColor = action.payload;
      saveToLocalStorage(state);
    },
    setGradientDirection: (state, action: PayloadAction<GradientDirection>) => {
      console.log("📐 Redux: Setting gradient direction to", action.payload);
      state.settings.gradientDirection = action.payload;
      saveToLocalStorage(state);
    },
    setFontFamily: (state, action: PayloadAction<string>) => {
      console.log("🔤 Redux: Setting font family to", action.payload);
      state.settings.fontFamily = action.payload;
      saveToLocalStorage(state);
    },
    setAmount: (state, action: PayloadAction<number>) => {
      console.log("💰 Redux: Setting amount to", action.payload);
      state.settings.amount = action.payload;
      saveToLocalStorage(state);
    },
    setAllSettings: (
      state,
      action: PayloadAction<Partial<GiftCardSettings>>,
    ) => {
      console.log("⚙️ Redux: Setting all settings to", action.payload);

      const newSettings = {
        ...state.settings,
        ...action.payload,
      };

      if (action.payload.id !== undefined) {
        newSettings.id = action.payload.id;
      }

      state.settings = newSettings;

      const hasId = !!newSettings.id;
      if (hasId !== state.isExistingSettings) {
        state.isExistingSettings = hasId;
        console.log("🔄 Redux: isExistingSettings auto-updated to", hasId);
      }

      console.log("✅ Redux: Final settings state:", state.settings);
      saveToLocalStorage(state);
    },
    setIsExistingSettings: (state, action: PayloadAction<boolean>) => {
      console.log(
        "🔄 Redux: isExistingSettings manually set to",
        action.payload,
      );
      state.isExistingSettings = action.payload;
      saveToLocalStorage(state);
    },
    resetSettings: (state) => {
      console.log("🔄 Redux: Resetting settings to initial state");
      state.settings = {
        primaryColor: "#F54927",
        secondaryColor: "#46368A",
        gradientDirection: "TOP_RIGHT",
        fontFamily: "Inter",
        amount: 500,
      };
      state.isExistingSettings = false;

      // Clear from localStorage
      try {
        localStorage.removeItem(STORAGE_KEY);
        console.log("🗑️ Cleared settings from localStorage");
      } catch (error) {
        console.error("Failed to clear settings from localStorage:", error);
      }
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
  resetSettings,
} = giftCardSettingsSlice.actions;

export default giftCardSettingsSlice.reducer;
