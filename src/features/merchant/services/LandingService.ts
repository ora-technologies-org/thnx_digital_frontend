import api from "@/shared/utils/api";

// Types
export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQSection {
  title: string;
  subtitle: string;
  items: FAQItem[];
}

export interface HeroSection {
  badge: string;
  title: string;
  subtitle: string;
  primaryCTA: {
    link: string;
    label: string;
  };
  secondaryCTA: {
    link: string;
    label: string;
  };
}

export interface StatItem {
  label: string;
  value: string;
}

export interface StepItem {
  step: number;
  title: string;
  description: string;
}

export interface FeaturePoint {
  title: string;
  description: string;
  points: string[];
}

export interface TestimonialItem {
  name: string;
  role: string;
  message: string;
}

export interface TestimonialSection {
  title: string;
  subtitle: string;
  items: TestimonialItem[];
}

export interface FooterLinks {
  legal: string[];
  company: string[];
  product: string[];
}

export interface Footer {
  links: FooterLinks;
  copyright: string;
}

export interface Contact {
  title: string;
  heading: string;
  subtitle: string;
  responseTime: string;
}

export interface RawStats {
  activeUsers: number;
  merchants: number;
  giftCardsSold: number;
  revenue: number;
  satisfactionRate: number;
}

export interface Newsletter {
  title: string;
  subtitle: string;
  privacyNote: string;
}

export interface FinalCTA {
  title: string;
  subtitle: string;
  primaryCTA: {
    link: string;
    label: string;
  };
  secondaryCTA: {
    link: string;
    label: string;
  };
}

export interface LandingPageData {
  faqs: FAQSection;
  hero: HeroSection;
  stats: StatItem[];
  steps: StepItem[];
  footer: Footer;
  contact: Contact;
  features: FeaturePoint[];
  testimonials: TestimonialSection;
  rawStats: RawStats;
  finalCTA: FinalCTA;
  newsletter: Newsletter;
}

/**
 * API response structure for landing page data fetch
 */
export interface LandingPageResponse {
  success: boolean;
  message: string;
  data: {
    data: LandingPageData;
  };
}

/**
 * Valid section names that can be updated on the landing page
 */
export type LandingPageSection =
  | "faqs"
  | "hero"
  | "stats"
  | "steps"
  | "footer"
  | "contact"
  | "features"
  | "testimonials"
  | "rawStats"
  | "finalCTA"
  | "newsletter";

/**
 * Type mapping for section data
 */
type SectionDataMap = {
  faqs: FAQSection;
  hero: HeroSection;
  stats: StatItem[];
  steps: StepItem[];
  footer: Footer;
  contact: Contact;
  features: FeaturePoint[];
  testimonials: TestimonialSection;
  rawStats: RawStats;
  finalCTA: FinalCTA;
  newsletter: Newsletter;
};

/**
 * Request payload for updating a landing page section
 */
export interface UpdateLandingPageRequest<
  T extends LandingPageSection = LandingPageSection,
> {
  slug?: string;
  section: T;
  data: SectionDataMap[T];
  index?: number;
}

/**
 * API response structure for landing page updates
 */
interface UpdateLandingPageResponse {
  success: boolean;
  message: string;
  data?: {
    data?: {
      content?: LandingPageData;
      data?: LandingPageData;
    };
    content?: LandingPageData;
  };
  content?: LandingPageData;
}

/**
 * Generic API response structure
 */
interface ApiResponse {
  success: boolean;
  message: string;
}

/**
 * Request payload interface for internal use
 */
