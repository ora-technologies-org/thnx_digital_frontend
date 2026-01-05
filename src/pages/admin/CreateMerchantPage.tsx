// src/pages/admin/CreateMerchantPage.tsx

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import {
  User,
  Building,
  FileText,
  MapPin,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  CreditCard,
  Edit2,
  Gift,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { RootState, AppDispatch } from "@/app/store";
import {
  setField,
  clearErrors,
  resetForm,
  setError,
} from "@/features/admin/slices/MerchantCreateSlice";
import {
  useCreateMerchant,
  useUpdateMerchant,
} from "@/features/admin/hooks/useMerchantMutations";
import AdminLayout from "@/shared/components/layout/AdminLayout";
import { Button } from "@/shared/components/ui/Button";
import { Modal } from "@/shared/components/ui/Modal";

interface ValidationErrorItem {
  message?: string;
  field?: keyof CreateMerchantForm;
}
interface ValidationError {
  errors: Array<ValidationErrorItem | string>;
}
type FieldValue = string | number | boolean | File | null | undefined;

interface CreateMerchantForm {
  email: string;
  password: string;
  name: string;
  phone: string;
  businessName: string;
  businessRegistrationNumber: string;
  taxId: string;
  businessType: string;
  businessCategory: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  businessPhone: string;
  businessEmail: string;
  website: string;
  description: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  ifscCode: string;
  swiftCode: string;
  giftCardLimit?: number;
  registrationDocument?: File | string;
  taxDocument?: File | string;
  identityDocument?: File | string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
    merchant?: {
      id: string;
      businessName: string;
      businessEmail: string;
      [key: string]: unknown;
    };
  };
}

interface ValidationRule {
  required?: boolean;
  pattern?: RegExp;
  patternMessage?: string;
  type?: "email" | "url" | "tel";
  minLength?: number;
}

interface ResponseModalData {
  isOpen: boolean;
  type: "success" | "error" | "info";
  title: string;
  message: string;
  details?: {
    merchantId?: string;
    email?: string;
    name?: string;
    businessName?: string;
  };
  onConfirm?: () => void;
  confirmText?: string;
}

// Constants
const businessTypes = [
  "Sole Proprietorship",
  "Partnership",
  "Limited Liability Company (LLC)",
  "Corporation",
  "Cooperative",
  "Non-Profit Organization",
];

const businessCategories = [
  "Retail",
  "Food & Dining",
  "Entertainment",
  "Health & Beauty",
  "Services",
  "Education",
  "Technology",
  "Sports & Fitness",
  "Travel & Hospitality",
  "Other",
];

const validationRules: Record<keyof CreateMerchantForm, ValidationRule> = {
  email: { required: true, type: "email" },
  password: { required: true, minLength: 6 },
  name: { required: true, minLength: 2 },
  phone: {
    required: true,
    pattern: /^[+]?[1-9][\d]{0,15}$/,
    patternMessage: "Invalid phone number",
  },
  businessName: { required: true, minLength: 2 },
  businessRegistrationNumber: { required: true },
  taxId: { required: true },
  businessType: { required: true },
  businessCategory: { required: true },
  address: { required: true, minLength: 5 },
  city: { required: true },
  state: { required: true },
  zipCode: { required: true },
  country: { required: true },
  businessPhone: { required: true },
  businessEmail: { required: true, type: "email" },
  website: { required: false, type: "url" },
  description: { required: true, minLength: 10 },
  bankName: { required: true },
  accountNumber: { required: true },
  accountHolderName: { required: true },
  ifscCode: { required: true },
  swiftCode: { required: false },
  giftCardLimit: { required: false },
  registrationDocument: { required: true },
  taxDocument: { required: true },
  identityDocument: { required: true },
};

