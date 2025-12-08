// src/shared/components/modals/CompleteProfileModal.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MagneticButton } from '../animated/MagneticButton';

interface CompleteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  action?: string; // e.g., "create a gift card", "view analytics"
}

export const CompleteProfileModal: React.FC<CompleteProfileModalProps> = ({
  isOpen,
  onClose,
  action = 'perform this action',
}) => {
  const navigate = useNavigate();

  const handleCompleteProfile = () => {
    onClose();
    navigate('/merchant/complete-profile');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative"
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Lock icon with animation */}
              <motion.div
                className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6"
                animate={{
                  boxShadow: [
                    '0 0 0 0 rgba(251, 191, 36, 0.7)',
                    '0 0 0 20px rgba(251, 191, 36, 0)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Lock className="w-10 h-10 text-white" />
              </motion.div>

              {/* Content */}
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
                Profile Incomplete
              </h2>

              <p className="text-gray-600 text-center mb-6">
                To <strong>{action}</strong>, you need to complete your merchant profile and get verified by our admin team.
              </p>

              {/* Steps */}
              <div className="bg-gray-50 rounded-2xl p-4 mb-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm text-gray-700">Account created</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <p className="text-sm text-gray-700 font-medium">Complete your profile</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  <p className="text-sm text-gray-500">Admin verification</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">4</span>
                  </div>
                  <p className="text-sm text-gray-500">Start selling!</p>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <MagneticButton
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handleCompleteProfile}
                >
                  Complete Profile Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </MagneticButton>

                <button
                  onClick={onClose}
                  className="w-full px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Maybe Later
                </button>
              </div>

              {/* Help text */}
              <p className="text-xs text-gray-500 text-center mt-4">
                Takes only 5 minutes to complete • Verification within 24-48 hours
              </p>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};