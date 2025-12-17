import api from "@/shared/utils/api";
import { AxiosError } from "axios";

interface ApiErrorResponse {
  message?: string;
}

export const createSupportTicket = async (data: {
  title: string;
  query: string;
}) => {
  try {
    const response = await api.post("/merchants/support-ticket", data);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const message =
        (error.response?.data as ApiErrorResponse)?.message ??
        "Failed to create support ticket. Please try again.";

      throw new Error(message);
    }

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Failed to create support ticket. Please try again.");
  }
};
