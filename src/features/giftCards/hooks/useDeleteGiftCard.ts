import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { giftCardService } from "../services/giftCardService";

export const useDeleteGiftCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => giftCardService.deleteGiftCard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["giftCards"] });
      toast.success("Gift card deleted successfully!");
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
          : "Failed to delete gift card";
      toast.error(message);
    },
  });
};
