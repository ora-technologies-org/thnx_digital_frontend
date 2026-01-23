// src/features/merchant/components/EditMerchantProfile.tsx
import useAuthMe from "@/features/merchant/hooks/useAuthMe";
import useUpdateProfile from "@/features/merchant/hooks/UseUpdateProfile";
import { Spinner } from "@/shared/components/ui/Spinner";
import { Button } from "@/shared/components/ui/Button";
import { Modal } from "@/shared/components/ui/Modal";
import { useState, useMemo } from "react";
import { UserData } from "@/features/merchant/services/DashboardService";

export const EditMerchantProfile = () => {
  const { data: userData, isLoading, error, refetch } = useAuthMe();

  // Track user edits separately from the base data
  const [formEdits, setFormEdits] = useState<Partial<UserData>>({});

  const [errors, setErrors] = useState<Partial<UserData>>({});

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<
    "success" | "error" | "info" | "warning"
  >("info");
  const [isLoadingModal, setIsLoadingModal] = useState(false);

  // Update profile mutation
  const updateProfileMutation = useUpdateProfile();

  // Derive formData from userData and formEdits - no useEffect needed!
  const formData = useMemo<UserData>(
    () => ({
      name: formEdits.name ?? userData?.name ?? "",
      phone: formEdits.phone ?? userData?.phone ?? "",
      bio: formEdits.bio ?? userData?.bio ?? "",
    }),
    [formEdits, userData],
  );

  // Show modal helper function
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

  const validateForm = (): boolean => {
    const newErrors: Partial<UserData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }

    if (!formData.bio.trim()) {
      newErrors.bio = "Bio is required";
    } else if (formData.bio.length > 500) {
      newErrors.bio = "Bio must be less than 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoadingModal(true);
      updateProfileMutation.mutate(formData, {
        onSuccess: () => {
          setIsLoadingModal(false);
          showResponseModal(
            "Success!",
            "Your profile has been updated successfully.",
            "success",
          );
          // Clear form edits after successful save so form shows fresh userData
          setFormEdits({});
          // Refetch the user data to get updated information
          refetch();
        },
        onError: (error: unknown) => {
          setIsLoadingModal(false);
          const errorMessage =
            error instanceof Error
              ? error.message
              : (error as { response?: { data?: { message?: string } } })
                  ?.response?.data?.message || "Failed to update profile";

          showResponseModal("Update Failed", errorMessage, "error");
        },
      });
    } else {
      showResponseModal(
        "Validation Error",
        "Please fix the errors in the form before submitting.",
        "warning",
      );
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormEdits((prev: Partial<UserData>) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name as keyof UserData]) {
      setErrors((prev: Partial<UserData>) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    // If it was a success modal, we could do additional cleanup or navigation here
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
        <h3 className="text-red-800 font-semibold mb-2 text-sm sm:text-base">
          Error Loading Profile
        </h3>
        <p className="text-red-600 text-sm mb-4">
          {error instanceof Error
            ? error.message
            : "Failed to load profile data"}
        </p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <>
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
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm sm:text-base ${
              errors.name ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
            placeholder="Enter your name"
          />
          {errors.name && (
            <p className="mt-1 text-xs sm:text-sm text-red-600">
              {errors.name}
            </p>
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
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm sm:text-base ${
              errors.phone ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
            placeholder="Enter your phone number"
            maxLength={10}
          />
          {errors.phone && (
            <p className="mt-1 text-xs sm:text-sm text-red-600">
              {errors.phone}
            </p>
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
            value={formData.bio}
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
                {formData.bio.length}/500 characters
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
          <Button
            type="submit"
            variant="gradient"
            size="lg"
            isLoading={updateProfileMutation.isPending || isLoadingModal}
            className="flex-1"
          >
            {updateProfileMutation.isPending || isLoadingModal
              ? "Updating..."
              : "Update Profile"}
          </Button>
        </div>
      </form>

      {/* Response Modal */}
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
          {modalType === "success" && (
            <p className="text-sm text-gray-500 mt-4">
              Your changes have been saved successfully.
            </p>
          )}
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

export default EditMerchantProfile;
