// src/shared/utils/Landing.ts

/**
 * Section data types
 */
export interface SectionItem {
  [key: string]:
    | string
    | number
    | string[]
    | Record<string, unknown>
    | boolean
    | undefined;
}

export interface ItemsSection {
  [key: string]:
    | string
    | number
    | string[]
    | Record<string, unknown>
    | boolean
    | undefined
    | SectionItem[];
  title?: string;
  subtitle?: string;
  items: SectionItem[];
}

export type ArraySection = SectionItem[];

export type ObjectSection = {
  [key: string]:
    | string
    | number
    | string[]
    | Record<string, unknown>
    | boolean
    | undefined;
};

// Union type that accepts any landing page section structure
export type SectionData =
  | ItemsSection
  | ArraySection
  | ObjectSection
  | Record<string, unknown>;

/**
 * Helper to convert any landing page section to SectionData
 */
export const toSectionData = <T>(data: T): SectionData => {
  return data as unknown as SectionData;
};

/**
 * Helper to convert SectionData back to specific type
 */
export const fromSectionData = <T>(data: SectionData): T => {
  return data as unknown as T;
};

/**
 * Empty templates for different section types
 */
export const SECTION_TEMPLATES: Record<string, SectionItem> = {
  faqs: { question: "", answer: "" },
  testimonials: { name: "", role: "", message: "" },
  steps: { step: 1, title: "", description: "" },
  features: { title: "", description: "", points: [""] },
  stats: { label: "", value: "" },
};

/**
 * Fields that should be excluded from rendering
 */
export const EXCLUDED_FIELDS = ["rawStats", "items"];

/**
 * Fields that should use textarea instead of input
 */
export const TEXTAREA_FIELDS = ["description", "message", "subtitle", "answer"];

/**
 * Get empty template for a section
 * @param section - Section name
 * @param currentLength - Current number of items (for step number)
 * @returns Empty template object
 */
export const getEmptyTemplate = (
  section: string,
  currentLength: number = 0,
): SectionItem => {
  const template = SECTION_TEMPLATES[section] || {};

  // Auto-increment step number for steps section
  if (section === "steps" && template.step !== undefined) {
    return { ...template, step: currentLength + 1 };
  }

  return template;
};

/**
 * Check if a field should use textarea
 * @param fieldName - Name of the field
 * @returns Boolean indicating if textarea should be used
 */
export const shouldUseTextarea = (fieldName: string): boolean => {
  return TEXTAREA_FIELDS.some((field) => fieldName.includes(field));
};

/**
 * Check if section has items property
 * @param data - Section data
 * @returns Boolean indicating if section has items
 */
export const hasItemsProperty = (data: unknown): data is ItemsSection => {
  return (
    typeof data === "object" &&
    data !== null &&
    "items" in data &&
    Array.isArray((data as ItemsSection).items)
  );
};

/**
 * Check if section is a simple array
 * @param data - Section data
 * @returns Boolean indicating if section is array
 */
export const isArraySection = (data: unknown): data is ArraySection => {
  return Array.isArray(data);
};

/**
 * Check if section is an object (not array)
 * @param data - Section data
 * @returns Boolean indicating if section is object
 */
export const isObjectSection = (data: unknown): data is ObjectSection => {
  return typeof data === "object" && data !== null && !Array.isArray(data);
};

/**
 * Format value for display
 * @param value - Value to format
 * @returns Formatted string
 */
export const formatValueForDisplay = (value: unknown): string => {
  if (Array.isArray(value)) {
    return value
      .map((item) =>
        typeof item === "object" ? JSON.stringify(item) : String(item),
      )
      .join(", ");
  }

  if (typeof value === "object" && value !== null) {
    return Object.entries(value)
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ");
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  return JSON.stringify(value);
};

/**
 * Check if field should be excluded from rendering
 * @param fieldName - Name of the field
 * @returns Boolean indicating if field should be excluded
 */
export const shouldExcludeField = (fieldName: string): boolean => {
  return EXCLUDED_FIELDS.includes(fieldName);
};

/**
 * Capitalize first letter of string
 * @param str - String to capitalize
 * @returns Capitalized string
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Get items from section data
 * @param sectionData - Section data
 * @returns Array of items
 */
export const getItemsFromSection = (
  sectionData: SectionData,
): SectionItem[] => {
  if (hasItemsProperty(sectionData)) {
    return sectionData.items || [];
  }
  if (isArraySection(sectionData)) {
    return sectionData;
  }
  return [];
};

/**
 * Update section with new data
 * @param sectionData - Current section data
 * @param formData - New form data
 * @param index - Index to update (null for new items or object sections)
 * @param isNew - Whether this is a new item
 * @returns Updated section data
 */
export const updateSectionData = (
  sectionData: SectionData,
  formData: SectionItem,
  index: number | null,
  isNew: boolean,
): SectionData => {
  // Handle sections with 'items' property
  if (hasItemsProperty(sectionData)) {
    const updatedItems = [...sectionData.items];
    if (isNew) {
      updatedItems.push(formData);
    } else if (index !== null) {
      updatedItems[index] = formData;
    }
    return {
      ...sectionData,
      items: updatedItems,
    };
  }

  // Handle simple array sections
  if (isArraySection(sectionData)) {
    const updatedData = [...sectionData];
    if (isNew) {
      updatedData.push(formData);
    } else if (index !== null) {
      updatedData[index] = formData;
    }
    return updatedData;
  }

  // Handle object sections
  return formData as ObjectSection;
};

/**
 * Delete item from section
 * @param sectionData - Current section data
 * @param index - Index to delete
 * @returns Updated section data
 */
export const deleteItemFromSection = (
  sectionData: SectionData,
  index: number,
): SectionData => {
  // Handle sections with 'items' property
  if (hasItemsProperty(sectionData)) {
    const updatedItems = sectionData.items.filter((_, i) => i !== index);
    return { ...sectionData, items: updatedItems };
  }

  // Handle simple array sections
  if (isArraySection(sectionData)) {
    return sectionData.filter((_, i) => i !== index);
  }

  return sectionData;
};
