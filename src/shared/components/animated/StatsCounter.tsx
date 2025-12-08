// src/shared/components/animated/StatsCounter.tsx
import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { cn } from '../../utils/helpers';

interface StatsCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  duration?: number;
  className?: string;
}

export const StatsCounter: React.FC<StatsCounterProps> = ({
  value,
  suffix = '',
  prefix = '',
  label,
  duration = 2.5,
  className,
}) => {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <motion.div
      ref={ref}
      className={cn('text-center', className)}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
        {prefix}
        {inView && (
          <CountUp
            start={0}
            end={value}
            duration={duration}
            separator=","
            decimals={0}
            suffix={suffix}
          />
        )}
      </div>
      <p className="text-gray-600 text-lg">{label}</p>
    </motion.div>
  );
};