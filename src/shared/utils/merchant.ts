// src/utils/merchantUtils.ts - MERCHANT UTILITY FUNCTIONS! 🛠️

import { CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { z } from "zod";
export type ProfileStatus =
  | "VERIFIED"
  | "REJECTED"
  | "PENDING_VERIFICATION"
  | "INCOMPLETE";

export interface StatusConfig {
  label: string;
  icon: LucideIcon;
  bgBadge: string;
  textBadge: string;
  borderBadge: string;
  gradient: string;
  avatarBg: string;
  glow: string;
}
export const purchaseSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Invalid email address"),
  customerPhone: z.string().min(10, "Phone must be at least 10 digits"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  transactionId: z.string().min(1, "Transaction ID is required"),
});
/**
 * Get status configuration based on merchant profile status
 * Returns styling and icons for different merchant statuses
 */
export const getStatusConfig = (
  profileStatus?: string | null,
): StatusConfig => {
  switch (profileStatus) {
    case "VERIFIED":
      return {
        label: "Verified",
        icon: CheckCircle,
        bgBadge: "bg-emerald-100",
        textBadge: "text-emerald-700",
        borderBadge: "border-emerald-200",
        gradient: "from-emerald-500 to-teal-500",
        avatarBg: "from-emerald-500 to-teal-600",
        glow: "shadow-emerald-500/20",
      };
    case "REJECTED":
      return {
        label: "Rejected",
        icon: XCircle,
        bgBadge: "bg-red-100",
        textBadge: "text-red-700",
        borderBadge: "border-red-200",
        gradient: "from-red-500 to-rose-500",
        avatarBg: "from-red-500 to-rose-600",
        glow: "shadow-red-500/20",
      };
    case "PENDING_VERIFICATION":
      return {
        label: "Pending",
        icon: Clock,
        bgBadge: "bg-amber-100",
        textBadge: "text-amber-700",
        borderBadge: "border-amber-200",
        gradient: "from-amber-500 to-orange-500",
        avatarBg: "from-amber-500 to-orange-600",
        glow: "shadow-amber-500/20",
      };
    default:
      return {
        label: "Incomplete",
        icon: AlertTriangle,
        bgBadge: "bg-slate-100",
        textBadge: "text-slate-600",
        borderBadge: "border-slate-200",
        gradient: "from-slate-400 to-slate-500",
        avatarBg: "from-slate-400 to-slate-600",
        glow: "shadow-slate-500/20",
      };
  }
};
export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const verifyOtpSchema = z.object({
  otp: z
    .string()
    .min(6, "OTP must be at least 6 characters")
    .max(6, "OTP must be 6 characters"),
});
/**
 * Format date to readable string (MMM DD, YYYY)
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Format date with time (MMM DD, YYYY at HH:MM AM/PM)
 * @param dateString - ISO date string
 * @returns Formatted date and time string
 */
export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

/**
 * Get initials from business name
 * @param businessName - The business name
 * @returns First 2 characters uppercase
 */
export const getBusinessInitials = (businessName: string): string => {
  return businessName.substring(0, 2).toUpperCase();
};

/**
 * Format location string from city, state, country
 * @param city - City name
 * @param state - State name
 * @param country - Country name
 * @returns Comma-separated location string
 */
export const formatLocation = (
  city?: string | null,
  state?: string | null,
  country?: string | null,
): string => {
  return [city, state, country].filter(Boolean).join(", ");
};

/**
 * Check if merchant can be edited (only verified merchants)
 * @param profileStatus - The merchant's profile status
 * @returns Boolean indicating if merchant is editable
 */
export const canEditMerchant = (profileStatus?: string | null): boolean => {
  return profileStatus === "VERIFIED";
};
// src/utils/passwordUtils.ts - PASSWORD VALIDATION UTILITIES! 🔐

/**
 * Password requirement interface for visual feedback
 */
export interface PasswordRequirement {
  label: string;
  test: (pwd: string) => boolean;
}

/**
 * Password strength requirements array
 * Used for displaying real-time validation feedback to users
 */
export const passwordRequirements: PasswordRequirement[] = [
  {
    label: "At least 8 characters long",
    test: (pwd: string) => pwd.length >= 8,
  },
  {
    label: "Contains at least one uppercase letter",
    test: (pwd: string) => /[A-Z]/.test(pwd),
  },
  {
    label: "Contains at least one lowercase letter",
    test: (pwd: string) => /[a-z]/.test(pwd),
  },
  {
    label: "Contains at least one number",
    test: (pwd: string) => /[0-9]/.test(pwd),
  },
];

/**
 * Zod schema for password change validation
 * Ensures password meets security requirements and matches confirmation
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

/**
 * Type inference from change password schema
 */
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

/**
 * Zod schema for reset password validation
 * Similar to change password but without current password requirement
 */
export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

/**
 * Type inference from reset password schema
 */
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

/**
 * Calculate password strength score (0-4)
 * @param password - The password to evaluate
 * @returns Number of requirements met (0-4)
 */
export const calculatePasswordStrength = (password: string): number => {
  return passwordRequirements.filter((req) => req.test(password)).length;
};

/**
 * Get password strength label based on score
 * @param strength - Password strength score (0-4)
 * @returns Human-readable strength label
 */
export const getPasswordStrengthLabel = (strength: number): string => {
  switch (strength) {
    case 0:
    case 1:
      return "Weak";
    case 2:
      return "Fair";
    case 3:
      return "Good";
    case 4:
      return "Strong";
    default:
      return "Weak";
  }
};

/**
 * Get password strength color classes for UI
 * @param strength - Password strength score (0-4)
 * @returns Tailwind color classes
 */
export const getPasswordStrengthColor = (
  strength: number,
): { bg: string; text: string } => {
  switch (strength) {
    case 0:
    case 1:
      return { bg: "bg-red-500", text: "text-red-600" };
    case 2:
      return { bg: "bg-orange-500", text: "text-orange-600" };
    case 3:
      return { bg: "bg-yellow-500", text: "text-yellow-600" };
    case 4:
      return { bg: "bg-green-500", text: "text-green-600" };
    default:
      return { bg: "bg-gray-300", text: "text-gray-600" };
  }
};

/**
 * Check if password meets all requirements
 * @param password - The password to validate
 * @returns Boolean indicating if all requirements are met
 */
export const isPasswordValid = (password: string): boolean => {
  return passwordRequirements.every((req) => req.test(password));
};
