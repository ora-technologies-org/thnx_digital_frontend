// src/features/auth/slices/profileSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ProfileFormData {
  // Business Details
  businessName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  businessPhone: string;
  businessEmail: string;
  website: string;

  // Bank Information
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  ifscCode: string;
  swiftCode: string;

  // Additional Business Info
  businessRegistrationNumber: string;
  taxId: string;
  businessType: string;
  businessCategory: string;
  description: string;

  // Document status (not the actual files)
  documents: {
    identityDocument?: {
      name: string;
      url: string;
      uploadedAt: string;
    };
    registrationDocument?: {
      name: string;
      url: string;
      uploadedAt: string;
    };
    taxDocument?: {
      name: string;
      url: string;
      uploadedAt: string;
    };
  };

  // Profile Status
  status: "incomplete" | "pending" | "approved" | "rejected";
  lastUpdated?: string;
  submittedAt?: string;
  rejectionReason?: string;

  // ID for edit mode
  id?: string;
  profileStatus?: "incomplete" | "pending" | "approved" | "rejected";
}

const initialState: ProfileFormData = {
  businessName: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  country: "India",
  businessPhone: "",
  businessEmail: "",
  website: "",
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

    // Update business details
    updateBusinessDetails: (
      state,
      action: PayloadAction<
        Partial<
          Pick<
            ProfileFormData,
            | "businessName"
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
