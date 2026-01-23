// src/features/merchant/components/ChangePassword.tsx
import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { AxiosError } from "axios";
import useChangePassword from "@/features/merchant/hooks/usePassword";
import { Modal } from "@/shared/components/ui/Modal";
import { Button } from "@/shared/components/ui/Button";

// Interface for API error response structure
interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

// // Interface for password form data
interface PasswordData {
  password: string;
  newPassword: string;
  confirmPassword: string;
}

export const ChangePassword = () => {
  // State for form data with initial empty values
  const [formData, setFormData] = useState<PasswordData>({
    password: "",
    newPassword: "",
    confirmPassword: "",
  });

  // State for form validation errors
  const [errors, setErrors] = useState<Partial<PasswordData>>({});

  // State for toggling password visibility for each field
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Modal state management
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<
    "success" | "error" | "info" | "warning"
  >("info");

  // Custom hook for password change mutation (uses React Query under the hood)
  const changePasswordMutation = useChangePassword();

  // Helper function to display modal with appropriate type and message
  const showResponseModal = (
    title: string,
    message: string,
    type: "success" | "error" | "info" | "warning" = "info",
  ) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType(type);
    setShowModal(true);
  };

  // Handler to close modal
  const handleModalClose = () => {
    setShowModal(false);
  };

  // Form validation function - returns true if form is valid
  const validateForm = (): boolean => {
    const newErrors: Partial<PasswordData> = {};

    // Current password validation - required field
    if (!formData.password.trim()) {
      newErrors.password = "Current password is required";
    }

    // New password validation - multiple criteria
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(
        formData.newPassword,
      )
    ) {
      newErrors.newPassword =
        "Password must contain uppercase, lowercase, number, and special character";
    }

    // Confirm password validation - must match new password
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Additional validation: new password must be different from current
    if (
      formData.password &&
      formData.newPassword &&
      formData.password === formData.newPassword
    ) {
      newErrors.newPassword =
        "New password must be different from current password";
    }

    // Update errors state
    setErrors(newErrors);

    // Form is valid if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    if (validateForm()) {
      // Trigger password change mutation
      changePasswordMutation.mutate(formData, {
        onSuccess: () => {
          // Success handler: show success modal and reset form
          showResponseModal(
            "Success!",
            "Your password has been changed successfully.",
            "success",
          );
          // Reset form fields
          setFormData({
            password: "",
            newPassword: "",
            confirmPassword: "",
          });
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
          // Error handler: extract error message from API response
          const errorMessage =
            error.response?.data?.message || "Failed to change password";
          showResponseModal("Password Change Failed", errorMessage, "error");
        },
      });
    } else {
      // Show warning modal if form validation fails
      showResponseModal(
        "Validation Error",
        "Please fix the errors in the form before submitting.",
        "warning",
      );
    }
  };

  // Input change handler - updates form data and clears field-specific errors
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for the current field when user starts typing
    if (errors[name as keyof PasswordData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Toggle password visibility for specific field
  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <>
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Current Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Current Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              {/* Lock icon for visual consistency */}
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword.current ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm sm:text-base ${
                  errors.password
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="Enter current password"
              />
              {/* Toggle password visibility button */}
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword.current ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {/* Display error message if validation fails */}
            {errors.password && (
              <p className="mt-1 text-xs sm:text-sm text-red-600">
                {errors.password}
              </p>
            )}
          </div>

          {/* New Password Field */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword.new ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className={`w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm sm:text-base ${
                  errors.newPassword
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword.new ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {/* Display error message if validation fails */}
            {errors.newPassword && (
              <p className="mt-1 text-xs sm:text-sm text-red-600">
                {errors.newPassword}
              </p>
            )}
            {/* Password requirements helper text */}
            <p className="mt-1 text-xs text-gray-500">
              Must be at least 8 characters with uppercase, lowercase, number,
              and special character
            </p>
          </div>

          {/* Confirm New Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword.confirm ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm sm:text-base ${
                  errors.confirmPassword
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword.confirm ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {/* Display error message if validation fails */}
            {errors.confirmPassword && (
              <p className="mt-1 text-xs sm:text-sm text-red-600">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
            <Button
              type="submit"
              variant="gradient"
              size="lg"
              isLoading={changePasswordMutation.isPending}
              className="flex-1"
            >
              {changePasswordMutation.isPending
                ? "Changing Password..."
                : "Change Password"}
            </Button>
          </div>
        </form>
      </div>

      {/* Response Modal - shown after form submission */}
      <Modal
        isOpen={showModal}
        onClose={handleModalClose}
        title={modalTitle}
        size="sm"
        type={modalType}
        showActions={true}
        onConfirm={handleModalClose}
        confirmText="OK"
      >
        <div className="text-center">
          <p className="text-gray-700 mb-2">{modalMessage}</p>
          {/* Success-specific additional message */}
          {modalType === "success" && (
            <p className="text-sm text-gray-500 mt-4">
              Please use your new password for future logins.
            </p>
          )}
          {/* Error-specific additional message */}
          {modalType === "error" && (
            <p className="text-sm text-gray-500 mt-4">
              Please try again or contact support if the problem persists.
            </p>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ChangePassword;
