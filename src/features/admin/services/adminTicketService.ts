import api from "@/shared/utils/api";
import type { AxiosError } from "axios";
export interface SupportTicket {
  id: string;
  title: string;
  query: string;
  status: "IN_PROGRESS" | "CLOSE";
  response?: string;
  createdAt: string;
  updatedAt: string;
  merchantName?: string;
  merchantEmail?: string;
}
interface ApiErrorResponse {
  message?: string;
}
export interface FetchTicketsParams {
  search?: string;
  order?: "asc" | "desc";
}

export interface UpdateTicketData {
  status: "OPEN" | "IN_PROGRESS" | "CLOSE";
  response: string;
}

export const fetchSupportTickets = async (params?: FetchTicketsParams) => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append("search", params.search);
    if (params?.order) queryParams.append("order", params.order);

    const url = `/merchants/support-ticket${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const response = await api.get(url);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<ApiErrorResponse>;
    throw new Error(
      err.response?.data?.message || "Failed to fetch support tickets",
    );
  }
};

export const fetchSupportTicketById = async (merchantid: string) => {
  try {
    const response = await api.get(`/merchants/support-ticket/${merchantid}`);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<ApiErrorResponse>;
    throw new Error(
      err.response?.data?.message || "Failed to fetch ticket details",
    );
  }
};

export const updateSupportTicket = async (
  merchantid: string,
  data: UpdateTicketData,
) => {
  try {
    const response = await api.put(
      `/merchants/support-ticket/${merchantid}`,
      data,
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError<ApiErrorResponse>;
    throw new Error(err.response?.data?.message || "Failed to update ticket");
  }
};
