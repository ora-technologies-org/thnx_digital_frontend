// src/shared/components/animated/TestimonialCard.tsx
import React, { useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { TiltCard } from "./TiltCard";

interface TestimonialCardProps {
  name: string;
  role: string;
  message: string;
  delay?: number;
  index?: number;
}

/**
 * TestimonialCard Component
 *
 * Displays a single testimonial with author details, rating, and animated effects.
 * Features a tilt effect on hover and gradient avatar based on index.
 *
 * @param name - Full name of the person giving the testimonial
 * @param role - Job title or role of the testimonial author
 * @param message - The testimonial text content
 * @param delay - Animation delay in seconds for staggered entrance
 * @param index - Position in testimonials array (used for gradient selection)
 */
export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  role,
  message,
  delay = 0,
  index = 0,
}) => {
  /**
   * Generates initials from a full name
   * Takes first letter of first two words and converts to uppercase
   *
   * @example getInitials("John Doe") => "JD"
   */
  const getInitials = (fullName: string): string => {
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Default rating is 5 stars for testimonials
  const rating = 5;

  // Gradient combinations for avatar backgrounds
  // Using const outside component would be more performant, but kept here for clarity
  const gradients = useMemo(
    () => [
      "from-blue-500 to-purple-600",
      "from-purple-500 to-pink-600",
      "from-green-500 to-teal-600",
      "from-orange-500 to-red-600",
      "from-indigo-500 to-blue-600",
      "from-pink-500 to-rose-600",
    ],
    [], // Empty deps - gradients are static
  );

  // Use index to deterministically select gradient (same testimonial always gets same color)
  const selectedGradient = useMemo(
    () => gradients[index % gradients.length],
    [index, gradients],
  );

  return (
    <motion.div
      className="flex-shrink-0 w-[380px] sm:w-[420px]"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{ y: -8 }}
    >
      <TiltCard className="h-full">
        {/* Background decoration */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full opacity-60 blur-2xl" />

        {/* Quote icon */}
        <div className="absolute top-6 right-6 text-blue-100">
          <Quote className="w-12 h-12" fill="currentColor" />
        </div>

        {/* Rating stars */}
        <div className="flex gap-1 mb-4 relative z-10">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 transition-colors ${
                i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Testimonial text */}
        <p className="text-gray-700 text-lg leading-relaxed mb-6 relative z-10 min-h-[120px]">
          "{message}"
        </p>

        {/* Author information */}
        <div className="flex items-center gap-4 pt-4 border-t border-gray-200 relative z-10">
          <div
            className={`w-12 h-12 rounded-full bg-gradient-to-br ${selectedGradient} flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0`}
          >
            {getInitials(name)}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{name}</p>
            <p className="text-sm text-gray-600">{role}</p>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
};

// Testimonial item interface
interface Testimonial {
  name: string;
  role: string;
  message: string;
}

/**
 * Supported data structures for testimonials
 * Allows flexibility in how testimonial data is passed to the component
 */
interface TestimonialsDataWrapper {
  data?: Testimonial[];
  items?: Testimonial[];
}

interface TestimonialsScrollProps {
  testimonials: Testimonial[] | TestimonialsDataWrapper;
}

/**
 * TestimonialsScroll Component
 *
 * A horizontally scrollable container for testimonials with navigation controls.
 * Supports multiple data formats and includes smooth scroll animations.
 *
 * @param testimonials - Array of testimonials or wrapped in an object with data/items property
 *
 * @example
 * // Direct array
 * <TestimonialsScroll testimonials={[{ name: "John", role: "CEO", message: "Great!" }]} />
 *
 * // Wrapped in object
 * <TestimonialsScroll testimonials={{ data: [...] }} />
 */
export const TestimonialsScroll: React.FC<TestimonialsScrollProps> = ({
  testimonials = [],
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  /**
   * Scrolls the testimonials container left or right
   * Uses smooth scrolling animation
   */
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 440; // Width of card + gap
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  /**
   * Normalize the testimonials prop to always return an array
   * Handles multiple data formats for backward compatibility
   */
  const normalizeTestimonials = (
    input: Testimonial[] | TestimonialsDataWrapper,
  ): Testimonial[] => {
    // If already an array, return as-is
    if (Array.isArray(input)) {
      return input;
    }

    // Type guard: check if input is an object
    if (input && typeof input === "object") {
      const wrapper = input as TestimonialsDataWrapper;

      // Check for data property
      if (Array.isArray(wrapper.data)) {
        return wrapper.data;
      }

      // Check for items property
      if (Array.isArray(wrapper.items)) {
        return wrapper.items;
      }
    }

    // Return empty array if no valid data found
    return [];
  };

  const validTestimonials = normalizeTestimonials(testimonials);

  // Don't render if no testimonials are available
  if (validTestimonials.length === 0) {
    console.warn("No testimonials available to display");
    return null;
  }

  return (
    <div className="relative">
      {/* Scroll navigation buttons */}
      <div className="flex justify-end gap-3 mb-8">
        <motion.button
          onClick={() => scroll("left")}
          className="w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl flex items-center justify-center text-gray-700 hover:text-blue-600 transition-all duration-300 border border-gray-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>
        <motion.button
          onClick={() => scroll("right")}
          className="w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl flex items-center justify-center text-gray-700 hover:text-blue-600 transition-all duration-300 border border-gray-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Scrollable testimonials container */}
      <div className="relative overflow-hidden">
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-scroll overflow-y-hidden scrollbar-hide px-2"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {validTestimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              {...testimonial}
              index={index}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>

      {/* Scroll position indicator dots (max 6 dots) */}
      <div className="flex justify-center gap-2 mt-6">
        {validTestimonials
          .slice(0, Math.min(validTestimonials.length, 6))
          .map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-gray-300 transition-colors"
            />
          ))}
      </div>

      {/* Hide scrollbar styling */}
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }
      `}</style>
    </div>
  );
};
