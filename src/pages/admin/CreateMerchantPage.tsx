// src/features/admin/pages/CreateMerchantPage.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";
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
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  CreditCard,
  Eye,
  EyeOff,
} from "lucide-react";
import AdminLayout from "@/shared/components/layout/AdminLayout";
import { merchantService } from "@/features/merchant/services/merchantService";

// ===== TYPES & CONSTANTS =====
interface CreateMerchantForm {
  email: string;
  password: string;
  confirmPassword: string;
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
}

interface ValidationErrors {
  [key: string]: string;
}
interface ApiErrorResponse {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

const ROUTES = { MERCHANTS: "/admin/merchants" } as const;
const BUSINESS_TYPES = [
  "Sole Proprietorship",
  "Partnership",
  "Limited Liability Company (LLC)",
  "Corporation",
  "Cooperative",
  "Non-Profit Organization",
] as const;
const BUSINESS_CATEGORIES = [
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
] as const;

const VALIDATION = {
  PASSWORD_MIN: 8,
  PASSWORD_PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
  PHONE_PATTERN: /^\+?[\d\s-()]{10,}$/,
  IFSC_PATTERN: /^[A-Z]{4}0[A-Z0-9]{6}$/,
  SWIFT_PATTERN: /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/,
  ZIP_PATTERN: /^[\d\w\s-]{3,10}$/,
  DESC_MIN: 20,
  DESC_MAX: 500,
} as const;

// ===== VALIDATION =====
const validateField = (
  name: string,
  value: string,
  form: CreateMerchantForm,
): string => {
  if (!value.trim() && name !== "website" && name !== "swiftCode")
    return "This field is required";

  const validations: Record<string, () => string> = {
    email: () =>
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "Invalid email address" : "",
    businessEmail: () => {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        return "Invalid email address";
      if (value === form.email)
        return "Business email must differ from personal email";
      return "";
    },
    password: () => {
      if (value.length < VALIDATION.PASSWORD_MIN)
        return `Password must be at least ${VALIDATION.PASSWORD_MIN} characters`;
      if (!VALIDATION.PASSWORD_PATTERN.test(value))
        return "Password must contain uppercase, lowercase, number, and special character";
      return "";
    },
    confirmPassword: () =>
      value !== form.password ? "Passwords do not match" : "",
    phone: () =>
      !VALIDATION.PHONE_PATTERN.test(value) ? "Invalid phone number" : "",
    businessPhone: () =>
      !VALIDATION.PHONE_PATTERN.test(value) ? "Invalid phone number" : "",
    ifscCode: () =>
      !VALIDATION.IFSC_PATTERN.test(value.toUpperCase())
        ? "Invalid IFSC code (e.g., SBIN0001234)"
        : "",
    swiftCode: () =>
      value && !VALIDATION.SWIFT_PATTERN.test(value.toUpperCase())
        ? "Invalid SWIFT code"
        : "",
    zipCode: () =>
      !VALIDATION.ZIP_PATTERN.test(value) ? "Invalid ZIP/Postal code" : "",
    description: () => {
      if (value.length < VALIDATION.DESC_MIN)
        return `Description must be at least ${VALIDATION.DESC_MIN} characters`;
      if (value.length > VALIDATION.DESC_MAX)
        return `Description must not exceed ${VALIDATION.DESC_MAX} characters`;
      return "";
    },
    website: () =>
      value && !/^https?:\/\/.+\..+/.test(value) ? "Invalid URL" : "",
    accountNumber: () =>
      !/^\d{8,18}$/.test(value) ? "Account number must be 8-18 digits" : "",
  };

  return validations[name]?.() || "";
};

const validateForm = (form: CreateMerchantForm): ValidationErrors => {
  const errors: ValidationErrors = {};
  Object.keys(form).forEach((key) => {
    const error = validateField(
      key,
      form[key as keyof CreateMerchantForm],
      form,
    );
    if (error) errors[key] = error;
  });
  return errors;
};

// ===== COMPONENTS =====
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <div className={`bg-white rounded-2xl shadow-lg ${className}`}>
    {children}
  </div>
);

const InputField: React.FC<{
  icon: React.ElementType;
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  showPasswordToggle?: boolean;
  onTogglePassword?: () => void;
}> = ({
  icon: Icon,
  label,
  name,
  type = "text",
  value,
  onChange,
  required = true,
  placeholder,
  error,
  disabled = false,
  showPasswordToggle = false,
  onTogglePassword,
}) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-semibold text-gray-700 mb-2"
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        <Icon className="w-5 h-5" />
      </div>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={!!error}
        className={`w-full pl-12 ${showPasswordToggle ? "pr-12" : "pr-4"} py-3 border-2 ${error ? "border-red-500" : "border-gray-200"} rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none disabled:bg-gray-100`}
      />
      {showPasswordToggle && onTogglePassword && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
        >
          {type === "password" ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      )}
    </div>
    {error && (
      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
        <AlertCircle className="w-4 h-4" />
        {error}
      </p>
    )}
  </div>
);

