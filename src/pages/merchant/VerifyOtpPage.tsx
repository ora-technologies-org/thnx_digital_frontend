// src/features/auth/pages/VerifyOtpPage.tsx
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowLeft, Gift } from "lucide-react";
import { Card } from "../../shared/components/ui/Card";
import { Input } from "../../shared/components/ui/Input";
import { MagneticButton } from "../../shared/components/animated/MagneticButton";
import { fadeInUp, staggerContainer } from "../../shared/utils/animations";
import { useForgotPassword } from "@/features/merchant/hooks/useForgotPssword";
import { verifyOtpSchema } from "@/shared/utils/merchant";

type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;

/**
 * Verify the OTP sent to email
 */
export const VerifyOtpPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from previous one
  const email = location.state?.email || "";
  const { verifyOtp, requestOtp, isLoading } = useForgotPassword();
  const [isResending, setIsResending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyOtpFormData>({
    resolver: zodResolver(verifyOtpSchema),
  });

  /**
   * Verify OTP and navigate to reset password page
   */
  const onSubmit = async (data: VerifyOtpFormData) => {
    if (!email) {
      navigate("/forgot-password");
      return;
    }

    const success = await verifyOtp(email, data.otp);
    if (success) {
      // Pass email AND otp to reset password page
      navigate("/reset-password", { state: { email, otp: data.otp } });
    }
  };

  /**
   * Resend OTP if user didn't receive it
   */
  const handleResendOtp = async () => {
    if (!email) return;
    setIsResending(true);
    await requestOtp(email);
    setIsResending(false);
  };

  // Redirect if no email (user came directly without going through forgot password)
  React.useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
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
            Verify{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              OTP
            </span>
          </h1>
          <p className="text-gray-600 text-lg">
            Enter the code sent to your email
          </p>
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
                We sent a verification code to <strong>{email}</strong>
              </motion.p>

              {/* OTP input field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Input
                  label="OTP Code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  error={errors.otp?.message}
                  {...register("otp")}
                  className="transition-all focus:scale-[1.02] text-center text-2xl tracking-widest"
                  maxLength={6}
                />
              </motion.div>

              {/* Verify button */}
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
                      Verifying...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="mr-2 h-5 w-5" />
                      Verify OTP
                    </>
                  )}
                </MagneticButton>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center space-y-4"
              >
                {/* Resend OTP option */}
                <div className="bg-blue-50 rounded-lg p-4 text-sm text-gray-700">
                  <p>
                    Didn't receive the code?{" "}
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-blue-600 hover:underline font-medium"
                      disabled={isResending || isLoading}
                    >
                      {isResending ? "Resending..." : "Resend OTP"}
                    </button>
                  </p>
                </div>

                {/* Back link */}
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to forgot password
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
