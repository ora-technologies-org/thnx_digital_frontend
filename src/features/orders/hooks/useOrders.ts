// src/features/orders/hooks/useOrders.ts - ORDERS DATA HOOK 🎣

import { useQuery } from "@tanstack/react-query";
import { ordersApi } from "../api/orders.api";
import type { OrdersResponse } from "../types/order.types";

export const useOrders = () => {
  return useQuery<OrdersResponse>({
    queryKey: ["orders"],
    queryFn: ordersApi.getOrders,
  });
};
