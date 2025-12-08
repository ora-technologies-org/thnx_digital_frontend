// src/features/giftCards/components/CustomerGiftCardCard.tsx - CUSTOMER VIEW CARD! 🎁
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Calendar, DollarSign } from 'lucide-react';
import { Card, CardContent } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import type { GiftCard } from '../types/giftCard.types';
import { formatCurrency, formatDate } from '../../../shared/utils/helpers';

interface CustomerGiftCardCardProps {
  giftCard: GiftCard;
  onBuyNow: (giftCard: GiftCard) => void;
}

export const CustomerGiftCardCard: React.FC<CustomerGiftCardCardProps> = ({
  giftCard,
  onBuyNow,
}) => {
  const isExpiringSoon = new Date(giftCard.expiryDate) < 
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden hover:shadow-2xl transition-shadow duration-300">
        <CardContent className="p-0">
          {/* Gift Card Preview */}
          <div className="h-48 bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 opacity-20"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              style={{
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '50px 50px',
              }}
            />
            <div className="relative h-full flex items-center justify-center p-6">
              <div className="text-center text-white">
                <div className="text-5xl font-bold mb-2">
                  {formatCurrency(giftCard.price)}
                </div>
                <div className="text-lg font-medium opacity-90">
                  Gift Card
                </div>
              </div>
            </div>
          </div>

          {/* Card Details */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
              {giftCard.title}
            </h3>
            
            {giftCard.description && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {giftCard.description}
              </p>
            )}

            {/* Expiry Date */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Calendar className="w-4 h-4" />
              <span>Valid until {formatDate(giftCard.expiryDate)}</span>
              {isExpiringSoon && (
                <span className="text-orange-600 font-medium ml-2">
                  • Expires Soon!
                </span>
              )}
            </div>

            {/* Buy Button */}
            <Button
              onClick={() => onBuyNow(giftCard)}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-semibold py-3 text-lg shadow-lg"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Buy Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};