const SelectField: React.FC<{
  icon: React.ElementType;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: readonly string[];
  required?: boolean;
  error?: string;
  disabled?: boolean;
}> = ({
  icon: Icon,
  label,
  name,
  value,
  onChange,
  options,
  required = true,
  error,
  disabled = false,
}) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-semibold text-gray-700 mb-2"
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
        <Icon className="w-5 h-5" />
      </div>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`w-full pl-12 pr-4 py-3 border-2 ${error ? "border-red-500" : "border-gray-200"} rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none appearance-none bg-white disabled:bg-gray-100`}
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
    {error && (
      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
        <AlertCircle className="w-4 h-4" />
        {error}
      </p>
    )}
  </div>
);

const TextAreaField: React.FC<{
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  error?: string;
  disabled?: boolean;
  maxLength?: number;
}> = ({
  label,
  name,
  value,
  onChange,
  required = true,
  placeholder,
  rows = 4,
  error,
  disabled = false,
  maxLength,
}) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-semibold text-gray-700 mb-2"
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      maxLength={maxLength}
      className={`w-full px-4 py-3 border-2 ${error ? "border-red-500" : "border-gray-200"} rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none resize-none disabled:bg-gray-100`}
    />
    {maxLength && (
      <p className="mt-1 text-xs text-gray-500 text-right">
        {value.length}/{maxLength}
      </p>
    )}
    {error && (
      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
        <AlertCircle className="w-4 h-4" />
        {error}
      </p>
    )}
  </div>
);

