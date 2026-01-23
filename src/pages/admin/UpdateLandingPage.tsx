// src/pages/LandingPageEditor.tsx - FIXED VERSION

import React, { useState, useEffect, useMemo } from "react";
import { Edit2, Plus, Trash2, Save } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Modal } from "@/shared/components/ui/Modal";
import AdminLayout from "@/shared/components/layout/AdminLayout";
import {
  useLandingPageRedux,
  useUpdateLandingPage,
  useFAQOperations,
  useTestimonialOperations,
  useFAQsData,
  useTestimonialsData,
} from "@/features/merchant/hooks/useLanding";

import {
  type SectionItem,
  type SectionData,
  getEmptyTemplate,
  shouldUseTextarea,
  hasItemsProperty,
  isArraySection,
  formatValueForDisplay,
  shouldExcludeField,
  capitalize,
  getItemsFromSection,
  updateSectionData,
  deleteItemFromSection,
} from "@/shared/utils/Landing";
import { Spinner } from "@/shared/components/ui/Spinner";

// Type definitions
interface ItemWithId extends SectionItem {
  id?: string;
  is_active?: boolean;
}

interface SectionWithItems {
  title?: string;
  subtitle?: string;
  items: ItemWithId[];
}

interface EditingState {
  section: string;
  index: number | null;
  itemId?: string;
  isNew?: boolean;
}

