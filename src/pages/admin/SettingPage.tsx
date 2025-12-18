import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { Card } from "../../shared/components/ui/Card";

import { jwtDecode } from "jwt-decode";
import { passwordService } from "@/features/admin/services/resetPasswordService";
import AdminLayout from "@/shared/components/layout/AdminLayout";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  fetchProfile,
  clearUpdateSuccess,
  clearError,
  updateProfile,
} from "@/features/auth/slices/adminprofileSlice";

interface DecodedToken {
  email: string;
  [key: string]: unknown;
}
interface ApiError {
  message?: string;
  errors?: Record<string, string[]>;
}

export const AdminSettingPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    profile,
    loading: profileLoading,
    error: profileError,
    updateSuccess,
  } = useAppSelector((state) => state.profile);

  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
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

  const [successMessage, setSuccessMessage] = useState("");

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "Reset", label: "Reset Password", icon: Lock },
  ];

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
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => {
        dispatch(clearUpdateSuccess());
        setSuccessMessage("");
      }, 3000);
    }
  }, [updateSuccess, dispatch]);

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
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
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
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };
  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSuccessMessage("");
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
    } catch (error: unknown) {
      console.error("Profile update error:", error);

      if (typeof error !== "object" || error === null) {
        setProfileErrors({
          general: "Something went wrong. Please try again.",
        });
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
        setProfileErrors({ general: apiError.message });
      } else {
        setProfileErrors({ general: "Profile update failed." });
      }
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrors({});

    if (!validatePasswordForm()) return;

    const email = getUserEmail();
    if (!email) {
      setErrors({
        general: "Unable to retrieve user email. Please login again.",
      });
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

      const response = await passwordService.changePassword(payload);
      setSuccessMessage(response.message || "Password changed successfully!");
      setPasswordData({ password: "", newPassword: "", confirmPassword: "" });
    } catch (error: unknown) {
      console.error("Password change error:", error);
      if (error instanceof Error) {
        setErrors({ general: error.message });
      } else {
        setErrors({ general: "Something went wrong. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">
            Manage your account and business settings
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-lg
                        transition-all duration-200
                        ${
                          isActive
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <Card className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                {tabs.find((t) => t.id === activeTab)?.label} Settings
              </h3>

              {activeTab === "profile" && (
                <form
                  onSubmit={handleProfileSubmit}
                  className="max-w-md space-y-6"
                >
                  {successMessage && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800">{successMessage}</p>
                    </div>
                  )}

                  {profileError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800">{profileError}</p>
                    </div>
                  )}

                  {profileErrors.general && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800">{profileErrors.general}</p>
                    </div>
                  )}

                  {/* Email (read-only) */}
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profile?.email || ""}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                    />
                  </div> */}

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        profileErrors.name
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter your name"
                    />
                    {profileErrors.name && (
                      <p className="mt-1 text-sm text-red-600">
                        {profileErrors.name}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        profileErrors.phone
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter your phone number (10 digits)"
                      maxLength={10}
                    />
                    {profileErrors.phone && (
                      <p className="mt-1 text-sm text-red-600">
                        {profileErrors.phone}
                      </p>
                    )}
                  </div>

                  {/* bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <input
                      type="text"
                      name="bio"
                      value={profileData.bio}
                      onChange={handleProfileInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        profileErrors.bio ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter bio"
                    />
                    {profileErrors.bio && (
                      <p className="mt-1 text-sm text-red-600">
                        {profileErrors.bio}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {profileLoading ? "Updating Profile..." : "Update Profile"}
                  </button>
                </form>
              )}

              {activeTab === "Reset" && (
                <form
                  onSubmit={handlePasswordSubmit}
                  className="max-w-md space-y-6"
                >
                  {successMessage && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800">{successMessage}</p>
                    </div>
                  )}

                  {errors.general && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800">{errors.general}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.current ? "text" : "password"}
                        name="password"
                        value={passwordData.password}
                        onChange={handlePasswordInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12 ${
                          errors.password ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("current")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword.current ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.new ? "text" : "password"}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12 ${
                          errors.newPassword
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("new")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword.new ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.newPassword}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.confirm ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12 ${
                          errors.confirmPassword
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("confirm")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword.confirm ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Changing Password..." : "Change Password"}
                  </button>
                </form>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
};