// Minimal Components
const FormSection = ({
  title,
  icon: Icon,
  children,
  className = "",
}: {
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`mb-8 ${className}`}>
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-blue-50 rounded-lg">
        <Icon className="w-5 h-5 text-blue-600" />
      </div>
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

const InputField: React.FC<{
  label: string;
  name: keyof CreateMerchantForm;
  type?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  value: string | number;
  onChange: (value: string) => void;
  onBlur?: () => void;
  touched?: boolean;
  min?: number;
}> = ({
  label,
  name,
  type = "text",
  placeholder,
  error,
  disabled = false,
  required = true,
  value,
  onChange,
  onBlur,
  touched,
  min,
}) => {
  const hasError = touched && error;
  const isValid = touched && !error && value;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
            disabled ? "bg-gray-50 cursor-not-allowed" : ""
          } ${
            hasError
              ? "border-red-500 bg-red-50"
              : isValid
                ? "border-green-500 bg-green-50"
                : "border-gray-300"
          }`}
        />
        {touched && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {hasError ? (
              <XCircle className="w-4 h-4 text-red-500" />
            ) : isValid ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : null}
          </div>
        )}
      </div>
      {hasError && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
};

const SelectField: React.FC<{
  label: string;
  name: keyof CreateMerchantForm;
  options: string[];
  error?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  touched?: boolean;
}> = ({
  label,
  name,
  options,
  error,
  required = true,
  value,
  onChange,
  onBlur,
  touched,
}) => {
  const hasError = touched && error;
  const isValid = touched && !error && value;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white ${
            hasError
              ? "border-red-500 bg-red-50"
              : isValid
                ? "border-green-500 bg-green-50"
                : "border-gray-300"
          }`}
        >
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {touched && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {hasError ? (
              <XCircle className="w-4 h-4 text-red-500" />
            ) : isValid ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : null}
          </div>
        )}
      </div>
      {hasError && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
};

