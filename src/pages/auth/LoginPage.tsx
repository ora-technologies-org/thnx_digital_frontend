


// // src/pages/auth/LoginPage.tsx
// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { LoginForm } from '../../features/auth/components/LoginForm';
// import { Card } from '../../shared/components/ui/Card';
// import { Gift } from 'lucide-react';
// import { useAppSelector } from '../../app/hooks';
// import { Spinner } from '../../shared/components/ui/Spinner';

// export const LoginPage: React.FC = () => {
//   const navigate = useNavigate();
  
//   // Select directly from Redux store
//   const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
//   const isLoading = useAppSelector((state) => state.auth.isLoading);
//   const user = useAppSelector((state) => state.auth.user);

//   useEffect(() => {
//     console.log('📍 LoginPage - Direct Redux State:', { 
//       isLoading, 
//       isAuthenticated, 
//       userRole: user?.role,
//       timestamp: new Date().toISOString()
//     });
    
//     // Wait for auth initialization
//     if (isLoading) {
//       console.log('⏳ Still initializing auth...');
//       return;
//     }
    
//     // Redirect if already authenticated
//     if (isAuthenticated && user) {
//       console.log('✅ Already authenticated, redirecting...');
      
//       if (user.role === 'MERCHANT') {
//         console.log('🚀 Redirecting to /merchant/dashboard');
//         navigate('/merchant/dashboard', { replace: true });
//       } else if (user.role === 'ADMIN') {
//         console.log('🚀 Redirecting to /admin/dashboard');
//         navigate('/admin/dashboard', { replace: true });
//       } else {
//         console.log('🚀 Redirecting to /');
//         navigate('/', { replace: true });
//       }
//     }
//   }, [isAuthenticated, isLoading, user, navigate]);

//   // Show loading during initialization
//   if (isLoading) {
//     console.log('🔄 LoginPage: Rendering loading spinner');
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <Spinner size="lg" />
//         <p className="ml-3 text-gray-600">Checking authentication...</p>
//       </div>
//     );
//   }

//   // Don't render login form if authenticated
//   if (isAuthenticated) {
//     console.log('⏭️ LoginPage: Authenticated, rendering null during redirect');
//     return null;
//   }

//   console.log('📝 LoginPage: Rendering login form');
  
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//       <Card className="w-full max-w-md">
//         <div className="text-center mb-8">
//           <div className="flex justify-center mb-4">
//             <Gift className="h-12 w-12 text-blue-600" />
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
//           <p className="text-gray-600 mt-2">Login to your account</p>
//         </div>
//         <LoginForm />
//       </Card>
//     </div>
//   );
// };


// src/pages/auth/LoginPage.tsx - ENHANCED VERSION! ✨
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, ArrowRight, Gift } from 'lucide-react';
import { Card } from '../../shared/components/ui/Card';
import { Input } from '../../shared/components/ui/Input';
import { MagneticButton } from '../../shared/components/animated/MagneticButton';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { fadeInUp, staggerContainer } from '../../shared/utils/animations';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
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
            Welcome <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Back</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Login to your merchant account
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div variants={fadeInUp}>
          <Card className="backdrop-blur-sm bg-white/90 border-2 border-gray-200/50 shadow-2xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-8">
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
                  {...register('email')}
                  className="transition-all focus:scale-[1.02]"
                  icon={<Mail className="w-5 h-5 text-gray-400" />}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  error={errors.password?.message}
                  {...register('password')}
                  className="transition-all focus:scale-[1.02]"
                  icon={<Lock className="w-5 h-5 text-gray-400" />}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-between"
              >
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
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
                      Logging in...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-5 w-5" />
                      Login
                    </>
                  )}
                </MagneticButton>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="relative"
              >
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">or</span>
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-center text-sm text-gray-600"
              >
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Register here
                </Link>
              </motion.p>
            </form>
          </Card>
        </motion.div>

        {/* Customer Link */}
        <motion.div
          variants={fadeInUp}
          className="mt-6 text-center"
        >
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
            <div className="p-4">
              <p className="text-sm text-gray-700 mb-2">
                Looking to <strong>buy gift cards</strong>?
              </p>
              <Link to="/browse">
                <motion.button
                  className="text-blue-600 hover:underline font-medium text-sm inline-flex items-center gap-1"
                  whileHover={{ x: 5 }}
                >
                  Browse our marketplace
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};