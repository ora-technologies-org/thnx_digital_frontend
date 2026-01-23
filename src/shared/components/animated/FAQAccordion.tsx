// src/shared/components/animated/FAQAccordion.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Supported data structures for FAQ items
 * Allows flexibility in how FAQ data is passed to the component
 */
interface FAQDataWrapper {
  data?: FAQItem[];
  items?: FAQItem[];
  faqs?: FAQItem[];
}

interface FAQAccordionProps {
  items?: FAQItem[] | FAQDataWrapper;
}

/**
 * FAQ Accordion Component
 *
 * A fully animated accordion component for displaying frequently asked questions.
 * Supports multiple data formats for flexibility and includes smooth expand/collapse animations.
 *
 * @param items - FAQ items as array or wrapped in an object with data/items/faqs property
 *
 * @example
 * // Direct array
 * <FAQAccordion items={[{ question: "Q1", answer: "A1" }]} />
 *
 * // Wrapped in object
 * <FAQAccordion items={{ data: [{ question: "Q1", answer: "A1" }] }} />
 */
export const FAQAccordion: React.FC<FAQAccordionProps> = ({ items = [] }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  /**
   * Toggles the accordion item at the specified index
   * Closes the item if it's already open, opens it otherwise
   */
  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  /**
   * Normalize the items prop to always return an array of FAQItem
   * Handles multiple data formats for backward compatibility and flexibility
   */
  const normalizeItems = (input: FAQItem[] | FAQDataWrapper): FAQItem[] => {
    // If already an array, return as-is
    if (Array.isArray(input)) {
      return input;
    }

    // Type guard: check if input is an object
    if (input && typeof input === "object") {
      const wrapper = input as FAQDataWrapper;

      // Check for data property
      if (Array.isArray(wrapper.data)) {
        return wrapper.data;
      }

      // Check for items property
      if (Array.isArray(wrapper.items)) {
        return wrapper.items;
      }

      // Check for faqs property
      if (Array.isArray(wrapper.faqs)) {
        return wrapper.faqs;
      }
    }

    // Return empty array if no valid data found
    return [];
  };

  const validItems = normalizeItems(items);

  // Display message when no FAQ items are available
  if (validItems.length === 0) {
    console.warn("No FAQ items available to display");
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No FAQs available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {validItems.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
        >
          {/* Accordion header button */}
          <button
            onClick={() => toggleItem(index)}
            className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            aria-expanded={openIndex === index}
            aria-controls={`faq-answer-${index}`}
          >
            <span className="text-lg font-semibold text-gray-900 pr-8">
              {item.question}
            </span>
            {/* Animated chevron icon that rotates when accordion opens */}
            <motion.div
              animate={{ rotate: openIndex === index ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-6 h-6 text-gray-600 flex-shrink-0" />
            </motion.div>
          </button>

          {/* Animated answer content with smooth expand/collapse */}
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                id={`faq-answer-${index}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                  {item.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};
