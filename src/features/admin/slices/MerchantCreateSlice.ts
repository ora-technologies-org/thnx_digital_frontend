// store/merchantSlice.ts
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
}

interface MerchantState {
  formData: CreateMerchantForm;
  isSubmitting: boolean;
  errors: Record<string, string>;
}

const initialState: MerchantState = {
  formData: {
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
  },
  isSubmitting: false,
  errors: {},
};

const merchantSlice = createSlice({
  name: "merchant",
  initialState,
  reducers: {
    updateFormData: (
      state,
      action: PayloadAction<Partial<CreateMerchantForm>>,
    ) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    setField: (
      state,
      action: PayloadAction<{ field: keyof CreateMerchantForm; value: string }>,
    ) => {
      state.formData[action.payload.field] = action.payload.value;
    },
    setErrors: (state, action: PayloadAction<Record<string, string>>) => {
      state.errors = action.payload;
    },
    clearErrors: (state) => {
      state.errors = {};
    },
    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload;
    },
    resetForm: (state) => {
      state.formData = initialState.formData;
      state.errors = {};
      state.isSubmitting = false;
    },
  },
});

export const {
  updateFormData,
  setField,
  setErrors,
  clearErrors,
  setSubmitting,
  resetForm,
} = merchantSlice.actions;
export default merchantSlice.reducer;
