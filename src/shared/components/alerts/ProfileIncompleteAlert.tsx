// src/shared/components/alerts/ProfileIncompleteAlert.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MagneticButton } from '../animated/MagneticButton';

interface ProfileIncompleteAlertProps {
  onDismiss?: () => void;
}

export const ProfileIncompleteAlert: React.FC<ProfileIncompleteAlertProps> = ({ onDismiss }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-2xl p-6 mb-6 shadow-lg"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          {/* Icon with pulse animation */}
          <motion.div
            className="relative"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <motion.div
              className="absolute inset-0 bg-yellow-400 rounded-full"
              animate={{
                scale: [1, 1.5],
                opacity: [0.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
          </motion.div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              🚀 Complete Your Profile to Get Started!
            </h3>
            <p className="text-gray-700 mb-4">
              To create and sell gift cards, you need to complete your merchant profile with business details and documents for verification.
            </p>

            <div className="flex flex-wrap gap-3">
              <MagneticButton
                variant="primary"
                size="md"
                onClick={() => navigate('/merchant/complete-profile')}
              >
                Complete Profile Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </MagneticButton>

              <button
                onClick={onDismiss}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                I'll do it later
              </button>
            </div>
          </div>
        </div>

        {/* Close button */}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </motion.div>
  );
};