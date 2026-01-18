import api from "@/shared/utils/api";
import type { AxiosError } from "axios";

/**
 * Represents a support ticket entity
 */
export interface SupportTicket {
  id: string;
  title: string;
  query: string;
  status: "OPEN" | "IN_PROGRESS" | "CLOSE";
  response?: string;
  createdAt: string;
  updatedAt: string;
  merchantName?: string;
  merchantEmail?: string;
  businessName?: string;
  adminResponse?: string;
}

/**
 * Standard API error response structure
 */
interface ApiErrorResponse {
  message?: string;
}

/**
 * Query parameters for filtering and paginating support tickets
 */
export interface FetchTicketsParams {
  search?: string; // Search term for filtering tickets
  order?: "asc" | "desc"; // Sort order
  page?: number; // Page number for pagination
  limit?: number; // Number of items per page
  status?: string; // Filter by ticket status
}

/**
 * Data required to update a support ticket
 */
export interface UpdateTicketData {
  status: "OPEN" | "IN_PROGRESS" | "CLOSE";
  response: string;
}

/**
 * Fetches support tickets with optional filtering and pagination
 * @param params - Optional query parameters for filtering and pagination
 * @returns Promise with paginated support tickets data
 * @throws Error if the request fails
 */
export const fetchSupportTickets = async (params?: FetchTicketsParams) => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append("search", params.search);
    if (params?.order) queryParams.append("order", params.order);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.status) queryParams.append("status", params.status);

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

/**
 * Fetches a single support ticket by merchant ID
 * @param merchaId - The merchant's unique identifier
 * @returns Promise with support ticket details
 * @throws Error if the ticket is not found or request fails
 */
export const fetchSupportTicketById = async (merchantId: string) => {
  try {
    const response = await api.get(`/merchants/support-ticket/${merchantId}`);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<ApiErrorResponse>;
    throw new Error(
      err.response?.data?.message || "Failed to fetch ticket details",
    );
  }
};

/**
 * Updates an existing support ticket with new status and response
 * @param merchantid - The merchant's unique identifier
 * @param data - Updated ticket data containing status and response
 * @returns Promise with updated ticket data
 * @throws Error if the update fails
 */
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
