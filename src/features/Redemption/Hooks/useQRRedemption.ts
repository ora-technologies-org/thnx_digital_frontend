// src/features/purchase/hooks/useRedemptionHistory.ts
import { useState, useCallback } from "react";
import { fetchRedemptionHistory } from "../Services/QRCodeRedemptionHistoryService";
import {
  RedemptionHistoryItem,
  RedemptionHistoryParams,
  RedemptionHistoryResponse,
  PurchaseWithRedemptions,
} from "../types/redeem.types";

export const useRedemptionHistory = () => {
  const [history, setHistory] = useState<RedemptionHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null>(null);

  const getRedemptionHistory = useCallback(
    async (
      params: RedemptionHistoryParams,
    ): Promise<RedemptionHistoryResponse> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchRedemptionHistory(params);

        console.log("🔍 Hook received result:", result);

        if (result.success) {
          let redemptions: RedemptionHistoryItem[] = [];

          // ✅ Check if data has the nested purchase structure
          if (
            result.data &&
            typeof result.data === "object" &&
            "purchase" in result.data
          ) {
            const purchaseData = result.data as PurchaseWithRedemptions;
            redemptions = purchaseData.purchase.recentRedemptions || [];

            // Create pagination info from purchase data
            setPagination({
              total:
                purchaseData.purchase.redemptionCount || redemptions.length,
              page: params.page || 1,
              limit: params.limit || 10,
              totalPages: Math.ceil(
                (purchaseData.purchase.redemptionCount || redemptions.length) /
                  (params.limit || 10),
              ),
            });
          }
          // ✅ Handle direct array response
          else if (Array.isArray(result.data)) {
            redemptions = result.data as RedemptionHistoryItem[];

            if (result.pagination) {
              setPagination(result.pagination);
            }
          }

          console.log("✅ Extracted redemptions:", redemptions);
          setHistory(redemptions);
        } else {
          setError(result.message);
          setHistory([]);
        }

        return result;
      } catch (err) {
        console.error("❌ Hook error:", err);
        const message =
          err instanceof Error
            ? err.message
            : "Failed to fetch redemption history";
        setError(message);
        setHistory([]);
        return { success: false, message, data: [] };
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const getRedemptionHistoryByQRCode = useCallback(
    async (
      qrCode: string,
      page: number = 1,
      limit: number = 10,
    ): Promise<RedemptionHistoryResponse> => {
      return getRedemptionHistory({ qrCode, page, limit });
    },
    [getRedemptionHistory],
  );

  const getRecentRedemptions = useCallback(
    async (
      qrCode: string,
      limit: number = 5,
    ): Promise<RedemptionHistoryResponse> => {
      return getRedemptionHistory({ qrCode, page: 1, limit });
    },
    [getRedemptionHistory],
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
    setError(null);
    setPagination(null);
  }, []);

  return {
    history,
    isLoading,
    error,
    pagination,
    getRedemptionHistory,
    getRedemptionHistoryByQRCode,
    getRecentRedemptions,
    clearHistory,
  };
};
