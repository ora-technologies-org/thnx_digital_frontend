import React, { useState } from "react";
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
import AdminLayout from "@/shared/components/layout/AdminLayout";

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

const Card = ({ children, className = "" }: any) => (
  <div className={`bg-white rounded-2xl shadow-lg ${className}`}>
    {children}
  </div>
);

const InputField = ({
  icon: Icon,
  label,
  name,
  type = "text",
  value,
  onChange,
  required = true,
  placeholder,
}: any) => (
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
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
      />
    </div>
  </div>
);

const SelectField = ({
  icon: Icon,
  label,
  name,
  value,
  onChange,
  options,
  required = true,
}: any) => (
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
        onChange={onChange}
        required={required}
        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none appearance-none bg-white"
      >
        <option value="">Select {label}</option>
        {options.map((option: string) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export const CreateMerchantPage: React.FC = () => {
  const [isPending, setIsPending] = useState(false);
  const [formData, setFormData] = useState<CreateMerchantForm>({
    email: "",
    password: "",
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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    setTimeout(() => {
      console.log("Creating merchant:", formData);
      setIsPending(false);
      alert("Merchant created successfully!");
    }, 2000);
  };

  const handleBack = () => {
    console.log("Navigate back to merchants");
  };

  return (
    <AdminLayout>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-8 max-w-5xl mx-auto">
        {/* Header */}
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

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <form onSubmit={handleSubmit}>
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
                  />
                  <InputField
                    icon={Mail}
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                  />
                  <InputField
                    icon={Lock}
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                  />
                  <InputField
                    icon={Phone}
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1234567890"
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
                  />
                  <InputField
                    icon={FileText}
                    label="Business Registration Number"
                    name="businessRegistrationNumber"
                    value={formData.businessRegistrationNumber}
                    onChange={handleChange}
                    placeholder="REG123456"
                  />
                  <InputField
                    icon={FileText}
                    label="Tax ID"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleChange}
                    placeholder="TAX123456"
                  />
                  <SelectField
                    icon={Tag}
                    label="Business Type"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    options={businessTypes}
                  />
                  <SelectField
                    icon={Tag}
                    label="Business Category"
                    name="businessCategory"
                    value={formData.businessCategory}
                    onChange={handleChange}
                    options={businessCategories}
                  />
                  <InputField
                    icon={Phone}
                    label="Business Phone"
                    name="businessPhone"
                    type="tel"
                    value={formData.businessPhone}
                    onChange={handleChange}
                    placeholder="+1234567890"
                  />
                  <InputField
                    icon={Mail}
                    label="Business Email"
                    name="businessEmail"
                    type="email"
                    value={formData.businessEmail}
                    onChange={handleChange}
                    placeholder="info@business.com"
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
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Business Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    placeholder="Describe your business..."
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none resize-none"
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
                  />
                  <InputField
                    icon={User}
                    label="Account Holder Name"
                    name="accountHolderName"
                    value={formData.accountHolderName}
                    onChange={handleChange}
                    placeholder="John Doe"
                  />
                  <InputField
                    icon={CreditCard}
                    label="Account Number"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    placeholder="1234567890"
                  />
                  <InputField
                    icon={FileText}
                    label="IFSC Code"
                    name="ifscCode"
                    value={formData.ifscCode}
                    onChange={handleChange}
                    placeholder="SBIN0001234"
                  />
                  <InputField
                    icon={Globe}
                    label="SWIFT Code"
                    name="swiftCode"
                    value={formData.swiftCode}
                    onChange={handleChange}
                    placeholder="SBININBB123"
                    required={false}
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
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      icon={MapPin}
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="New York"
                    />
                    <InputField
                      icon={MapPin}
                      label="State/Province"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="NY"
                    />
                    <InputField
                      icon={MapPin}
                      label="ZIP/Postal Code"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      placeholder="10001"
                    />
                    <InputField
                      icon={Globe}
                      label="Country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="USA"
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
    </AdminLayout>
  );
};
