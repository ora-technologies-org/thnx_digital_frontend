// src/features/admin/slices/MerchantCreateSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CreateMerchantForm {
  email: string;
  password: string;
  name: string;
  phone: string;
  businessName: string;
  businessRegistrationNumber: string;
  taxId: string;
  businessType: string;
  businessCategory: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  businessPhone: string;
  businessEmail: string;
  website: string;
  description: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  ifscCode: string;
  swiftCode: string;
  giftCardLimit?: number; // Added field for edit mode only
  registrationDocument?: File | string;
  taxDocument?: File | string;
  identityDocument?: File | string;
  additionalDocuments?: File[] | string[];
}

interface MerchantState {
  formData: CreateMerchantForm;
  errors: Partial<Record<keyof CreateMerchantForm, string>>;
}

const initialFormData: CreateMerchantForm = {
  email: "",
  password: "",
  name: "",
  phone: "",
  businessName: "",
  businessRegistrationNumber: "",
  taxId: "",
  businessType: "",
  businessCategory: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
  businessPhone: "",
  businessEmail: "",
  website: "",
  description: "",
  bankName: "",
  accountNumber: "",
  accountHolderName: "",
  ifscCode: "",
  swiftCode: "",
  giftCardLimit: undefined,
  registrationDocument: undefined,
  taxDocument: undefined,
  identityDocument: undefined,
  additionalDocuments: undefined,
};

const initialState: MerchantState = {
  formData: initialFormData,
  errors: {},
};

const merchantSlice = createSlice({
  name: "merchant",
  initialState,
  reducers: {
    setField: <K extends keyof CreateMerchantForm>(
      state: typeof initialState,
      action: PayloadAction<{ field: K; value: CreateMerchantForm[K] }>,
    ) => {
      state.formData[action.payload.field] = action.payload.value;

      if (state.errors[action.payload.field]) {
        delete state.errors[action.payload.field];
      }
    },
    updateFormData: (
      state,
      action: PayloadAction<Partial<CreateMerchantForm>>,
    ) => {
      state.formData = {
        ...state.formData,
        ...action.payload,
      };
    },
    setError: (
      state,
      action: PayloadAction<{
        field: keyof CreateMerchantForm;
        message: string;
      }>,
    ) => {
      state.errors[action.payload.field] = action.payload.message;
    },
    clearErrors: (state) => {
      state.errors = {};
    },
    resetForm: (state) => {
      state.formData = initialFormData;
      state.errors = {};
    },
  },
});

export const { setField, updateFormData, setError, clearErrors, resetForm } =
  merchantSlice.actions;
export default merchantSlice.reducer;
