// src/pages/auth/CompleteProfilePage.tsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  Building,
  MapPin,
  Phone,
  FileText,
  CreditCard,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  Loader2,
  Upload,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { Card } from "../../shared/components/ui/Card";
import { Input } from "../../shared/components/ui/Input";
import { Modal } from "../../shared/components/ui/Modal";
import { MagneticButton } from "../../shared/components/animated/MagneticButton";
import {
  ProgressWizard,
  WizardStep,
} from "../../shared/components/wizard/ProgressWizard";
import { DocumentUpload } from "../../shared/components/upload/DocumentUpload";
import { staggerContainer } from "../../shared/utils/animations";
import toast from "react-hot-toast";
import { DashboardLayout } from "@/shared/components/layout/DashboardLayout";

// Redux actions
import { setProfile } from "@/features/auth/slices/profileSlice";

// Custom hooks
import { useProfileData } from "@/features/merchant/hooks/useProfileData";
import { useSubmitProfile } from "@/features/merchant/hooks/useProfileComplete";
import { RootState } from "@/app/store";

// Zod Schema
const profileSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().min(2, "Country is required"),
  businessPhone: z.string().min(10, "Business phone is required"),
  businessEmail: z.string().email("Invalid business email"),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  bankName: z.string().min(2, "Bank name is required"),
  accountNumber: z.string().min(5, "Account number is required"),
  accountHolderName: z.string().min(2, "Account holder name is required"),
  ifscCode: z.string().optional(),
  swiftCode: z.string().optional(),
  businessRegistrationNumber: z.string().optional(),
  taxId: z.string().optional(),
  businessType: z.string().optional(),
  businessCategory: z.string().optional(),
  description: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const wizardSteps: WizardStep[] = [
  { id: 1, title: "Business Details", description: "Address & Contact" },
  { id: 2, title: "Bank Information", description: "Payment Details" },
  { id: 3, title: "Documents", description: "Verification Files" },
];

