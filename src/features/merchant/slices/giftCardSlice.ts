// src/features/merchant/slices/giftCardSettingsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * Represents the direction of the gradient effect on gift cards
 */
export type GradientDirection =
  | "LEFT_RIGHT"
  | "TOP_BOTTOM"
  | "TOP_RIGHT"
  | "BOTTOM_LEFT";

/**
 * Interface defining the visual and functional settings for a gift card
 */
export interface GiftCardSettings {
  id?: string;
  primaryColor: string;
  secondaryColor: string;
  gradientDirection: GradientDirection;
  fontFamily: string;
  amount: number;
}

/**
 * Interface defining the state structure for gift card settings
 */
interface GiftCardSettingsState {
  settings: GiftCardSettings;
  isExistingSettings: boolean;
}

/**
 * Key used for storing gift card settings in localStorage
 */
const STORAGE_KEY = "giftCardSettings";

/**
 * Loads initial state from localStorage if available, otherwise returns default settings
 * This ensures persistence across browser sessions
 *
 * @returns Initial state object for gift card settings
 */
const loadInitialState = (): GiftCardSettingsState => {
  try {
    // Attempt to retrieve stored settings from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log("📦 Loaded settings from localStorage:", parsed);
      return parsed;
    }
  } catch (error) {
    console.error("Failed to load settings from localStorage:", error);
  }

  // Return default state if no stored settings exist or error occurs
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

/**
 * Initialize state by loading from localStorage or using defaults
 */
const initialState: GiftCardSettingsState = loadInitialState();

/**
 * Helper function to save the current state to localStorage
 * This ensures settings persist across browser sessions
 *
 * @param state - Current gift card settings state to be saved
 */
const saveToLocalStorage = (state: GiftCardSettingsState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    console.log("💾 Saved settings to localStorage");
  } catch (error) {
    console.error("Failed to save settings to localStorage:", error);
  }
};

/**
 * Redux slice for managing gift card settings
 * Includes actions for updating individual settings and managing persistence
 */
const giftCardSettingsSlice = createSlice({
  name: "giftCardSettings",
  initialState,
  reducers: {
    /**
     * Action to update the primary color setting
     */
    setPrimaryColor: (state, action: PayloadAction<string>) => {
      console.log("🔴 Redux: Setting primary color to", action.payload);
      state.settings.primaryColor = action.payload;
      saveToLocalStorage(state);
    },

    /**
     * Action to update the secondary color setting
     */
    setSecondaryColor: (state, action: PayloadAction<string>) => {
      console.log("🟣 Redux: Setting secondary color to", action.payload);
      state.settings.secondaryColor = action.payload;
      saveToLocalStorage(state);
    },

    /**
     * Action to update the gradient direction setting
     */
    setGradientDirection: (state, action: PayloadAction<GradientDirection>) => {
      console.log("📐 Redux: Setting gradient direction to", action.payload);
      state.settings.gradientDirection = action.payload;
      saveToLocalStorage(state);
    },

    /**
     * Action to update the font family setting
     */
    setFontFamily: (state, action: PayloadAction<string>) => {
      console.log("🔤 Redux: Setting font family to", action.payload);
      state.settings.fontFamily = action.payload;
      saveToLocalStorage(state);
    },

    /**
     * Action to update the gift card amount setting
     */
    setAmount: (state, action: PayloadAction<number>) => {
      console.log("💰 Redux: Setting amount to", action.payload);
      state.settings.amount = action.payload;
      saveToLocalStorage(state);
    },

    /**
     * Action to update multiple settings at once
     * Automatically updates isExistingSettings based on presence of ID
     *
     * @param action.payload - Partial settings object to merge with current settings
     */
    setAllSettings: (
      state,
      action: PayloadAction<Partial<GiftCardSettings>>,
    ) => {
      console.log("⚙️ Redux: Setting all settings to", action.payload);

      // Merge current settings with new settings
      const newSettings = {
        ...state.settings,
        ...action.payload,
      };

      // Preserve ID if provided in payload
      if (action.payload.id !== undefined) {
        newSettings.id = action.payload.id;
      }

      state.settings = newSettings;

      // Auto-update isExistingSettings based on presence of ID
      const hasId = !!newSettings.id;
      if (hasId !== state.isExistingSettings) {
        state.isExistingSettings = hasId;
        console.log("🔄 Redux: isExistingSettings auto-updated to", hasId);
      }

      console.log("✅ Redux: Final settings state:", state.settings);
      saveToLocalStorage(state);
    },

    /**
     * Action to manually set the isExistingSettings flag
     * Useful when settings are loaded from backend with existing ID
     */
    setIsExistingSettings: (state, action: PayloadAction<boolean>) => {
      console.log(
        "🔄 Redux: isExistingSettings manually set to",
        action.payload,
      );
      state.isExistingSettings = action.payload;
      saveToLocalStorage(state);
    },

    /**
     * Action to reset all settings to default values
     * Also clears settings from localStorage
     */
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

      // Clear from localStorage to ensure complete reset
      try {
        localStorage.removeItem(STORAGE_KEY);
        console.log("🗑️ Cleared settings from localStorage");
      } catch (error) {
        console.error("Failed to clear settings from localStorage:", error);
      }
    },
  },
});

/**
 * Export all actions for use in components and thunks
 */
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

/**
 * Export the reducer for store configuration
 */
export default giftCardSettingsSlice.reducer;
