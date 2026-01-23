import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GiftCard, GiftCardState } from "../types/giftCard.types";

const initialState: GiftCardState = {
  giftCards: [],
  selectedGiftCard: null,
  isLoading: false,
  error: null,
  filters: {
    search: "",
    status: "all",
  },
};

const giftCardSlice = createSlice({
  name: "giftCards",
  initialState,
  reducers: {
    setGiftCards: (state, action: PayloadAction<GiftCard[]>) => {
      state.giftCards = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setSelectedGiftCard: (state, action: PayloadAction<GiftCard | null>) => {
      state.selectedGiftCard = action.payload;
    },
    addGiftCard: (state, action: PayloadAction<GiftCard>) => {
      state.giftCards.unshift(action.payload);
    },
    updateGiftCard: (state, action: PayloadAction<GiftCard>) => {
      const index = state.giftCards.findIndex(
        (card) => card.id === action.payload.id,
      );
      if (index !== -1) {
        state.giftCards[index] = action.payload;
      }
      if (state.selectedGiftCard?.id === action.payload.id) {
        state.selectedGiftCard = action.payload;
      }
    },
    removeGiftCard: (state, action: PayloadAction<string>) => {
      state.giftCards = state.giftCards.filter(
        (card) => card.id !== action.payload,
      );
      if (state.selectedGiftCard?.id === action.payload) {
        state.selectedGiftCard = null;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
    },
    setStatusFilter: (
      state,
      action: PayloadAction<"all" | "active" | "inactive" | "expired">,
    ) => {
      state.filters.status = action.payload;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setGiftCards,
  setSelectedGiftCard,
  addGiftCard,
  updateGiftCard,
  removeGiftCard,
  setLoading,
  setError,
  setSearchFilter,
  setStatusFilter,
  clearFilters,
  clearError,
} = giftCardSlice.actions;

export default giftCardSlice.reducer;

// Selectors
export const selectAllGiftCards = (state: { giftCards: GiftCardState }) =>
  state.giftCards.giftCards;

export const selectSelectedGiftCard = (state: { giftCards: GiftCardState }) =>
  state.giftCards.selectedGiftCard;

export const selectGiftCardFilters = (state: { giftCards: GiftCardState }) =>
  state.giftCards.filters;

export const selectFilteredGiftCards = (state: {
  giftCards: GiftCardState;
}) => {
  const { giftCards, filters } = state.giftCards;
  let filtered = [...giftCards];

  // Apply search filter
  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(
      (card) =>
        card.title.toLowerCase().includes(search) ||
        card.description?.toLowerCase().includes(search),
    );
  }

  // Apply status filter
  if (filters.status !== "all") {
    const now = new Date();
    filtered = filtered.filter((card) => {
      const isExpired = new Date(card.expiryDate) < now;

      switch (filters.status) {
        case "active":
          return card.isActive && !isExpired;
        case "inactive":
          return !card.isActive;
        case "expired":
          return isExpired;
        default:
          return true;
      }
    });
  }

  return filtered;
};
