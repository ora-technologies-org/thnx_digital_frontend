// src/utils/giftCardUtils.ts - GIFT CARD UTILITIES! 🎁

import { GradientDirection } from "../types/giftCard.types";

/**
 * Font option interface
 */
export interface FontOption {
  value: string;
  label: string;
}

/**
 * Color palette interface
 */
export interface ColorPalette {
  primary: string;
  secondary: string;
  name: string;
}

/**
 * Gradient direction configuration interface
 */
export interface GradientConfig {
  value: GradientDirection;
  label: string;
  class: string;
}

/**
 * Available font families for gift cards
 */
export const FONT_OPTIONS: FontOption[] = [
  { value: "Inter", label: "Inter" },
  { value: "Roboto", label: "Roboto" },
  { value: "Poppins", label: "Poppins" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Lato", label: "Lato" },
];

/**
 * Predefined color palettes with attractive combinations
 */
export const COLOR_PALETTES: ColorPalette[] = [
  { primary: "#F54927", secondary: "#46368A", name: "Sunset" },
  { primary: "#3B82F6", secondary: "#8B5CF6", name: "Ocean" },
  { primary: "#10B981", secondary: "#059669", name: "Forest" },
  { primary: "#F59E0B", secondary: "#EF4444", name: "Fire" },
  { primary: "#EC4899", secondary: "#8B5CF6", name: "Berry" },
  { primary: "#06B6D4", secondary: "#3B82F6", name: "Sky" },
  { primary: "#8B5CF6", secondary: "#EC4899", name: "Grape" },
  { primary: "#EF4444", secondary: "#F97316", name: "Crimson" },
];

/**
 * Gradient direction configurations with CSS classes
 */
export const GRADIENT_DIRECTIONS: GradientConfig[] = [
  { value: "TOP_RIGHT", label: "Top Right", class: "to-br" },
  { value: "LEFT_RIGHT", label: "Top Left", class: "to-tr" },
  { value: "TOP_BOTTOM", label: "Bottom Right", class: "to-tl" },
  { value: "BOTTOM_LEFT", label: "Bottom Left", class: "to-bl" },
];

/**
 * Preset colors for quick selection in color picker
 */
export const PRESET_COLORS: string[] = [
  "#F54927",
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EC4899",
  "#8B5CF6",
  "#EF4444",
  "#06B6D4",
  "#F97316",
  "#14B8A6",
  "#8B5CF6",
  "#F43F5E",
  "#84CC16",
  "#EAB308",
  "#A855F7",
  "#6366F1",
  "#059669",
  "#DC2626",
  "#7C3AED",
  "#0EA5E9",
  "#22C55E",
  "#F59E0B",
];

/**
 * Quick select amount options (in currency)
 */
export const QUICK_AMOUNTS: number[] = [500, 1000, 2000, 5000];

/**
 * Amount slider configuration
 */
export const AMOUNT_SLIDER_CONFIG = {
  min: 100,
  max: 10000,
  step: 100,
  default: 500,
};

/**
 * Convert gradient direction enum to CSS gradient direction string
 * @param direction - The gradient direction enum value
 * @returns CSS-compatible gradient direction string
 */
export const getGradientDirectionCSS = (
  direction: GradientDirection,
): string => {
  switch (direction) {
    case "TOP_RIGHT":
      return "to top right";
    case "LEFT_RIGHT":
      return "to top left";
    case "TOP_BOTTOM":
      return "to bottom right";
    case "BOTTOM_LEFT":
      return "to bottom left";
    default:
      return "to bottom right";
  }
};

/**
 * Load Google Fonts dynamically
 * @param fonts - Array of font family names to load
 */
export const loadGoogleFonts = (fonts: string[]): void => {
  const link = document.createElement("link");
  link.href = `https://fonts.googleapis.com/css2?${fonts.map((font) => `family=${font.replace(" ", "+")}`).join("&")}&display=swap`;
  link.rel = "stylesheet";

  // Only add if not already present
  if (!document.querySelector(`link[href="${link.href}"]`)) {
    document.head.appendChild(link);
  }
};

/**
 * Validate hex color code
 * @param color - Color string to validate
 * @returns Boolean indicating if color is valid hex
 */
export const isValidHexColor = (color: string): boolean => {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
};

/**
 * Format hex color to uppercase with # prefix
 * @param color - Color string to format
 * @returns Formatted hex color
 */
export const formatHexColor = (color: string): string => {
  if (!color.startsWith("#")) {
    color = "#" + color;
  }
  return color.toUpperCase();
};

/**
 * Check if two color palettes match
 * @param palette1 - First color palette
 * @param palette2 - Second color palette
 * @returns Boolean indicating if palettes match
 */
export const isPaletteMatch = (
  palette1: { primary: string; secondary: string },
  palette2: { primary: string; secondary: string },
): boolean => {
  return (
    palette1.primary.toLowerCase() === palette2.primary.toLowerCase() &&
    palette1.secondary.toLowerCase() === palette2.secondary.toLowerCase()
  );
};

/**
 * Get contrast color (black or white) based on background
 * @param hexColor - Background hex color
 * @returns "black" or "white" for optimal contrast
 */
export const getContrastColor = (hexColor: string): "black" | "white" => {
  // Remove # if present
  const hex = hexColor.replace("#", "");

  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return black for light backgrounds, white for dark
  return luminance > 0.5 ? "black" : "white";
};

/**
 * Generate CSS gradient string from settings
 * @param primaryColor - Primary gradient color
 * @param secondaryColor - Secondary gradient color
 * @param direction - Gradient direction
 * @returns CSS gradient string
 */
export const generateGradient = (
  primaryColor: string,
  secondaryColor: string,
  direction: GradientDirection,
): string => {
  const cssDirection = getGradientDirectionCSS(direction);
  return `linear-gradient(${cssDirection}, ${primaryColor}, ${secondaryColor})`;
};

/**
 * Format currency amount with proper locale
 * @param amount - Amount to format
 * @param currency - Currency symbol (default: ₹)
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  currency: string = "₹",
): string => {
  return `${currency}${amount.toLocaleString()}`;
};
