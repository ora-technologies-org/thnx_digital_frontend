import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { purchaseService } from "../services/purchaseService";
import type { RedeemData } from "../types/purchase.types";
import { useInvalidateQueries } from "@/shared/hooks/useInvalidateQueries";
import type { AxiosError } from "axios";

interface ErrorResponse {
  message: string;
}

export const useRedeemGiftCard = () => {
  const { queryClient } = useInvalidateQueries();

  return useMutation({
    mutationFn: (data: RedeemData) => purchaseService.redeemGiftCard(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["redemptions"] });

      // Handle potential undefined data
      if (data.data) {
        toast.success(
          `Redeemed ₹${data.data.redemption.amount}. Remaining: ₹${data.data.remainingBalance}`,
        );
      } else {
        toast.success("Gift card redeemed successfully");
      }
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const message =
        error.response?.data?.message || "Failed to redeem gift card";
      toast.error(message);
    },
  });
};
