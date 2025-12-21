// src/types/giftCard.types.ts

export type GradientDirection =
  | "TOP_RIGHT"
  | "TOP_LEFT"
  | "BOTTOM_RIGHT"
  | "BOTTOM_LEFT"
  | "TOP"
  | "BOTTOM"
  | "LEFT"
  | "RIGHT";

export interface GiftCardSettings {
  primaryColor: string;
  secondaryColor: string;
  gradientDirection: GradientDirection;
  fontFamily: string;
  amount?: number; // Optional, not sent to API
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
