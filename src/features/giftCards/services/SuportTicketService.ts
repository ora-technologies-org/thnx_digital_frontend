// services/SupportTicketService.ts

import api from "@/shared/utils/api";
import { AxiosError } from "axios";

interface ApiErrorResponse {
  message?: string;
}

interface CreateTicketData {
  title: string;
  query: string;
}

export const createSupportTicket = async (data: CreateTicketData) => {
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
