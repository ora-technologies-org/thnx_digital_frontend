// services/contactUs.service.ts
import api from "@/shared/utils/api";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
  updatedAt?: string;
  status?: "new" | "read" | "replied";
}

export interface ContactMessagesResponse {
  success: boolean;
  message: string;
  data: {
    data: ContactMessage[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    filters: {
      search: string | null;
      sortBy: string;
      sortOrder: string;
    };
  };
}

export const contactUsService = {
  getContactMessages: async (): Promise<ContactMessage[]> => {
    try {
      const response = await api.get<ContactMessagesResponse>(
        "/users/contact-us?order=asc",
      );

      // The response structure is: response.data.data.data
      // Because api.get returns { data: ... }, and your API returns { data: { data: [...] } }
      return response.data?.data?.data || [];
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      // Re-throw the error so the calling component can handle it
      throw error;
    }
  },
};
