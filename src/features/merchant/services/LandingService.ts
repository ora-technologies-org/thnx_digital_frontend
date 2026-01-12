// src/services/landingPage.service.ts
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Types
export interface FAQItem {
  question: string;
  answer: string;
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

export interface Testimonial {
  name: string;
  role: string;
  message: string;
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
  email: string;
  phone: string;
  location: string;
  responseTime: string;
}

export interface RawStats {
  activeUsers: number;
  merchants: number;
  giftCardsSold: number;
  revenue: number;
  satisfactionRate: number;
}

export interface LandingPageData {
  faqs: FAQItem[];
  hero: HeroSection;
  stats: StatItem[];
  steps: StepItem[];
  footer: Footer;
  contact: Contact;
  features: FeaturePoint[];
  testimonials: Testimonial[];
  rawStats: RawStats;
  finalCTA: {
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
  };
  newsletter: {
    title: string;
    subtitle: string;
    privacyNote: string;
  };
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
  | "rawStats";

/**
 * Type mapping for section data
 * Maps each section to its corresponding data type
 */
type SectionDataMap = {
  faqs: FAQItem[];
  hero: HeroSection;
  stats: StatItem[];
  steps: StepItem[];
  footer: Footer;
  contact: Contact;
  features: FeaturePoint[];
  testimonials: Testimonial[];
  rawStats: RawStats;
};

/**
 * Request payload for updating a landing page section
 * Uses mapped types to ensure data matches the section type
 */
export interface UpdateLandingPageRequest {
  section: LandingPageSection;
  data: SectionDataMap[LandingPageSection];
  index?: number; // Optional index for updating specific items in array sections
}

/**
 * API response structure for landing page updates
 * Server returns updated document with nested content structure
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
 * Landing Page Service
 * Handles all API interactions for landing page content management
 */
export const landingPageService = {
  /**
   * Fetches complete landing page data from the server
   * Handles multiple response structure formats for backward compatibility
   *
   * @returns Promise resolving to LandingPageData
   * @throws Error if response structure is invalid or request fails
   */
  async getLandingPageData(): Promise<LandingPageData> {
    try {
      const response = await axios.get<LandingPageResponse>(
        `${API_BASE_URL}users/landing-page`,
      );
      console.log("📥 Fetch response:", response.data);

      // Handle different response structures from various API versions
      // Try most nested structure first, then fall back to simpler structures
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
   * Supports both full section updates and individual item updates (via index)
   *
   * @param payload - Section identifier, new data, and optional index for array items
   * @returns Promise resolving to updated LandingPageData
   * @throws Error if update fails or response structure is invalid
   *
   * @example
   * // Update entire hero section
   * updateLandingPageSection({ section: 'hero', data: newHeroData })
   *
   * // Update specific FAQ item at index 2
   * updateLandingPageSection({ section: 'faqs', data: newFaqItem, index: 2 })
   */
  async updateLandingPageSection(
    payload: UpdateLandingPageRequest,
  ): Promise<LandingPageData> {
    try {
      console.log("📤 Sending update payload:", payload);

      const response = await axios.patch<UpdateLandingPageResponse>(
        `${API_BASE_URL}users/landing-page`,
        payload,
      );

      console.log("📥 Update response:", response.data);

      // The update returns {id, slug, content: {...}, updatedAt}
      // We need to extract and return the content object
      // Handle various nesting levels for different API response formats
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
      throw error;
    }
  },

  /**
   * Subscribes an email address to the newsletter
   *
   * @param email - Email address to subscribe
   * @returns Promise with success status and message
   * @throws Error if subscription fails
   */
  async subscribeNewsletter(email: string): Promise<ApiResponse> {
    try {
      const response = await axios.post<ApiResponse>(
        `${API_BASE_URL}/newsletter/subscribe`,
        {
          email,
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      throw error;
    }
  },

  /**
   * Submits a contact form message
   *
   * @param data - Contact form data including name, email, and message
   * @returns Promise with success status and message
   * @throws Error if submission fails
   */
  async submitContactForm(data: {
    name: string;
    email: string;
    message: string;
  }): Promise<ApiResponse> {
    try {
      const response = await axios.post<ApiResponse>(
        `${API_BASE_URL}/contact/submit`,
        data,
      );
      return response.data;
    } catch (error) {
      console.error("Error submitting contact form:", error);
      throw error;
    }
  },
};
