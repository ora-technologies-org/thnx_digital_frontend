import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import {
  redemptionService,
  FetchRedemptionsParams,
  RedemptionsResponse,
} from "../Services/redemptionService";

export const useRedemptions = (initialParams: FetchRedemptionsParams = {}) => {
  const [params, setParams] = useState<FetchRedemptionsParams>({
    page: 1,
    limit: 10,
    sortBy: "redeemedAt",
    sortOrder: "desc",
    ...initialParams,
  });

  const queryKey = ["redemptions", params];

  const {
    data: redemptionsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<RedemptionsResponse, Error>({
    queryKey,
    queryFn: () => redemptionService.fetchRedemptions(params),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const updateParams = useCallback(
    (newParams: Partial<FetchRedemptionsParams>) => {
      setParams((prev) => ({
        ...prev,
        ...newParams,
        page: newParams.page !== undefined ? newParams.page : 1,
      }));
    },
    [],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      updateParams({ page });
    },
    [updateParams],
  );

  const handleSearch = useCallback(
    (search: string) => {
      updateParams({ search, page: 1 });
    },
    [updateParams],
  );

  const handleSort = useCallback(
    (sortBy: string, sortOrder: "asc" | "desc") => {
      updateParams({ sortBy, sortOrder });
    },
    [updateParams],
  );

  return {
    data: redemptionsData,
    isLoading,
    isError,
    error,
    params,
    updateParams,
    handlePageChange,
    handleSearch,
    handleSort,
    refetch,
  };
};

export const useExportRedemptions = () => {
  return useMutation({
    mutationFn: redemptionService.exportRedemptions,
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `redemptions-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
  });
};
