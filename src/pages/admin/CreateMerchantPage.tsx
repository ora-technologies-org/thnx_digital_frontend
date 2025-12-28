// src/pages/admin/CreateMerchantPage.tsx - FIXED VERSION 🔧
// Fixed: TypeScript any types, improved error handling, added comments

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Phone,
  Building,
  FileText,
  MapPin,
  Globe,
  Tag,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  CreditCard,
  Edit2,
  Gift,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { RootState, AppDispatch } from "@/app/store";
import {
  setField,
  clearErrors,
  resetForm,
} from "@/features/admin/slices/MerchantCreateSlice";
import {
  useCreateMerchant,
  useUpdateMerchant,
} from "@/features/admin/hooks/useMerchantMutations";
import AdminLayout from "@/shared/components/layout/AdminLayout";

// Import the components
import { Button } from "@/shared/components/ui/Button";
import { Modal } from "@/shared/components/ui/Modal";

// Define proper API error response interface
interface ApiErrorResponse {
  message?: string;
  errors?: Record<string, string | string[]> | string;
  [key: string]: unknown;
}

// Merchant form data interface
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
  additionalDocuments?: File[] | string[];
}

// API Response Interface
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

// Business type options
const businessTypes = [
  "Sole Proprietorship",
  "Partnership",
  "Limited Liability Company (LLC)",
  "Corporation",
  "Cooperative",
  "Non-Profit Organization",
];

// Business category options
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

// Reusable Card component for layout
const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`bg-white rounded-2xl shadow-lg ${className}`}>
    {children}
  </div>
);

// Reusable InputField component
interface InputFieldProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  name: keyof CreateMerchantForm;
  type?: string;
  required?: boolean;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  min?: number;
  step?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  icon: Icon,
  label,
  name,
  type = "text",
  required = true,
  placeholder,
  error,
  disabled = false,
  min,
  step,
}) => {
  const dispatch = useDispatch();
  const value = useSelector(
    (state: RootState) => state.merchant.formData[name],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = type === "number" ? Number(e.target.value) : e.target.value;
    dispatch(setField({ field: name, value: val }));
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <Icon className="w-5 h-5" />
        </div>
        <input
          type={type}
          name={name}
          value={value as string | number}
          onChange={handleChange}
          required={required}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          step={step}
          className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 transition-all outline-none ${
            disabled ? "bg-gray-100 cursor-not-allowed" : ""
          } ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-100"
              : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
          }`}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
};

// File Upload Field Component
interface FileFieldProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  name: keyof CreateMerchantForm;
  required?: boolean;
  error?: string;
  accept?: string;
  existingFileUrl?: string;
}

const FileField: React.FC<FileFieldProps> = ({
  icon: Icon,
  label,
  name,
  required = false,
  error,
  accept = ".pdf,.jpg,.jpeg,.png",
  existingFileUrl,
}) => {
  const dispatch = useDispatch();
  const value = useSelector(
    (state: RootState) => state.merchant.formData[name],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      dispatch(
        setField({
          field: name,
          value: file,
        }),
      );
    }
  };

  const getFileName = () => {
    if (value instanceof File) {
      return value.name;
    } else if (typeof value === "string" && value) {
      return "Existing file";
    } else if (existingFileUrl) {
      return "Current file uploaded";
    }
    return "No file chosen";
  };

  const hasFile = value instanceof File || existingFileUrl;

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <div className="flex items-center gap-3">
          <label className="flex-1 cursor-pointer">
            <div
              className={`flex items-center gap-3 px-4 py-3 border-2 rounded-xl transition-all ${
                error
                  ? "border-red-500 hover:border-red-600"
                  : "border-gray-200 hover:border-blue-500"
              }`}
            >
              <Icon className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600 flex-1 truncate">
                {getFileName()}
              </span>
              <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                Browse
              </span>
            </div>
            <input
              type="file"
              onChange={handleFileChange}
              accept={accept}
              required={required && !hasFile}
              className="hidden"
            />
          </label>
          {existingFileUrl && (
            <a
              href={existingFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
              title="View current file"
            >
              <FileText className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
      <p className="mt-1 text-xs text-gray-500">
        Accepted formats: PDF, JPG, PNG (Max 5MB)
      </p>
    </div>
  );
};

// Reusable SelectField component for dropdowns
interface SelectFieldProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  name: keyof CreateMerchantForm;
  required?: boolean;
  options: string[];
  error?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  icon: Icon,
  label,
  name,
  required = true,
  options,
  error,
}) => {
  const dispatch = useDispatch();
  const value = useSelector(
    (state: RootState) => state.merchant.formData[name],
  );

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setField({ field: name, value: e.target.value }));
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <Icon className="w-5 h-5" />
        </div>
        <select
          name={name}
          value={value}
          onChange={handleChange}
          required={required}
          className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 transition-all outline-none appearance-none bg-white ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-100"
              : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
          }`}
        >
          <option value="">Select {label}</option>
          {options.map((option: string) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
};

// Modal Response Interface
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
    [key: string]: unknown;
  };
  onConfirm?: () => void;
  confirmText?: string;
}

