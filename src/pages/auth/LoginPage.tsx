// src/pages/auth/LoginPage.tsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, useReducedMotion, Variant } from "framer-motion";
import {
  LogIn,
  Mail,
  Lock,
  ArrowRight,
  Gift,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { Card } from "../../shared/components/ui/Card";
import { Input } from "../../shared/components/ui/Input";
import { MagneticButton } from "../../shared/components/animated/MagneticButton";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { fadeInUp, staggerContainer } from "../../shared/utils/animations";

// ===== CONSTANTS =====
const ROUTES = {
  FORGOT_PASSWORD: "/forgot-password",
  REGISTER: "/register",
  BROWSE: "/browse",
} as const;

const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
  EMAIL_MAX_LENGTH: 254,
} as const;

const FEATURE_FLAGS = {
  ENABLE_GOOGLE_LOGIN: import.meta.env.VITE_ENABLE_GOOGLE_LOGIN !== "false",
  ENABLE_ONE_TAP: import.meta.env.VITE_ENABLE_GOOGLE_ONE_TAP === "true",
  ENABLE_REMEMBER_ME: import.meta.env.VITE_ENABLE_REMEMBER_ME !== "false",
} as const;

// ===== VALIDATION SCHEMA =====
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .max(VALIDATION_RULES.EMAIL_MAX_LENGTH, "Email is too long")
    .transform((val) => val.trim().toLowerCase()),
  password: z
    .string()
    .min(
      VALIDATION_RULES.PASSWORD_MIN_LENGTH,
      `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters`,
    )
    .regex(
      VALIDATION_RULES.PASSWORD_PATTERN,
      "Password must contain uppercase, lowercase, number, and special character",
    ),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

// ===== HOOKS =====
const useCapsLockDetection = () => {
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.getModifierState) {
        setIsCapsLockOn(e.getModifierState("CapsLock"));
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("keyup", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("keyup", handleKeyPress);
    };
  }, []);

  return isCapsLockOn;
};

