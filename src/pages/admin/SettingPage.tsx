import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Card } from "../../shared/components/ui/Card";
import { jwtDecode } from "jwt-decode";
import { changePassword } from "@/features/admin/services/resetPasswordService";
import AdminLayout from "@/shared/components/layout/AdminLayout";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Button } from "@/shared/components/ui/Button";
import { Modal } from "@/shared/components/ui/Modal";
import {
  clearError,
  clearUpdateSuccess,
  fetchProfile,
  updateProfile,
} from "@/features/auth/slices/adminProfileSlice";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface DecodedToken {
  email: string;
  [key: string]: unknown;
}

interface ApiError {
  message?: string;
  errors?: Record<string, string[]>;
}

interface ResponseModalData {
  isOpen: boolean;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message: string;
  onConfirm?: () => void;
}

// Profile interface - adjust this based on your actual profile structure
interface UserProfile {
  id?: string;
  email?: string;
  name?: string;
  phone?: string;
  bio?: string;
  [key: string]: unknown;
}

export const AdminSettingPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    profile: rawProfile,
    loading: profileLoading,
    error: profileError,
    updateSuccess,
  } = useAppSelector((state) => state.profile);

  // Type-safe profile accessor with fallback
  const profile = useMemo(() => {
    if (typeof rawProfile === "object" && rawProfile !== null) {
      return rawProfile as UserProfile;
    }
    return null;
  }, [rawProfile]);

  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Response modal state
  const [responseModal, setResponseModal] = useState<ResponseModalData>({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });

  // Profile form data
  const [profileData, setProfileData] = useState({
    name: "",
    phone: "",
    bio: "",
  });

  // Password form data
  const [passwordData, setPasswordData] = useState({
    password: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{
    password?: string;
    newPassword?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  const [profileErrors, setProfileErrors] = useState<{
    name?: string;
    phone?: string;
    bio?: string;
    general?: string;
  }>({});

  const [touched, setTouched] = useState<{
    name?: boolean;
    phone?: boolean;
    bio?: boolean;
    password?: boolean;
    newPassword?: boolean;
    confirmPassword?: boolean;
  }>({});

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "reset", label: "Reset Password", icon: Lock },
  ];

  // Open response modal
  const openResponseModal = (
    type: "success" | "error" | "info" | "warning",
    title: string,
    message: string,
    onConfirm?: () => void,
  ) => {
    setResponseModal({
      isOpen: true,
      type,
      title,
      message,
      onConfirm,
    });
  };

  // Close response modal
  const closeResponseModal = () => {
    setResponseModal((prev) => ({ ...prev, isOpen: false }));
  };

  // Fetch profile on component mount
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // Update form when profile is loaded
  useEffect(() => {
    if (profile) {
      setProfileData({
        name: profile.name || "",
        phone: profile.phone || "",
        bio: profile.bio || "",
      });
    }
  }, [profile]);

  // Handle update success
  useEffect(() => {
    if (updateSuccess) {
      openResponseModal("success", "Success!", "Profile updated successfully!");
      setTimeout(() => {
        dispatch(clearUpdateSuccess());
      }, 3000);
    }
  }, [updateSuccess, dispatch]);

  // Show error modal if profile error exists
  useEffect(() => {
    if (profileError) {
      openResponseModal("error", "Error", profileError);
    }
  }, [profileError]);

  const getUserEmail = (): string | null => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return null;
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.email;
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  };

  const validateProfileForm = (): boolean => {
    const newErrors: typeof profileErrors = {};

    if (!profileData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (profileData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (profileData.phone && !/^\d{10}$/.test(profileData.phone)) {
      newErrors.phone = "Phone number should be 10 digits";
    }

    if (profileData.bio && profileData.bio.length > 200) {
      newErrors.bio = "Bio must be less than 200 characters";
    }

    setProfileErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!passwordData.password) {
      newErrors.password = "Current password is required";
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword)
    ) {
      newErrors.newPassword =
        "Password must contain uppercase, lowercase, and numbers";
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));

    // Mark field as touched
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Clear error for this field when user starts typing
    if (profileErrors[name as keyof typeof profileErrors]) {
      setProfileErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePasswordInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));

    // Mark field as touched
    setTouched((prev) => ({ ...prev, [name]: true }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    // Validate specific field on blur
    if (field === "name" && profileData.name.trim()) {
      if (profileData.name.trim().length < 2) {
        setProfileErrors((prev) => ({
          ...prev,
          name: "Name must be at least 2 characters",
        }));
      }
    }

    if (field === "phone" && profileData.phone) {
      if (!/^\d{10}$/.test(profileData.phone)) {
        setProfileErrors((prev) => ({
          ...prev,
          phone: "Phone number should be 10 digits",
        }));
      }
    }

    if (field === "newPassword" && passwordData.newPassword) {
      if (passwordData.newPassword.length < 8) {
        setErrors((prev) => ({
          ...prev,
          newPassword: "Password must be at least 8 characters",
        }));
      }
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Mark all fields as touched for validation
    setTouched({ name: true, phone: true, bio: true });

    setProfileErrors({});
    dispatch(clearError());

    // Validate form before submitting
    if (!validateProfileForm()) return;

    try {
      await dispatch(
        updateProfile({
          name: profileData.name,
          phone: profileData.phone,
          bio: profileData.bio,
        }),
      ).unwrap();

      openResponseModal("success", "Success!", "Profile updated successfully!");
    } catch (error: unknown) {
      console.error("Profile update error:", error);

      if (typeof error !== "object" || error === null) {
        openResponseModal(
          "error",
          "Error",
          "Something went wrong. Please try again.",
        );
        return;
      }

      const apiError = error as ApiError;

      // Handle field-level validation errors
      if (apiError.errors) {
        const fieldErrors: typeof profileErrors = {};

        Object.entries(apiError.errors).forEach(([key, messages]) => {
          if (messages?.length) {
            fieldErrors[key as keyof typeof profileErrors] = messages[0];
          }
        });

        setProfileErrors(fieldErrors);
        return;
      }

      // Handle general error message
      if (apiError.message) {
        openResponseModal("error", "Error", apiError.message);
      } else {
        openResponseModal("error", "Error", "Profile update failed.");
      }
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all password fields as touched
    setTouched({ password: true, newPassword: true, confirmPassword: true });

    setErrors({});

    if (!validatePasswordForm()) return;

    const email = getUserEmail();
    if (!email) {
      openResponseModal(
        "error",
        "Authentication Error",
        "Unable to retrieve user email. Please login again.",
      );
      return;
    }

    setLoading(true);

    try {
      const payload = {
        email: String(email),
        password: String(passwordData.password),
        newPassword: String(passwordData.newPassword),
        confirmPassword: String(passwordData.confirmPassword),
      };

      const response = await changePassword(payload);

      openResponseModal("success", "Success!", response.message, () => {
        setPasswordData({
          password: "",
          newPassword: "",
          confirmPassword: "",
        });
        setTouched({});
      });
    } catch (error: unknown) {
      console.error("Password change error:", error);
      if (error instanceof Error) {
        openResponseModal("error", "Error", error.message);
      } else {
        openResponseModal(
          "error",
          "Error",
          "Something went wrong. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, color: "bg-gray-200", text: "" };

    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*]/.test(password)) score++;

    const colors = [
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-blue-500",
      "bg-green-500",
    ];
    const texts = ["Very Weak", "Weak", "Fair", "Good", "Strong"];

    return {
      score,
      color: colors[score - 1] || "bg-gray-200",
      text: texts[score - 1] || "",
    };
  };

  const passwordStrength = getPasswordStrength(passwordData.newPassword);

  return (
    <>
      <AdminLayout>
        <div className="p-4 md:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 md:mb-8"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Settings
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Manage your account and business settings
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Sidebar Navigation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1"
            >
              <Card className="p-3 md:p-4">
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                          w-full flex items-center gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg
                          transition-all duration-200 text-sm md:text-base
                          ${
                            isActive
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                              : "text-gray-700 hover:bg-gray-100 hover:shadow-sm"
                          }
                        `}
                      >
                        <Icon className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="font-medium">{tab.label}</span>
                        {isActive && (
                          <div className="ml-auto w-2 h-2 rounded-full bg-white/80"></div>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </Card>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-3"
            >
              <Card className="p-4 md:p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                    {tabs.find((t) => t.id === activeTab)?.label} Settings
                  </h3>
                  {activeTab === "profile" && profile && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>
                        Last updated: {new Date().toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Profile Tab */}
                {activeTab === "profile" && (
                  <form
                    onSubmit={handleProfileSubmit}
                    className="max-w-lg space-y-4 md:space-y-6"
                  >
                    {/* Email (read-only) */}
                    {/* <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={profile?.email || ""}
                          disabled
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed pr-10"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div> */}

                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="name"
                          value={profileData.name}
                          onChange={handleProfileInputChange}
                          onBlur={() => handleBlur("name")}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                            profileErrors.name && touched.name
                              ? "border-red-500 ring-1 ring-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Enter your full name"
                        />
                        {profileData.name && !profileErrors.name && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          </div>
                        )}
                      </div>
                      {profileErrors.name && touched.name && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {profileErrors.name}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleProfileInputChange}
                          onBlur={() => handleBlur("phone")}
                          className={`w-full px-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                            profileErrors.phone && touched.phone
                              ? "border-red-500 ring-1 ring-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Enter 10-digit phone number"
                          maxLength={10}
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          +1
                        </div>
                      </div>
                      {profileErrors.phone && touched.phone && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {profileErrors.phone}
                        </p>
                      )}
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <div className="relative">
                        <textarea
                          name="bio"
                          value={profileData.bio}
                          onChange={handleProfileInputChange}
                          onBlur={() => handleBlur("bio")}
                          rows={3}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${
                            profileErrors.bio && touched.bio
                              ? "border-red-500 ring-1 ring-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Tell us about yourself..."
                          maxLength={200}
                        />
                        <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                          {profileData.bio.length}/200
                        </div>
                      </div>
                      {profileErrors.bio && touched.bio && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {profileErrors.bio}
                        </p>
                      )}
                    </div>

                    <div className="pt-4">
                      <Button
                        type="submit"
                        variant="gradient"
                        size="lg"
                        isLoading={profileLoading}
                        className="w-full"
                      >
                        {profileLoading ? "Updating..." : "Update Profile"}
                      </Button>
                    </div>
                  </form>
                )}

                {/* Password Reset Tab */}
                {activeTab === "reset" && (
                  <form
                    onSubmit={handlePasswordSubmit}
                    className="max-w-lg space-y-4 md:space-y-6"
                  >
                    {/* Current Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword.current ? "text" : "password"}
                          name="password"
                          value={passwordData.password}
                          onChange={handlePasswordInputChange}
                          onBlur={() => handleBlur("password")}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12 transition-all ${
                            errors.password && touched.password
                              ? "border-red-500 ring-1 ring-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Enter your current password"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("current")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                          aria-label={
                            showPassword.current
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {showPassword.current ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      {errors.password && touched.password && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.password}
                        </p>
                      )}
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword.new ? "text" : "password"}
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordInputChange}
                          onBlur={() => handleBlur("newPassword")}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12 transition-all ${
                            errors.newPassword && touched.newPassword
                              ? "border-red-500 ring-1 ring-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Create a strong password"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("new")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                          aria-label={
                            showPassword.new ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword.new ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>

                      {/* Password Strength Indicator */}
                      {passwordData.newPassword && (
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">
                              Password strength:
                            </span>
                            <span
                              className={`font-medium ${
                                passwordStrength.score >= 4
                                  ? "text-green-600"
                                  : passwordStrength.score >= 3
                                    ? "text-blue-600"
                                    : passwordStrength.score >= 2
                                      ? "text-yellow-600"
                                      : "text-red-600"
                              }`}
                            >
                              {passwordStrength.text}
                            </span>
                          </div>
                          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${passwordStrength.color} transition-all duration-300`}
                              style={{
                                width: `${(passwordStrength.score / 5) * 100}%`,
                              }}
                            />
                          </div>
                          <ul className="text-xs text-gray-500 space-y-1 mt-2">
                            <li
                              className={`flex items-center gap-1 ${passwordData.newPassword.length >= 8 ? "text-green-600" : ""}`}
                            >
                              <div
                                className={`w-1.5 h-1.5 rounded-full ${passwordData.newPassword.length >= 8 ? "bg-green-500" : "bg-gray-300"}`}
                              />
                              At least 8 characters
                            </li>
                            <li
                              className={`flex items-center gap-1 ${/[a-z]/.test(passwordData.newPassword) ? "text-green-600" : ""}`}
                            >
                              <div
                                className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(passwordData.newPassword) ? "bg-green-500" : "bg-gray-300"}`}
                              />
                              One lowercase letter
                            </li>
                            <li
                              className={`flex items-center gap-1 ${/[A-Z]/.test(passwordData.newPassword) ? "text-green-600" : ""}`}
                            >
                              <div
                                className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(passwordData.newPassword) ? "bg-green-500" : "bg-gray-300"}`}
                              />
                              One uppercase letter
                            </li>
                            <li
                              className={`flex items-center gap-1 ${/\d/.test(passwordData.newPassword) ? "text-green-600" : ""}`}
                            >
                              <div
                                className={`w-1.5 h-1.5 rounded-full ${/\d/.test(passwordData.newPassword) ? "bg-green-500" : "bg-gray-300"}`}
                              />
                              One number
                            </li>
                          </ul>
                        </div>
                      )}

                      {errors.newPassword && touched.newPassword && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.newPassword}
                        </p>
                      )}
                    </div>

                    {/* Confirm New Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword.confirm ? "text" : "password"}
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordInputChange}
                          onBlur={() => handleBlur("confirmPassword")}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12 transition-all ${
                            errors.confirmPassword && touched.confirmPassword
                              ? "border-red-500 ring-1 ring-red-500"
                              : passwordData.confirmPassword &&
                                  passwordData.newPassword ===
                                    passwordData.confirmPassword
                                ? "border-green-500"
                                : "border-gray-300"
                          }`}
                          placeholder="Confirm your new password"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("confirm")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                          aria-label={
                            showPassword.confirm
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {showPassword.confirm ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                        {passwordData.confirmPassword &&
                          passwordData.newPassword ===
                            passwordData.confirmPassword && (
                            <div className="absolute right-10 top-1/2 -translate-y-1/2">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            </div>
                          )}
                      </div>
                      {errors.confirmPassword && touched.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 space-y-3">
                      <Button
                        type="submit"
                        variant="gradient"
                        size="lg"
                        isLoading={loading}
                        className="w-full"
                      >
                        {loading ? "Changing Password..." : "Change Password"}
                      </Button>

                      <div className="text-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setPasswordData({
                              password: "",
                              newPassword: "",
                              confirmPassword: "",
                            });
                            setTouched({});
                            setErrors({});
                          }}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          Clear Form
                        </Button>
                      </div>
                    </div>
                  </form>
                )}
              </Card>
            </motion.div>
          </div>
        </div>
      </AdminLayout>

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
        confirmText="OK"
        size="sm"
      >
        <div className="text-center py-4">
          <p className="text-gray-700 text-lg font-medium mb-2">
            {responseModal.message}
          </p>
          {responseModal.type === "success" && (
            <p className="text-gray-500 text-sm">
              Your changes have been saved successfully.
            </p>
          )}
        </div>
      </Modal>
    </>
  );
};
