// src/types/giftCard.types.ts

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
  amount?: number; // Optional, not sent to API
}

export interface GiftCardSettingsResponse {
  success: boolean;
  data: {
    id: string;
    primaryColor: string;
    secondaryColor: string;
    gradientDirection: GradientDirection;
    fontFamily: string;
  } | null;
  message?: string;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  name: string;
}

export interface FontOption {
  value: string;
  label: string;
}

export interface GradientOption {
  value: GradientDirection;
  label: string;
  class: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}
