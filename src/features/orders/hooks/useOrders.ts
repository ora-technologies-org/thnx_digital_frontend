import { useQuery } from "@tanstack/react-query";
import { ordersApi, OrdersQueryParams } from "../api/orders.api";
import type { OrdersResponse } from "../types/order.types";

export const useOrders = (params?: OrdersQueryParams) => {
  return useQuery<OrdersResponse>({
    queryKey: ["orders", params], // Include params in the key so it refetches when they change
    queryFn: () => ordersApi.getOrders(params),
    staleTime: 0, // Always consider data stale
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes (replaces cacheTime)
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData, // Replaces keepPreviousData
  });
};
