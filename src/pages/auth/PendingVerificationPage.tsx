// src/pages/auth/PendingVerificationPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Clock, CheckCircle, Mail, Phone, Home, 
  AlertCircle, RefreshCw, ArrowRight 
} from 'lucide-react';
import { Card } from '../../shared/components/ui/Card';
import { MagneticButton } from '../../shared/components/animated/MagneticButton';
import { fadeInUp, staggerContainer } from '../../shared/utils/animations';
import api from '../../shared/utils/api';
import toast from 'react-hot-toast';

export const PendingVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [isLoading, setIsLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState<string>('');

  useEffect(() => {
    checkVerificationStatus();
  }, []);

  const checkVerificationStatus = async () => {
    try {
      const response = await api.get('/auth/merchant/verification-status');
      setStatus(response.data.status);
      if (response.data.status === 'rejected') {
        setRejectionReason(response.data.rejectionReason);
      }
      if (response.data.status === 'approved') {
        toast.success('Your account has been verified!');
        setTimeout(() => navigate('/merchant/dashboard'), 2000);
      }
    } catch (error) {
      console.error('Error checking status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    checkVerificationStatus();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

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
        className="w-full max-w-2xl relative z-10"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <Card className="backdrop-blur-sm bg-white/90 border-2 border-gray-200/50 shadow-2xl p-8 md:p-12 text-center">
          {status === 'pending' && (
            <>
              {/* Clock Animation */}
              <motion.div
                variants={fadeInUp}
                className="relative inline-block mb-6"
              >
                <motion.div
                  className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl"
                  animate={{
                    boxShadow: [
                      '0 0 0 0 rgba(251, 191, 36, 0.7)',
                      '0 0 0 30px rgba(251, 191, 36, 0)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Clock className="w-12 h-12 text-white" />
                </motion.div>

                {/* Rotating circle */}
                <motion.div
                  className="absolute inset-0 border-4 border-t-yellow-500 border-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              >
                Verification in Progress
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-lg text-gray-600 mb-8"
              >
                Thank you for submitting your profile! Our team is reviewing your documents.
              </motion.p>

              {/* Timeline */}
              <motion.div
                variants={fadeInUp}
                className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8"
              >
                <h3 className="font-semibold text-gray-900 mb-4">What's happening now?</h3>
                <div className="space-y-4 text-left">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Profile Submitted</p>
                      <p className="text-sm text-gray-600">Your documents have been received</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <motion.div
                      className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Clock className="w-4 h-4 text-white" />
                    </motion.div>
                    <div>
                      <p className="font-medium text-gray-900">Under Review</p>
                      <p className="text-sm text-gray-600">Admin is verifying your information</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-500">Approval Pending</p>
                      <p className="text-sm text-gray-500">You'll be notified once approved</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Info Cards */}
              <motion.div
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
              >
                <motion.div
                  variants={fadeInUp}
                  className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
                >
                  <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Processing Time</p>
                  <p className="text-xs text-gray-600">24-48 hours</p>
                </motion.div>

                <motion.div
                  variants={fadeInUp}
                  className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
                >
                  <Mail className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Email Updates</p>
                  <p className="text-xs text-gray-600">Check your inbox</p>
                </motion.div>

                <motion.div
                  variants={fadeInUp}
                  className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
                >
                  <Phone className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Need Help?</p>
                  <p className="text-xs text-gray-600">Contact support</p>
                </motion.div>
              </motion.div>

              {/* Actions */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-3 justify-center"
              >
                <MagneticButton
                  variant="outline"
                  onClick={handleRefresh}
                >
                  <RefreshCw className="mr-2 h-5 w-5" />
                  Check Status
                </MagneticButton>

                <MagneticButton
                  variant="primary"
                  onClick={() => navigate('/')}
                >
                  <Home className="mr-2 h-5 w-5" />
                  Go to Home
                </MagneticButton>
              </motion.div>
            </>
          )}

          {status === 'approved' && (
            <>
              {/* Success Animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-xl mx-auto mb-6"
              >
                <CheckCircle className="w-12 h-12 text-white" />
              </motion.div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                🎉 Congratulations!
              </h1>

              <p className="text-lg text-gray-600 mb-8">
                Your account has been verified! Redirecting to dashboard...
              </p>
            </>
          )}

          {status === 'rejected' && (
            <>
              {/* Rejected Animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                className="w-24 h-24 bg-gradient-to-r from-red-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl mx-auto mb-6"
              >
                <AlertCircle className="w-12 h-12 text-white" />
              </motion.div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Verification Not Approved
              </h1>

              <p className="text-lg text-gray-600 mb-6">
                Unfortunately, we couldn't verify your documents.
              </p>

              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 text-left">
                <p className="font-semibold text-red-900 mb-2">Reason:</p>
                <p className="text-sm text-red-700">
                  {rejectionReason || 'Please contact support for more details.'}
                </p>
              </div>

              <MagneticButton
                variant="primary"
                onClick={() => navigate('/merchant/resubmit')}
              >
                Resubmit Documents
                <ArrowRight className="ml-2 h-5 w-5" />
              </MagneticButton>
            </>
          )}
        </Card>
      </motion.div>
    </div>
  );
};