interface RequestPayload {
  slug: string;
  section: LandingPageSection;
  data: SectionDataMap[LandingPageSection];
  index?: number;
}

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

      if (response.data?.data?.data?.content) {
        return response.data.data.data.content;
      } else if (response.data?.data?.data) {
        return response.data.data.data;
      } else if (response.data?.data) {
        return response.data.data;
      } else {
        console.error("Unexpected response structure:", response.data);
        throw new Error("Invalid response structure");
      }
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
        "users/landing-page",
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
        return response.data.data.data;
      } else if (response.data?.data) {
        return response.data.data;
      } else {
        console.error("Unexpected response structure:", response.data);
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      console.error("Error updating landing page data:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
      throw error;
    }
  },

  /**
   * Adds a new FAQ item
   */
  async addFAQItem(faqItem: FAQItem): Promise<LandingPageData> {
    try {
      const currentData = await this.getLandingPageData();
      const updatedFAQs = {
        ...currentData.faqs,
        items: [...currentData.faqs.items, faqItem],
      };

      return await this.updateLandingPageSection({
        section: "faqs",
        data: updatedFAQs,
      });
    } catch (error) {
      console.error("Error adding FAQ item:", error);
      throw error;
    }
  },

  /**
   * Updates a specific FAQ item by index
   */
  async updateFAQItem(
    faqItem: FAQItem,
    index: number,
  ): Promise<LandingPageData> {
    try {
      const currentData = await this.getLandingPageData();
      const updatedItems = [...currentData.faqs.items];
      updatedItems[index] = faqItem;

      const updatedFAQs = {
        ...currentData.faqs,
        items: updatedItems,
      };

      return await this.updateLandingPageSection({
        section: "faqs",
        data: updatedFAQs,
      });
    } catch (error) {
      console.error("Error updating FAQ item:", error);
      throw error;
    }
  },

  /**
   * Deletes a FAQ item by index
   */
  async deleteFAQItem(index: number): Promise<LandingPageData> {
    try {
      const currentData = await this.getLandingPageData();
      const updatedItems = currentData.faqs.items.filter((_, i) => i !== index);

      const updatedFAQs = {
        ...currentData.faqs,
        items: updatedItems,
      };

      return await this.updateLandingPageSection({
        section: "faqs",
        data: updatedFAQs,
      });
    } catch (error) {
      console.error("Error deleting FAQ item:", error);
      throw error;
    }
  },

  /**
   * Adds a new testimonial item
   */
  async addTestimonialItem(
    testimonialItem: TestimonialItem,
  ): Promise<LandingPageData> {
    try {
      const currentData = await this.getLandingPageData();
      const updatedTestimonials = {
        ...currentData.testimonials,
        items: [...currentData.testimonials.items, testimonialItem],
      };

      return await this.updateLandingPageSection({
        section: "testimonials",
        data: updatedTestimonials,
      });
    } catch (error) {
      console.error("Error adding testimonial item:", error);
      throw error;
    }
  },

  /**
   * Updates a specific testimonial item by index
   */
  async updateTestimonialItem(
    testimonialItem: TestimonialItem,
    index: number,
  ): Promise<LandingPageData> {
    try {
      const currentData = await this.getLandingPageData();
      const updatedItems = [...currentData.testimonials.items];
      updatedItems[index] = testimonialItem;

      const updatedTestimonials = {
        ...currentData.testimonials,
        items: updatedItems,
      };

      return await this.updateLandingPageSection({
        section: "testimonials",
        data: updatedTestimonials,
      });
    } catch (error) {
      console.error("Error updating testimonial item:", error);
      throw error;
    }
  },

  /**
   * Deletes a testimonial item by index
   */
  async deleteTestimonialItem(index: number): Promise<LandingPageData> {
    try {
      const currentData = await this.getLandingPageData();
      const updatedItems = currentData.testimonials.items.filter(
        (_, i) => i !== index,
      );

      const updatedTestimonials = {
        ...currentData.testimonials,
        items: updatedItems,
      };

      return await this.updateLandingPageSection({
        section: "testimonials",
        data: updatedTestimonials,
      });
    } catch (error) {
      console.error("Error deleting testimonial item:", error);
      throw error;
    }
  },

  /**
   * Adds a new item to simple array sections (stats, steps, features)
   */
  async addItemToSection(
    section: "stats" | "steps" | "features",
    item: StatItem | StepItem | FeaturePoint,
  ): Promise<LandingPageData> {
    try {
      const currentData = await this.getLandingPageData();
      const currentArray = currentData[section];
      const updatedArray = [...currentArray, item];

      return await this.updateLandingPageSection({
        section,
        data: updatedArray,
      });
    } catch (error) {
      console.error(`Error adding item to ${section}:`, error);
      throw error;
    }
  },

  /**
   * Updates a specific item in simple array sections
   */
  async updateItemInSection(
    section: "stats" | "steps" | "features",
    item: StatItem | StepItem | FeaturePoint,
    index: number,
  ): Promise<LandingPageData> {
    try {
      const currentData = await this.getLandingPageData();
      const currentArray = currentData[section];
      const updatedArray = [...currentArray];
      updatedArray[index] = item;

      return await this.updateLandingPageSection({
        section,
        data: updatedArray,
      });
    } catch (error) {
      console.error(`Error updating item in ${section}:`, error);
      throw error;
    }
  },

  /**
   * Deletes an item from simple array sections
   */
  async deleteItemFromSection(
    section: "stats" | "steps" | "features",
    index: number,
  ): Promise<LandingPageData> {
    try {
      const currentData = await this.getLandingPageData();
      const currentArray = currentData[section];
      const updatedArray = currentArray.filter((_, i) => i !== index);

      return await this.updateLandingPageSection({
        section,
        data: updatedArray,
      });
    } catch (error) {
      console.error(`Error deleting item from ${section}:`, error);
      throw error;
    }
  },

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
