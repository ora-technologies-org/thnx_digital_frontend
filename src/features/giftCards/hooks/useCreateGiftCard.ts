import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { giftCardService } from "../services/giftCardService";
import { CreateGiftCardData } from "../types/giftCard.types";

export const useCreateGiftCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGiftCardData) =>
      giftCardService.createGiftCard(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["giftCards"] });
      toast.success("Gift card created successfully!");
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error &&
        "response" in error &&
        typeof error.response === "object" &&
        error.response !== null &&
        "data" in error.response &&
        typeof error.response.data === "object" &&
        error.response.data !== null &&
        "message" in error.response.data &&
        typeof error.response.data.message === "string"
          ? error.response.data.message
          : "Failed to create gift card";
      toast.error(message);
    },
  });
};
