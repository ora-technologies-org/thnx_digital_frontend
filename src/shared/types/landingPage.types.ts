// src/types/landingPage.types.ts

/**
 * FAQ related types
 */
export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQSection {
  title: string;
  subtitle: string;
  items: FAQItem[];
}

/**
 * Hero section types
 */
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

/**
 * Stats related types
 */
export interface StatItem {
  label: string;
  value: string;
}

export interface RawStats {
  activeUsers: number;
  merchants: number;
  giftCardsSold: number;
  revenue: number;
  satisfactionRate: number;
}

/**
 * Steps section types
 */
export interface StepItem {
  step: number;
  title: string;
  description: string;
}

/**
 * Features section types
 */
export interface FeaturePoint {
  title: string;
  description: string;
  points: string[];
}

/**
 * Testimonials section types
 */
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

/**
 * Footer section types
 */
export interface FooterLinks {
  legal: string[];
  company: string[];
  product: string[];
}

export interface Footer {
  links: FooterLinks;
  copyright: string;
}

/**
 * Contact section types
 */
export interface Contact {
  title: string;
  heading: string;
  subtitle: string;
  responseTime: string;
}
/**
 * Error response structure
 */
export interface ErrorResponse {
  response?: {
    data: unknown;
    status: number;
    statusText: string;
  };
  message: string;
}
/**
 * Newsletter section types
 */
export interface Newsletter {
  title: string;
  subtitle: string;
  privacyNote: string;
}

/**
 * Final CTA section types
 */
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

/**
 * Complete landing page data structure
 */
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
export type SectionDataMap = {
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
export interface UpdateLandingPageResponse {
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
export interface ApiResponse {
  success: boolean;
  message: string;
}

/**
 * Request payload interface for internal use
 */
export interface RequestPayload {
  slug: string;
  section: LandingPageSection;
  data: SectionDataMap[LandingPageSection];
  index?: number;
}
