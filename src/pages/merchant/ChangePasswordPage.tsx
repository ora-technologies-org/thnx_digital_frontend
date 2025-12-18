import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  CheckCircle,
  Shield,
  Eye,
  EyeOff,
  Check,
  Mail,
} from "lucide-react";
import { Card } from "../../shared/components/ui/Card";
import { Input } from "../../shared/components/ui/Input";
import { MagneticButton } from "../../shared/components/animated/MagneticButton";
import { fadeInUp, staggerContainer } from "../../shared/utils/animations";

import { useAppSelector } from "@/app/hooks";
import { useChangePassword } from "@/features/merchant/hooks/usechangePassword";

// Password validation with strength requirements
const changePasswordSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

/**
 * Change password page for authenticated users
 */
export const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { changePassword, isLoading, changeSuccess } = useChangePassword();

  // Get user email
  const user = useAppSelector((state) => state.auth.user);
  const userEmail = user?.email || "";

  // Local state for password visibility toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPasswordValue, setNewPasswordValue] = useState("");

  // Password strength requirements for visual feedback
  const requirements = [
    {
      label: "At least 8 characters long",
      test: (pwd: string) => pwd.length >= 8,
    },
    {
      label: "Contains at least one uppercase letter",
      test: (pwd: string) => /[A-Z]/.test(pwd),
    },
    {
      label: "Contains at least one lowercase letter",
      test: (pwd: string) => /[a-z]/.test(pwd),
    },
    {
      label: "Contains at least one number",
      test: (pwd: string) => /[0-9]/.test(pwd),
    },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      email: userEmail, // Pre-fill email from Redux state
    },
  });

  const newPassword = useWatch({
    control,
    name: "newPassword",
  });

  // Update password value for requirements checker
  React.useEffect(() => {
    setNewPasswordValue(newPassword || "");
  }, [newPassword]);

  /**
   * Submit password change to API
   */
  const onSubmit = async (data: ChangePasswordFormData) => {
    console.log("Submitting change password with:", {
      email: data.email,
      currentPassword: "***",
      newPassword: "***",
      confirmPassword: "***",
    });

    const success = await changePassword(
      data.email,
      data.currentPassword,
      data.newPassword,
      data.confirmPassword,
    );

    // On success, show success UI then redirect
    if (success) {
      setTimeout(() => {
        navigate("/dashboard"); // Redirect to dashboard or appropriate page
      }, 2000);
    }
  };

  /**
   * Navigate back after success
   */
  const handleGoBack = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div
        className="absolute top-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <motion.div
        className="w-full max-w-md relative z-10"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* Header */}
        <motion.div variants={fadeInUp} className="text-center mb-8">
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-xl"
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
          >
            <Shield className="h-8 w-8 text-white" />
          </motion.div>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Change{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Password
            </span>
          </h1>
          <p className="text-gray-600 text-lg">
            {changeSuccess
              ? "Password changed successfully!"
              : "Update your account password"}
          </p>
        </motion.div>

        {/* Form Card - Switches between form and success message */}
        <motion.div variants={fadeInUp}>
          <Card className="backdrop-blur-sm bg-white/90 border-2 border-gray-200/50 shadow-2xl">
            {!changeSuccess ? (
              // Password change form
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-8">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-gray-600 text-center mb-6"
                >
                  Please enter your current password and choose a new one.
                </motion.p>

                {/* Email input (pre-filled, read-only) */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="your.email@example.com"
                    error={errors.email?.message}
                    {...register("email")}
                    className="transition-all focus:scale-[1.02] bg-gray-50"
                    icon={<Mail className="w-5 h-5 text-gray-400" />}
                    readOnly
                  />
                </motion.div>

                {/* Current password input with visibility toggle */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative"
                >
                  <Input
                    label="Current Password"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="••••••••"
                    error={errors.currentPassword?.message}
                    {...register("currentPassword")}
                    className="transition-all focus:scale-[1.02] pr-12"
                    icon={<Lock className="w-5 h-5 text-gray-400" />}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </motion.div>

                {/* New password input with visibility toggle */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="relative"
                >
                  <Input
                    label="New Password"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="••••••••"
                    error={errors.newPassword?.message}
                    {...register("newPassword")}
                    className="transition-all focus:scale-[1.02] pr-12"
                    icon={<Lock className="w-5 h-5 text-gray-400" />}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </motion.div>

                {/* Confirm password input with visibility toggle */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="relative"
                >
                  <Input
                    label="Confirm New Password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    error={errors.confirmPassword?.message}
                    {...register("confirmPassword")}
                    className="transition-all focus:scale-[1.02] pr-12"
                    icon={<Lock className="w-5 h-5 text-gray-400" />}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </motion.div>

                {/* Password requirements checklist */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="bg-blue-50 rounded-lg p-4 text-sm text-gray-700"
                >
                  <p className="font-medium mb-3">New password requirements:</p>
                  <ul className="space-y-2">
                    {requirements.map((req, index) => {
                      const isMet = req.test(newPasswordValue);
                      return (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + index * 0.1 }}
                          className="flex items-center gap-2 text-xs"
                        >
                          <AnimatePresence mode="wait">
                            {isMet ? (
                              <motion.div
                                key="check"
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: 180 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 200,
                                  damping: 15,
                                }}
                                className="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                              >
                                <Check className="w-3 h-3 text-white" />
                              </motion.div>
                            ) : (
                              <motion.div
                                key="empty"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className="flex-shrink-0 w-5 h-5 border-2 border-gray-300 rounded-full"
                              />
                            )}
                          </AnimatePresence>
                          <span
                            className={
                              isMet
                                ? "text-green-700 font-medium"
                                : "text-gray-600"
                            }
                          >
                            {req.label}
                          </span>
                        </motion.li>
                      );
                    })}
                  </ul>
                </motion.div>

                {/* Submit button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <MagneticButton
                    size="lg"
                    variant="primary"
                    className="w-full"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        Changing Password...
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-5 w-5" />
                        Change Password
                      </>
                    )}
                  </MagneticButton>
                </motion.div>

                {/* Cancel button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="w-full text-center text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Cancel
                  </button>
                </motion.div>
              </form>
            ) : (
              // Success message after password change
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 text-center space-y-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4"
                >
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </motion.div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Password Changed Successfully!
                  </h3>
                  <p className="text-gray-600">
                    Your password has been updated successfully. You can
                    continue using your account with the new password.
                  </p>
                </div>

                <MagneticButton
                  size="lg"
                  variant="primary"
                  className="w-full"
                  onClick={handleGoBack}
                >
                  <Shield className="mr-2 h-5 w-5" />
                  Go Back
                </MagneticButton>
              </motion.div>
            )}
          </Card>
        </motion.div>

        {/* Support link */}
        <motion.div variants={fadeInUp} className="mt-6 text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
            <div className="p-4">
              <p className="text-sm text-gray-700">
                Need help?{" "}
                <Link
                  to="/support"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Contact Support
                </Link>
              </p>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};
