// src/pages/ResetPasswordPage.tsx - RESET PASSWORD PAGE! 🔐

import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, CheckCircle, Gift, Eye, EyeOff, Check } from "lucide-react";
import { Card } from "../../shared/components/ui/Card";
import { Input } from "../../shared/components/ui/Input";
import { MagneticButton } from "../../shared/components/animated/MagneticButton";
import { fadeInUp, staggerContainer } from "../../shared/utils/animations";
import { useForgotPassword } from "@/features/merchant/hooks/useForgotPssword";

import {
  resetPasswordSchema,
  passwordRequirements,
  type ResetPasswordFormData,
} from "@/shared/utils/merchant";

/**
 * Reset password with new password
 */
export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get email and OTP from previous page
  const email = location.state?.email || "";
  const otp = location.state?.otp || "";

  const { resetPassword, isLoading, resetSuccess } = useForgotPassword();

  // Local state for password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");

  // Debug: Log received state
  React.useEffect(() => {
    console.log("Reset Password Page - Received state:", { email, otp });
  }, [email, otp]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const password = useWatch({
    control,
    name: "newPassword",
  });

  // Update password value for requirements checker
  React.useEffect(() => {
    setPasswordValue(password || "");
  }, [password]);

  /**
   * Submit new password to API
   */
  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!email || !otp) {
      console.error("Missing email or OTP:", { email, otp });
      navigate("/forgot-password");
      return;
    }

    console.log("Submitting reset password with:", {
      email,
      otp,
      password: data.newPassword,
      confirmPassword: data.confirmPassword,
    });

    const success = await resetPassword(
      email,
      otp,
      data.newPassword,
      data.confirmPassword,
    );

    // On success, show success UI then redirect to login
    if (success) {
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  };

  // Redirect if no email/otp (direct access without flow)
  React.useEffect(() => {
    if (!email || !otp) {
      navigate("/forgot-password");
    }
  }, [email, otp, navigate]);

  /**
   * Navigate to login after success
   */
  const handleGoToLogin = () => {
    navigate("/login");
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
            <Gift className="h-8 w-8 text-white" />
          </motion.div>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Reset{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Password
            </span>
          </h1>
          <p className="text-gray-600 text-lg">
            {resetSuccess
              ? "Password reset successful!"
              : "Create your new password"}
          </p>
        </motion.div>

        {/* Form Card - Switches between form and success message */}
        <motion.div variants={fadeInUp}>
          <Card className="backdrop-blur-sm bg-white/90 border-2 border-gray-200/50 shadow-2xl">
            {!resetSuccess ? (
              // Password reset form
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-8">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-gray-600 text-center mb-6"
                >
                  Please enter your new password below.
                </motion.p>

                {/* New password input with visibility toggle */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="relative"
                >
                  <Input
                    label="New Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    error={errors.newPassword?.message}
                    {...register("newPassword")}
                    className="transition-all focus:scale-[1.02] pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? (
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
                  transition={{ delay: 0.3 }}
                  className="relative"
                >
                  <Input
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    error={errors.confirmPassword?.message}
                    {...register("confirmPassword")}
                    className="transition-all focus:scale-[1.02] pr-12"
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
                  transition={{ delay: 0.4 }}
                  className="bg-blue-50 rounded-lg p-4 text-sm text-gray-700"
                >
                  <p className="font-medium mb-3">Password requirements:</p>
                  <ul className="space-y-2">
                    {passwordRequirements.map((req, index) => {
                      const isMet = req.test(passwordValue);
                      return (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
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
                  transition={{ delay: 0.5 }}
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
                        Resetting Password...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-5 w-5" />
                        Reset Password
                      </>
                    )}
                  </MagneticButton>
                </motion.div>
              </form>
            ) : (
              // Success message after password reset
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
                    Password Reset Successfully!
                  </h3>
                  <p className="text-gray-600">
                    Your password has been reset successfully. You can now login
                    with your new password.
                  </p>
                </div>

                <MagneticButton
                  size="lg"
                  variant="primary"
                  className="w-full"
                  onClick={handleGoToLogin}
                >
                  <Lock className="mr-2 h-5 w-5" />
                  Go to Login
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
