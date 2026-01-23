// src/pages/auth/CompleteProfilePage.tsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";

import { useWatch } from "react-hook-form";
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
import toast from "react-hot-toast";

// Components
import { Card } from "../../shared/components/ui/Card";
import { Input } from "../../shared/components/ui/Input";
import { Modal } from "../../shared/components/ui/Modal";
import { MagneticButton } from "../../shared/components/animated/MagneticButton";
import { ProgressWizard } from "../../shared/components/wizard/ProgressWizard";
import { DocumentUpload } from "../../shared/components/upload/DocumentUpload";
import { DashboardLayout } from "@/shared/components/layout/DashboardLayout";

// Hooks
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useProfileData } from "@/features/merchant/hooks/useProfileData";
import { useSubmitProfile } from "@/features/merchant/hooks/useProfileComplete";

// Redux
import { setProfile } from "@/features/auth/slices/profileSlice";
import { RootState } from "@/app/store";

// Utils
import {
  createStorageKeys,
  loadSavedFormData,
  loadSavedStep,
  loadSavedFile,
  cleanupOldStorage,
  clearAllStorage,
  saveFilesInfo,
} from "@/shared/utils/storage";
import {
  profileSchema,
  step1Schema,
  validateBankInfo,
  type ProfileFormData,
} from "@/shared/utils/validators";

import { staggerContainer } from "../../shared/utils/animations";
import { extractErrorMessage } from "@/shared/utils/error";
import { DEFAULT_COUNTRY, WIZARD_STEPS } from "@/shared/utils/constants";
import { handleLogoSelection } from "@/shared/utils/file";
import {
  getDocumentUrl,
  normalizeProfileDocuments,
} from "@/shared/utils/document";
import { useAppDispatch, useAppSelector } from "@/app/hooks";

