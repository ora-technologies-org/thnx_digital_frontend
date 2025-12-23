// src/features/merchant/components/EditMerchantProfile.tsx
import useAuthMe, { UserData } from "@/features/merchant/hooks/useAuthMe";
import useUpdateProfile from "@/features/merchant/hooks/UseUpdateProfile";
import { useState } from "react";

export const EditMerchantProfile = () => {
  // Initialize formData directly from userData, avoiding useEffect
  const { data: userData, isLoading, error } = useAuthMe();

  const [formData, setFormData] = useState<UserData>(() => ({
    name: userData?.name || "",
    phone: userData?.phone || "",
    bio: userData?.bio || "",
  }));

  const [errors, setErrors] = useState<Partial<UserData>>({});

  // Update profile mutation
  const updateProfileMutation = useUpdateProfile();

  // Update formData when userData changes (without useEffect)
  // This approach is more efficient and avoids the ESLint warning
  const currentFormData = userData
    ? {
        name: formData.name || userData.name,
        phone: formData.phone || userData.phone,
        bio: formData.bio || userData.bio,
      }
    : formData;

  const validateForm = (): boolean => {
    const newErrors: Partial<UserData> = {};

    if (!currentFormData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!currentFormData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^\d{10}$/.test(currentFormData.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }

    if (!currentFormData.bio.trim()) {
      newErrors.bio = "Bio is required";
    } else if (currentFormData.bio.length > 500) {
      newErrors.bio = "Bio must be less than 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      updateProfileMutation.mutate(currentFormData, {
        onSuccess: () => {
          alert("Profile updated successfully!");
        },
        onError: (error: unknown) => {
          const errorMessage =
            error instanceof Error
              ? error.message
              : (error as { response?: { data?: { message?: string } } })
                  ?.response?.data?.message || "Failed to update profile";
          alert(errorMessage);
        },
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name as keyof UserData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-sm sm:text-base text-gray-600">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
        <h3 className="text-red-800 font-semibold mb-2 text-sm sm:text-base">
          Error Loading Profile
        </h3>
        <p className="text-red-600 text-sm">
          {error instanceof Error
            ? error.message
            : "Failed to load profile data"}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      {/* Name Field */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={currentFormData.name}
          onChange={handleChange}
          className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm sm:text-base ${
            errors.name ? "border-red-500 bg-red-50" : "border-gray-300"
          }`}
          placeholder="Enter your name"
        />
        {errors.name && (
          <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      {/* Phone Field */}
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Phone <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={currentFormData.phone}
          onChange={handleChange}
          className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm sm:text-base ${
            errors.phone ? "border-red-500 bg-red-50" : "border-gray-300"
          }`}
          placeholder="Enter your phone number"
          maxLength={10}
        />
        {errors.phone && (
          <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.phone}</p>
        )}
      </div>

      {/* Bio Field */}
      <div>
        <label
          htmlFor="bio"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Bio <span className="text-red-500">*</span>
        </label>
        <textarea
          id="bio"
          name="bio"
          value={currentFormData.bio}
          onChange={handleChange}
          rows={4}
          className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none text-sm sm:text-base ${
            errors.bio ? "border-red-500 bg-red-50" : "border-gray-300"
          }`}
          placeholder="Tell us about yourself"
          maxLength={500}
        />
        <div className="flex justify-between mt-1">
          {errors.bio ? (
            <p className="text-xs sm:text-sm text-red-600">{errors.bio}</p>
          ) : (
            <span className="text-xs sm:text-sm text-gray-500">
              {currentFormData.bio.length}/500 characters
            </span>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
        <button
          type="submit"
          disabled={updateProfileMutation.isPending}
          className={`w-full sm:flex-1 py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-medium text-white transition text-sm sm:text-base ${
            updateProfileMutation.isPending
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {updateProfileMutation.isPending ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Updating...
            </span>
          ) : (
            "Update Profile"
          )}
        </button>
      </div>
    </form>
  );
};

export default EditMerchantProfile;
