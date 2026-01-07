import api from "@/shared/utils/api";
import { AxiosError } from "axios";
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  phone?: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

export const submitContactForm = async (
  data: ContactFormData,
): Promise<ContactResponse> => {
  try {
    const response = await api.post("/users/contact-us", data);
    return {
      success: true,
      message: response.data.message || "Message sent successfully!",
    };
  } catch (error) {
    console.error("Contact form submission error:", error);

    // Check if it's an AxiosError
    if (error instanceof AxiosError) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to send message. Please try again.",
      };
    }

    // For other error types
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message || "Failed to send message. Please try again.",
      };
    }

    return {
      success: false,
      message: "Failed to send message. Please try again.",
    };
  }
};
