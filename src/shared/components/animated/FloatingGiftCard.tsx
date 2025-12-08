// src/shared/components/animated/FloatingGiftCard.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';
import { cn } from '../../utils/helpers';

interface FloatingGiftCardProps {
  delay?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const FloatingGiftCard: React.FC<FloatingGiftCardProps> = ({
  delay = 0,
  className,
  size = 'md',
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const sizes = {
    sm: 'w-48 h-32',
    md: 'w-64 h-40',
    lg: 'w-80 h-48',
  };

  return (
    <motion.div
      className={cn(
        'relative rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl',
        'transform-gpu will-change-transform',
        sizes[size],
        className
      )}
      initial={{ opacity: 0, y: 100, rotateX: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        rotateX: 0,
        x: mousePosition.x,
        y: mousePosition.y,
      }}
      transition={{
        opacity: { duration: 0.8, delay },
        y: { duration: 0.8, delay },
        rotateX: { duration: 0.8, delay },
        x: { type: 'spring', stiffness: 50, damping: 20 },
        y: { type: 'spring', stiffness: 50, damping: 20 },
      }}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 opacity-50 blur-xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Card content */}
      <div className="relative z-10 p-6 h-full flex flex-col justify-between text-white">
        <div className="flex justify-between items-start">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <Gift className="w-6 h-6" />
          </div>
          <div className="text-right">
            <p className="text-xs font-medium opacity-80">Balance</p>
            <p className="text-2xl font-bold">₹500</p>
          </div>
        </div>

        <div>
          <p className="text-sm opacity-80 mb-1">Gift Card</p>
          <p className="font-semibold text-lg">Thnx Digital</p>
        </div>
      </div>

      {/* Shine effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
    </motion.div>
  );
};