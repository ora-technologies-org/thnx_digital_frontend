// src/shared/components/wizard/ProgressWizard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export interface WizardStep {
  id: number;
  title: string;
  description: string;
}

interface ProgressWizardProps {
  steps: WizardStep[];
  currentStep: number;
  className?: string;
}

const cn = (...classes: (string | undefined | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

export const ProgressWizard: React.FC<ProgressWizardProps> = ({
  steps,
  currentStep,
  className,
}) => {
  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-200 -z-10" />
        <motion.div
          className="absolute top-8 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 -z-10"
          initial={{ width: 0 }}
          animate={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />

        {/* Steps */}
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          const isPending = currentStep < step.id;

          return (
            <div key={step.id} className="flex flex-col items-center relative">
              {/* Circle */}
              <motion.div
                className={cn(
                  'w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg relative z-10 transition-all duration-300',
                  isCompleted && 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg',
                  isActive && 'bg-white border-4 border-blue-600 text-blue-600 shadow-xl',
                  isPending && 'bg-gray-100 text-gray-400 border-2 border-gray-300'
                )}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
                whileHover={{ scale: 1.05 }}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <Check className="w-8 h-8" strokeWidth={3} />
                  </motion.div>
                ) : (
                  <span>{step.id}</span>
                )}

                {/* Pulse animation for active step */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-blue-400"
                    animate={{
                      scale: [1, 1.3],
                      opacity: [0.7, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeOut',
                    }}
                  />
                )}
              </motion.div>

              {/* Label */}
              <motion.div
                className="mt-4 text-center max-w-[120px]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                <p
                  className={cn(
                    'text-sm font-semibold mb-1',
                    isActive && 'text-blue-600',
                    isCompleted && 'text-gray-900',
                    isPending && 'text-gray-400'
                  )}
                >
                  {step.title}
                </p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
};