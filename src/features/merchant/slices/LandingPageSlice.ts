// src/store/slices/landingPageSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  LandingPageData,
  landingPageService,
  UpdateLandingPageRequest,
} from "../services/LandingService";

interface LandingPageState {
  data: LandingPageData | null;
  loading: boolean;
  error: string | null;
  updateLoading: boolean;
  updateError: string | null;
}

const initialState: LandingPageState = {
  data: null,
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null,
};

// Async thunks
/**
 * Fetches the complete landing page data from the server
 * @returns Promise with LandingPageData or rejection with error message
 */
export const fetchLandingPageData = createAsyncThunk(
  "landingPage/fetchData",
  async (_, { rejectWithValue }) => {
    try {
      const data = await landingPageService.getLandingPageData();
      return data;
    } catch (error) {
      // Type guard to safely access error properties
      if (error instanceof Error) {
        return rejectWithValue(
          error.message || "Failed to fetch landing page data",
        );
      }
      // Handle axios or custom error responses
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      return rejectWithValue(
        axiosError?.response?.data?.message ||
          "Failed to fetch landing page data",
      );
    }
  },
);

/**
 * Updates a specific section of the landing page
 * @param payload - Contains section name, data to update, and optional index for array items
 * @returns Promise with updated LandingPageData or rejection with error message
 */
export const updateLandingPageSection = createAsyncThunk(
  "landingPage/updateSection",
  async (payload: UpdateLandingPageRequest, { rejectWithValue }) => {
    try {
      const data = await landingPageService.updateLandingPageSection(payload);
      return data;
    } catch (error) {
      // Type guard to safely access error properties
      if (error instanceof Error) {
        return rejectWithValue(
          error.message || "Failed to update landing page section",
        );
      }
      // Handle axios or custom error responses
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      return rejectWithValue(
        axiosError?.response?.data?.message ||
          "Failed to update landing page section",
      );
    }
  },
);

// Slice
const landingPageSlice = createSlice({
  name: "landingPage",
  initialState,
  reducers: {
    /**
     * Clears all error states in the landing page slice
     */
    clearError: (state) => {
      state.error = null;
      state.updateError = null;
    },
    /**
     * Performs an optimistic UI update before server confirmation
     * This provides immediate feedback to users while the API request is in flight
     * If the request fails, the state will be reverted in the rejected case
     */
    optimisticUpdate: (
      state,
      action: PayloadAction<UpdateLandingPageRequest>,
    ) => {
      if (!state.data) return;

      const { section, data, index } = action.payload;

      // Create a new data object to maintain immutability
      const newData = { ...state.data };

      // Type-safe access to section data
      const sectionData = newData[section];

      if (index !== undefined && Array.isArray(sectionData)) {
        // Handle array sections with index: update specific item in array
        const sectionArray = [...sectionData];
        sectionArray[index] = data;
        newData[section] = sectionArray as typeof sectionData;
      } else if (Array.isArray(sectionData)) {
        // Handle array sections without index: replace entire array
        newData[section] = data as typeof sectionData;
      } else {
        // Handle object sections: update the entire section
        newData[section] = data as typeof sectionData;
      }

      state.data = newData;
    },
  },
  extraReducers: (builder) => {
    // Fetch landing page data reducers
    builder
      .addCase(fetchLandingPageData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLandingPageData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchLandingPageData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update landing page section reducers
    builder
      .addCase(updateLandingPageSection.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateLandingPageSection.fulfilled, (state, action) => {
        state.updateLoading = false;
        // Replace local state with authoritative server response
        console.log("✅ Redux: Update successful, new data:", action.payload);
        state.data = action.payload;
      })
      .addCase(updateLandingPageSection.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload as string;
        console.error("❌ Redux: Update failed:", action.payload);
        // Note: If using optimistic updates, you may want to revert to previous state here
      });
  },
});

export const { clearError, optimisticUpdate } = landingPageSlice.actions;
export default landingPageSlice.reducer;
