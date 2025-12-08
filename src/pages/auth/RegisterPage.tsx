// src/pages/auth/RegisterPage.tsx - ENHANCED VERSION! ✨
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Gift, Store, User, Mail, Lock, Phone, ArrowRight, Sparkles } from 'lucide-react';
import { Card } from '../../shared/components/ui/Card';
import { Input } from '../../shared/components/ui/Input';
import { MagneticButton } from '../../shared/components/animated/MagneticButton';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { fadeInUp, staggerContainer } from '../../shared/utils/animations';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  businessName: z.string().min(2, 'Business name is required'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerMerchant, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerMerchant(data);
      // After successful registration, go directly to dashboard
      navigate('/merchant/dashboard');
    } catch (error) {
      // Error handling is done in the useAuth hook
      console.error('Registration error:', error);
    }
  };

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
        className="w-full max-w-2xl relative z-10"
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
            <Store className="h-8 w-8 text-white" />
          </motion.div>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Become a <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Merchant</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Start selling digital gift cards in minutes!
          </p>

          {/* Badge */}
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mt-4"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">Step 1 of 2 • Quick Registration</span>
          </motion.div>
        </motion.div>

        {/* Form Card */}
        <motion.div variants={fadeInUp}>
          <Card className="backdrop-blur-sm bg-white/90 border-2 border-gray-200/50 shadow-2xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-8">
              {/* Personal Info Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Personal Information
                </h3>
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Input
                      label="Full Name"
                      placeholder="John Doe"
                      error={errors.name?.message}
                      {...register('name')}
                      className="transition-all focus:scale-[1.02]"
                    />
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Input
                        label="Email"
                        type="email"
                        placeholder="your@email.com"
                        error={errors.email?.message}
                        {...register('email')}
                        className="transition-all focus:scale-[1.02]"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Input
                        label="Phone"
                        placeholder="+919876543210"
                        error={errors.phone?.message}
                        {...register('phone')}
                        className="transition-all focus:scale-[1.02]"
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Input
                      label="Password"
                      type="password"
                      placeholder="••••••••"
                      error={errors.password?.message}
                      helperText="Min 8 characters with uppercase, lowercase, and number"
                      {...register('password')}
                      className="transition-all focus:scale-[1.02]"
                    />
                  </motion.div>
                </div>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Business Details</span>
                </div>
              </div>

              {/* Business Info Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Store className="w-5 h-5 text-purple-600" />
                  Business Information
                </h3>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Input
                    label="Business Name"
                    placeholder="ABC Company Ltd"
                    error={errors.businessName?.message}
                    {...register('businessName')}
                    className="transition-all focus:scale-[1.02]"
                  />
                </motion.div>
              </div>

              {/* Info Box */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-blue-50 border border-blue-200 rounded-xl p-4"
              >
                <div className="flex items-start gap-3">
                  <Gift className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 mb-1">
                      What's next?
                    </p>
                    <p className="text-sm text-blue-700">
                      After registration, you'll complete your profile with business documents for verification. This helps us keep the platform secure!
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <MagneticButton
                  size="lg"
                  variant="primary"
                  className="w-full"
                  onClick={handleSubmit(onSubmit)}
                  type="button"
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Continue to Profile Setup
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </MagneticButton>
              </motion.div>

              {/* Login Link */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-center text-sm text-gray-600"
              >
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Login here
                </button>
              </motion.p>
            </form>
          </Card>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          variants={fadeInUp}
          className="mt-8 grid grid-cols-3 gap-4 text-center"
        >
          {[
            { icon: '✅', text: 'Free to Join' },
            { icon: '🚀', text: 'Quick Setup' },
            { icon: '💰', text: 'Start Earning' },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg"
            >
              <p className="text-2xl mb-1">{item.icon}</p>
              <p className="text-sm font-medium text-gray-700">{item.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};