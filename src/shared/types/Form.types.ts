// src/shared/types/shared.types.ts

/**
 * Common business information fields shared across merchant and profile forms
 */
export interface BusinessInformation {
  businessName: string;
  businessRegistrationNumber: string;
  taxId: string;
  businessType: string;
  businessCategory: string;
}

/**
 * Common business address fields
 */
export interface BusinessAddress {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

/**
 * Common business contact fields
 */
export interface BusinessContact {
  businessPhone: string;
  businessEmail: string;
  website: string;
  description: string;
}

/**
 * Common banking information fields
 */
export interface BankingInformation {
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  ifscCode: string;
  swiftCode: string;
}

/**
 * Document information structure
 * This represents a fully uploaded and processed document
 */
export interface DocumentInfo {
  name: string;
  url: string;
  uploadedAt: string;
  size?: number;
  type?: string;
}

/**
 * Documents collection for profile
 * Documents can be either:
 * - string (URL to existing document from API)
 * - DocumentInfo (full document metadata)
 * - undefined (not uploaded)
 */
export interface ProfileDocuments {
  identityDocument?: string | DocumentInfo;
  registrationDocument?: string | DocumentInfo;
  taxDocument?: string | DocumentInfo;
  [key: string]: string | DocumentInfo | undefined;
}

/**
 * Profile/Merchant status types
 */
export type ProfileStatus =
  | "incomplete"
  | "pending"
  | "approved"
  | "rejected"
  | "PENDING_VERIFICATION";

/**
 * Complete business profile data (used by ProfileFormData)
 */
export interface BusinessProfile
  extends
    BusinessInformation,
    BusinessAddress,
    BusinessContact,
    BankingInformation {
  businessLogo: string;
  documents: ProfileDocuments;
  status: ProfileStatus;
  lastUpdated?: string;
  submittedAt?: string;
  rejectionReason?: string;
  id?: string;
  profileStatus?: ProfileStatus;
  profile: string | null;
  loading: boolean;
  error: string;
  updateSuccess: boolean;

  // Individual document URLs (for backward compatibility with API responses)
  identityDocument?: string;
  registrationDocument?: string;
  taxDocument?: string;
}

/**
 * Form data structure for creating a new merchant
 */
export interface CreateMerchantForm
  extends
    BusinessInformation,
    BusinessAddress,
    BusinessContact,
    BankingInformation {
  // Personal Information
  email: string;
  password: string;
  name: string;
  phone: string;

  // Optional Fields
  giftCardLimit?: number;

  // Document Uploads (can be File objects or URLs)
  registrationDocument?: File | string;
  taxDocument?: File | string;
  identityDocument?: File | string;
  additionalDocuments?: File[] | string[];
}

/**
 * Redux state structure for merchant creation form
 */
export interface MerchantState {
  formData: CreateMerchantForm;
  errors: Partial<Record<keyof CreateMerchantForm, string>>;
}

/**
 * Type alias for ProfileFormData (for backward compatibility)
 */
export type ProfileFormData = BusinessProfile;

/**
 * Utility type to convert ProfileDocuments to DocumentInfo only
 * Useful for strictly typed contexts
 */
export type StrictProfileDocuments = {
  [K in keyof ProfileDocuments]: ProfileDocuments[K] extends
    | string
    | DocumentInfo
    | undefined
    ? DocumentInfo | undefined
    : never;
};

/**
 * Helper function to normalize document to DocumentInfo
 */
export function normalizeDocument(
  doc: string | DocumentInfo | undefined,
): DocumentInfo | undefined {
  if (!doc) return undefined;

  if (typeof doc === "string") {
    // Convert string URL to DocumentInfo
    return {
      name: doc.split("/").pop() || "document",
      url: doc,
      uploadedAt: new Date().toISOString(),
    };
  }

  return doc;
}

/**
 * Helper function to normalize all documents in ProfileDocuments
 */
export function normalizeProfileDocuments(
  docs: ProfileDocuments,
): StrictProfileDocuments {
  return {
    identityDocument: normalizeDocument(docs.identityDocument),
    registrationDocument: normalizeDocument(docs.registrationDocument),
    taxDocument: normalizeDocument(docs.taxDocument),
  };
}
