import React, { useEffect } from "react";
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
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  CreditCard,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "@/app/store";
import {
  setField,
  clearErrors,
  resetForm,
} from "@/features/admin/slices/MerchantCreateSlice";
import { useCreateMerchant } from "@/features/admin/hooks/useMerchantMutations";

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
}

const InputField: React.FC<InputFieldProps> = ({
  icon: Icon,
  label,
  name,
  type = "text",
  required = true,
  placeholder,
  error,
}) => {
  const dispatch = useDispatch();
  const value = useSelector(
    (state: RootState) => state.merchant.formData[name],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setField({ field: name, value: e.target.value }));
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
          value={value}
          onChange={handleChange}
          required={required}
          placeholder={placeholder}
          className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 transition-all outline-none ${
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
  const token = localStorage.getItem("accessToken");
  console.log("accessToken:", token);
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

// Main CreateMerchantPage component
export const CreateMerchantPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const formData = useSelector((state: RootState) => state.merchant.formData);
  const errors = useSelector((state: RootState) => state.merchant.errors);
  const { mutate: createMerchant, isPending } = useCreateMerchant();

  // Clean up form on component unmount
  useEffect(() => {
    return () => {
      dispatch(resetForm());
    };
  }, [dispatch]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearErrors());

    // Client-side validation
    const validationErrors: Record<string, string> = {};

    if (!formData.email.includes("@")) {
      validationErrors.email = "Invalid email address";
    }

    if (formData.password.length < 8) {
      validationErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.businessName.trim()) {
      validationErrors.businessName = "Business name is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      alert("Please fix the validation errors");
      return;
    }

    // Call mutation to create merchant
    createMerchant(formData, {
      onSuccess: () => {
        dispatch(resetForm());
        navigate("/admin/merchants");
      },
    });
  };

  // Navigate back to merchants list
  const handleBack = () => {
    navigate("/admin/merchants");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-8 max-w-5xl mx-auto">
        {/* Header section with back button and title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
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
                  />
                  <InputField
                    icon={Mail}
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    error={errors.email}
                  />
                  <InputField
                    icon={Lock}
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    error={errors.password}
                  />
                  <InputField
                    icon={Phone}
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    placeholder="+1234567890"
                    error={errors.phone}
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
                    Business Description <span className="text-red-500">*</span>
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
                  disabled={isPending}
                  whileHover={{ scale: isPending ? 1 : 1.02 }}
                  whileTap={{ scale: isPending ? 1 : 0.98 }}
                  className={`flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    isPending
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:shadow-lg"
                  }`}
                >
                  {isPending ? (
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

        {/* Information card at bottom */}
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
                    • The merchant will be created and automatically verified
                  </li>
                  <li>• An email notification will be sent to the merchant</li>
                  <li>• The merchant can log in immediately after creation</li>
                  <li>• All fields marked with * are required</li>
                  <li>
                    • Banking information will be used for payment settlements
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
