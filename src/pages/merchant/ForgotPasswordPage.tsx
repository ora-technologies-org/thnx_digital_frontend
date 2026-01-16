// src/features/auth/pages/ForgotPasswordPage.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Gift } from "lucide-react";
import { Card } from "../../shared/components/ui/Card";
import { Input } from "../../shared/components/ui/Input";
import { MagneticButton } from "../../shared/components/animated/MagneticButton";
import { fadeInUp, staggerContainer } from "../../shared/utils/animations";
import { useForgotPassword } from "@/features/merchant/hooks/useForgotPssword";
import { forgotPasswordSchema } from "@/shared/utils/merchant";

// Email validation schema

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

/**
 *Collect email and send OTP
 */
export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  const { requestOtp, isLoading } = useForgotPassword();

  // React Hook Form for validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  /**
   * Send OTP to email and navigate to verification page
   */
  const onSubmit = async (data: ForgotPasswordFormData) => {
    const success = await requestOtp(data.email);
    if (success) {
      // Pass email to next page via route state
      navigate("/verify-otp", { state: { email: data.email } });
    }
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
        {/* Header with icon and title */}
        <motion.div variants={fadeInUp} className="text-center mb-8">
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-xl"
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
          >
            <Gift className="h-8 w-8 text-white" />
          </motion.div>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Forgot{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Password
            </span>
          </h1>
          <p className="text-gray-600 text-lg">Reset your password</p>
        </motion.div>

        {/* Form Card */}
        <motion.div variants={fadeInUp}>
          <Card className="backdrop-blur-sm bg-white/90 border-2 border-gray-200/50 shadow-2xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-8">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-gray-600 text-center mb-6"
              >
                Enter your email address and we'll send you an OTP to reset your
                password.
              </motion.p>

              {/* Email input field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Input
                  label="Email"
                  type="email"
                  placeholder="your@email.com"
                  error={errors.email?.message}
                  {...register("email")}
                  className="transition-all focus:scale-[1.02]"
                />
              </motion.div>

              {/* Submit button with loading state from React Query */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
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
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-5 w-5" />
                      Send OTP
                    </>
                  )}
                </MagneticButton>
              </motion.div>

              {/* Back to login link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <Link
                  to="/login"
                  className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to login
                </Link>
              </motion.div>
            </form>
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
