// src/features/auth/slices/profileSlice.ts
import { ProfileFormData } from "@/shared/types/Form.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ProfileFormData = {
  businessName: "",
  businessLogo: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  country: "India",
  businessPhone: "",
  businessEmail: "",
  website: "",
  profile: null,
  loading: false,
  error: "",
  updateSuccess: false,
  bankName: "",
  accountNumber: "",
  accountHolderName: "",
  ifscCode: "",
  swiftCode: "",
  businessRegistrationNumber: "",
  taxId: "",
  businessType: "",
  businessCategory: "",
  description: "",
  documents: {},
  status: "incomplete",
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    // Update entire profile (useful when fetching from API)
    setProfile: (state, action: PayloadAction<Partial<ProfileFormData>>) => {
      return { ...state, ...action.payload };
    },

    // Update business details (including logo)
    updateBusinessDetails: (
      state,
      action: PayloadAction<
        Partial<
          Pick<
            ProfileFormData,
            | "businessName"
            | "businessLogo"
            | "address"
            | "city"
            | "state"
            | "zipCode"
            | "country"
            | "businessPhone"
            | "businessEmail"
            | "website"
          >
        >
      >,
    ) => {
      Object.assign(state, action.payload);
      state.lastUpdated = new Date().toISOString();
    },

    // Update business logo specifically
    updateBusinessLogo: (state, action: PayloadAction<string>) => {
      state.businessLogo = action.payload;
      state.lastUpdated = new Date().toISOString();
    },

    // Update bank information
    updateBankInfo: (
      state,
      action: PayloadAction<
        Partial<
          Pick<
            ProfileFormData,
            | "bankName"
            | "accountNumber"
            | "accountHolderName"
            | "ifscCode"
            | "swiftCode"
          >
        >
      >,
    ) => {
      Object.assign(state, action.payload);
      state.lastUpdated = new Date().toISOString();
    },

    // Update additional business info
    updateAdditionalInfo: (
      state,
      action: PayloadAction<
        Partial<
          Pick<
            ProfileFormData,
            | "businessRegistrationNumber"
            | "taxId"
            | "businessType"
            | "businessCategory"
            | "description"
          >
        >
      >,
    ) => {
      Object.assign(state, action.payload);
      state.lastUpdated = new Date().toISOString();
    },

    // Update document status
    updateDocument: (
      state,
      action: PayloadAction<{
        type: keyof ProfileFormData["documents"];
        data: { name: string; url: string; uploadedAt: string };
      }>,
    ) => {
      state.documents[action.payload.type] = action.payload.data;
      state.lastUpdated = new Date().toISOString();
    },

    removeDocument: (
      state,
      action: PayloadAction<keyof ProfileFormData["documents"]>,
    ) => {
      delete state.documents[action.payload];
      state.lastUpdated = new Date().toISOString();
    },

    updateStatus: (
      state,
      action: PayloadAction<{
        status: ProfileFormData["status"];
        rejectionReason?: string;
      }>,
    ) => {
      state.status = action.payload.status;
      if (action.payload.rejectionReason) {
        state.rejectionReason = action.payload.rejectionReason;
      }
      if (action.payload.status === "pending") {
        state.submittedAt = new Date().toISOString();
      }
      state.lastUpdated = new Date().toISOString();
    },

    // Reset profile to initial state
    resetProfile: () => initialState,

    // Bulk update for form submission
    updateFullProfile: (
      state,
      action: PayloadAction<Partial<ProfileFormData>>,
    ) => {
      Object.assign(state, action.payload);
      state.lastUpdated = new Date().toISOString();
    },

    // Update individual field
    updateField: <K extends keyof ProfileFormData>(
      state: ProfileFormData,
      action: PayloadAction<{ field: K; value: ProfileFormData[K] }>,
    ) => {
      state[action.payload.field] = action.payload.value;
      state.lastUpdated = new Date().toISOString();
    },
  },
});

export const {
  setProfile,
  updateBusinessDetails,
  updateBusinessLogo,
  updateBankInfo,
  updateAdditionalInfo,
  updateDocument,
  removeDocument,
  updateStatus,
  resetProfile,
  updateFullProfile,
  updateField,
} = profileSlice.actions;

export default profileSlice.reducer;
