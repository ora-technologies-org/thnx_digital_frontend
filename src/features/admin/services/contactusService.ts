// services/contactUs.service.ts

import api from "@/shared/utils/api";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
  status?: "new" | "read" | "replied";
}

export interface ContactMessagesResponse {
  messages?: ContactMessage[];
  data?: ContactMessage[];
}

export const contactUsService = {
  getContactMessages: async (): Promise<ContactMessage[]> => {
    const response = await api.get<ContactMessagesResponse>(
      "/users/contact-us?order=asc",
    );

    return response.data.messages || response.data.data || [];
  },
};