export const CompleteProfilePage: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id || "anonymous";
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Storage keys
  const STORAGE_KEYS = useMemo(() => createStorageKeys(userId), [userId]);

  // State
  const [currentStep, setCurrentStep] = useState(() =>
    loadSavedStep(STORAGE_KEYS.CURRENT_STEP),
  );
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(
    null,
  );
  const [validationAttempted, setValidationAttempted] = useState(false);
  const [isFormPrefilled, setIsFormPrefilled] = useState(false);
  const [formKey, setFormKey] = useState(() => Date.now());

  // Redux
  const reduxProfile = useAppSelector((state: RootState) => state.profile);

  // API
  const {
    data: profileData,
    isLoading: isLoadingProfile,
    isFetching,
    refetch: refetchProfile,
  } = useProfileData();
  const submitProfileMutation = useSubmitProfile();

  // Edit mode detection
  const isEditMode = useMemo(
    () => !!profileData?.id || !!reduxProfile?.id,
    [profileData, reduxProfile],
  );

  const profileId = useMemo(
    () => profileData?.id || reduxProfile?.id,
    [profileData?.id, reduxProfile?.id],
  );

  // Document states
  const [identityDoc, setIdentityDoc] = useState<File | null>(() =>
    loadSavedFile(STORAGE_KEYS.UPLOADED_FILES, "identityDoc"),
  );
  const [registrationDoc, setRegistrationDoc] = useState<File | null>(() =>
    loadSavedFile(STORAGE_KEYS.UPLOADED_FILES, "registrationDoc"),
  );
  const [taxDoc, setTaxDoc] = useState<File | null>(() =>
    loadSavedFile(STORAGE_KEYS.UPLOADED_FILES, "taxDoc"),
  );
  const [businessLogo, setBusinessLogo] = useState<File | null>(() =>
    loadSavedFile(STORAGE_KEYS.UPLOADED_FILES, "businessLogo"),
  );

  // Logo preview
  const [logoPreview, setLogoPreview] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_KEYS.LOGO_PREVIEW),
  );
  const [existingLogoUrl, setExistingLogoUrl] = useState<string | null>(null);

  // Form
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, touchedFields },
    trigger,
    reset,
    getValues,
    control,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: "onTouched",
    defaultValues: {
      country: DEFAULT_COUNTRY,
      ...loadSavedFormData(STORAGE_KEYS.FORM_DATA),
    },
  });

  const formValues = useWatch({ control });

  const hasUnsavedChanges =
    isDirty ||
    identityDoc !== null ||
    registrationDoc !== null ||
    taxDoc !== null ||
    businessLogo !== null;

  // Save form data to localStorage
  useEffect(() => {
    if (Object.keys(formValues).length > 0) {
      localStorage.setItem(STORAGE_KEYS.FORM_DATA, JSON.stringify(formValues));
    }
  }, [formValues, STORAGE_KEYS]);

  // Save current step
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_STEP, currentStep.toString());
  }, [currentStep, STORAGE_KEYS]);

  // Save uploaded files
  useEffect(() => {
    saveFilesInfo(STORAGE_KEYS.UPLOADED_FILES, {
      identityDoc,
      registrationDoc,
      taxDoc,
      businessLogo,
    });
  }, [identityDoc, registrationDoc, taxDoc, businessLogo, STORAGE_KEYS]);

  // Save logo preview
  useEffect(() => {
    if (logoPreview) {
      localStorage.setItem(STORAGE_KEYS.LOGO_PREVIEW, logoPreview);
    } else {
      localStorage.removeItem(STORAGE_KEYS.LOGO_PREVIEW);
    }
  }, [logoPreview, STORAGE_KEYS]);

  // Cleanup old storage
  useEffect(() => {
    cleanupOldStorage(STORAGE_KEYS);
  }, [STORAGE_KEYS]);

  // Handle logo change
  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await handleLogoSelection(e.target.files?.[0], (file, preview) => {
      setBusinessLogo(file);
      setLogoPreview(preview);
    });
  };

  // Remove logo
  const handleRemoveLogo = () => {
    setBusinessLogo(null);
    setLogoPreview(null);
    localStorage.removeItem(STORAGE_KEYS.LOGO_PREVIEW);
  };

  // Sync profile to Redux
  useEffect(() => {
    if (!profileData || isLoadingProfile) return;

    dispatch(
      setProfile({
        businessName: profileData.businessName || "",
        businessLogo: profileData.businessLogo || "",
        address: profileData.address || "",
        city: profileData.city || "",
        state: profileData.state || "",
        zipCode: profileData.zipCode || "",
        country: profileData.country || DEFAULT_COUNTRY,
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
        status: "pending",
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
  }, [profileData, isLoadingProfile, dispatch]);

  // Handle profile status
  useEffect(() => {
    if (isLoadingProfile) return;

    const status = profileData?.profileStatus || reduxProfile?.profileStatus;

    if (status === "approved" || status === "PENDING_VERIFICATION") {
      if (status === "PENDING_VERIFICATION") {
        toast.success("Your profile is under review!");
      } else {
        toast.success("Your profile is already verified!");
      }
      navigate("/merchant/dashboard");
    }
  }, [profileData, reduxProfile, isLoadingProfile, navigate]);

  // Prefill form
  const prefillForm = useCallback(() => {
    const sourceData = profileData || reduxProfile;

    if (!sourceData?.id || isLoadingProfile || isFormPrefilled) return;

    const formValues: ProfileFormData = {
      businessName: sourceData.businessName || "",
      address: sourceData.address || "",
      city: sourceData.city || "",
      state: sourceData.state || "",
      zipCode: sourceData.zipCode || "",
      country: sourceData.country || DEFAULT_COUNTRY,
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

    localStorage.removeItem(STORAGE_KEYS.FORM_DATA);
    localStorage.removeItem(STORAGE_KEYS.UPLOADED_FILES);
    localStorage.removeItem(STORAGE_KEYS.LOGO_PREVIEW);
    localStorage.setItem(STORAGE_KEYS.CURRENT_STEP, "1");

    reset(formValues, {
      keepDirty: false,
      keepErrors: false,
      keepDefaultValues: false,
    });

    if (sourceData.businessLogo) {
      setExistingLogoUrl(sourceData.businessLogo);
      setLogoPreview(sourceData.businessLogo);
    }

    setIsFormPrefilled(true);
    setFormKey(Date.now());
  }, [
    profileData,
    reduxProfile,
    isLoadingProfile,
    reset,
    isFormPrefilled,
    STORAGE_KEYS,
  ]);

  useEffect(() => {
    if (
      !isLoadingProfile &&
      (profileData || reduxProfile?.id) &&
      !isFormPrefilled
    ) {
      setTimeout(prefillForm, 0);
    }
  }, [
    profileData,
    reduxProfile,
    isLoadingProfile,
    isFormPrefilled,
    prefillForm,
  ]);

  // Prevent accidental navigation
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

  // Cleanup localStorage
  const cleanupLocalStorage = useCallback(() => {
    clearAllStorage(STORAGE_KEYS);
  }, [STORAGE_KEYS]);

  // Navigation handlers
  const handleNext = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setValidationAttempted(true);

    let isValid = false;

    if (currentStep === 1) {
      isValid = await trigger(
        Object.keys(step1Schema.shape) as (keyof ProfileFormData)[],
      );
    } else if (currentStep === 2) {
      const bankFields = getValues([
        "bankName",
        "accountNumber",
        "accountHolderName",
      ]);
      const hasBankInfo = bankFields.some(
        (field) => field && field.trim() !== "",
      );

      if (hasBankInfo) {
        isValid = await trigger([
          "bankName",
          "accountNumber",
          "accountHolderName",
        ]);
      } else {
        isValid = true;
      }
    }

    if (isValid) {
      setCurrentStep(currentStep + 1);
      setValidationAttempted(false);
    } else {
      toast.error("Please fix all validation errors before continuing", {
        duration: 3000,
      });
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    setValidationAttempted(false);
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

  // Form submission
  const onSubmit = async (data: ProfileFormData) => {
    setValidationAttempted(true);

    if (!isEditMode && !identityDoc) {
      toast.error("Please upload an identity document to continue");
      setCurrentStep(3);
      return;
    }

    const bankValidation = validateBankInfo(data);
    if (!bankValidation.valid) {
      toast.error(bankValidation.error!);
      setCurrentStep(2);
      return;
    }

    const currentProfileId = profileData?.id || reduxProfile?.id;
    const isCurrentlyEditing = !!currentProfileId;

    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, value.toString());
      }
    });

    if (businessLogo) formData.append("businessLogo", businessLogo);
    if (identityDoc) formData.append("identityDocument", identityDoc);
    if (registrationDoc)
      formData.append("registrationDocument", registrationDoc);
    if (taxDoc) formData.append("taxDocument", taxDoc);

    submitProfileMutation.mutate(
      {
        formData,
        isEdit: isCurrentlyEditing,
        profileId: currentProfileId,
      },
      {
        // Update the onSubmit success handler in CompleteProfilePage.tsx

        // Replace the onSuccess callback in the submitProfileMutation.mutate call with this:

        onSuccess: (response) => {
          // Handle different response structures
          const responseProfile = response?.data || response;

          // Extract profile data with proper fallbacks
          const profileId = responseProfile?.id || currentProfileId;
          const businessLogoUrl =
            responseProfile?.businessLogo || existingLogoUrl || "";

          // Normalize documents to ensure consistent structure
          const documentsData = normalizeProfileDocuments(
            responseProfile?.documents,
          );

          dispatch(
            setProfile({
              ...data,
              id: profileId,
              status: "pending",
              profileStatus: "pending",
              businessLogo: businessLogoUrl,
              lastUpdated: new Date().toISOString(),
              submittedAt: new Date().toISOString(),
              documents: documentsData,
              loading: false,
              error: "",
              updateSuccess: true,
            }),
          );

          cleanupLocalStorage();

          toast.success(
            isCurrentlyEditing
              ? "Profile updated successfully!"
              : "Profile submitted for verification!",
            { duration: 3000 },
          );

          refetchProfile();

          setTimeout(() => {
            navigate("/merchant/dashboard");
          }, 1500);
        },

        onError: (error: unknown) => {
          const errorMessage = extractErrorMessage(
            error,
            "Failed to submit profile. Please try again.",
          );
          toast.error(errorMessage, { duration: 5000 });
        },
      },
    );
  };

  // Loading state
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
                        ? "Your profile is currently being reviewed."
                        : "You are updating your existing profile."}
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
                ? "Update your business information"
                : "Provide your business details to start creating gift cards"}
            </p>
          </motion.div>

          {/* Progress Wizard */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <ProgressWizard steps={WIZARD_STEPS} currentStep={currentStep} />
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            key={formKey}
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
                          Business Logo {isEditMode && "(Optional)"}
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
                                    Remove
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
                          error={
                            touchedFields.businessName || validationAttempted
                              ? errors.businessName?.message
                              : undefined
                          }
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
                          error={
                            touchedFields.address || validationAttempted
                              ? errors.address?.message
                              : undefined
                          }
                          {...register("address")}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            label="City *"
                            placeholder="Mumbai"
                            error={
                              touchedFields.city || validationAttempted
                                ? errors.city?.message
                                : undefined
                            }
                            {...register("city")}
                          />
                          <Input
                            label="State/Province"
                            placeholder="Maharashtra"
                            error={
                              touchedFields.state
                                ? errors.state?.message
                                : undefined
                            }
                            {...register("state")}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            label="ZIP/Postal Code"
                            placeholder="400001"
                            error={
                              touchedFields.zipCode
                                ? errors.zipCode?.message
                                : undefined
                            }
                            {...register("zipCode")}
                          />
                          <Input
                            label="Country *"
                            placeholder="India"
                            error={
                              touchedFields.country || validationAttempted
                                ? errors.country?.message
                                : undefined
                            }
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
                            label="Business Phone"
                            placeholder="+919876543210"
                            error={
                              touchedFields.businessPhone
                                ? errors.businessPhone?.message
                                : undefined
                            }
                            {...register("businessPhone")}
                          />
                          <Input
                            label="Business Email *"
                            type="email"
                            placeholder="business@example.com"
                            error={
                              touchedFields.businessEmail || validationAttempted
                                ? errors.businessEmail?.message
                                : undefined
                            }
                            {...register("businessEmail")}
                          />
                        </div>

                        <Input
                          label="Website (Optional)"
                          placeholder="https://yourbusiness.com"
                          error={
                            touchedFields.website
                              ? errors.website?.message
                              : undefined
                          }
                          {...register("website")}
                        />
                      </div>

                      {/* Optional Fields */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900">
                          Additional Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            label="Business Registration Number"
                            placeholder="REG123456"
                            error={
                              touchedFields.businessRegistrationNumber
                                ? errors.businessRegistrationNumber?.message
                                : undefined
                            }
                            {...register("businessRegistrationNumber")}
                          />
                          <Input
                            label="Tax ID"
                            placeholder="TAX123456"
                            error={
                              touchedFields.taxId
                                ? errors.taxId?.message
                                : undefined
                            }
                            {...register("taxId")}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            label="Business Type"
                            placeholder="E-commerce, Restaurant, etc."
                            error={
                              touchedFields.businessType
                                ? errors.businessType?.message
                                : undefined
                            }
                            {...register("businessType")}
                          />
                          <Input
                            label="Business Category"
                            placeholder="Retail, Services, etc."
                            error={
                              touchedFields.businessCategory
                                ? errors.businessCategory?.message
                                : undefined
                            }
                            {...register("businessCategory")}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description (Optional)
                          </label>
                          <textarea
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                              touchedFields.description && errors.description
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:ring-blue-500"
                            }`}
                            rows={3}
                            placeholder="Brief description of your business..."
                            {...register("description")}
                          />
                          {touchedFields.description && errors.description && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.description.message}
                            </p>
                          )}
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
                          (Optional)
                        </p>
                      </div>

                      <div className="space-y-4">
                        <Input
                          label="Bank Name"
                          placeholder="HDFC Bank, ICICI Bank, etc."
                          error={
                            touchedFields.bankName || validationAttempted
                              ? errors.bankName?.message
                              : undefined
                          }
                          {...register("bankName")}
                        />

                        <Input
                          label="Account Number"
                          placeholder="1234567890"
                          error={
                            touchedFields.accountNumber || validationAttempted
                              ? errors.accountNumber?.message
                              : undefined
                          }
                          {...register("accountNumber")}
                        />

                        <Input
                          label="Account Holder Name"
                          placeholder="As per bank records"
                          error={
                            touchedFields.accountHolderName ||
                            validationAttempted
                              ? errors.accountHolderName?.message
                              : undefined
                          }
                          {...register("accountHolderName")}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            label="IFSC Code (India)"
                            placeholder="HDFC0000123"
                            error={
                              touchedFields.ifscCode
                                ? errors.ifscCode?.message
                                : undefined
                            }
                            {...register("ifscCode")}
                          />

                          <Input
                            label="SWIFT Code (International)"
                            placeholder="HDFCINBB"
                            error={
                              touchedFields.swiftCode
                                ? errors.swiftCode?.message
                                : undefined
                            }
                            {...register("swiftCode")}
                          />
                        </div>
                      </div>

                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <p className="text-sm text-yellow-800">
                          <strong>Note:</strong> Your bank details will be kept
                          secure and used only for processing payments. Bank
                          information is optional but required for receiving
                          payments.
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
                            ? "Upload new documents only if needed"
                            : "Upload documents to verify your business"}
                        </p>
                      </div>

                      <div className="space-y-6">
                        <DocumentUpload
                          label={`Identity Document ${isEditMode ? "(Optional)" : "(Required *)"}`}
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
                              ? "Leave empty to keep existing document"
                              : "Upload Aadhaar, PAN, Passport, or Driver's License"
                          }
                          error={
                            validationAttempted && !isEditMode && !identityDoc
                              ? "Identity document is required"
                              : undefined
                          }
                          existingDocumentUrl={
                            isEditMode
                              ? getDocumentUrl(profileData?.identityDocument)
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
                          helperText="GST Certificate, Shop Act License, etc."
                          existingDocumentUrl={
                            isEditMode
                              ? getDocumentUrl(
                                  profileData?.registrationDocument,
                                )
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
                          helperText="GST Registration or Tax Registration Document"
                          existingDocumentUrl={
                            isEditMode
                              ? getDocumentUrl(profileData?.taxDocument)
                              : undefined
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
                                ? "Your updated profile will be reviewed within 24-48 hours."
                                : "Our team will review your documents within 24-48 hours."}
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
                You have unsaved changes. Are you sure you want to leave?
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
