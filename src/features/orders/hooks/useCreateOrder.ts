import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersApi } from "../api/orders.api";
import type { CreateOrderData } from "../types/order.types";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderData) => ordersApi.createOrder(data),
    onSuccess: () => {
      // Refresh orders list
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
