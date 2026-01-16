// src/features/admin/slices/MerchantCreateSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * Form data structure for creating a new merchant
 * Contains personal info, business details, banking info, and document uploads
 */
export interface CreateMerchantForm {
  // Personal Information
  email: string;
  password: string;
  name: string;
  phone: string;

  // Business Information
  businessName: string;
  businessRegistrationNumber: string;
  taxId: string;
  businessType: string;
  merchant: string;
  businessCategory: string;

  // Business Address
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;

  // Business Contact
  businessPhone: string;
  businessEmail: string;
  website: string;
  description: string;

  // Banking Information
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  ifscCode: string;
  swiftCode: string;

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
interface MerchantState {
  formData: CreateMerchantForm;
  errors: Partial<Record<keyof CreateMerchantForm, string>>;
}

/**
 * Initial form data with all fields set to empty values
 */
const initialFormData: CreateMerchantForm = {
  // Personal Information
  email: "",
  password: "",
  name: "",
  phone: "",

  // Business Information
  businessName: "",
  businessRegistrationNumber: "",
  taxId: "",
  businessType: "",
  merchant: "", // ✅ FIXED: Added missing field
  businessCategory: "",

  // Business Address
  address: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",

  // Business Contact
  businessPhone: "",
  businessEmail: "",
  website: "",
  description: "",

  // Banking Information
  bankName: "",
  accountNumber: "",
  accountHolderName: "",
  ifscCode: "",
  swiftCode: "",

  // Optional Fields
  giftCardLimit: undefined,
  registrationDocument: undefined,
  taxDocument: undefined,
  identityDocument: undefined,
  additionalDocuments: undefined,
};

/**
 * Initial Redux state for merchant form
 */
const initialState: MerchantState = {
  formData: initialFormData,
  errors: {},
};

/**
 * Redux slice for managing merchant creation form state
 */
const merchantSlice = createSlice({
  name: "merchant",
  initialState,
  reducers: {
    /**
     * Updates a single form field and clears its error
     * @param field - The field name to update
     * @param value - The new value for the field
     */
    setField: <K extends keyof CreateMerchantForm>(
      state: typeof initialState,
      action: PayloadAction<{ field: K; value: CreateMerchantForm[K] }>,
    ) => {
      state.formData[action.payload.field] = action.payload.value;

      // Clear error for this field when user starts typing
      if (state.errors[action.payload.field]) {
        delete state.errors[action.payload.field];
      }
    },

    /**
     * Clears the error for a specific field
     */
    clearSingleError: (
      state,
      action: PayloadAction<{ field: keyof CreateMerchantForm }>,
    ) => {
      delete state.errors[action.payload.field];
    },

    /**
     * Updates multiple form fields at once
     * @param payload - Partial form data to merge with existing data
     */
    updateFormData: (
      state,
      action: PayloadAction<Partial<CreateMerchantForm>>,
    ) => {
      state.formData = {
        ...state.formData,
        ...action.payload,
      };
    },

    /**
     * Sets an error message for a single field
     * @param field - The field name
     * @param message - The error message
     */
    setError: (
      state,
      action: PayloadAction<{
        field: keyof CreateMerchantForm;
        message: string;
      }>,
    ) => {
      state.errors[action.payload.field] = action.payload.message;
    },

    /**
     * Sets multiple error messages at once
     * Useful for displaying validation errors from API responses
     */
    setErrors: (
      state,
      action: PayloadAction<Partial<Record<keyof CreateMerchantForm, string>>>,
    ) => {
      state.errors = {
        ...state.errors,
        ...action.payload,
      };
    },

    /**
     * Clears the error for a specific field
     */
    clearError: (state, action: PayloadAction<keyof CreateMerchantForm>) => {
      delete state.errors[action.payload];
    },

    /**
     * Clears all error messages
     */
    clearErrors: (state) => {
      state.errors = {};
    },

    /**
     * Resets the entire form to initial state
     * Clears both form data and errors
     */
    resetForm: (state) => {
      state.formData = initialFormData;
      state.errors = {};
    },
  },
});

// Export actions for use in components
export const {
  setField,
  updateFormData,
  setError,
  setErrors,
  clearError,
  clearErrors,
  resetForm,
} = merchantSlice.actions;

// Export reducer for store configuration
export default merchantSlice.reducer;