// Main CreateMerchantPage component
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

  // State for response modal
  const [responseModal, setResponseModal] = useState<ResponseModalData>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
    confirmText: "OK",
  });

  // Log to verify edit mode detection
  useEffect(() => {
    if (isEditMode) {
      console.log("Edit Mode Activated for Merchant ID:", id);
      console.log("Form Data:", formData);
    } else {
      console.log("Create Mode - New Merchant");
    }
  }, [isEditMode, id, formData]);

  // Clean up form on component unmount
  useEffect(() => {
    return () => {
      dispatch(resetForm());
    };
  }, [dispatch]);

  /**
   * Formats the API response message for display in the modal
   * @param response - The API response object
   * @returns Formatted message string
   */
  const formatResponseMessage = (response: ApiResponse): string => {
    const message = response.message;

    return message;
  };

  /**
   * Extracts error message from API error response
   * @param error - The error object from API call
   * @returns Object containing title, message, and details
   */
  const extractErrorMessage = (
    error: unknown,
  ): { title: string; message: string; details?: Record<string, unknown> } => {
    const defaultError = {
      title: "Operation Failed",
      message: "An unexpected error occurred. Please try again.",
    };

    // Check if error has response data (Axios error)
    if (typeof error === "object" && error !== null) {
      const apiError = error as { response?: { data?: ApiErrorResponse } };

      if (apiError.response?.data) {
        const errorData = apiError.response.data;
        let errorMessage = errorData.message || defaultError.message;
        const errorDetails: Record<string, unknown> = {};

        // Handle validation errors
        if (errorData.errors) {
          if (typeof errorData.errors === "object") {
            // Format object validation errors
            const formattedErrors = Object.entries(errorData.errors)
              .map(([field, messages]) => {
                if (Array.isArray(messages)) {
                  return `${field}: ${messages.join(", ")}`;
                }
                return `${field}: ${messages}`;
              })
              .join("\n");
            errorMessage += `\n\nValidation Errors:\n${formattedErrors}`;
            errorDetails.validationErrors = errorData.errors;
          } else if (typeof errorData.errors === "string") {
            errorMessage += `\n\n${errorData.errors}`;
          }
        }

        return {
          title: "Operation Failed",
          message: errorMessage,
          details:
            Object.keys(errorDetails).length > 0 ? errorDetails : undefined,
        };
      }

      // Handle non-Axios errors
      if (error instanceof Error) {
        return {
          title: "Error",
          message: error.message || defaultError.message,
        };
      }
    }

    return defaultError;
  };

  /**
   * Opens the response modal with dynamic data
   * @param type - Modal type (success, error, info)
   * @param title - Modal title
   * @param message - Modal message
   * @param details - Additional details to display
   * @param onConfirm - Callback function when confirm is clicked
   * @param confirmText - Text for confirm button (default: "OK")
   */
  const openResponseModal = (
    type: "success" | "error" | "info",
    title: string,
    message: string,
    details?: ResponseModalData["details"],
    onConfirm?: () => void,
    confirmText: string = "OK",
  ) => {
    setResponseModal({
      isOpen: true,
      type,
      title,
      message,
      details,
      onConfirm,
      confirmText,
    });
  };

  // Close response modal
  const closeResponseModal = () => {
    setResponseModal((prev) => ({ ...prev, isOpen: false }));
  };

  /**
   * Handles form submission
   * @param e - Form event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearErrors());

    // Client-side validation
    const validationErrors: Record<string, string> = {};

    if (!formData.email.includes("@")) {
      validationErrors.email = "Invalid email address";
    }

    // Password is only required for create, not edit
    if (!isEditMode && formData.password.length < 8) {
      validationErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.businessName.trim()) {
      validationErrors.businessName = "Business name is required";
    }

    // Validate giftCardLimit in edit mode
    if (isEditMode && formData.giftCardLimit !== undefined) {
      if (formData.giftCardLimit < 0) {
        validationErrors.giftCardLimit = "Gift card limit cannot be negative";
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      const errorMessages = Object.values(validationErrors).join("\n");
      openResponseModal(
        "error",
        "Validation Error",
        `Please fix the following errors:\n\n${errorMessages}`,
      );
      return;
    }

    // Call appropriate mutation based on mode
    if (isEditMode) {
      updateMerchant(
        { merchantId: id!, formData },
        {
          onSuccess: (response: ApiResponse) => {
            openResponseModal(
              "success",
              "Merchant Updated Successfully",
              formatResponseMessage(response),
              {
                merchantId: response.data?.user?.id,
                email: response.data?.user?.email,
                name: response.data?.user?.name,
              },
              () => {
                dispatch(resetForm());
                navigate("/admin/merchants");
              },
            );
          },
          onError: (error: unknown) => {
            const { title, message, details } = extractErrorMessage(error);
            openResponseModal("error", title, message, details);
          },
        },
      );
    } else {
      createMerchant(formData, {
        onSuccess: (response: ApiResponse) => {
          openResponseModal(
            "success",
            "Merchant Created Successfully",
            formatResponseMessage(response),
            {
              merchantId: response.data?.user?.id,
              email: response.data?.user?.email,
              name: response.data?.user?.name,
              businessName: formData.businessName,
            },
            () => {
              dispatch(resetForm());
              navigate("/admin/merchants");
            },
          );
        },
        onError: (error: unknown) => {
          const { title, message, details } = extractErrorMessage(error);
          openResponseModal("error", title, message, details);
        },
      });
    }
  };

  // Navigate back to merchants list
  const handleBack = () => {
    // Check if there are unsaved changes
    const hasUnsavedChanges = Object.keys(formData).some(
      (key) => formData[key as keyof CreateMerchantForm],
    );

    if (hasUnsavedChanges) {
      openResponseModal(
        "info",
        "Unsaved Changes",
        "You have unsaved changes. Are you sure you want to leave?",
        undefined,
        () => {
          dispatch(resetForm());
          navigate("/admin/merchants");
        },
        "Leave",
      );
    } else {
      navigate("/admin/merchants");
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="p-8 max-w-5xl mx-auto">
          {/* Header section with back button and title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Button
              variant="ghost"
              onClick={handleBack}
              className="flex items-center gap-2 mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Merchants
            </Button>

            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 bg-gradient-to-br ${
                  isEditMode
                    ? "from-green-500 to-emerald-600"
                    : "from-blue-500 to-purple-600"
                } rounded-2xl flex items-center justify-center`}
              >
                {isEditMode ? (
                  <Edit2 className="w-6 h-6 text-white" />
                ) : (
                  <Sparkles className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {isEditMode ? "Edit Merchant" : "Create New Merchant"}
                </h1>
                <p className="text-gray-600">
                  {isEditMode
                    ? "Update merchant information"
                    : "Add a new merchant to your platform"}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Main form section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <form onSubmit={handleSubmit}>
              <Card className="p-8">
                {/* Personal Information section */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Personal Information
                  </h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Basic details about the merchant
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      icon={User}
                      label="Full Name"
                      name="name"
                      placeholder="John Doe"
                      error={errors.name}
                      disabled={isEditMode}
                    />
                    <InputField
                      icon={Mail}
                      label="Email Address"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      error={errors.email}
                      disabled={isEditMode}
                    />
                    <InputField
                      icon={Lock}
                      label="Password"
                      name="password"
                      type="password"
                      placeholder={
                        isEditMode ? "Cannot be changed" : "••••••••"
                      }
                      error={errors.password}
                      required={!isEditMode}
                      disabled={isEditMode}
                    />
                    <InputField
                      icon={Phone}
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      placeholder="+1234567890"
                      error={errors.phone}
                      disabled={isEditMode}
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 my-8" />

                {/* Gift Card Limit Section (Edit Mode Only) */}
                {isEditMode && (
                  <>
                    <div className="mb-8">
                      <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                        <Gift className="w-5 h-5 text-pink-600" />
                        Gift Card Settings
                      </h2>
                      <p className="text-sm text-gray-600 mb-6">
                        Configure gift card limitations for this merchant
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField
                          icon={Gift}
                          label="Gift Card Limit"
                          name="giftCardLimit"
                          type="number"
                          placeholder="Enter limit (e.g., 1000)"
                          error={errors.giftCardLimit}
                          required={false}
                          min={0}
                          step="0.01"
                        />
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        Set the maximum number of gift cards this merchant can
                        issue. Leave empty for no limit.
                      </p>
                    </div>

                    <div className="border-t border-gray-200 my-8" />
                  </>
                )}

                {/* Documents Section */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-cyan-600" />
                    Business Documents
                  </h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Upload required business verification documents
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FileField
                      icon={FileText}
                      label="Registration Document"
                      name="registrationDocument"
                      required={!isEditMode}
                      error={errors.registrationDocument}
                      existingFileUrl={
                        isEditMode
                          ? (formData.registrationDocument as string)
                          : undefined
                      }
                    />
                    <FileField
                      icon={FileText}
                      label="Tax Document"
                      name="taxDocument"
                      required={!isEditMode}
                      error={errors.taxDocument}
                      existingFileUrl={
                        isEditMode
                          ? (formData.taxDocument as string)
                          : undefined
                      }
                    />
                    <FileField
                      icon={FileText}
                      label="Identity Document"
                      name="identityDocument"
                      required={!isEditMode}
                      error={errors.identityDocument}
                      existingFileUrl={
                        isEditMode
                          ? (formData.identityDocument as string)
                          : undefined
                      }
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 my-8" />

                {/* Business Information section */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                    <Building className="w-5 h-5 text-purple-600" />
                    Business Information
                  </h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Details about the merchant's business
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      icon={Building}
                      label="Business Name"
                      name="businessName"
                      placeholder="ABC Company"
                      error={errors.businessName}
                    />
                    <InputField
                      icon={FileText}
                      label="Business Registration Number"
                      name="businessRegistrationNumber"
                      placeholder="REG123456"
                      error={errors.businessRegistrationNumber}
                    />
                    <InputField
                      icon={FileText}
                      label="Tax ID"
                      name="taxId"
                      placeholder="TAX123456"
                      error={errors.taxId}
                    />
                    <SelectField
                      icon={Tag}
                      label="Business Type"
                      name="businessType"
                      options={businessTypes}
                      error={errors.businessType}
                    />
                    <SelectField
                      icon={Tag}
                      label="Business Category"
                      name="businessCategory"
                      options={businessCategories}
                      error={errors.businessCategory}
                    />
                    <InputField
                      icon={Phone}
                      label="Business Phone"
                      name="businessPhone"
                      type="tel"
                      placeholder="+1234567890"
                      error={errors.businessPhone}
                    />
                    <InputField
                      icon={Mail}
                      label="Business Email"
                      name="businessEmail"
                      type="email"
                      placeholder="info@business.com"
                      error={errors.businessEmail}
                    />
                    <InputField
                      icon={Globe}
                      label="Website"
                      name="website"
                      type="url"
                      placeholder="https://www.business.com"
                      required={false}
                      error={errors.website}
                    />
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Business Description{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={(e) =>
                        dispatch(
                          setField({
                            field: "description",
                            value: e.target.value,
                          }),
                        )
                      }
                      required
                      placeholder="Describe your business..."
                      rows={4}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 transition-all outline-none resize-none ${
                        errors.description
                          ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                          : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                      }`}
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-200 my-8" />

                {/* Banking Information section */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-indigo-600" />
                    Banking Information
                  </h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Bank account details for payments
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      icon={Building}
                      label="Bank Name"
                      name="bankName"
                      placeholder="Bank of America"
                      error={errors.bankName}
                    />
                    <InputField
                      icon={User}
                      label="Account Holder Name"
                      name="accountHolderName"
                      placeholder="John Doe"
                      error={errors.accountHolderName}
                    />
                    <InputField
                      icon={CreditCard}
                      label="Account Number"
                      name="accountNumber"
                      placeholder="1234567890"
                      error={errors.accountNumber}
                    />
                    <InputField
                      icon={FileText}
                      label="IFSC Code"
                      name="ifscCode"
                      placeholder="SBIN0001234"
                      error={errors.ifscCode}
                    />
                    <InputField
                      icon={Globe}
                      label="SWIFT Code"
                      name="swiftCode"
                      placeholder="SBININBB123"
                      required={false}
                      error={errors.swiftCode}
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 my-8" />

                {/* Location Information section */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-green-600" />
                    Location Information
                  </h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Business location details
                  </p>

                  <div className="grid grid-cols-1 gap-6">
                    <InputField
                      icon={MapPin}
                      label="Street Address"
                      name="address"
                      placeholder="123 Main Street"
                      error={errors.address}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField
                        icon={MapPin}
                        label="City"
                        name="city"
                        placeholder="New York"
                        error={errors.city}
                      />
                      <InputField
                        icon={MapPin}
                        label="State/Province"
                        name="state"
                        placeholder="NY"
                        error={errors.state}
                      />
                      <InputField
                        icon={MapPin}
                        label="ZIP/Postal Code"
                        name="zipCode"
                        placeholder="10001"
                        error={errors.zipCode}
                      />
                      <InputField
                        icon={Globe}
                        label="Country"
                        name="country"
                        placeholder="USA"
                        error={errors.country}
                      />
                    </div>
                  </div>
                </div>

                {/* Submit buttons section */}
                <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={handleBack}
                    className="px-6"
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    variant={isEditMode ? "gradient" : "gradient"}
                    size="lg"
                    isLoading={isPending}
                    disabled={isPending}
                    className="flex-1"
                  >
                    {isEditMode ? "Update Merchant" : "Create Merchant"}
                  </Button>
                </div>
              </Card>
            </form>
          </motion.div>

          {/* Information card at bottom */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6"
          >
            <Card
              className={`p-6 bg-gradient-to-br ${
                isEditMode
                  ? "from-green-50 to-emerald-50 border-2 border-green-200"
                  : "from-blue-50 to-purple-50 border-2 border-blue-200"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 ${
                    isEditMode ? "bg-green-500" : "bg-blue-500"
                  } rounded-full flex items-center justify-center flex-shrink-0`}
                >
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    Important Notes
                  </h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {isEditMode ? (
                      <>
                        <li>
                          • Personal information (name, email, phone, password)
                          cannot be changed
                        </li>
                        <li>
                          • Only business and banking details can be updated
                        </li>
                        <li>
                          • Gift card limit can be set to control the number of
                          gift cards
                        </li>
                        <li>• All changes will be saved immediately</li>
                        <li>
                          • The merchant will receive a notification about the
                          update
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          • The merchant will be created and automatically
                          verified
                        </li>
                        <li>
                          • An email notification will be sent to the merchant
                        </li>
                        <li>
                          • The merchant can log in immediately after creation
                        </li>
                        <li>• All fields marked with * are required</li>
                        <li>
                          • Banking information will be used for payment
                          settlements
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>
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
          <p className="text-gray-700 text-lg font-medium mb-2 whitespace-pre-line">
            {responseModal.message}
          </p>
          {responseModal.type === "success" && (
            <p className="text-gray-500 text-sm mt-4">
              Your changes have been saved successfully.
            </p>
          )}
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default CreateMerchantPage;
