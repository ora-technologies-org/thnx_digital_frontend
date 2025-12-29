import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gift,
  Sparkles,
  Save,
  ChevronDown,
  Check,
  Pencil,
  X,
} from "lucide-react";
import { Button } from "../../shared/components/ui/Button";
import {
  setPrimaryColor,
  setSecondaryColor,
  setGradientDirection,
  setFontFamily,
  setAmount,
  GradientDirection,
} from "@/features/merchant/slices/giftCardSlice";
import { useGiftCardSettings } from "@/features/merchant/hooks/useGiftCardSetting";
import type { RootState } from "@/app/store";
import { useAppDispatch, useAppSelector } from "@/app/hooks";

// Font options for the gift card
const FONT_OPTIONS = [
  { value: "Inter", label: "Inter" },
  { value: "Roboto", label: "Roboto" },
  { value: "Poppins", label: "Poppins" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Lato", label: "Lato" },
];

// Predefined color palette combinations
const COLOR_PALETTES = [
  { primary: "#F54927", secondary: "#46368A", name: "Sunset" },
  { primary: "#3B82F6", secondary: "#8B5CF6", name: "Ocean" },
  { primary: "#10B981", secondary: "#059669", name: "Forest" },
  { primary: "#F59E0B", secondary: "#EF4444", name: "Fire" },
  { primary: "#EC4899", secondary: "#8B5CF6", name: "Berry" },
  { primary: "#06B6D4", secondary: "#3B82F6", name: "Sky" },
  { primary: "#8B5CF6", secondary: "#EC4899", name: "Grape" },
  { primary: "#EF4444", secondary: "#F97316", name: "Crimson" },
];

// Gradient direction options with corresponding CSS classes
const GRADIENT_DIRECTIONS: {
  value: GradientDirection;
  label: string;
  class: string;
}[] = [
  { value: "TOP_RIGHT", label: "Top Right", class: "to-br" },
  { value: "LEFT_RIGHT", label: "Top Left", class: "to-tr" },
  { value: "TOP_BOTTOM", label: "Bottom Right", class: "to-tl" },
  { value: "BOTTOM_LEFT", label: "Bottom Left", class: "to-bl" },
];

// Preset color options for quick selection
const PRESET_COLORS = [
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

interface ColorPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentColor: string;
  onColorChange: (color: string) => void;
  title: string;
}

/**
 * Color Picker Modal Component
 * Allows users to select colors using a color picker, hex input, or preset colors
 */
const ColorPickerModal: React.FC<ColorPickerModalProps> = ({
  isOpen,
  onClose,
  currentColor,
  onColorChange,
  title,
}) => {
  const [tempColor, setTempColor] = useState(currentColor);

  // Sync temporary color with current color when it changes
  useEffect(() => {
    setTempColor(currentColor);
  }, [currentColor]);

  const handleApply = () => {
    onColorChange(tempColor);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-white rounded-2xl shadow-2xl p-4 sm:p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          </button>
        </div>

        {/* Color Preview */}
        <div className="mb-4 sm:mb-6">
          <div
            className="w-full h-20 sm:h-24 rounded-xl border-2 border-gray-200 shadow-inner transition-colors duration-200"
            style={{ backgroundColor: tempColor }}
          />
          <p className="text-center text-xs sm:text-sm font-mono text-gray-600 mt-2">
            {tempColor.toUpperCase()}
          </p>
        </div>

        {/* Custom Color Picker */}
        <div className="mb-4 sm:mb-6">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
            Custom Color
          </label>
          <div className="flex gap-2 sm:gap-3">
            <input
              type="color"
              value={tempColor}
              onChange={(e) => setTempColor(e.target.value)}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg cursor-pointer border-2 border-gray-200"
            />
            <input
              type="text"
              value={tempColor}
              onChange={(e) => {
                const value = e.target.value;
                // Only allow valid hex color format
                if (value.match(/^#[0-9A-Fa-f]{0,6}$/)) {
                  setTempColor(value);
                }
              }}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg font-mono text-xs sm:text-sm uppercase"
              placeholder="#000000"
              maxLength={7}
            />
          </div>
        </div>

        {/* Preset Colors Grid */}
        <div className="mb-4 sm:mb-6">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
            Preset Colors
          </label>
          <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5 sm:gap-2">
            {PRESET_COLORS.map((color, index) => (
              <motion.button
                key={index}
                onClick={() => setTempColor(color)}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg border-2 transition-all ${
                  tempColor.toLowerCase() === color.toLowerCase()
                    ? "border-blue-600 scale-110 shadow-lg"
                    : "border-gray-200 hover:border-gray-300 hover:scale-105"
                }`}
                style={{ backgroundColor: color }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 sm:gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="gradient" onClick={handleApply} className="flex-1">
            Apply Color
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

/**
 * Gift Card Builder Component
 * Main component for designing and customizing gift cards
 */
export const GiftCardBuilder: React.FC = () => {
  const dispatch = useAppDispatch();

  // Get gift card settings from Redux store
  const giftCardSettings = useAppSelector(
    (state: RootState) => state.giftCardSettings,
  );

  // Memoize settings with default values
  const settings = useMemo(() => {
    return (
      giftCardSettings?.settings || {
        primaryColor: "#F54927",
        secondaryColor: "#46368A",
        gradientDirection: "TOP_RIGHT" as GradientDirection,
        fontFamily: "Inter",
        amount: 500,
      }
    );
  }, [giftCardSettings?.settings]);

  const { saveSettings, isSaving, isExistingSettings } = useGiftCardSettings();

  // Component state
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [showPrimaryPicker, setShowPrimaryPicker] = useState(false);
  const [showSecondaryPicker, setShowSecondaryPicker] = useState(false);

  // Handler functions
  const handleSaveSettings = () => {
    saveSettings({
      primaryColor: settings.primaryColor,
      secondaryColor: settings.secondaryColor,
      gradientDirection: settings.gradientDirection,
      fontFamily: settings.fontFamily,
    });
  };

  const handlePrimaryColorChange = (color: string) => {
    dispatch(setPrimaryColor(color));
  };

  const handleSecondaryColorChange = (color: string) => {
    dispatch(setSecondaryColor(color));
  };

  const handleAmountChange = (amount: number) => {
    dispatch(setAmount(amount));
  };

  const handleGradientChange = (direction: GradientDirection) => {
    dispatch(setGradientDirection(direction));
  };

  const handleFontChange = (font: string) => {
    dispatch(setFontFamily(font));
  };

  return (
    <>
      {/* Card Builder Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-gray-200"
      >
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
            Design Your Gift Card
          </h3>
          <p className="text-xs sm:text-sm lg:text-base text-gray-600">
            Customize colors, fonts, and preview in real-time
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Controls Section */}
          <div className="space-y-4 sm:space-y-6">
            {/* Color Palette Selection */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                Color Palette
              </label>
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {COLOR_PALETTES.map((palette, index) => {
                  const isSelected =
                    settings.primaryColor === palette.primary &&
                    settings.secondaryColor === palette.secondary;

                  return (
                    <motion.button
                      key={index}
                      onClick={() => {
                        handlePrimaryColorChange(palette.primary);
                        handleSecondaryColorChange(palette.secondary);
                      }}
                      className={`h-10 sm:h-12 lg:h-14 rounded-lg sm:rounded-xl relative overflow-hidden ${
                        isSelected
                          ? "ring-2 sm:ring-4 ring-blue-600 ring-offset-1 sm:ring-offset-2"
                          : ""
                      }`}
                      style={{
                        background: `linear-gradient(to bottom right, ${palette.primary}, ${palette.secondary})`,
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title={palette.name}
                    >
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute inset-0 flex items-center justify-center bg-black/20"
                        >
                          <Check className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Custom Color Pickers */}
            <div className="space-y-3 sm:space-y-4">
              {/* Primary Color */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Primary Color
                </label>
                <div className="flex gap-2">
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-2 border-gray-200 cursor-pointer hover:border-blue-400 transition-colors flex-shrink-0"
                    style={{ backgroundColor: settings.primaryColor }}
                    onClick={() => setShowPrimaryPicker(true)}
                    title="Click to choose color"
                  />
                  <input
                    type="text"
                    value={settings.primaryColor}
                    onChange={(e) => handlePrimaryColorChange(e.target.value)}
                    className="flex-1 px-2 sm:px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-mono uppercase min-w-0"
                    placeholder="#F54927"
                  />
                  <motion.button
                    onClick={() => setShowPrimaryPicker(true)}
                    className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md flex-shrink-0"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Open Color Picker"
                  >
                    <Pencil className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Secondary Color */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Secondary Color
                </label>
                <div className="flex gap-2">
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-2 border-gray-200 cursor-pointer hover:border-blue-400 transition-colors flex-shrink-0"
                    style={{ backgroundColor: settings.secondaryColor }}
                    onClick={() => setShowSecondaryPicker(true)}
                    title="Click to choose color"
                  />
                  <input
                    type="text"
                    value={settings.secondaryColor}
                    onChange={(e) => handleSecondaryColorChange(e.target.value)}
                    className="flex-1 px-2 sm:px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-mono uppercase min-w-0"
                    placeholder="#46368A"
                  />
                  <motion.button
                    onClick={() => setShowSecondaryPicker(true)}
                    className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md flex-shrink-0"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Open Color Picker"
                  >
                    <Pencil className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Gradient Direction */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                Gradient Direction
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {GRADIENT_DIRECTIONS.map((dir) => {
                  const isSelected = settings.gradientDirection === dir.value;

                  return (
                    <motion.button
                      key={dir.value}
                      onClick={() => handleGradientChange(dir.value)}
                      className={`px-2 sm:px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isSelected
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {dir.label}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Font Family Dropdown */}
            <div className="relative">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Font Family
              </label>
              <button
                onClick={() => setShowFontDropdown(!showFontDropdown)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg text-left flex items-center justify-between hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                <span style={{ fontFamily: settings.fontFamily }}>
                  {settings.fontFamily}
                </span>
                <ChevronDown
                  className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-500 transition-transform ${
                    showFontDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>
              {showFontDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                >
                  {FONT_OPTIONS.map((font) => {
                    const isSelected = settings.fontFamily === font.value;

                    return (
                      <button
                        key={font.value}
                        onClick={() => {
                          handleFontChange(font.value);
                          setShowFontDropdown(false);
                        }}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-left text-sm sm:text-base hover:bg-gray-50 transition-colors ${
                          isSelected ? "bg-blue-50 text-blue-600" : ""
                        }`}
                        style={{ fontFamily: font.value }}
                      >
                        {font.label}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </div>

            {/* Amount Slider */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                Gift Amount: ₹{settings.amount.toLocaleString()}
              </label>
              <input
                type="range"
                min="100"
                max="10000"
                step="100"
                value={settings.amount}
                onChange={(e) => handleAmountChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>₹100</span>
                <span>₹10,000</span>
              </div>
            </div>

            {/* Quick Amount Selection */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                Quick Select
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[500, 1000, 2000, 5000].map((value) => {
                  const isSelected = settings.amount === value;

                  return (
                    <motion.button
                      key={value}
                      onClick={() => handleAmountChange(value)}
                      className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                        isSelected
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      ₹{value.toLocaleString()}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Save Settings Button */}
            <Button
              onClick={handleSaveSettings}
              isLoading={isSaving}
              variant="gradient"
              className="w-full"
            >
              <Save className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              {isSaving
                ? isExistingSettings
                  ? "Updating..."
                  : "Saving..."
                : isExistingSettings
                  ? "Update Settings"
                  : "Save Settings"}
            </Button>
          </div>

          {/* Preview Section */}
          <div className="flex items-center justify-center py-8 lg:py-0">
            <motion.div
              key={`${settings.primaryColor}-${settings.secondaryColor}-${settings.gradientDirection}-${settings.amount}`}
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="relative w-full max-w-sm sm:max-w-md lg:max-w-sm aspect-[1.6/1]"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Gift Card */}
              <div
                className="absolute inset-0 rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col justify-between text-white"
                style={{
                  background: `linear-gradient(${
                    settings.gradientDirection === "TOP_RIGHT"
                      ? "to top right"
                      : settings.gradientDirection === "LEFT_RIGHT"
                        ? "to top left"
                        : settings.gradientDirection === "TOP_BOTTOM"
                          ? "to bottom right"
                          : "to bottom left"
                  }, ${settings.primaryColor}, ${settings.secondaryColor})`,
                  fontFamily: settings.fontFamily,
                }}
              >
                {/* Animated Glow Effect */}
                <motion.div
                  className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-50 blur-xl"
                  style={{
                    background: `linear-gradient(to bottom right, ${settings.primaryColor}, ${settings.secondaryColor})`,
                  }}
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.7, 0.5],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Card Header */}
                <div className="relative z-10">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                      <Gift className="w-5 h-5 sm:w-7 sm:h-7" />
                    </div>
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="w-5 h-5 sm:w-7 sm:h-7" />
                    </motion.div>
                  </div>
                </div>

                {/* Card Balance */}
                <div className="relative z-10">
                  <p className="text-xs sm:text-sm opacity-80 mb-1">Balance</p>
                  <motion.p
                    key={settings.amount}
                    initial={{ scale: 1.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-2xl sm:text-3xl lg:text-4xl font-bold"
                  >
                    ₹{settings.amount.toLocaleString()}
                  </motion.p>
                </div>

                {/* Card Footer */}
                <div className="relative z-10">
                  <p className="text-[10px] sm:text-xs opacity-80">
                    Gift Card • Thnx Digital
                  </p>
                </div>

                {/* Animated Shine Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-xl sm:rounded-2xl"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Color Picker Modals */}
      <AnimatePresence>
        {showPrimaryPicker && (
          <ColorPickerModal
            isOpen={showPrimaryPicker}
            onClose={() => setShowPrimaryPicker(false)}
            currentColor={settings.primaryColor}
            onColorChange={handlePrimaryColorChange}
            title="Choose Primary Color"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSecondaryPicker && (
          <ColorPickerModal
            isOpen={showSecondaryPicker}
            onClose={() => setShowSecondaryPicker(false)}
            currentColor={settings.secondaryColor}
            onColorChange={handleSecondaryColorChange}
            title="Choose Secondary Color"
          />
        )}
      </AnimatePresence>
    </>
  );
};