const LandingPageEditor: React.FC = () => {
  const { data: landingData, loading, fetchData } = useLandingPageRedux();
  const { data: faqsData, isLoading: faqsLoading } = useFAQsData();
  const { data: testimonialsData, isLoading: testimonialsLoading } =
    useTestimonialsData();

  const { updateSection } = useUpdateLandingPage();
  const { addFAQ, updateFAQ, deleteFAQ } = useFAQOperations();
  const { addTestimonial, updateTestimonial, deleteTestimonial } =
    useTestimonialOperations();

  const [editingItem, setEditingItem] = useState<EditingState | null>(null);
  const [formData, setFormData] = useState<SectionItem>({});

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Merge FAQs and Testimonials into landing page data using useMemo
  const mergedData = useMemo(() => {
    if (!landingData) return null;

    const merged = { ...landingData };

    // Merge FAQs
    if (faqsData && Array.isArray(faqsData)) {
      merged.faqs = {
        title: landingData.faqs?.title || "Frequently Asked Questions",
        subtitle:
          landingData.faqs?.subtitle || "Got questions? We've got answers",
        items: faqsData,
      };
    }

    // Merge Testimonials
    if (testimonialsData && Array.isArray(testimonialsData)) {
      merged.testimonials = {
        title: landingData.testimonials?.title || "What Our Customers Say",
        subtitle: landingData.testimonials?.subtitle || "Trusted by thousands",
        items: testimonialsData,
      };
    }

    return merged;
  }, [landingData, faqsData, testimonialsData]);

  const handleEdit = (section: string, index: number | null = null): void => {
    if (!mergedData) return;

    const sectionData = mergedData[section] as SectionData;

    if (hasItemsProperty(sectionData)) {
      if (index !== null) {
        const item = sectionData.items[index] as ItemWithId;
        const { id, ...itemData } = item;
        // Remove id and is_active from itemData
        delete itemData.is_active;
        setFormData(itemData);
        setEditingItem({ section, index, itemId: id });
      } else {
        const sectionWithItems = sectionData as SectionWithItems;
        const headerData: SectionItem = {};
        if (sectionWithItems.title) headerData.title = sectionWithItems.title;
        if (sectionWithItems.subtitle)
          headerData.subtitle = sectionWithItems.subtitle;
        setFormData(headerData);
        setEditingItem({ section, index: null });
      }
    } else if (isArraySection(sectionData) && index !== null) {
      setFormData({ ...sectionData[index] });
      setEditingItem({ section, index });
    } else {
      const dataToEdit =
        typeof sectionData === "object" && sectionData !== null
          ? Object.fromEntries(
              Object.entries(sectionData).filter(([key]) => key !== "items"),
            )
          : {};
      setFormData(dataToEdit as SectionItem);
      setEditingItem({ section, index: null });
    }
  };

  const handleAdd = (section: string): void => {
    if (!mergedData) return;

    const sectionData = mergedData[section] as SectionData;
    const currentLength = getItemsFromSection(sectionData).length;
    const template = getEmptyTemplate(section, currentLength);

    setFormData(template);
    setEditingItem({ section, index: null, isNew: true });
  };

  const handleSave = async (): Promise<void> => {
    if (!editingItem || !mergedData) return;

    const { section, index, itemId, isNew = false } = editingItem;
    const sectionData = mergedData[section] as SectionData;

    try {
      if (section === "faqs") {
        if (index === null && !isNew) {
          const updatedSection = {
            ...sectionData,
            title: formData.title,
            subtitle: formData.subtitle,
          };
          await updateSection({ section: "faqs", data: updatedSection });
        } else if (isNew) {
          await addFAQ(formData as ItemWithId);
        } else if (itemId) {
          await updateFAQ({ id: itemId, data: formData as ItemWithId });
        }
        setEditingItem(null);
        setFormData({});
        return;
      }

      if (section === "testimonials") {
        if (index === null && !isNew) {
          const updatedSection = {
            ...sectionData,
            title: formData.title,
            subtitle: formData.subtitle,
          };
          await updateSection({
            section: "testimonials",
            data: updatedSection,
          });
        } else if (isNew) {
          await addTestimonial(formData as ItemWithId);
        } else if (itemId) {
          await updateTestimonial({ id: itemId, data: formData as ItemWithId });
        }
        setEditingItem(null);
        setFormData({});
        return;
      }

      const updatedData = updateSectionData(
        sectionData,
        formData,
        index,
        isNew,
      );
      const success = await updateSection({ section, data: updatedData });

      if (success) {
        setEditingItem(null);
        setFormData({});
      }
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  const handleDelete = async (
    section: string,
    index: number,
  ): Promise<void> => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    if (!mergedData) return;

    const sectionData = mergedData[section] as SectionData;

    try {
      if (section === "faqs" && hasItemsProperty(sectionData)) {
        const item = sectionData.items[index] as ItemWithId;
        if (item?.id) {
          await deleteFAQ(item.id);
          return;
        }
      }

      if (section === "testimonials" && hasItemsProperty(sectionData)) {
        const item = sectionData.items[index] as ItemWithId;
        if (item?.id) {
          await deleteTestimonial(item.id);
          return;
        }
      }

      const updatedData = deleteItemFromSection(sectionData, index);
      await updateSection({ section, data: updatedData });
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const handleInputChange = (field: string, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedInputChange = (
    parentField: string,
    childField: string,
    value: string,
  ): void => {
    setFormData((prev) => ({
      ...prev,
      [parentField]: {
        ...(prev[parentField] as Record<string, unknown>),
        [childField]: value,
      },
    }));
  };

  const handleArrayInputChange = (
    field: string,
    index: number,
    value: string,
  ): void => {
    setFormData((prev) => {
      const currentArray = prev[field];
      const newArray = Array.isArray(currentArray) ? [...currentArray] : [];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayItem = (field: string): void => {
    setFormData((prev) => {
      const currentArray = prev[field];
      const newArray = Array.isArray(currentArray) ? [...currentArray] : [];
      return { ...prev, [field]: [...newArray, ""] };
    });
  };

  const removeArrayItem = (field: string, index: number): void => {
    setFormData((prev) => {
      const currentArray = prev[field];
      if (!Array.isArray(currentArray)) return prev;

      const newArray = [...currentArray];
      newArray.splice(index, 1);
      return { ...prev, [field]: newArray };
    });
  };

  const renderFormField = (
    key: string,
    value: unknown,
  ): React.ReactNode | null => {
    if (
      key === "step" ||
      key === "items" ||
      key === "id" ||
      key === "is_active"
    )
      return null;

    if (Array.isArray(value)) {
      return (
        <div key={key} className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-700 capitalize">
            {key}
          </label>
          <div className="space-y-2">
            {value.map((item: string, idx: number) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) =>
                    handleArrayInputChange(key, idx, e.target.value)
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder={`${key} ${idx + 1}`}
                />
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeArrayItem(key, idx)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => addArrayItem(key)}
            >
              + Add {key}
            </Button>
          </div>
        </div>
      );
    }

    if (typeof value === "object" && value !== null) {
      return (
        <div
          key={key}
          className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
        >
          <label className="block text-sm font-medium mb-3 text-gray-800 capitalize">
            {key}
          </label>
          <div className="space-y-3">
            {Object.entries(value as Record<string, unknown>).map(
              ([subKey, subValue]) => (
                <div key={subKey}>
                  <label className="block text-xs font-medium mb-1 text-gray-600 capitalize">
                    {subKey}
                  </label>
                  <input
                    type="text"
                    value={String(subValue)}
                    onChange={(e) =>
                      handleNestedInputChange(key, subKey, e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>
              ),
            )}
          </div>
        </div>
      );
    }

    const isTextArea = shouldUseTextarea(key);
    const stringValue = String(value ?? "");

    return (
      <div key={key} className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-700 capitalize">
          {key}
        </label>
        {isTextArea ? (
          <textarea
            value={stringValue}
            onChange={(e) => handleInputChange(key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
            rows={4}
            placeholder={`Enter ${key}...`}
          />
        ) : (
          <input
            type="text"
            value={stringValue}
            onChange={(e) => handleInputChange(key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder={`Enter ${key}...`}
          />
        )}
      </div>
    );
  };

  const renderItemsSection = (
    sectionName: string,
    sectionData: SectionData,
  ): React.ReactNode => {
    if (!hasItemsProperty(sectionData)) return null;

    const items = sectionData.items || [];

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 capitalize">
              {sectionName}
            </h2>
            {sectionData.title && (
              <p className="text-sm text-gray-600 mt-1">{sectionData.title}</p>
            )}
            {sectionData.subtitle && (
              <p className="text-xs text-gray-500">{sectionData.subtitle}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleEdit(sectionName)}
            >
              <Edit2 size={14} className="mr-1" /> Edit Header
            </Button>
            <Button size="sm" onClick={() => handleAdd(sectionName)}>
              <Plus size={16} className="mr-1" /> Add Item
            </Button>
          </div>
        </div>

        <div className="p-6">
          {items.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>No items yet. Click "Add Item" to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item: SectionItem, index: number) => (
                <div
                  key={index}
                  className="group border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-1">
                      {Object.entries(item)
                        .filter(([key]) => key !== "id" && key !== "is_active")
                        .map(([key, value]) => (
                          <div key={key} className="text-sm">
                            <span className="font-medium text-gray-700 capitalize">
                              {key}:{" "}
                            </span>
                            <span className="text-gray-600">
                              {formatValueForDisplay(value)}
                            </span>
                          </div>
                        ))}
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(sectionName, index)}
                      >
                        <Edit2 size={14} />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(sectionName, index)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderArraySection = (
    sectionName: string,
    sectionData: SectionData,
  ): React.ReactNode => {
    if (!isArraySection(sectionData)) return null;

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 capitalize">
            {sectionName}
          </h2>
          <Button size="sm" onClick={() => handleAdd(sectionName)}>
            <Plus size={16} className="mr-1" /> Add New
          </Button>
        </div>

        <div className="p-6">
          {sectionData.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>No items yet. Click "Add New" to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sectionData.map((item: SectionItem, index: number) => (
                <div
                  key={index}
                  className="group border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-1">
                      {Object.entries(item).map(([key, value]) => (
                        <div key={key} className="text-sm">
                          <span className="font-medium text-gray-700 capitalize">
                            {key}:{" "}
                          </span>
                          <span className="text-gray-600">
                            {formatValueForDisplay(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(sectionName, index)}
                      >
                        <Edit2 size={14} />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(sectionName, index)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderObjectSection = (
    sectionName: string,
    sectionData: SectionData,
  ): React.ReactNode => {
    if (typeof sectionData !== "object" || sectionData === null) return null;

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 capitalize">
            {sectionName}
          </h2>
          <Button size="sm" onClick={() => handleEdit(sectionName)}>
            <Edit2 size={16} className="mr-1" /> Edit
          </Button>
        </div>

        <div className="p-6">
          <div className="space-y-3">
            {Object.entries(sectionData)
              .filter(([key]) => !shouldExcludeField(key) && key !== "items")
              .map(([key, value]) => {
                if (
                  typeof value === "object" &&
                  value !== null &&
                  !Array.isArray(value)
                ) {
                  return (
                    <div
                      key={key}
                      className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                    >
                      <h4 className="font-medium text-gray-700 mb-2 capitalize">
                        {key}
                      </h4>
                      <div className="space-y-1 pl-3">
                        {Object.entries(value as Record<string, unknown>).map(
                          ([subKey, subValue]) => (
                            <div
                              key={subKey}
                              className="flex items-center gap-2 text-sm"
                            >
                              <span className="font-medium text-gray-600 capitalize">
                                {subKey}:
                              </span>
                              <span className="text-gray-800">
                                {formatValueForDisplay(subValue)}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  );
                }

                if (Array.isArray(value)) {
                  return (
                    <div
                      key={key}
                      className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                    >
                      <h4 className="font-medium text-gray-700 mb-2 capitalize">
                        {key}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {value.map((item: unknown, idx: number) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm text-gray-700"
                          >
                            {formatValueForDisplay(item)}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={key}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {key}
                      </span>
                      <p className="text-gray-800 mt-0.5">
                        {formatValueForDisplay(value)}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  };

  const isLoading = loading || faqsLoading || testimonialsLoading;

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-600">Loading landing page data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!mergedData) {
    return (
      <AdminLayout>
        <div className="p-6 text-center text-gray-500">No data available</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Landing Page Editor
            </h1>
            <p className="text-gray-600">
              Manage all your landing page content in one place
            </p>
          </div>

          <Modal
            isOpen={!!editingItem}
            onClose={() => {
              setEditingItem(null);
              setFormData({});
            }}
            title={`${editingItem?.isNew ? "Add" : "Edit"} ${capitalize(editingItem?.section || "")}`}
            size="lg"
          >
            <div className="space-y-1">
              {Object.entries(formData).map(([key, value]) =>
                renderFormField(key, value),
              )}
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => {
                  setEditingItem(null);
                  setFormData({});
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleSave} className="flex-1">
                <Save size={16} className="mr-2" /> Save Changes
              </Button>
            </div>
          </Modal>

          <div className="space-y-6">
            {Object.entries(mergedData)
              .filter(([key]) => !shouldExcludeField(key))
              .map(([key, value]) => {
                const sectionData = value as SectionData;

                if (hasItemsProperty(sectionData)) {
                  return (
                    <div key={key}>{renderItemsSection(key, sectionData)}</div>
                  );
                }
                if (isArraySection(sectionData)) {
                  return (
                    <div key={key}>{renderArraySection(key, sectionData)}</div>
                  );
                }
                return (
                  <div key={key}>{renderObjectSection(key, sectionData)}</div>
                );
              })}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default LandingPageEditor;
