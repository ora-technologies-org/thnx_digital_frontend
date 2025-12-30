import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

import { giftCardService } from "../services/giftCardService";
import { UpdateGiftCardData } from "../types/giftCard.types";

export const useUpdateGiftCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGiftCardData }) =>
      giftCardService.updateGiftCard(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["giftCards"] });
      toast.success("Gift card updated successfully!");
    },

    onError: (error: AxiosError<{ message?: string }>) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update gift card";

      toast.error(message);
    },
  });
};
