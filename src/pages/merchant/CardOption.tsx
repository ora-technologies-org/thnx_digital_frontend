// src/components/GiftCardBuilder.tsx - GIFT CARD BUILDER! 🎁
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

import { useGiftCardSettings } from "@/features/merchant/hooks/useGiftCardSetting";
import type { RootState } from "@/app/store";
import { useAppSelector } from "@/app/hooks";

import {
  FONT_OPTIONS,
  COLOR_PALETTES,
  GRADIENT_DIRECTIONS,
  PRESET_COLORS,
  QUICK_AMOUNTS,
  AMOUNT_SLIDER_CONFIG,
  loadGoogleFonts,
  isPaletteMatch,
  generateGradient,
  formatCurrency,
} from "@/shared/utils/giftcard";
import { GradientDirection } from "@/shared/types/giftCard.types";

interface ColorPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentColor: string;
  onColorChange: (color: string) => void;
  title: string;
}

const ColorPickerModal: React.FC<ColorPickerModalProps> = ({
  isOpen,
  onClose,
  currentColor,
  onColorChange,
  title,
}) => {
  const [tempColor, setTempColor] = useState(currentColor);

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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

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

        {/* Color Picker */}
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

        {/* Preset Colors */}
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

        {/* Actions */}
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

export const GiftCardBuilder: React.FC = () => {
  // Get saved settings from Redux (from server)
  const giftCardSettings = useAppSelector(
    (state: RootState) => state.giftCardSettings,
  );

  const savedSettings = useMemo(() => {
    return (
      giftCardSettings?.settings || {
        primaryColor: "#F54927",
        secondaryColor: "#46368A",
        gradientDirection: "TOP_RIGHT" as GradientDirection,
        fontFamily: "Inter",
        amount: AMOUNT_SLIDER_CONFIG.default,
      }
    );
  }, [giftCardSettings?.settings]);

  // Local state for temporary/unsaved changes (for live preview)
  const [localSettings, setLocalSettings] = useState(savedSettings);

  const { saveSettings, isSaving, isExistingSettings } = useGiftCardSettings();
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [showPrimaryPicker, setShowPrimaryPicker] = useState(false);
  const [showSecondaryPicker, setShowSecondaryPicker] = useState(false);

  // Load Google Fonts on mount
  useEffect(() => {
    loadGoogleFonts(FONT_OPTIONS.map((font) => font.value));
  }, []);

  // Sync local settings when saved settings change (e.g., after save or load)
  useEffect(() => {
    setLocalSettings(savedSettings);
  }, [savedSettings]);

  // Check if there are unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    return (
      localSettings.primaryColor !== savedSettings.primaryColor ||
      localSettings.secondaryColor !== savedSettings.secondaryColor ||
      localSettings.gradientDirection !== savedSettings.gradientDirection ||
      localSettings.fontFamily !== savedSettings.fontFamily
    );
  }, [localSettings, savedSettings]);

  const handleSaveSettings = () => {
    // Only save the settings fields (exclude amount which is local only)
    saveSettings({
      primaryColor: localSettings.primaryColor,
      secondaryColor: localSettings.secondaryColor,
      gradientDirection: localSettings.gradientDirection,
      fontFamily: localSettings.fontFamily,
    });
  };

  // Local handlers that only update preview, don't dispatch to Redux
  const handlePrimaryColorChange = (color: string) => {
    setLocalSettings((prev) => ({ ...prev, primaryColor: color }));
  };

  const handleSecondaryColorChange = (color: string) => {
    setLocalSettings((prev) => ({ ...prev, secondaryColor: color }));
  };

  const handleAmountChange = (amount: number) => {
    setLocalSettings((prev) => ({ ...prev, amount }));
  };

  const handleGradientChange = (direction: GradientDirection) => {
    setLocalSettings((prev) => ({ ...prev, gradientDirection: direction }));
  };

  const handleFontChange = (font: string) => {
    setLocalSettings((prev) => ({ ...prev, fontFamily: font }));
  };

  // Determine button text based on existing settings and unsaved changes
  const getButtonText = () => {
    if (isSaving) {
      return isExistingSettings ? "Updating..." : "Saving...";
    }
    if (isExistingSettings) {
      return hasUnsavedChanges ? "Update Settings" : "Settings Saved";
    }
    return "Save Settings";
  };

  // Disable button if no unsaved changes and settings exist
  const isButtonDisabled = isExistingSettings && !hasUnsavedChanges;

  return (
    <>
      {/* Card Builder Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-gray-200"
      >
        <div className="text-center mb-6 sm:mb-8">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
            Design Your Gift Card
          </h3>
          <p className="text-xs sm:text-sm lg:text-base text-gray-600">
            Customize colors, fonts, and preview in real-time
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Controls */}
          <div className="space-y-4 sm:space-y-6">
            {/* Color Palette Selection */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                Color Palette
              </label>
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {COLOR_PALETTES.map((palette, index) => {
                  const isSelected = isPaletteMatch(
                    {
                      primary: localSettings.primaryColor,
                      secondary: localSettings.secondaryColor,
                    },
                    palette,
                  );

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
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Primary Color
                </label>
                <div className="flex gap-2">
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-2 border-gray-200 cursor-pointer hover:border-blue-400 transition-colors flex-shrink-0"
                    style={{ backgroundColor: localSettings.primaryColor }}
                    onClick={() => setShowPrimaryPicker(true)}
                    title="Click to choose color"
                  />
                  <input
                    type="text"
                    value={localSettings.primaryColor}
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

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Secondary Color
                </label>
                <div className="flex gap-2">
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-2 border-gray-200 cursor-pointer hover:border-blue-400 transition-colors flex-shrink-0"
                    style={{ backgroundColor: localSettings.secondaryColor }}
                    onClick={() => setShowSecondaryPicker(true)}
                    title="Click to choose color"
                  />
                  <input
                    type="text"
                    value={localSettings.secondaryColor}
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
                  const isSelected =
                    localSettings.gradientDirection === dir.value;

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
                <span style={{ fontFamily: localSettings.fontFamily }}>
                  {localSettings.fontFamily}
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
                    const isSelected = localSettings.fontFamily === font.value;

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
                Gift Amount: {formatCurrency(localSettings.amount)}
              </label>
              <input
                type="range"
                min={AMOUNT_SLIDER_CONFIG.min}
                max={AMOUNT_SLIDER_CONFIG.max}
                step={AMOUNT_SLIDER_CONFIG.step}
                value={localSettings.amount}
                onChange={(e) => handleAmountChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{formatCurrency(AMOUNT_SLIDER_CONFIG.min)}</span>
                <span>{formatCurrency(AMOUNT_SLIDER_CONFIG.max)}</span>
              </div>
            </div>

            {/* Quick Amounts */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                Quick Select
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {QUICK_AMOUNTS.map((value) => {
                  const isSelected = localSettings.amount === value;

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
                      {formatCurrency(value)}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Save/Update Button */}
            <Button
              onClick={handleSaveSettings}
              isLoading={isSaving}
              disabled={isButtonDisabled}
              variant={isButtonDisabled ? "outline" : "gradient"}
              className="w-full"
            >
              {!isButtonDisabled && (
                <Save className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              )}
              {isButtonDisabled && (
                <Check className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" />
              )}
              {getButtonText()}
            </Button>

            {hasUnsavedChanges && (
              <p className="text-xs text-amber-600 text-center">
                You have unsaved changes
              </p>
            )}
          </div>

          {/* Preview */}
          <div className="flex items-center justify-center py-8 lg:py-0">
            <motion.div
              key={`${localSettings.primaryColor}-${localSettings.secondaryColor}-${localSettings.gradientDirection}-${localSettings.amount}`}
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="relative w-full max-w-sm sm:max-w-md lg:max-w-sm aspect-[1.6/1]"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Card */}
              <div
                className="absolute inset-0 rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col justify-between text-white"
                style={{
                  background: generateGradient(
                    localSettings.primaryColor,
                    localSettings.secondaryColor,
                    localSettings.gradientDirection,
                  ),
                  fontFamily: localSettings.fontFamily,
                }}
              >
                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-50 blur-xl"
                  style={{
                    background: `linear-gradient(to bottom right, ${localSettings.primaryColor}, ${localSettings.secondaryColor})`,
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

                {/* Content */}
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

                <div className="relative z-10">
                  <p className="text-xs sm:text-sm opacity-80 mb-1">Balance</p>
                  <motion.p
                    key={localSettings.amount}
                    initial={{ scale: 1.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-2xl sm:text-3xl lg:text-4xl font-bold"
                  >
                    {formatCurrency(localSettings.amount)}
                  </motion.p>
                </div>

                <div className="relative z-10">
                  <p className="text-[10px] sm:text-xs opacity-80">
                    Gift Card • Thnx Digital
                  </p>
                </div>

                {/* Shine effect */}
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
            currentColor={localSettings.primaryColor}
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
            currentColor={localSettings.secondaryColor}
            onColorChange={handleSecondaryColorChange}
            title="Choose Secondary Color"
          />
        )}
      </AnimatePresence>
    </>
  );
};