// ===== MAIN COMPONENT =====
export const CreateMerchantPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [formData, setFormData] = useState<CreateMerchantForm>({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    businessName: "",
    businessRegistrationNumber: "",
    taxId: "",
    businessType: "",
    businessCategory: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    businessPhone: "",
    businessEmail: "",
    website: "",
    description: "",
    bankName: "",
    accountNumber: "",
    accountHolderName: "",
    ifscCode: "",
    swiftCode: "",
  });

  const createMerchantMutation = useMutation({
    mutationFn: merchantService.createMerchant,
    onSuccess: () => {
      toast.success("Merchant created successfully!");
      setHasUnsavedChanges(false);
      navigate(ROUTES.MERCHANTS, { replace: true });
    },
    onError: (error: AxiosError) => {
      const data = error.response?.data as ApiErrorResponse | undefined;
      toast.error(data?.message || "Failed to create merchant");
      if (data?.errors) {
        const fieldErrors: ValidationErrors = {};
        Object.entries(data.errors).forEach(([field, messages]) => {
          fieldErrors[field] = messages[0];
        });
        setErrors(fieldErrors);
      }
    },
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setHasUnsavedChanges(true);
    if (errors[name])
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });

    // Real-time validation for critical fields
    if (
      ["email", "password", "confirmPassword", "businessEmail"].includes(name)
    ) {
      const error = validateField(name, value, { ...formData, [name]: value });
      if (error) setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the validation errors");
      document
        .getElementById(Object.keys(validationErrors)[0])
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const { ...merchantData } = formData;
    createMerchantMutation.mutate(merchantData);
  };

  const handleBack = () => {
    if (
      hasUnsavedChanges &&
      !window.confirm(
        "You have unsaved changes. Are you sure you want to leave?",
      )
    )
      return;
    navigate(ROUTES.MERCHANTS);
  };

  const isSubmitting = createMerchantMutation.isPending;

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="p-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
              type="button"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Merchants
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Create New Merchant
                </h1>
                <p className="text-gray-600">
                  Add a new merchant to your platform
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <form onSubmit={handleSubmit} noValidate>
              <Card className="p-8">
                {/* Personal Information */}
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
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      error={errors.name}
                      disabled={isSubmitting}
                    />
                    <InputField
                      icon={Mail}
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      error={errors.email}
                      disabled={isSubmitting}
                    />
                    <InputField
                      icon={Lock}
                      label="Password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      error={errors.password}
                      disabled={isSubmitting}
                      showPasswordToggle
                      onTogglePassword={() => setShowPassword(!showPassword)}
                    />
                    <InputField
                      icon={Lock}
                      label="Confirm Password"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      error={errors.confirmPassword}
                      disabled={isSubmitting}
                      showPasswordToggle
                      onTogglePassword={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    />
                    <InputField
                      icon={Phone}
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1234567890"
                      error={errors.phone}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 my-8" />

                {/* Business Information */}
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
                      value={formData.businessName}
                      onChange={handleChange}
                      placeholder="ABC Company"
                      error={errors.businessName}
                      disabled={isSubmitting}
                    />
                    <InputField
                      icon={FileText}
                      label="Business Registration Number"
                      name="businessRegistrationNumber"
                      value={formData.businessRegistrationNumber}
                      onChange={handleChange}
                      placeholder="REG123456"
                      error={errors.businessRegistrationNumber}
                      disabled={isSubmitting}
                    />
                    <InputField
                      icon={FileText}
                      label="Tax ID"
                      name="taxId"
                      value={formData.taxId}
                      onChange={handleChange}
                      placeholder="TAX123456"
                      error={errors.taxId}
                      disabled={isSubmitting}
                    />
                    <SelectField
                      icon={Tag}
                      label="Business Type"
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleChange}
                      options={BUSINESS_TYPES}
                      error={errors.businessType}
                      disabled={isSubmitting}
                    />
                    <SelectField
                      icon={Tag}
                      label="Business Category"
                      name="businessCategory"
                      value={formData.businessCategory}
                      onChange={handleChange}
                      options={BUSINESS_CATEGORIES}
                      error={errors.businessCategory}
                      disabled={isSubmitting}
                    />
                    <InputField
                      icon={Phone}
                      label="Business Phone"
                      name="businessPhone"
                      type="tel"
                      value={formData.businessPhone}
                      onChange={handleChange}
                      placeholder="+1234567890"
                      error={errors.businessPhone}
                      disabled={isSubmitting}
                    />
                    <InputField
                      icon={Mail}
                      label="Business Email"
                      name="businessEmail"
                      type="email"
                      value={formData.businessEmail}
                      onChange={handleChange}
                      placeholder="info@business.com"
                      error={errors.businessEmail}
                      disabled={isSubmitting}
                    />
                    <InputField
                      icon={Globe}
                      label="Website"
                      name="website"
                      type="url"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://www.business.com"
                      required={false}
                      error={errors.website}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="mt-6">
                    <TextAreaField
                      label="Business Description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe your business..."
                      rows={4}
                      error={errors.description}
                      disabled={isSubmitting}
                      maxLength={VALIDATION.DESC_MAX}
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 my-8" />

                {/* Banking Information */}
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
                      value={formData.bankName}
                      onChange={handleChange}
                      placeholder="Bank of America"
                      error={errors.bankName}
                      disabled={isSubmitting}
                    />
                    <InputField
                      icon={User}
                      label="Account Holder Name"
                      name="accountHolderName"
                      value={formData.accountHolderName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      error={errors.accountHolderName}
                      disabled={isSubmitting}
                    />
                    <InputField
                      icon={CreditCard}
                      label="Account Number"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleChange}
                      placeholder="1234567890"
                      error={errors.accountNumber}
                      disabled={isSubmitting}
                    />
                    <InputField
                      icon={FileText}
                      label="IFSC Code"
                      name="ifscCode"
                      value={formData.ifscCode}
                      onChange={handleChange}
                      placeholder="SBIN0001234"
                      error={errors.ifscCode}
                      disabled={isSubmitting}
                    />
                    <InputField
                      icon={Globe}
                      label="SWIFT Code"
                      name="swiftCode"
                      value={formData.swiftCode}
                      onChange={handleChange}
                      placeholder="SBININBB123"
                      required={false}
                      error={errors.swiftCode}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 my-8" />

                {/* Location Information */}
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
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="123 Main Street"
                      error={errors.address}
                      disabled={isSubmitting}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField
                        icon={MapPin}
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="New York"
                        error={errors.city}
                        disabled={isSubmitting}
                      />
                      <InputField
                        icon={MapPin}
                        label="State/Province"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="NY"
                        error={errors.state}
                        disabled={isSubmitting}
                      />
                      <InputField
                        icon={MapPin}
                        label="ZIP/Postal Code"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        placeholder="10001"
                        error={errors.zipCode}
                        disabled={isSubmitting}
                      />
                      <InputField
                        icon={Globe}
                        label="Country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="USA"
                        error={errors.country}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                  <motion.button
                    type="button"
                    onClick={handleBack}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    className={`flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg"}`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating Merchant...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Create Merchant
                      </>
                    )}
                  </motion.button>
                </div>
              </Card>
            </form>
          </motion.div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6"
          >
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    Important Notes
                  </h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>
                      • The merchant account will be created and verification
                      status determined by backend
                    </li>
                    <li>
                      • An email notification will be sent to the merchant
                    </li>
                    <li>• All fields marked with * are required</li>
                    <li>
                      • Banking information will be securely stored and used for
                      settlements
                    </li>
                    <li>
                      • Password must be at least 8 characters with uppercase,
                      lowercase, number, and special character
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
};
