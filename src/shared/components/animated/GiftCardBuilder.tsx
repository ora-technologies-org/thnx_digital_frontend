// src/shared/components/animated/GiftCardBuilder.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Sparkles } from 'lucide-react';

export const GiftCardBuilder: React.FC = () => {
  const [amount, setAmount] = useState(500);
  const [selectedColor, setSelectedColor] = useState(0);

  const colors = [
    { from: 'from-blue-500', to: 'to-purple-600', name: 'Ocean' },
    { from: 'from-pink-500', to: 'to-orange-500', name: 'Sunset' },
    { from: 'from-green-500', to: 'to-teal-600', name: 'Forest' },
    { from: 'from-purple-500', to: 'to-pink-600', name: 'Grape' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200"
    >
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gray-900 mb-2">
          Design Your Gift Card
        </h3>
        <p className="text-gray-600">
          Customize and preview in real-time
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Controls */}
        <div className="space-y-6">
          {/* Amount slider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Gift Amount: ₹{amount}
            </label>
            <input
              type="range"
              min="100"
              max="10000"
              step="100"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>₹100</span>
              <span>₹10,000</span>
            </div>
          </div>

          {/* Color selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Choose Theme
            </label>
            <div className="grid grid-cols-4 gap-3">
              {colors.map((color, index) => (
                <motion.button
                  key={index}
                  onClick={() => setSelectedColor(index)}
                  className={`h-12 rounded-xl bg-gradient-to-br ${color.from} ${color.to} relative ${
                    selectedColor === index ? 'ring-4 ring-blue-600 ring-offset-2' : ''
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {selectedColor === index && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <Sparkles className="w-6 h-6 text-white" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Quick amounts */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Quick Select
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[500, 1000, 2000, 5000].map((value) => (
                <motion.button
                  key={value}
                  onClick={() => setAmount(value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    amount === value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ₹{value}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="flex justify-center">
          <motion.div
            key={`${selectedColor}-${amount}`}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative w-72 h-44"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Card */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${colors[selectedColor].from} ${colors[selectedColor].to} rounded-2xl shadow-2xl p-6 flex flex-col justify-between text-white`}
            >
              {/* Glow effect */}
              <motion.div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${colors[selectedColor].from} ${colors[selectedColor].to} opacity-50 blur-xl`}
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

              {/* Content */}
              <div className="relative z-10">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <Gift className="w-6 h-6" />
                  </div>
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-6 h-6" />
                  </motion.div>
                </div>
              </div>

              <div className="relative z-10">
                <p className="text-sm opacity-80 mb-1">Balance</p>
                <motion.p
                  key={amount}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-3xl font-bold"
                >
                  ₹{amount.toLocaleString()}
                </motion.p>
              </div>

              <div className="relative z-10">
                <p className="text-xs opacity-80">Gift Card • Thnx Digital</p>
              </div>

              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-2xl"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2,
                  ease: 'easeInOut',
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};