import api from "@/shared/utils/api";
import {
  ApiResponse,
  ErrorResponse,
  FAQItem,
  FAQSection,
  FeaturePoint,
  LandingPageData,
  LandingPageResponse,
  RequestPayload,
  StatItem,
  StepItem,
  TestimonialItem,
  TestimonialSection,
  UpdateLandingPageRequest,
  UpdateLandingPageResponse,
} from "@/shared/types/landingPage.types";

/**
 * Landing Page Service
 * Handles all API interactions for landing page content management
 */
export const landingPageService = {
  /**
   * Fetches complete landing page data from the server
   */
  async getLandingPageData(): Promise<LandingPageData> {
    try {
      const response = await api.get<LandingPageResponse>("users/landing-page");
      console.log("📥 Fetch response:", response.data);

      const responseData = response.data?.data?.data;

      // Handle nested content structure
      if (
        responseData &&
        typeof responseData === "object" &&
        "content" in responseData
      ) {
        return responseData.content as LandingPageData;
      }

      // Handle direct data structure
      if (responseData) {
        return responseData as LandingPageData;
      }

      // Fallback to data field
      if (response.data?.data) {
        return response.data.data as unknown as LandingPageData;
      }
      console.error("Unexpected response structure:", response.data);
      throw new Error("Invalid response structure");
    } catch (error) {
      console.error("Error fetching landing page data:", error);
      throw error;
    }
  },

  /**
   * Updates a specific section of the landing page
   *
   * Section formats based on backend:
   *
   * - hero: { badge, title, subtitle, primaryCTA, secondaryCTA }
   * - stats: [{ label, value }, ...]
   * - rawStats: { activeUsers, merchants, giftCardsSold, revenue, satisfactionRate }
   * - features: [{ title, description, points }, ...]
   * - steps: [{ step, title, description }, ...]
   * - testimonials: { title, subtitle, items: [{ name, role, message }, ...] }
   * - faqs: { title, subtitle, items: [{ question, answer }, ...] }
   * - contact: { title, heading, subtitle, responseTime }
   * - newsletter: { title, subtitle, privacyNote }
   * - finalCTA: { title, subtitle, primaryCTA, secondaryCTA }
   * - footer: { copyright, links: { product, company, legal } }
   */
  async updateLandingPageSection(
    payload: UpdateLandingPageRequest,
  ): Promise<LandingPageData> {
    try {
      const requestPayload: RequestPayload = {
        slug: payload.slug || "home",
        section: payload.section,
        data: payload.data,
      };

      if (payload.index !== undefined && payload.index !== null) {
        requestPayload.index = payload.index;
      }

      console.log(
        "📤 Sending update payload:",
        JSON.stringify(requestPayload, null, 2),
      );

      const response = await api.patch<UpdateLandingPageResponse>(
        "admin/landing-page",
        requestPayload,
      );

      console.log("✅ Update successful:", response.data);

      // Extract content from response
      if (response.data?.data?.data?.content) {
        return response.data.data.data.content;
      } else if (response.data?.data?.content) {
        return response.data.data.content;
      } else if (response.data?.content) {
        return response.data.content;
      } else if (response.data?.data?.data) {
        return response.data.data.data as LandingPageData;
      } else if (response.data?.data) {
        return response.data.data as LandingPageData;
      } else {
        console.error("Unexpected response structure:", response.data);
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      const err = error as ErrorResponse;
      console.error("Error updating landing page data:", err);
      if (err.response) {
        console.error("Error response:", err.response.data);
      }
      throw error;
    }
  },

  // ==================== FAQ FETCH METHOD ====================

  /**
   * Fetches all FAQ items
   */
  async getFAQs(): Promise<FAQItem[]> {
    try {
      const response = await api.get<{ data: FAQItem[] }>("users/faq");
      console.log("📥 FAQs fetched:", response.data);
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      throw error;
    }
  },

  // ==================== FAQ METHODS ====================

  /**
   * Adds a new FAQ item using dedicated endpoint
   */
  async addFAQItem(faqItem: Omit<FAQItem, "id">): Promise<ApiResponse> {
    try {
      const payload = {
        question: faqItem.question,
        answer: faqItem.answer,
        is_active: true,
      };

      const response = await api.post<ApiResponse>("admin/faq", payload);
      console.log("✅ FAQ added successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error adding FAQ item:", error);
      throw error;
    }
  },

  /**
   * Updates a specific FAQ item by ID using dedicated endpoint
   */
  async updateFAQItem(
    faqId: string,
    faqItem: Partial<Omit<FAQItem, "id">>,
  ): Promise<ApiResponse> {
    try {
      const payload = {
        question: faqItem.question,
        answer: faqItem.answer,
        is_active: true,
      };

      const response = await api.patch<ApiResponse>(
        `admin/faq/${faqId}`,
        payload,
      );
      console.log("✅ FAQ updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating FAQ item:", error);
      throw error;
    }
  },

  /**
   * Deletes a FAQ item by ID
   */
  async deleteFAQItem(faqId: string): Promise<ApiResponse> {
    try {
      const response = await api.delete<ApiResponse>(`admin/faq/${faqId}`);
      console.log("✅ FAQ deleted successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error deleting FAQ item:", error);
      throw error;
    }
  },

  /**
   * Updates FAQ section metadata (title, subtitle)
   */
  async updateFAQSection(metadata: Partial<FAQSection>): Promise<ApiResponse> {
    try {
      const response = await api.patch<ApiResponse>("admin/faq", metadata);
      console.log("✅ FAQ section updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating FAQ section:", error);
      throw error;
    }
  },

  // ==================== TESTIMONIAL FETCH METHOD ====================

  /**
   * Fetches all testimonial items
   */
  async getTestimonials(): Promise<TestimonialItem[]> {
    try {
      const response = await api.get<{ data: TestimonialItem[] }>(
        "admin/testimonials",
      );
      console.log("📥 Testimonials fetched:", response.data);
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      throw error;
    }
  },

  // ==================== TESTIMONIAL METHODS ====================

  /**
   * Adds a new testimonial item using dedicated endpoint
   */
  async addTestimonialItem(
    testimonialItem: Omit<TestimonialItem, "id">,
  ): Promise<ApiResponse> {
    try {
      const payload = {
        name: testimonialItem.name,
        role: testimonialItem.role,
        message: testimonialItem.message,
        is_active: true,
      };

      const response = await api.post<ApiResponse>(
        "admin/testimonials",
        payload,
      );
      console.log("✅ Testimonial added successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error adding testimonial item:", error);
      throw error;
    }
  },

  /**
   * Updates a specific testimonial item by ID using dedicated endpoint
   */
  async updateTestimonialItem(
    testimonialId: string,
    testimonialItem: Partial<Omit<TestimonialItem, "id">>,
  ): Promise<ApiResponse> {
    try {
      const payload = {
        name: testimonialItem.name,
        role: testimonialItem.role,
        message: testimonialItem.message,
        is_active: true,
      };

      const response = await api.patch<ApiResponse>(
        `admin/testimonials/${testimonialId}`,
        payload,
      );
      console.log("✅ Testimonial updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating testimonial item:", error);
      throw error;
    }
  },

  /**
   * Deletes a testimonial item by ID
   */
  async deleteTestimonialItem(testimonialId: string): Promise<ApiResponse> {
    try {
      const response = await api.delete<ApiResponse>(
        `admin/testimonials/${testimonialId}`,
      );
      console.log("✅ Testimonial deleted successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error deleting testimonial item:", error);
      throw error;
    }
  },

  /**
   * Updates testimonial section metadata (title, subtitle)
   */
  async updateTestimonialSection(
    metadata: Partial<TestimonialSection>,
  ): Promise<ApiResponse> {
    try {
      const response = await api.patch<ApiResponse>(
        "admin/testimonials",
        metadata,
      );
      console.log(
        "✅ Testimonial section updated successfully:",
        response.data,
      );
      return response.data;
    } catch (error) {
      console.error("Error updating testimonial section:", error);
      throw error;
    }
  },

  // ==================== STATS METHODS ====================

  /**
   * Adds a new stat item
   */
  async addStatItem(item: StatItem): Promise<LandingPageData> {
    try {
      const currentData = await this.getLandingPageData();
      const updatedStats = [...currentData.stats, item];

      return await this.updateLandingPageSection({
        section: "stats",
        data: updatedStats,
      });
    } catch (error) {
      console.error("Error adding stat item:", error);
      throw error;
    }
  },

  /**
   * Updates a specific stat item by index
   */
  async updateStatItem(
    item: StatItem,
    index: number,
  ): Promise<LandingPageData> {
    try {
      const currentData = await this.getLandingPageData();
      const updatedStats = [...currentData.stats];
      updatedStats[index] = item;

      return await this.updateLandingPageSection({
        section: "stats",
        data: updatedStats,
      });
    } catch (error) {
      console.error("Error updating stat item:", error);
      throw error;
    }
  },

  /**
   * Deletes a stat item by index
   */
  async deleteStatItem(index: number): Promise<LandingPageData> {
    try {
      const currentData = await this.getLandingPageData();
      const updatedStats = currentData.stats.filter((_, i) => i !== index);

      return await this.updateLandingPageSection({
        section: "stats",
        data: updatedStats,
      });
    } catch (error) {
      console.error("Error deleting stat item:", error);
      throw error;
    }
  },

  // ==================== STEP METHODS ====================

  /**
   * Adds a new step item
   */
  async addStepItem(item: StepItem): Promise<LandingPageData> {
    try {
      const currentData = await this.getLandingPageData();
      const updatedSteps = [...currentData.steps, item];

      return await this.updateLandingPageSection({
        section: "steps",
        data: updatedSteps,
      });
    } catch (error) {
      console.error("Error adding step item:", error);
      throw error;
    }
  },

  /**
   * Updates a specific step item by index
   */
  async updateStepItem(
    item: StepItem,
    index: number,
  ): Promise<LandingPageData> {
    try {
      const currentData = await this.getLandingPageData();
      const updatedSteps = [...currentData.steps];
      updatedSteps[index] = item;

      return await this.updateLandingPageSection({
        section: "steps",
        data: updatedSteps,
      });
    } catch (error) {
      console.error("Error updating step item:", error);
      throw error;
    }
  },

  /**
   * Deletes a step item by index
   */
  async deleteStepItem(index: number): Promise<LandingPageData> {
    try {
      const currentData = await this.getLandingPageData();
      const updatedSteps = currentData.steps.filter((_, i) => i !== index);

      return await this.updateLandingPageSection({
        section: "steps",
        data: updatedSteps,
      });
    } catch (error) {
      console.error("Error deleting step item:", error);
      throw error;
    }
  },

  // ==================== FEATURE METHODS ====================

  /**
   * Adds a new feature item
   */
  async addFeatureItem(item: FeaturePoint): Promise<LandingPageData> {
    try {
      const currentData = await this.getLandingPageData();
      const updatedFeatures = [...currentData.features, item];

      return await this.updateLandingPageSection({
        section: "features",
        data: updatedFeatures,
      });
    } catch (error) {
      console.error("Error adding feature item:", error);
      throw error;
    }
  },

  /**
   * Updates a specific feature item by index
   */
  async updateFeatureItem(
    item: FeaturePoint,
    index: number,
  ): Promise<LandingPageData> {
    try {
      const currentData = await this.getLandingPageData();
      const updatedFeatures = [...currentData.features];
      updatedFeatures[index] = item;

      return await this.updateLandingPageSection({
        section: "features",
        data: updatedFeatures,
      });
    } catch (error) {
      console.error("Error updating feature item:", error);
      throw error;
    }
  },

  /**
   * Deletes a feature item by index
   */
  async deleteFeatureItem(index: number): Promise<LandingPageData> {
    try {
      const currentData = await this.getLandingPageData();
      const updatedFeatures = currentData.features.filter(
        (_, i) => i !== index,
      );

      return await this.updateLandingPageSection({
        section: "features",
        data: updatedFeatures,
      });
    } catch (error) {
      console.error("Error deleting feature item:", error);
      throw error;
    }
  },

  // ==================== NEWSLETTER & CONTACT ====================

  /**
   * Subscribes an email address to the newsletter
   */
  async subscribeNewsletter(email: string): Promise<ApiResponse> {
    try {
      const response = await api.post<ApiResponse>("/newsletter/subscribe", {
        email,
      });
      return response.data;
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      throw error;
    }
  },

  /**
   * Submits a contact form message
   */
  async submitContactForm(data: {
    name: string;
    email: string;
    message: string;
  }): Promise<ApiResponse> {
    try {
      const response = await api.post<ApiResponse>("/contact/submit", data);
      return response.data;
    } catch (error) {
      console.error("Error submitting contact form:", error);
      throw error;
    }
  },
};