export const CompleteProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(
    null,
  );
  const [validationAttempted, setValidationAttempted] = useState(false);
  const [isFormPrefilled, setIsFormPrefilled] = useState(false);

  // Get profile from Redux store
  const reduxProfile = useSelector((state: RootState) => state.profile);

  // Fetch profile data from API
  const {
    data: profileData,
    isLoading: isLoadingProfile,
    isFetching,
    refetch: refetchProfile,
  } = useProfileData();

  const submitProfileMutation = useSubmitProfile();

  // Determine edit mode from BOTH sources - use useMemo to avoid recalculation
  const isEditMode = useMemo(() => {
    const hasApiProfileId = !!profileData?.id;
    const hasReduxProfileId = !!reduxProfile?.id;
    const editMode = hasApiProfileId || hasReduxProfileId;

    console.log("🔍 Edit Mode Calculation:", {
      hasApiProfileId,
      apiProfileId: profileData?.id,
      hasReduxProfileId,
      reduxProfileId: reduxProfile?.id,
      finalEditMode: editMode,
    });

    return editMode;
  }, [profileData, reduxProfile]); // Watch entire objects

  // Get profile ID from either source
  const profileId = useMemo(() => {
    return profileData?.id || reduxProfile?.id;
  }, [profileData?.id, reduxProfile?.id]);

  // Document states
  const [identityDoc, setIdentityDoc] = useState<File | null>(null);
  const [registrationDoc, setRegistrationDoc] = useState<File | null>(null);
  const [taxDoc, setTaxDoc] = useState<File | null>(null);

  // Business Logo state
  const [businessLogo, setBusinessLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [existingLogoUrl, setExistingLogoUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    trigger,
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      country: "India",
    },
  });

  const hasUnsavedChanges =
    isDirty ||
    identityDoc !== null ||
    registrationDoc !== null ||
    taxDoc !== null ||
    businessLogo !== null;

  // Log edit mode status whenever it changes
  useEffect(() => {
    console.log("🔍 Current State:", {
      isEditMode,
      profileId,
      hasProfileData: !!profileData,
      hasReduxProfile: !!reduxProfile?.id,
      profileStatus: profileData?.profileStatus || reduxProfile?.profileStatus,
    });
  }, [isEditMode, profileId, profileData, reduxProfile]);

  // Debug profile loading
  useEffect(() => {
    console.log("🔍 Profile Loading Debug:", {
      isLoadingProfile,
      isFetching,
      profileData,
      reduxProfile,
      isEditMode,
      profileId: profileData?.id || reduxProfile?.id,
      formPrefilled: isFormPrefilled,
    });
  }, [
    isLoadingProfile,
    isFetching,
    profileData,
    reduxProfile,
    isEditMode,
    isFormPrefilled,
  ]);

  // Handle logo file selection
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/svg+xml",
    ];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (PNG, JPG, or SVG)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Logo file size should not exceed 5MB");
      return;
    }

    setBusinessLogo(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Remove logo
  const handleRemoveLogo = () => {
    setBusinessLogo(null);
    setLogoPreview(null);
  };

  // Sync profile data to Redux when fetched from API
  useEffect(() => {
    if (!profileData || isLoadingProfile) return;

    console.log("🔄 Syncing API data to Redux:", profileData);

    // Update Redux store with fetched data
    dispatch(
      setProfile({
        businessName: profileData.businessName || "",
        businessLogo: profileData.businessLogo || "",
        address: profileData.address || "",
        city: profileData.city || "",
        state: profileData.state || "",
        zipCode: profileData.zipCode || "",
        country: profileData.country || "India",
        businessPhone: profileData.businessPhone || "",
        businessEmail: profileData.businessEmail || "",
        website: profileData.website || "",
        bankName: profileData.bankName || "",
        accountNumber: profileData.accountNumber || "",
        accountHolderName: profileData.accountHolderName || "",
        ifscCode: profileData.ifscCode || "",
        swiftCode: profileData.swiftCode || "",
        businessRegistrationNumber:
          profileData.businessRegistrationNumber || "",
        taxId: profileData.taxId || "",
        businessType: profileData.businessType || "",
        businessCategory: profileData.businessCategory || "",
        description: profileData.description || "",
        id: profileData.id,
        status: profileData.profileStatus || "incomplete",
        profileStatus: profileData.profileStatus,
        lastUpdated: profileData.updatedAt || new Date().toISOString(),
        submittedAt: profileData.submittedAt,
        rejectionReason: profileData.rejectionReason,
        documents: {},
        profile: null,
        loading: false,
        error: "",
        updateSuccess: false,
      }),
    );

    console.log("✅ Redux store updated with API data");
  }, [profileData, isLoadingProfile, dispatch]);

  // Handle profile status and navigation
  useEffect(() => {
    if (isLoadingProfile) return;

    const status = profileData?.profileStatus || reduxProfile?.profileStatus;

    console.log("🔍 Profile status check:", {
      status,
      hasProfileData: !!profileData,
      profileId: profileData?.id || reduxProfile?.id,
    });

    // Only redirect if status is approved
    if (status === "approved" || status === "PENDING_VERIFICATION") {
      if (status === "PENDING_VERIFICATION") {
        toast.success("Your profile is under review!");
      } else {
        toast.success("Your profile is already verified!");
      }
      navigate("/merchant/dashboard");
      return;
    }
  }, [profileData, reduxProfile, isLoadingProfile, navigate]);

  // Prefill form with fetched data from both API and Redux
  const prefillForm = useCallback(() => {
    // Use API data first, then Redux as fallback
    const sourceData = profileData || reduxProfile;

    // Skip if no data or still loading or already prefilled
    if (!sourceData?.id || isLoadingProfile || isFormPrefilled) {
      return;
    }

    console.log("🔄 Prefilling form with data:", {
      source: profileData ? "API" : "Redux",
      profileId: sourceData.id,
      businessName: sourceData.businessName,
      status: sourceData.profileStatus,
    });

    const formValues: ProfileFormData = {
      businessName: sourceData.businessName || "",
      address: sourceData.address || "",
      city: sourceData.city || "",
      state: sourceData.state || "",
      zipCode: sourceData.zipCode || "",
      country: sourceData.country || "India",
      businessPhone: sourceData.businessPhone || "",
      businessEmail: sourceData.businessEmail || "",
      website: sourceData.website || "",
      bankName: sourceData.bankName || "",
      accountNumber: sourceData.accountNumber || "",
      accountHolderName: sourceData.accountHolderName || "",
      ifscCode: sourceData.ifscCode || "",
      swiftCode: sourceData.swiftCode || "",
      businessRegistrationNumber: sourceData.businessRegistrationNumber || "",
      taxId: sourceData.taxId || "",
      businessType: sourceData.businessType || "",
      businessCategory: sourceData.businessCategory || "",
      description: sourceData.description || "",
    };

    console.log("📝 Setting form values:", formValues);

    // Reset form with fetched data
    reset(formValues, {
      keepDirty: false,
      keepErrors: false,
      keepDefaultValues: false,
    });

    // Set existing logo URL
    if (sourceData.businessLogo) {
      console.log("🖼️ Setting existing logo URL:", sourceData.businessLogo);
      setExistingLogoUrl(sourceData.businessLogo);
    }

    // Mark form as prefilled
    setIsFormPrefilled(true);

    console.log(
      "✅ Form prefilled successfully from",
      profileData ? "API" : "Redux",
    );
  }, [profileData, reduxProfile, isLoadingProfile, reset, isFormPrefilled]);

  // Run prefill when data is available
  useEffect(() => {
    if (
      !isLoadingProfile &&
      (profileData || reduxProfile?.id) &&
      !isFormPrefilled
    ) {
      // Use setTimeout to avoid setState in synchronous effect
      setTimeout(() => {
        prefillForm();
      }, 0);
    }
  }, [
    profileData,
    reduxProfile,
    isLoadingProfile,
    isFormPrefilled,
    prefillForm,
  ]);

  // Prevent accidental navigation with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && !submitProfileMutation.isPending) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges, submitProfileMutation.isPending]);

  const handleNext = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    let fieldsToValidate: (keyof ProfileFormData)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = [
        "businessName",
        "address",
        "city",
        "country",
        "businessPhone",
        "businessEmail",
      ];
    } else if (currentStep === 2) {
      fieldsToValidate = ["bankName", "accountNumber", "accountHolderName"];
    }

    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      setCurrentStep(currentStep + 1);
      setValidationAttempted(false); // Reset validation attempted when navigating
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    setValidationAttempted(false); // Reset validation attempted when navigating
  };

  const handleConfirmLeave = () => {
    setShowUnsavedModal(false);
    if (pendingNavigation) {
      navigate(pendingNavigation);
      setPendingNavigation(null);
    }
  };

  const handleCancelLeave = () => {
    setShowUnsavedModal(false);
    setPendingNavigation(null);
  };

  // In the onSubmit function, replace the FormData creation section:
  const onSubmit = async (data: ProfileFormData) => {
    // Log current state for debugging
    console.log("📝 Form submission started", {
      hasProfileData: !!profileData,
      profileId: profileData?.id,
      hasReduxProfile: !!reduxProfile?.id,
      reduxProfileId: reduxProfile?.id,
    });

    setValidationAttempted(true); // Set validation attempted only on submit

    // Determine edit mode based on ACTUAL profile ID existence
    const currentProfileId = profileData?.id || reduxProfile?.id;
    const isCurrentlyEditing = !!currentProfileId;

    console.log("🔍 Edit mode determination:", {
      currentProfileId,
      isCurrentlyEditing,
      profileDataId: profileData?.id,
      reduxProfileId: reduxProfile?.id,
    });

    // Validation: Identity document is required for NEW profiles only
    // ONLY validate on submit, not when navigating
    if (!isCurrentlyEditing && !identityDoc) {
      toast.error("Please upload an identity document to continue");
      setCurrentStep(3);
      return;
    }

    // If we're in edit mode but don't have a profile ID, something is wrong
    if (isCurrentlyEditing && !currentProfileId) {
      console.error("❌ CRITICAL: Edit mode but no profile ID found!");
      toast.error("Profile ID not found. Please refresh and try again.");
      return;
    }

    const formData = new FormData();

    // Append all form fields
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, value.toString());
      }
    });

    // Append business logo if a new one is uploaded
    // DO NOT append keepExistingLogo - backend doesn't accept it
    if (businessLogo) {
      formData.append("businessLogo", businessLogo);
      console.log("🖼️ Adding new business logo:", businessLogo.name);
    }
    // Note: If editing and not uploading new logo, we don't need to send anything
    // The backend should keep the existing logo automatically

    // Append documents only if new ones are uploaded (optional for edit mode)
    if (identityDoc) {
      formData.append("identityDocument", identityDoc);
      console.log("📄 Adding identity document:", identityDoc.name);
    }

    if (registrationDoc) {
      formData.append("registrationDocument", registrationDoc);
      console.log("📄 Adding registration document:", registrationDoc.name);
    }

    if (taxDoc) {
      formData.append("taxDocument", taxDoc);
      console.log("📄 Adding tax document:", taxDoc.name);
    }

    // DO NOT add _method - backend doesn't accept it
    // The HTTP method (PUT vs POST) is determined by the endpoint URL

    console.log("📤 Final submission details:", {
      method: isCurrentlyEditing ? "PUT" : "POST",
      profileId: currentProfileId,
      isEdit: isCurrentlyEditing,
      endpoint: isCurrentlyEditing
        ? `/merchants/${currentProfileId}`
        : "/auth/merchant/complete-profile",
      formDataSize: Array.from(formData.entries()).length,
    });

    // Log all FormData entries for debugging
    console.log("📦 FormData Contents:");
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(
          `  - ${key}: [File: ${value.name}, ${value.size} bytes, ${value.type}]`,
        );
      } else {
        console.log(`  - ${key}: ${value}`);
      }
    }

    // Submit the form
    submitProfileMutation.mutate(
      {
        formData,
        isEdit: isCurrentlyEditing,
        profileId: currentProfileId,
      },
      {
        onSuccess: (response) => {
          console.log("✅ Profile submission successful:", response);

          // Get the response profile data
          const responseProfile = response?.data || response;

          // Update Redux store with response
          dispatch(
            setProfile({
              ...data,
              id: currentProfileId || responseProfile?.id,
              status: "pending",
              profileStatus: "pending",
              businessLogo:
                responseProfile?.businessLogo || existingLogoUrl || "",
              lastUpdated: new Date().toISOString(),
              submittedAt: new Date().toISOString(),
              documents: responseProfile?.documents || {},
              loading: false,
              error: "",
              updateSuccess: true,
            }),
          );

          toast.success(
            isCurrentlyEditing
              ? "Profile updated successfully!"
              : "Profile submitted for verification!",
            { duration: 3000 },
          );

          // Refetch profile data
          refetchProfile();

          // Navigate after a brief delay
          setTimeout(() => {
            navigate("/merchant/dashboard");
          }, 1500);
        },
        onError: (error: unknown) => {
          console.error("❌ Profile submission failed:", error);

          let errorMessage = "Failed to submit profile. Please try again.";

          if (
            error &&
            typeof error === "object" &&
            "response" in error &&
            error.response &&
            typeof error.response === "object" &&
            "data" in error.response
          ) {
            const responseData = (error.response as { data?: unknown }).data;

            if (responseData && typeof responseData === "object") {
              const dataObj = responseData as Record<string, unknown>;

              if (typeof dataObj.message === "string") {
                errorMessage = dataObj.message;
              } else if (typeof dataObj.error === "string") {
                errorMessage = dataObj.error;
              } else if (dataObj.errors && typeof dataObj.errors === "object") {
                const firstError = Object.values(dataObj.errors)[0];
                if (typeof firstError === "string") {
                  errorMessage = firstError;
                } else if (Array.isArray(firstError) && firstError.length > 0) {
                  errorMessage = firstError[0];
                }
              }
            }
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }

          toast.error(errorMessage, { duration: 5000 });
        },
      },
    );
  };

  // Show loading state
  if (isLoadingProfile || isFetching) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"
            />
            <p className="mt-4 text-gray-600">Loading profile data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Edit mode indicator */}
          {isEditMode && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 rounded-xl p-4 ${
                profileData?.profileStatus === "rejected"
                  ? "bg-red-50 border border-red-200"
                  : profileData?.profileStatus === "pending" ||
                      profileData?.profileStatus === "PENDING_VERIFICATION"
                    ? "bg-yellow-50 border border-yellow-200"
                    : "bg-blue-50 border border-blue-200"
              }`}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle
                  className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                    profileData?.profileStatus === "rejected"
                      ? "text-red-600"
                      : profileData?.profileStatus === "pending" ||
                          profileData?.profileStatus === "PENDING_VERIFICATION"
                        ? "text-yellow-600"
                        : "text-blue-600"
                  }`}
                />
                <div>
                  <p
                    className={`text-sm font-medium mb-1 ${
                      profileData?.profileStatus === "rejected"
                        ? "text-red-900"
                        : profileData?.profileStatus === "pending" ||
                            profileData?.profileStatus ===
                              "PENDING_VERIFICATION"
                          ? "text-yellow-900"
                          : "text-blue-900"
                    }`}
                  >
                    {profileData?.profileStatus === "rejected"
                      ? "Profile Rejected - Edit Required"
                      : profileData?.profileStatus === "pending" ||
                          profileData?.profileStatus === "PENDING_VERIFICATION"
                        ? "Profile Under Review - Edit if Needed"
                        : "Editing Existing Profile"}
                  </p>
                  <p
                    className={`text-sm ${
                      profileData?.profileStatus === "rejected"
                        ? "text-red-700"
                        : profileData?.profileStatus === "pending" ||
                            profileData?.profileStatus ===
                              "PENDING_VERIFICATION"
                          ? "text-yellow-700"
                          : "text-blue-700"
                    }`}
                  >
                    {profileData?.profileStatus === "rejected"
                      ? profileData.rejectionReason ||
                        "Please review and correct your information"
                      : profileData?.profileStatus === "pending" ||
                          profileData?.profileStatus === "PENDING_VERIFICATION"
                        ? "Your profile is currently being reviewed. You can still make edits if needed."
                        : "You are updating your existing profile. Upload new documents only if you want to replace existing ones."}
                  </p>
                  <p className="text-xs mt-2 text-gray-600">
                    Profile ID: {profileId}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isEditMode ? "Update Your Profile" : "Complete Your Profile"}
            </h1>
            <p className="text-gray-600">
              {isEditMode
                ? "Update your business information and resubmit for verification"
                : "Provide your business details to start creating gift cards"}
            </p>
          </motion.div>

          {/* Progress Wizard */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <ProgressWizard steps={wizardSteps} currentStep={currentStep} />
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <Card className="backdrop-blur-sm bg-white/90 border-2 border-gray-200/50 shadow-2xl p-6 md:p-8">
              <form onSubmit={handleSubmit(onSubmit)}>
                <AnimatePresence mode="wait">
                  {/* STEP 1: Business Details */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                          <Building className="w-6 h-6 text-blue-600" />
                          Business Details
                        </h2>
                        <p className="text-gray-600">
                          Tell us about your business location and contact
                          information
                        </p>
                      </div>

                      {/* Business Logo Upload */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                          <ImageIcon className="w-5 h-5 text-purple-600" />
                          Business Logo{" "}
                          {isEditMode && "(Optional - update if needed)"}
                        </h3>

                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-400 transition-colors">
                          {logoPreview || existingLogoUrl ? (
                            <div className="flex flex-col items-center gap-4">
                              <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200">
                                <img
                                  src={logoPreview || existingLogoUrl || ""}
                                  alt="Business Logo"
                                  className="w-full h-full object-contain bg-gray-50"
                                />
                              </div>
                              <div className="flex gap-2">
                                <label className="cursor-pointer">
                                  <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                                    onChange={handleLogoChange}
                                    className="hidden"
                                  />
                                  <span className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium inline-flex items-center gap-2">
                                    <Upload className="w-4 h-4" />
                                    Change Logo
                                  </span>
                                </label>
                                {logoPreview && (
                                  <button
                                    type="button"
                                    onClick={handleRemoveLogo}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium inline-flex items-center gap-2"
                                  >
                                    <X className="w-4 h-4" />
                                    Remove New
                                  </button>
                                )}
                              </div>
                              <p className="text-sm text-gray-500 text-center">
                                {logoPreview
                                  ? "New logo selected"
                                  : "Current logo"}{" "}
                                - PNG, JPG, or SVG up to 5MB
                              </p>
                            </div>
                          ) : (
                            <label className="cursor-pointer flex flex-col items-center gap-3">
                              <input
                                type="file"
                                accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                                onChange={handleLogoChange}
                                className="hidden"
                              />
                              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                                <Upload className="w-8 h-8 text-blue-600" />
                              </div>
                              <div className="text-center">
                                <p className="text-sm font-medium text-gray-900">
                                  Upload Business Logo
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  PNG, JPG, or SVG up to 5MB
                                </p>
                              </div>
                            </label>
                          )}
                        </div>
                      </div>

                      {/* Business Name */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                          <Building className="w-5 h-5 text-blue-600" />
                          Business Information
                        </h3>

                        <Input
                          label="Business Name *"
                          placeholder="Your Business Name"
                          error={errors.businessName?.message}
                          {...register("businessName")}
                        />
                      </div>

                      {/* Address Section */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-purple-600" />
                          Business Address
                        </h3>

                        <Input
                          label="Street Address *"
                          placeholder="123 Main Street"
                          error={errors.address?.message}
                          {...register("address")}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            label="City *"
                            placeholder="Mumbai"
                            error={errors.city?.message}
                            {...register("city")}
                          />
                          <Input
                            label="State/Province"
                            placeholder="Maharashtra"
                            error={errors.state?.message}
                            {...register("state")}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            label="ZIP/Postal Code"
                            placeholder="400001"
                            error={errors.zipCode?.message}
                            {...register("zipCode")}
                          />
                          <Input
                            label="Country *"
                            placeholder="India"
                            error={errors.country?.message}
                            {...register("country")}
                          />
                        </div>
                      </div>

                      {/* Contact Section */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                          <Phone className="w-5 h-5 text-green-600" />
                          Contact Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            label="Business Phone *"
                            placeholder="+919876543210"
                            error={errors.businessPhone?.message}
                            {...register("businessPhone")}
                          />
                          <Input
                            label="Business Email *"
                            type="email"
                            placeholder="business@example.com"
                            error={errors.businessEmail?.message}
                            {...register("businessEmail")}
                          />
                        </div>

                        <Input
                          label="Website (Optional)"
                          placeholder="https://yourbusiness.com"
                          error={errors.website?.message}
                          {...register("website")}
                        />
                      </div>

                      {/* Optional Fields */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900">
                          Additional Information (Optional)
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            label="Business Registration Number"
                            placeholder="REG123456"
                            {...register("businessRegistrationNumber")}
                          />
                          <Input
                            label="Tax ID"
                            placeholder="TAX123456"
                            {...register("taxId")}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            label="Business Type"
                            placeholder="E-commerce, Restaurant, etc."
                            {...register("businessType")}
                          />
                          <Input
                            label="Business Category"
                            placeholder="Retail, Services, etc."
                            {...register("businessCategory")}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            rows={3}
                            placeholder="Brief description of your business..."
                            {...register("description")}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: Bank Information */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                          <CreditCard className="w-6 h-6 text-blue-600" />
                          Bank Information
                        </h2>
                        <p className="text-gray-600">
                          Enter your bank details for receiving payments
                        </p>
                      </div>

                      <div className="space-y-4">
                        <Input
                          label="Bank Name *"
                          placeholder="HDFC Bank, ICICI Bank, etc."
                          error={errors.bankName?.message}
                          {...register("bankName")}
                        />

                        <Input
                          label="Account Number *"
                          placeholder="1234567890"
                          error={errors.accountNumber?.message}
                          {...register("accountNumber")}
                        />

                        <Input
                          label="Account Holder Name *"
                          placeholder="As per bank records"
                          error={errors.accountHolderName?.message}
                          {...register("accountHolderName")}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            label="IFSC Code (India)"
                            placeholder="HDFC0000123"
                            {...register("ifscCode")}
                          />
                          <Input
                            label="SWIFT Code (International)"
                            placeholder="HDFCINBB"
                            {...register("swiftCode")}
                          />
                        </div>
                      </div>

                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <p className="text-sm text-yellow-800">
                          <strong>Note:</strong> Your bank details will be kept
                          secure and used only for processing payments when
                          customers redeem gift cards at your store.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: Documents */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                          <FileText className="w-6 h-6 text-blue-600" />
                          Verification Documents
                        </h2>
                        <p className="text-gray-600">
                          {isEditMode
                            ? "Upload new documents only if you want to replace existing ones"
                            : "Upload documents to verify your business"}
                        </p>
                      </div>

                      <div className="space-y-6">
                        <DocumentUpload
                          label={`Identity Document ${
                            isEditMode
                              ? "(Optional - update if needed)"
                              : "(Required *)"
                          }`}
                          required={!isEditMode}
                          value={identityDoc}
                          onChange={setIdentityDoc}
                          accept={{
                            "application/pdf": [".pdf"],
                            "image/*": [".png", ".jpg", ".jpeg"],
                          }}
                          maxSize={10 * 1024 * 1024}
                          helperText={
                            isEditMode
                              ? "Leave empty to keep existing document, or upload new to replace"
                              : "Upload Aadhaar, PAN, Passport, or Driver's License (PDF, JPG, PNG up to 10MB)"
                          }
                          // Only show error if validation was attempted (on submit) AND we're not in edit mode AND no document
                          error={
                            validationAttempted && !isEditMode && !identityDoc
                              ? "Identity document is required"
                              : undefined
                          }
                          existingDocumentUrl={
                            isEditMode
                              ? profileData?.identityDocument
                              : undefined
                          }
                          existingDocumentName={
                            isEditMode ? "Identity Document" : undefined
                          }
                        />
                        <DocumentUpload
                          label="Business Registration Document (Optional)"
                          value={registrationDoc}
                          onChange={setRegistrationDoc}
                          accept={{
                            "application/pdf": [".pdf"],
                            "image/*": [".png", ".jpg", ".jpeg"],
                          }}
                          maxSize={10 * 1024 * 1024}
                          helperText="GST Certificate, Shop Act License, or Incorporation Certificate (PDF, JPG, PNG up to 10MB)"
                          // NEW: Add existing document info for edit mode
                          existingDocumentUrl={
                            isEditMode
                              ? profileData?.registrationDocument
                              : undefined
                          }
                          existingDocumentName={
                            isEditMode ? "Registration Document" : undefined
                          }
                        />
                        <DocumentUpload
                          label="Tax Document (Optional)"
                          value={taxDoc}
                          onChange={setTaxDoc}
                          accept={{
                            "application/pdf": [".pdf"],
                            "image/*": [".png", ".jpg", ".jpeg"],
                          }}
                          maxSize={10 * 1024 * 1024}
                          helperText="GST Registration or Tax Registration Document (PDF, JPG, PNG up to 10MB)"
                          // NEW: Add existing document info for edit mode
                          existingDocumentUrl={
                            isEditMode ? profileData?.taxDocument : undefined
                          }
                          existingDocumentName={
                            isEditMode ? "Tax Document" : undefined
                          }
                        />
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-blue-900 mb-1">
                              What happens next?
                            </p>
                            <p className="text-sm text-blue-700">
                              {isEditMode
                                ? "Your updated profile will be reviewed within 24-48 hours. You'll receive an email notification once verified."
                                : "Our team will review your documents within 24-48 hours. You'll receive an email notification once your account is verified and you can start creating gift cards!"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                  {currentStep > 1 ? (
                    <MagneticButton
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      disabled={submitProfileMutation.isPending}
                    >
                      <ArrowLeft className="mr-2 h-5 w-5" />
                      Back
                    </MagneticButton>
                  ) : (
                    <div />
                  )}

                  {currentStep < 3 ? (
                    <MagneticButton
                      type="button"
                      variant="primary"
                      onClick={handleNext}
                      disabled={submitProfileMutation.isPending}
                    >
                      Continue
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </MagneticButton>
                  ) : (
                    <MagneticButton
                      type="submit"
                      variant="primary"
                      disabled={submitProfileMutation.isPending}
                      className="min-w-[180px]"
                    >
                      {submitProfileMutation.isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                          {isEditMode ? "Updating..." : "Submitting..."}
                        </>
                      ) : (
                        <>
                          {isEditMode
                            ? "Update Profile"
                            : "Submit for Verification"}
                          <CheckCircle className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </MagneticButton>
                  )}
                </div>
              </form>
            </Card>
          </motion.div>

          {/* Debug Button (Optional - remove in production) */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                console.log("🔄 Debug Info:", {
                  isEditMode,
                  profileData,
                  reduxProfile,
                  profileId,
                  isFormPrefilled,
                  currentStep,
                  identityDoc,
                  registrationDoc,
                  taxDoc,
                  businessLogo,
                });
                refetchProfile();
              }}
              className="text-xs text-gray-500 underline"
            >
              Debug Info
            </button>
          </div>

          {/* Help Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center text-sm text-gray-500"
          >
            <p>
              Need help? Contact our support team at{" "}
              <a
                href="mailto:support@example.com"
                className="text-blue-600 hover:underline"
              >
                support@example.com
              </a>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Unsaved Changes Modal */}
      <Modal
        isOpen={showUnsavedModal}
        onClose={handleCancelLeave}
        title="Unsaved Changes"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-gray-700">
                You have unsaved changes. Are you sure you want to leave? Your
                progress will be lost.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancelLeave}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Stay on Page
            </button>
            <button
              type="button"
              onClick={handleConfirmLeave}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              Leave Anyway
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};