const TextareaField: React.FC<{
  label: string;
  name: keyof CreateMerchantForm;
  placeholder?: string;
  error?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  touched?: boolean;
  rows?: number;
}> = ({
  label,
  name,
  placeholder,
  error,
  required = true,
  value,
  onChange,
  onBlur,
  touched,
  rows = 3,
}) => {
  const hasError = touched && error;
  const isValid = touched && !error && value;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <textarea
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          rows={rows}
          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none ${
            hasError
              ? "border-red-500 bg-red-50"
              : isValid
                ? "border-green-500 bg-green-50"
                : "border-gray-300"
          }`}
        />
        {touched && value && (
          <div className="absolute right-3 top-3">
            {hasError ? (
              <XCircle className="w-4 h-4 text-red-500" />
            ) : (
              <CheckCircle className="w-4 h-4 text-green-500" />
            )}
          </div>
        )}
      </div>
      {hasError && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
};

const FileField: React.FC<{
  label: string;
  name: keyof CreateMerchantForm;
  error?: string;
  required?: boolean;
  existingFileUrl?: string;
  onChange: (file: File) => void;
  onBlur?: () => void;
  touched?: boolean;
  hasFile: boolean;
}> = ({
  label,
  error,
  required = true,
  existingFileUrl,
  onChange,
  onBlur,
  touched,
  hasFile,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onChange(file);
  };

  const fileText = existingFileUrl
    ? "Document uploaded"
    : hasFile
      ? "File selected"
      : "No file chosen";
  const hasError = touched && error;
  const isValid = touched && !error && (hasFile || existingFileUrl);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            className={`flex-1 px-4 py-2.5 border rounded-lg transition-colors ${
              hasError
                ? "border-red-500 bg-red-50"
                : isValid
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-sm ${hasError ? "text-red-600" : "text-gray-600"}`}
              >
                {fileText}
              </span>
              <span className="text-sm text-blue-600 font-medium">Browse</span>
            </div>
          </div>
          <input
            type="file"
            onChange={handleFileChange}
            onBlur={onBlur}
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
          />
        </label>
        {touched && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {hasError ? (
              <XCircle className="w-4 h-4 text-red-500" />
            ) : isValid ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : null}
          </div>
        )}
      </div>
      {hasError && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
      <p className="mt-1 text-xs text-gray-500">PDF, JPG, PNG (Max 5MB)</p>
    </div>
  );
};

// Validation function
const validateField = (
  name: keyof CreateMerchantForm,
  value: FieldValue,
  rule: ValidationRule,
): string | null => {
  if (rule.required) {
    if (value === undefined || value === null || value === "") {
      return "This field is required";
    }

    if (name.includes("Document")) {
      if (!(value instanceof File)) {
        return "This document is required";
      }
    }
  }

  if (
    value &&
    rule.minLength &&
    typeof value === "string" &&
    value.length < rule.minLength
  ) {
    return `Minimum ${rule.minLength} characters required`;
  }

  if (value && rule.pattern && typeof value === "string") {
    if (!rule.pattern.test(value)) {
      return rule.patternMessage || "Invalid format";
    }
  }

  if (rule.type === "email" && typeof value === "string") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Please enter a valid email address";
    }
  }

  return null;
};

// Helper function to extract error messages
const extractErrorMessage = (
  error: unknown,
): { title: string; message: string; details?: Record<string, unknown> } => {
  console.log("Extracting error message:", error);

  const defaultError = {
    title: "Operation Failed",
    message: "An unexpected error occurred. Please try again.",
  };

  if (typeof error === "object" && error !== null) {
    // Type the error object properly
    const errorObj = error as Record<string, unknown>;

    // 1. Check for errors array in the error object (your API format)
    if (errorObj.errors && Array.isArray(errorObj.errors)) {
      console.log("Found errors array in error object:", errorObj.errors);

      // Create summary message for modal
      const validationError = errorObj as ValidationError;
      const errorMessages = validationError.errors.map((err) =>
        typeof err === "object" && "message" in err && err.message
          ? err.message
          : String(err),
      );

      const errorMessage = errorMessages.join("\n\n");

      return {
        title: "Validation Failed",
        message: errorMessage,
        details: { errors: validationError.errors },
      };
    }

    // 2. Check for Axios response data
    if (errorObj.response && typeof errorObj.response === "object") {
      const responseData = (errorObj.response as { data?: unknown }).data;
      if (responseData && typeof responseData === "object") {
        console.log("Found response data:", responseData);

        const responseObj = responseData as Record<string, unknown>;
        if (responseObj.errors && Array.isArray(responseObj.errors)) {
          console.log("Found errors array in response:", responseObj.errors);

          // Create summary message for modal
          const errorMessages = responseObj.errors.map((err: unknown) =>
            typeof err === "object" && (err as { message?: string }).message
              ? (err as { message: string }).message
              : String(err),
          );
          const errorMessage = errorMessages.join("\n\n");

          return {
            title: "Validation Failed",
            message: errorMessage,
            details: { errors: responseObj.errors },
          };
        }

        // Handle other error formats
        if (typeof responseObj.message === "string") {
          return {
            title: "Operation Failed",
            message: responseObj.message,
            details: responseData,
          };
        }
      }
    }

    // 3. Direct message
    if (typeof errorObj.message === "string") {
      return {
        title: "Error",
        message: errorObj.message,
      };
    }

    // Generic error
    if (error instanceof Error) {
      return {
        title: "Error",
        message: error.message,
      };
    }

    return defaultError;
  }

  return defaultError;
};

// Main Component
export const CreateMerchantPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const formData = useSelector((state: RootState) => state.merchant.formData);
  const errors = useSelector((state: RootState) => state.merchant.errors);

  const { mutate: createMerchant, isPending: isCreating } = useCreateMerchant();
  const { mutate: updateMerchant, isPending: isUpdating } = useUpdateMerchant();
  const isPending = isCreating || isUpdating;

  const [responseModal, setResponseModal] = useState<ResponseModalData>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
    confirmText: "OK",
  });

  const [touchedFields, setTouchedFields] = useState<
    Set<keyof CreateMerchantForm>
  >(new Set());

  // Calculate missing fields
  const missingFieldCount = useMemo(() => {
    let count = 0;

    Object.entries(validationRules).forEach(([field, rule]) => {
      const fieldName = field as keyof CreateMerchantForm;

      // Skip password validation in edit mode if not changed
      if (isEditMode && field === "password" && !formData.password) {
        return;
      }

      // Skip document validation in edit mode if they already exist
      if (
        isEditMode &&
        (field === "registrationDocument" ||
          field === "taxDocument" ||
          field === "identityDocument") &&
        (formData[fieldName] as string)
      ) {
        return;
      }

      if (rule.required) {
        const value = formData[fieldName];
        const hasValue = value !== undefined && value !== null && value !== "";

        if (field.includes("Document")) {
          const hasFile = value instanceof File || value;
          if (!hasFile) count++;
        } else if (!hasValue) {
          count++;
        }
      }
    });

    return count;
  }, [formData, isEditMode]);

  // Effects
  useEffect(() => {
    return () => {
      dispatch(resetForm());
    };
  }, [dispatch]);

  // Handlers
  const handleFieldBlur = useCallback(
    (fieldName: keyof CreateMerchantForm) => {
      setTouchedFields((prev) => new Set(prev).add(fieldName));

      // Clear error if user is trying to fix it
      if (errors[fieldName]) {
        const rule = validationRules[fieldName];
        const value = formData[fieldName];
        const error = validateField(fieldName, value, rule);

        if (!error) {
          // Clear just this field's error
          dispatch(setError({ field: fieldName, message: "" }));
        } else if (error !== errors[fieldName]) {
          // Update error if it's different
          dispatch(setError({ field: fieldName, message: error }));
        }
      } else {
        // Normal validation for fields without errors
        const rule = validationRules[fieldName];
        const value = formData[fieldName];
        const error = validateField(fieldName, value, rule);

        if (error) {
          dispatch(setError({ field: fieldName, message: error }));
        }
      }
    },
    [dispatch, formData, errors],
  );

  const scrollToMissingField = useCallback(() => {
    // Find all missing fields
    const missingFields: { field: string; element: HTMLElement | null }[] = [];

    Object.entries(validationRules).forEach(([field, rule]) => {
      if (rule.required) {
        const fieldName = field as keyof CreateMerchantForm;
        const value = formData[fieldName];
        const hasValue = value !== undefined && value !== null && value !== "";

        if (!hasValue) {
          const element = document.querySelector(`[name="${field}"]`);
          if (element) {
            missingFields.push({ field, element: element as HTMLElement });
          }
        }
      }
    });

    // Scroll to first missing field
    if (missingFields.length > 0) {
      missingFields[0].element?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      missingFields[0].element?.focus();

      // Highlight all missing fields
      missingFields.forEach(({ field }) => {
        const element = document.querySelector(`[name="${field}"]`);
        if (element) {
          element.classList.add("border-red-500", "bg-red-50");
          setTimeout(() => {
            element.classList.remove("border-red-500", "bg-red-50");
          }, 3000);
        }
      });
    }
  }, [formData]);

  const openResponseModal = (
    type: "success" | "error" | "info",
    title: string,
    message: string,
    onConfirm?: () => void,
    confirmText: string = "OK",
  ) => {
    setResponseModal({
      isOpen: true,
      type,
      title,
      message,
      onConfirm,
      confirmText,
    });
  };

  const closeResponseModal = () => {
    setResponseModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Mark all fields as touched
      const allFields = Object.keys(validationRules) as Array<
        keyof CreateMerchantForm
      >;
      setTouchedFields(new Set(allFields));

      // Validate all fields and collect errors
      const validationErrors: Record<string, string> = {};

      Object.entries(validationRules).forEach(([field, rule]) => {
        const fieldName = field as keyof CreateMerchantForm;

        if (isEditMode && field === "password" && !formData.password) {
          return;
        }

        if (
          isEditMode &&
          (field === "registrationDocument" ||
            field === "taxDocument" ||
            field === "identityDocument") &&
          (formData[fieldName] as string)
        ) {
          return;
        }

        const value = formData[fieldName];
        const error = validateField(fieldName, value, rule);

        if (error) {
          validationErrors[field] = error;
        }
      });

      // If there are validation errors, scroll to first one and show message
      if (Object.keys(validationErrors).length > 0) {
        // Set errors in Redux
        Object.entries(validationErrors).forEach(([field, error]) => {
          dispatch(
            setError({
              field: field as keyof CreateMerchantForm,
              message: error,
            }),
          );
        });

        // Scroll to first error
        setTimeout(() => {
          scrollToMissingField();
        }, 100);

        // Show modal with guidance
        openResponseModal(
          "info",
          "Complete Required Fields",
          `Please complete ${Object.keys(validationErrors).length} required field${Object.keys(validationErrors).length > 1 ? "s" : ""} before submitting.`,
        );
        return;
      }

      // Clear any previous errors
      dispatch(clearErrors());

      // Submit form
      if (isEditMode) {
        updateMerchant(
          { merchantId: id!, formData },
          {
            onSuccess: (response: ApiResponse) => {
              openResponseModal("success", "Success", response.message, () => {
                dispatch(resetForm());
                navigate("/admin/merchants");
              });
            },
            // In your handleSubmit function, update the error handler with detailed logging:
            onError: (error: unknown) => {
              const errorDetails = extractErrorMessage(error);

              // Show modal with summary
              openResponseModal(
                "error",
                errorDetails.title,
                errorDetails.message,
              );

              // Scroll to first error field
              if (
                errorDetails.details?.errors &&
                Array.isArray(errorDetails.details.errors)
              ) {
                const firstError = errorDetails.details.errors[0];
                if (
                  firstError &&
                  typeof firstError === "object" &&
                  "field" in firstError &&
                  firstError.field
                ) {
                  setTimeout(() => {
                    const element = document.querySelector(
                      `[name="${firstError.field}"]`,
                    );
                    if (element) {
                      element.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                      (element as HTMLElement).focus();

                      // Highlight the field
                      element.classList.add("border-red-500", "bg-red-50");
                      setTimeout(() => {
                        element.classList.remove("border-red-500", "bg-red-50");
                      }, 2000);
                    }
                  }, 100);
                }
              }
            },
          },
        );
      } else {
        createMerchant(formData, {
          onSuccess: (response: ApiResponse) => {
            openResponseModal("success", "Success", response.message, () => {
              dispatch(resetForm());
              navigate("/admin/merchants");
            });
          },
          onError: (error: unknown) => {
            const errorDetails = extractErrorMessage(error);
            openResponseModal(
              "error",
              errorDetails.title,
              errorDetails.message,
            );

            // Scroll to first error field if available
            if (
              errorDetails.details?.errors &&
              Array.isArray(errorDetails.details.errors)
            ) {
              const firstError = errorDetails.details.errors[0];
              if (
                firstError &&
                typeof firstError === "object" &&
                "field" in firstError &&
                firstError.field
              ) {
                setTimeout(() => {
                  const element = document.querySelector(
                    `[name="${firstError.field}"]`,
                  );
                  if (element) {
                    element.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                    (element as HTMLElement).focus();
                  }
                }, 100);
              }
            }
          },
        });
      }
    },
    [
      isEditMode,
      formData,
      dispatch,
      scrollToMissingField,
      updateMerchant,
      id,
      navigate,
      createMerchant,
    ],
  );

  const handleBack = useCallback(() => {
    const hasUnsavedChanges = Object.keys(formData).some(
      (key) => formData[key as keyof CreateMerchantForm],
    );

    if (hasUnsavedChanges) {
      openResponseModal(
        "info",
        "Unsaved Changes",
        "You have unsaved changes. Are you sure you want to leave?",
        () => {
          dispatch(resetForm());
          navigate("/admin/merchants");
        },
        "Leave",
      );
    } else {
      navigate("/admin/merchants");
    }
  }, [formData, dispatch, navigate]);

  // Helper functions for form fields
  const handleInputChange = useCallback(
    (field: keyof CreateMerchantForm, value: string) => {
      dispatch(setField({ field, value }));
    },
    [dispatch],
  );

  const handleFileChange = useCallback(
    (field: keyof CreateMerchantForm, file: File) => {
      dispatch(setField({ field, value: file }));
    },
    [dispatch],
  );

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="p-6 max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Merchants
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div
                className={`p-2 rounded-lg ${isEditMode ? "bg-green-100" : "bg-blue-100"}`}
              >
                {isEditMode ? (
                  <Edit2 className="w-6 h-6 text-green-600" />
                ) : (
                  <Sparkles className="w-6 h-6 text-blue-600" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isEditMode ? "Edit Merchant" : "Create New Merchant"}
                </h1>
                <p className="text-gray-600">
                  {isEditMode
                    ? "Update merchant details"
                    : "Register a new merchant"}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <FormSection title="Personal Information" icon={User}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={(value) => handleInputChange("name", value)}
                    onBlur={() => handleFieldBlur("name")}
                    placeholder="John Doe"
                    error={errors.name}
                    touched={touchedFields.has("name")}
                    disabled={isEditMode}
                  />

                  <InputField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={(value) => handleInputChange("email", value)}
                    onBlur={() => handleFieldBlur("email")}
                    placeholder="john@example.com"
                    error={errors.email}
                    touched={touchedFields.has("email")}
                    disabled={isEditMode}
                  />

                  {!isEditMode && (
                    <InputField
                      label="Password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={(value) => handleInputChange("password", value)}
                      onBlur={() => handleFieldBlur("password")}
                      placeholder="••••••••"
                      error={errors.password}
                      touched={touchedFields.has("password")}
                    />
                  )}

                  <InputField
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(value) => handleInputChange("phone", value)}
                    onBlur={() => handleFieldBlur("phone")}
                    placeholder="+1234567890"
                    error={errors.phone}
                    touched={touchedFields.has("phone")}
                    disabled={isEditMode}
                  />
                </div>
              </FormSection>

              {/* Gift Card Limit (Edit only) */}
              {isEditMode && (
                <FormSection title="Gift Card Settings" icon={Gift}>
                  <div className="max-w-xs">
                    <InputField
                      label="Gift Card Limit"
                      name="giftCardLimit"
                      type="number"
                      value={formData.giftCardLimit || ""}
                      onChange={(value) =>
                        handleInputChange("giftCardLimit", value)
                      }
                      onBlur={() => handleFieldBlur("giftCardLimit")}
                      placeholder="Enter limit"
                      error={errors.giftCardLimit}
                      touched={touchedFields.has("giftCardLimit")}
                      required={false}
                      min={0}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Set maximum gift cards merchant can issue. Leave empty for
                    no limit.
                  </p>
                </FormSection>
              )}

              {/* Documents */}
              <FormSection title="Business Documents" icon={FileText}>
                <div className="space-y-4">
                  <FileField
                    label="Registration Document"
                    name="registrationDocument"
                    onChange={(file) =>
                      handleFileChange("registrationDocument", file)
                    }
                    onBlur={() => handleFieldBlur("registrationDocument")}
                    required={!isEditMode}
                    error={errors.registrationDocument}
                    touched={touchedFields.has("registrationDocument")}
                    hasFile={
                      !!(
                        formData.registrationDocument instanceof File ||
                        formData.registrationDocument
                      )
                    }
                    existingFileUrl={
                      isEditMode
                        ? (formData.registrationDocument as string)
                        : undefined
                    }
                  />

                  <FileField
                    label="Tax Document"
                    name="taxDocument"
                    onChange={(file) => handleFileChange("taxDocument", file)}
                    onBlur={() => handleFieldBlur("taxDocument")}
                    required={!isEditMode}
                    error={errors.taxDocument}
                    touched={touchedFields.has("taxDocument")}
                    hasFile={
                      !!(
                        formData.taxDocument instanceof File ||
                        formData.taxDocument
                      )
                    }
                    existingFileUrl={
                      isEditMode ? (formData.taxDocument as string) : undefined
                    }
                  />

                  <FileField
                    label="Identity Document"
                    name="identityDocument"
                    onChange={(file) =>
                      handleFileChange("identityDocument", file)
                    }
                    onBlur={() => handleFieldBlur("identityDocument")}
                    required={!isEditMode}
                    error={errors.identityDocument}
                    touched={touchedFields.has("identityDocument")}
                    hasFile={
                      !!(
                        formData.identityDocument instanceof File ||
                        formData.identityDocument
                      )
                    }
                    existingFileUrl={
                      isEditMode
                        ? (formData.identityDocument as string)
                        : undefined
                    }
                  />
                </div>
              </FormSection>

              {/* Business Information */}
              <FormSection title="Business Information" icon={Building}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Business Name"
                    name="businessName"
                    value={formData.businessName}
                    onChange={(value) =>
                      handleInputChange("businessName", value)
                    }
                    onBlur={() => handleFieldBlur("businessName")}
                    placeholder="ABC Company"
                    error={errors.businessName}
                    touched={touchedFields.has("businessName")}
                  />

                  <InputField
                    label="Business Registration Number"
                    name="businessRegistrationNumber"
                    value={formData.businessRegistrationNumber}
                    onChange={(value) =>
                      handleInputChange("businessRegistrationNumber", value)
                    }
                    onBlur={() => handleFieldBlur("businessRegistrationNumber")}
                    placeholder="REG123456"
                    error={errors.businessRegistrationNumber}
                    touched={touchedFields.has("businessRegistrationNumber")}
                  />

                  <InputField
                    label="Tax ID"
                    name="taxId"
                    value={formData.taxId}
                    onChange={(value) => handleInputChange("taxId", value)}
                    onBlur={() => handleFieldBlur("taxId")}
                    placeholder="TAX123456"
                    error={errors.taxId}
                    touched={touchedFields.has("taxId")}
                  />

                  <SelectField
                    label="Business Type"
                    name="businessType"
                    value={formData.businessType}
                    onChange={(value) =>
                      handleInputChange("businessType", value)
                    }
                    onBlur={() => handleFieldBlur("businessType")}
                    options={businessTypes}
                    error={errors.businessType}
                    touched={touchedFields.has("businessType")}
                  />

                  <SelectField
                    label="Business Category"
                    name="businessCategory"
                    value={formData.businessCategory}
                    onChange={(value) =>
                      handleInputChange("businessCategory", value)
                    }
                    onBlur={() => handleFieldBlur("businessCategory")}
                    options={businessCategories}
                    error={errors.businessCategory}
                    touched={touchedFields.has("businessCategory")}
                  />

                  <InputField
                    label="Business Phone"
                    name="businessPhone"
                    type="tel"
                    value={formData.businessPhone}
                    onChange={(value) =>
                      handleInputChange("businessPhone", value)
                    }
                    onBlur={() => handleFieldBlur("businessPhone")}
                    placeholder="+1234567890"
                    error={errors.businessPhone}
                    touched={touchedFields.has("businessPhone")}
                  />

                  <InputField
                    label="Business Email"
                    name="businessEmail"
                    type="email"
                    value={formData.businessEmail}
                    onChange={(value) =>
                      handleInputChange("businessEmail", value)
                    }
                    onBlur={() => handleFieldBlur("businessEmail")}
                    placeholder="info@business.com"
                    error={errors.businessEmail}
                    touched={touchedFields.has("businessEmail")}
                  />

                  <InputField
                    label="Website"
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={(value) => handleInputChange("website", value)}
                    onBlur={() => handleFieldBlur("website")}
                    placeholder="https://www.business.com"
                    error={errors.website}
                    touched={touchedFields.has("website")}
                    required={false}
                  />
                </div>

                <TextareaField
                  label="Business Description"
                  name="description"
                  value={formData.description}
                  onChange={(value) => handleInputChange("description", value)}
                  onBlur={() => handleFieldBlur("description")}
                  placeholder="Describe your business..."
                  error={errors.description}
                  touched={touchedFields.has("description")}
                  rows={4}
                />
              </FormSection>

              {/* Banking Information */}
              <FormSection title="Banking Information" icon={CreditCard}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Bank Name"
                    name="bankName"
                    value={formData.bankName}
                    onChange={(value) => handleInputChange("bankName", value)}
                    onBlur={() => handleFieldBlur("bankName")}
                    placeholder="Bank of America"
                    error={errors.bankName}
                    touched={touchedFields.has("bankName")}
                  />

                  <InputField
                    label="Account Holder Name"
                    name="accountHolderName"
                    value={formData.accountHolderName}
                    onChange={(value) =>
                      handleInputChange("accountHolderName", value)
                    }
                    onBlur={() => handleFieldBlur("accountHolderName")}
                    placeholder="John Doe"
                    error={errors.accountHolderName}
                    touched={touchedFields.has("accountHolderName")}
                  />

                  <InputField
                    label="Account Number"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={(value) =>
                      handleInputChange("accountNumber", value)
                    }
                    onBlur={() => handleFieldBlur("accountNumber")}
                    placeholder="1234567890"
                    error={errors.accountNumber}
                    touched={touchedFields.has("accountNumber")}
                  />

                  <InputField
                    label="IFSC Code"
                    name="ifscCode"
                    value={formData.ifscCode}
                    onChange={(value) => handleInputChange("ifscCode", value)}
                    onBlur={() => handleFieldBlur("ifscCode")}
                    placeholder="SBIN0001234"
                    error={errors.ifscCode}
                    touched={touchedFields.has("ifscCode")}
                  />

                  <InputField
                    label="SWIFT Code"
                    name="swiftCode"
                    value={formData.swiftCode}
                    onChange={(value) => handleInputChange("swiftCode", value)}
                    onBlur={() => handleFieldBlur("swiftCode")}
                    placeholder="SBININBB123"
                    error={errors.swiftCode}
                    touched={touchedFields.has("swiftCode")}
                    required={false}
                  />
                </div>
              </FormSection>

              {/* Location Information */}
              <FormSection title="Location Information" icon={MapPin}>
                <div className="space-y-4">
                  <InputField
                    label="Street Address"
                    name="address"
                    value={formData.address}
                    onChange={(value) => handleInputChange("address", value)}
                    onBlur={() => handleFieldBlur("address")}
                    placeholder="123 Main Street"
                    error={errors.address}
                    touched={touchedFields.has("address")}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={(value) => handleInputChange("city", value)}
                      onBlur={() => handleFieldBlur("city")}
                      placeholder="New York"
                      error={errors.city}
                      touched={touchedFields.has("city")}
                    />

                    <InputField
                      label="State/Province"
                      name="state"
                      value={formData.state}
                      onChange={(value) => handleInputChange("state", value)}
                      onBlur={() => handleFieldBlur("state")}
                      placeholder="NY"
                      error={errors.state}
                      touched={touchedFields.has("state")}
                    />

                    <InputField
                      label="ZIP/Postal Code"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={(value) => handleInputChange("zipCode", value)}
                      onBlur={() => handleFieldBlur("zipCode")}
                      placeholder="10001"
                      error={errors.zipCode}
                      touched={touchedFields.has("zipCode")}
                    />

                    <InputField
                      label="Country"
                      name="country"
                      value={formData.country}
                      onChange={(value) => handleInputChange("country", value)}
                      onBlur={() => handleFieldBlur("country")}
                      placeholder="USA"
                      error={errors.country}
                      touched={touchedFields.has("country")}
                    />
                  </div>
                </div>
              </FormSection>

              {/* Submit Section */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {missingFieldCount > 0 ? (
                      <span className="text-amber-600 font-medium">
                        {missingFieldCount} incomplete field
                        {missingFieldCount > 1 ? "s" : ""}
                      </span>
                    ) : (
                      <span className="text-green-600 font-medium">
                        All fields are complete
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      disabled={isPending}
                    >
                      Cancel
                    </Button>

                    <Button
                      type="submit"
                      variant={isEditMode ? "gradient" : "gradient"}
                      isLoading={isPending}
                    >
                      {isEditMode ? "Update Merchant" : "Create Merchant"}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </motion.div>

          {/* Information Card */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-900 mb-1">
                  Important Notes
                </h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  {isEditMode ? (
                    <>
                      <li>
                        • Personal information cannot be changed in edit mode
                      </li>
                      <li>• Documents are optional if already uploaded</li>
                      <li>• Gift card limit can be set or left empty</li>
                    </>
                  ) : (
                    <>
                      <li>• All fields marked with * are required</li>
                      <li>• All documents are required for new merchants</li>
                      <li>
                        • Merchant will receive login credentials via email
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Response Modal */}
      <Modal
        isOpen={responseModal.isOpen}
        onClose={closeResponseModal}
        title={responseModal.title}
        type={responseModal.type}
        showActions={true}
        onConfirm={() => {
          responseModal.onConfirm?.();
          closeResponseModal();
        }}
        confirmText={responseModal.confirmText || "OK"}
        size="md"
      >
        <div className="text-center py-4">
          <p className="text-gray-700 whitespace-pre-line">
            {responseModal.message}
          </p>
        </div>
      </Modal>
    </AdminLayout>
  );
};
export default CreateMerchantPage;
