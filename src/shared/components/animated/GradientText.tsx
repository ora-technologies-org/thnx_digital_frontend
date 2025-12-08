// src/shared/components/animated/GradientText.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export const GradientText: React.FC<GradientTextProps> = ({ 
  children, 
  className,
  animate = true 
}) => {
  return (
    <motion.span
      className={cn(
        "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent",
        animate && "animate-gradient bg-[length:200%_auto]",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.span>
  );
};