// src/features/purchase/hooks/useRedemptionHistory.ts
import { useState, useCallback } from "react";
import {
  RedemptionHistoryItem,
  RedemptionHistoryResponse,
  RedemptionHistoryParams,
  fetchRedemptionHistory,
} from "../Services/QRCodeRedemptionHistoryService";

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

        if (result.success) {
          setHistory(result.data);
          if (result.pagination) {
            setPagination(result.pagination);
          }
        } else {
          setError(result.message);
        }

        return result;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to fetch redemption history";
        setError(message);
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
