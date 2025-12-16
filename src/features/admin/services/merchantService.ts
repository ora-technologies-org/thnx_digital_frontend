import axios from "axios";
import { CreateMerchantForm } from "../slices/MerchantCreateSlice";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export interface CreateMerchantResponse {
  success: boolean;
  data: {
    merchantId: string;
    email: string;
    name: string;
    businessName: string;
  };
  message: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  statusCode: number;
}

export const merchantService = {
  async createMerchant(
    formData: CreateMerchantForm,
  ): Promise<CreateMerchantResponse> {
    // Create a FormData object
    const multiPartData = new FormData();

    // Append fields dynamically, excluding empty website
    Object.entries(formData).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        !(key === "website" && value === "")
      ) {
        if (value instanceof File) {
          multiPartData.append(key, value);
        } else {
          multiPartData.append(key, String(value));
        }
      }
    });

    try {
      const response = await axios.post<CreateMerchantResponse>(
        `${API_BASE_URL}merchants/`,
        multiPartData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data;
        throw {
          message: data?.message || "Failed to create merchant",
          errors: data?.errors,
          statusCode: error.response?.status || 500,
        } as ApiError;
      } else {
        throw {
          message: "An unexpected error occurred",
          statusCode: 500,
        } as ApiError;
      }
    }
  },
};
