// src/features/admin/store/profileSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  profileService,
  AdminProfile,
  UpdateProfileRequest,
} from "../services/profileService";

interface ProfileState {
  profile: AdminProfile | null;
  loading: boolean;
  error: string | null;
  updateSuccess: boolean;
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
  updateSuccess: false,
};

// Async thunks
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const profile = await profileService.getProfile();
      return profile;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch profile");
    }
  },
);

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (data: UpdateProfileRequest, { rejectWithValue }) => {
    try {
      const profile = await profileService.updateProfile(data);
      return profile;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to update profile");
    }
  },
);

const AdminprofileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearUpdateSuccess: (state) => {
      state.updateSuccess = false;
    },
    resetProfile: (state) => {
      state.profile = null;
      state.error = null;
      state.updateSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProfile.fulfilled,
        (state, action: PayloadAction<AdminProfile>) => {
          state.loading = false;
          state.profile = action.payload;
          state.error = null;
        },
      )
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(
        updateProfile.fulfilled,
        (state, action: PayloadAction<AdminProfile>) => {
          state.loading = false;
          state.profile = action.payload;
          state.error = null;
          state.updateSuccess = true;
        },
      )
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.updateSuccess = false;
      });
  },
});

export const { clearError, clearUpdateSuccess, resetProfile } =
  AdminprofileSlice.actions;
export default AdminprofileSlice.reducer;