// ===== MAIN COMPONENT =====
export const LoginPage: React.FC = () => {
  const { login, loginWithGoogle, loadingStates } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const isCapsLockOn = useCapsLockDetection();
  const shouldReduceMotion = useReducedMotion();
  const emailInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Destructure email register to handle ref properly
  const { ref: emailRegisterRef, ...emailRegisterProps } = register("email");

  // Auto-focus email field on mount
  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  // Clear auth error when form validation errors change
  // We use a ref to track the previous errors to avoid unnecessary effect runs
  const prevErrorsRef = useRef(errors);
  useEffect(() => {
    if (prevErrorsRef.current !== errors && authError) {
      setAuthError(null);
    }
    prevErrorsRef.current = errors;
  }, [errors, authError]);

  const onSubmit = async (data: LoginFormData) => {
    setAuthError(null);

    try {
      await login({
        email: data.email,
        password: data.password,
      });

      // Note: Remember me logic should be handled in the auth hook
      // storing refresh token appropriately based on this flag
    } catch (err) {
      console.error("Login error:", err);
      setAuthError(
        "Login failed. Please check your credentials and try again.",
      );
    }
  };

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse,
  ) => {
    if (!credentialResponse.credential) {
      setAuthError("Google login failed. Please try again.");
      return;
    }

    setIsGoogleLoading(true);
    setAuthError(null);

    try {
      await loginWithGoogle(credentialResponse.credential);
    } catch (err) {
      console.error("Google login error:", err);
      setAuthError("Google login failed. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    setAuthError("Google login failed. Please try again.");
    setIsGoogleLoading(false);
  };

  const isFormLoading = loadingStates.isLoggingIn || isGoogleLoading;

  // Animation variants that respect reduced motion
  const getAnimationVariants = (variant: Variant) => {
    return shouldReduceMotion ? {} : variant;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background - respects reduced motion */}
      {!shouldReduceMotion && (
        <>
          <motion.div
            className="absolute top-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            aria-hidden="true"
          />
          <motion.div
            className="absolute bottom-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            aria-hidden="true"
          />
        </>
      )}

      <motion.div
        className="w-full max-w-md relative z-10"
        initial="hidden"
        animate="visible"
        variants={getAnimationVariants(staggerContainer)}
      >
        {/* Header */}
        <motion.div
          variants={getAnimationVariants(fadeInUp)}
          className="text-center mb-8"
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-xl"
            whileHover={shouldReduceMotion ? {} : { rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
            aria-hidden="true"
          >
            <Gift className="h-8 w-8 text-white" />
          </motion.div>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Back
            </span>
          </h1>
          <p className="text-gray-600 text-lg">
            Login to your merchant account
          </p>
        </motion.div>

        {/* Global Error Message */}
        {authError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            role="alert"
            aria-live="assertive"
            className="mb-4"
          >
            <Card className="bg-red-50 border-2 border-red-200">
              <div className="p-4 flex items-start gap-3">
                <AlertCircle
                  className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <p className="text-sm text-red-800">{authError}</p>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Form Card */}
        <motion.div variants={getAnimationVariants(fadeInUp)}>
          <Card className="backdrop-blur-sm bg-white/90 border-2 border-gray-200/50 shadow-2xl">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 p-8"
              noValidate
            >
              <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Input
                  label="Email"
                  type="email"
                  placeholder="your@email.com"
                  error={errors.email?.message}
                  {...emailRegisterProps}
                  ref={(e) => {
                    emailRegisterRef(e); // Call register's ref
                    emailInputRef.current = e; // Assign to your custom ref
                  }}
                  disabled={isFormLoading}
                  autoComplete="email"
                  className="transition-all"
                  icon={
                    <Mail
                      className="w-5 h-5 text-gray-400"
                      aria-hidden="true"
                    />
                  }
                />
              </motion.div>

              <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    error={errors.password?.message}
                    {...register("password")}
                    disabled={isFormLoading}
                    autoComplete="current-password"
                    className="transition-all pr-12"
                    icon={
                      <Lock
                        className="w-5 h-5 text-gray-400"
                        aria-hidden="true"
                      />
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    disabled={isFormLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" aria-hidden="true" />
                    ) : (
                      <Eye className="w-5 h-5" aria-hidden="true" />
                    )}
                  </button>
                </div>

                {/* Caps Lock Warning */}
                {isCapsLockOn && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-amber-600 flex items-center gap-1"
                    role="alert"
                  >
                    <AlertCircle className="w-4 h-4" aria-hidden="true" />
                    Caps Lock is on
                  </motion.p>
                )}
              </motion.div>

              <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-between"
              >
                {FEATURE_FLAGS.ENABLE_REMEMBER_ME && (
                  <label
                    htmlFor="rememberMe"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      id="rememberMe"
                      type="checkbox"
                      {...register("rememberMe")}
                      disabled={isFormLoading}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 disabled:opacity-50"
                    />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>
                )}

                <Link
                  to={ROUTES.FORGOT_PASSWORD}
                  className="text-sm text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                  tabIndex={isFormLoading ? -1 : 0}
                >
                  Forgot password?
                </Link>
              </motion.div>

              <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <MagneticButton
                  size="lg"
                  variant="primary"
                  className="w-full"
                  type="submit"
                  disabled={isFormLoading}
                  aria-label={
                    loadingStates.isLoggingIn
                      ? "Logging in, please wait"
                      : "Login"
                  }
                >
                  {loadingStates.isLoggingIn ? (
                    <>
                      <motion.div
                        animate={shouldReduceMotion ? {} : { rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        aria-hidden="true"
                      />
                      Logging in...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-5 w-5" aria-hidden="true" />
                      Login
                    </>
                  )}
                </MagneticButton>
              </motion.div>

              {FEATURE_FLAGS.ENABLE_GOOGLE_LOGIN && (
                <>
                  <motion.div
                    initial={shouldReduceMotion ? {} : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="relative"
                    aria-hidden="true"
                  >
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">or</span>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex justify-center"
                  >
                    <div className="w-full">
                      {isGoogleLoading ? (
                        <div className="flex items-center justify-center py-3">
                          <motion.div
                            animate={shouldReduceMotion ? {} : { rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"
                            aria-hidden="true"
                          />
                          <span className="ml-2 text-sm text-gray-600">
                            Connecting to Google...
                          </span>
                        </div>
                      ) : (
                        <GoogleLogin
                          onSuccess={handleGoogleSuccess}
                          onError={handleGoogleError}
                          useOneTap={FEATURE_FLAGS.ENABLE_ONE_TAP}
                          theme="outline"
                          size="large"
                          width="100%"
                          text="continue_with"
                        />
                      )}
                    </div>
                  </motion.div>
                </>
              )}

              <motion.p
                initial={shouldReduceMotion ? {} : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center text-sm text-gray-600"
              >
                Don't have an account?{" "}
                <Link
                  to={ROUTES.REGISTER}
                  className="text-blue-600 hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                  tabIndex={isFormLoading ? -1 : 0}
                >
                  Register here
                </Link>
              </motion.p>
            </form>
          </Card>
        </motion.div>

        {/* Customer Link */}
        <motion.div
          variants={getAnimationVariants(fadeInUp)}
          className="mt-6 text-center"
        >
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
            <div className="p-4">
              <p className="text-sm text-gray-700 mb-2">
                Looking to <strong>buy gift cards</strong>?
              </p>
              <Link to={ROUTES.BROWSE} tabIndex={isFormLoading ? -1 : 0}>
                <motion.button
                  className="text-blue-600 hover:underline font-medium text-sm inline-flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                  whileHover={shouldReduceMotion ? {} : { x: 5 }}
                  type="button"
                  disabled={isFormLoading}
                >
                  Browse our marketplace
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </motion.button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Screen reader announcement for loading state */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {isFormLoading && "Processing login request"}
      </div>
    </div>
  );
};
