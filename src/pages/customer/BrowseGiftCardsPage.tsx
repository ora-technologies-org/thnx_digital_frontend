// src/pages/customer/BrowseGiftCardsPage.tsx - CUSTOMER PURCHASE PAGE! 🛍️
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Gift, Search, Filter } from 'lucide-react';
import { useGiftCards } from '../../features/giftCards/hooks/useGiftCards';
import { Spinner } from '../../shared/components/ui/Spinner';
import type { GiftCard } from '../../features/giftCards/types/giftCard.types';

import { CustomerGiftCardCard } from '@/features/giftCards/components/CustomerGiftCardCard';
import { PurchaseModal } from '@/features/purchase/component/PurchaseModal';



export const BrowseGiftCardsPage: React.FC = () => {
  const { data, isLoading } = useGiftCards();
  const [selectedCard, setSelectedCard] = useState<GiftCard | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const giftCards = data?.data.giftCards || [];

  const filteredCards = giftCards.filter(card => {
    if (!searchQuery) return card.isActive;
    return (
      card.isActive &&
      (card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.description?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const handleBuyNow = (card: GiftCard) => {
    setSelectedCard(card);
    setShowPurchaseModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-pink-500 rounded-2xl flex items-center justify-center">
                <Gift className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Thnx Digital Gift Cards
            </h1>
            <p className="text-lg text-gray-600">
              Perfect gifts for your loved ones
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search gift cards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>
          </div>
        </motion.div>

        {/* Gift Cards Grid */}
        {filteredCards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-sm p-12 text-center"
          >
            <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery ? 'No gift cards found' : 'No gift cards available'}
            </h3>
            <p className="text-gray-600">
              {searchQuery
                ? 'Try adjusting your search'
                : 'Check back soon for new gift cards'}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <CustomerGiftCardCard
                  giftCard={card}
                  onBuyNow={handleBuyNow}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Purchase Modal */}
      {selectedCard && (
        <PurchaseModal
          giftCard={selectedCard}
          isOpen={showPurchaseModal}
          onClose={() => {
            setShowPurchaseModal(false);
            setSelectedCard(null);
          }}
        />
      )}
    </div>
  );
};