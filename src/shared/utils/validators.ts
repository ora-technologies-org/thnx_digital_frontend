import { z } from "zod";

/**
 * Step 1 validation schema
 */
export const step1Schema = z.object({
  businessName: z.string().min(1, "Business name is required").max(255),
  businessRegistrationNumber: z
    .string()
    .min(1, "Registration number is required")
    .max(100),
  taxId: z.string().max(100).optional(),
  businessType: z.string().max(100).optional(),
  businessCategory: z.string().max(100).optional(),
  address: z.string().min(1, "Address is required").max(500),
  city: z.string().min(1, "City is required").max(100),
  state: z.string().max(100).optional(),
  zipCode: z.string().max(20).optional(),
  country: z.string().min(1, "Country is required").max(100),
  businessPhone: z
    .string()
    .regex(
      /^\+?[1-9]\d{1,14}$/,
      "Invalid phone number format. Use international format (e.g., +919876543210 or 9876543210)",
    )
    .optional(),
  businessEmail: z
    .string()
    .min(1, "Business email is required")
    .email(
      "Invalid email format. Use standard email format (e.g., contact@business.com)",
    )
    .max(255),
  website: z
    .string()
    .refine((val) => !val || /^https?:\/\/.+/.test(val), {
      message:
        "Invalid website URL. Must include protocol (e.g., https://www.example.com)",
    })
    .max(255)
    .optional()
    .or(z.literal("")),
});

/**
 * Step 2 validation schema
 */
export const step2Schema = z.object({
  bankName: z.string().min(1, "Bank name is required").max(255).optional(),
  accountNumber: z
    .string()
    .min(1, "Account number is required")
    .max(50)
    .optional(),
  accountHolderName: z
    .string()
    .min(1, "Account holder name is required")
    .max(255)
    .optional(),
  ifscCode: z
    .string()
    .refine((val) => !val || /^[A-Z]{4}0[A-Z0-9]{6}$/.test(val), {
      message:
        "Invalid IFSC code format. Must be 11 characters: 4 uppercase letters + 0 + 6 alphanumeric characters (e.g., SBIN0001234)",
    })
    .optional()
    .or(z.literal("")),
  swiftCode: z
    .string()
    .refine((val) => !val || /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(val), {
      message:
        "Invalid SWIFT code format. Must be 8 or 11 uppercase characters (e.g., SBININBB or SBININBB123)",
    })
    .optional()
    .or(z.literal("")),
});

/**
 * Step 3 validation schema
 */
export const step3Schema = z.object({
  description: z
    .string()
    .max(2000, "Description too long. Maximum 2000 characters allowed")
    .optional(),
});

/**
 * Combined profile schema
 */
export const profileSchema = step1Schema.merge(step2Schema).merge(step3Schema);

export type ProfileFormData = z.infer<typeof profileSchema>;

/**
 * Validate bank information
 */
export const validateBankInfo = (data: {
  bankName?: string;
  accountNumber?: string;
  accountHolderName?: string;
  ifscCode?: string;
  swiftCode?: string;
}): { valid: boolean; error?: string } => {
  const hasBankInfo =
    data.bankName || data.accountNumber || data.accountHolderName;
  const hasBankCode = data.ifscCode || data.swiftCode;

  if (hasBankInfo && !hasBankCode) {
    return {
      valid: false,
      error:
        "Please provide either IFSC Code (for India) or SWIFT Code (for international)",
    };
  }

  return { valid: true };
};
