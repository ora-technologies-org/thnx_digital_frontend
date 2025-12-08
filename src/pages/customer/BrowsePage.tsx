import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useActiveGiftCards } from '../../features/giftCards/hooks/useGiftCards';
import { Spinner } from '../../shared/components/ui/Spinner';
import { formatCurrency, formatDate } from '../../shared/utils/helpers';
import { ShoppingCart } from 'lucide-react';

export const BrowsePage: React.FC = () => {
  const navigate = useNavigate();
  const { data: giftCards, isLoading } = useActiveGiftCards();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Browse Gift Cards</h1>
          <p className="text-gray-600 mt-1">Purchase gift cards without creating an account</p>
        </div>
      </header>

      {/* Gift Cards Grid */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {giftCards && giftCards.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {giftCards.map((card) => (
              <div
                key={card.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {card.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {card.merchant?.merchantProfile?.businessName || card.merchant?.name}
                      </p>
                    </div>
                  </div>

                  {card.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {card.description}
                    </p>
                  )}

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Price</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {formatCurrency(card.price)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Valid until</span>
                      <span className="text-gray-900">{formatDate(card.expiryDate)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/purchase/${card.id}`)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Purchase Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No gift cards available</p>
          </div>
        )}
      </main>
    </div>
  );
};