// src/shared/components/animated/TestimonialCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { TiltCard } from './TiltCard';

interface TestimonialCardProps {
  name: string;
  role: string;
  avatar: string;
  rating: number;
  text: string;
  delay?: number;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  role,
  avatar,
  rating,
  text,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
    >
      <TiltCard className="h-full">
        {/* Quote icon */}
        <div className="absolute top-6 right-6 text-blue-100">
          <Quote className="w-12 h-12" fill="currentColor" />
        </div>

        {/* Rating */}
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Testimonial text */}
        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          "{text}"
        </p>

        {/* Author */}
        <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
            {avatar}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{name}</p>
            <p className="text-sm text-gray-600">{role}</p>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
};