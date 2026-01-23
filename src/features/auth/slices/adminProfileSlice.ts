// src/features/admin/store/profileSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getProfile,
  updateProfile as updateProfileService,
  AdminProfile,
  UpdateProfileRequest,
} from "../services/profileService";

/**
 * Redux state structure for admin profile management
 */
interface ProfileState {
  /** Current admin profile data, null if not loaded */
  profile: AdminProfile | null;
  /** Loading state for async operations */
  loading: boolean;
  /** Error message from failed operations, null if no error */
  error: string | null;
  /** Flag indicating if the last update operation was successful */
  updateSuccess: boolean;
}

/**
 * Initial state for the profile slice
 */
const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
  updateSuccess: false,
};

// ==================== Async Thunks ====================

/**
 * Fetches the current admin user's profile from the backend
 *
 * @returns Admin profile data on success
 * @throws Rejected with error message on failure
 *
 * @example
 * ```typescript
 * dispatch(fetchProfile())
 *   .unwrap()
 *   .then(profile => console.log('Profile loaded:', profile))
 *   .catch(error => console.error('Failed:', error));
 * ```
 */
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      // Call the profile service to fetch data
      const profile = await getProfile();
      return profile;
    } catch (error) {
      // Extract error message for Redux state
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch profile");
    }
  },
);

/**
 * Updates the current admin user's profile
 *
 * @param data - Partial profile data to update
 * @returns Updated admin profile data on success
 * @throws Rejected with error message on failure
 *
 * @example
 * ```typescript
 * dispatch(updateProfile({ name: "John Doe", phone: "+1234567890" }))
 *   .unwrap()
 *   .then(profile => console.log('Profile updated:', profile))
 *   .catch(error => console.error('Update failed:', error));
 * ```
 */
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (data: UpdateProfileRequest, { rejectWithValue }) => {
    try {
      // Call the profile service to update data
      // Renamed import to avoid name collision with this thunk
      const profile = await updateProfileService(data);
      return profile;
    } catch (error) {
      // Extract error message for Redux state
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to update profile");
    }
  },
);

// ==================== Slice Definition ====================

/**
 * Redux slice for managing admin profile state
 * Handles profile fetching, updating, and error management
 */
const AdminprofileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    /**
     * Clears any error message from state
     * Useful for dismissing error notifications
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Resets the update success flag
     * Should be called after showing success notification
     */
    clearUpdateSuccess: (state) => {
      state.updateSuccess = false;
    },

    /**
     * Resets the entire profile state to initial values
     * Used during logout or when clearing user data
     */
    resetProfile: (state) => {
      state.profile = null;
      state.error = null;
      state.updateSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // ==================== Fetch Profile Cases ====================

      /**
       * Handles the pending state when fetching profile
       * Sets loading to true and clears any previous errors
       */
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      /**
       * Handles successful profile fetch
       * Updates state with fetched profile data
       */
      .addCase(
        fetchProfile.fulfilled,
        (state, action: PayloadAction<AdminProfile>) => {
          state.loading = false;
          state.profile = action.payload;
          state.error = null;
        },
      )

      /**
       * Handles failed profile fetch
       * Sets error message and stops loading
       */
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ==================== Update Profile Cases ====================

      /**
       * Handles the pending state when updating profile
       * Sets loading to true, clears errors, and resets success flag
       */
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = false;
      })

      /**
       * Handles successful profile update
       * Updates state with new profile data and sets success flag
       */
      .addCase(
        updateProfile.fulfilled,
        (state, action: PayloadAction<AdminProfile>) => {
          state.loading = false;
          state.profile = action.payload;
          state.error = null;
          state.updateSuccess = true;
        },
      )

      /**
       * Handles failed profile update
       * Sets error message, stops loading, and clears success flag
       */
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.updateSuccess = false;
      });
  },
});

// Export actions for use in components
export const { clearError, clearUpdateSuccess, resetProfile } =
  AdminprofileSlice.actions;

// Export reducer for store configuration
export default AdminprofileSlice.reducer;
