import api from "@/shared/utils/api";
import {
  FetchRedemptionsParams,
  RedemptionsResponse,
} from "../types/redeem.types";

export const redemptionService = {
  // Fetch paginated list of redemptions with optional filtering
  async fetchRedemptions(
    params: FetchRedemptionsParams = {},
  ): Promise<RedemptionsResponse> {
    const response = await api.get("/purchases/redemptions", { params });
    return response.data.data;
  },

  // Export redemptions data as CSV/Excel file
  async exportRedemptions(params: FetchRedemptionsParams = {}): Promise<Blob> {
    const response = await api.get("/purchases/redemptions/export", {
      params,
      responseType: "blob",
    });
    return response.data;
  },
};
