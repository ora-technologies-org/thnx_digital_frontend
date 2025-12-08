import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MainLayout } from '../../shared/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../shared/components/ui/Card';
import { PurchaseForm } from '../../features/purchase/component/PurchaseForm';
// import { QRCodeDisplay } from '../../features/purchase/components/QRCodeDisplay';
import { QRCodeDisplay } from '../../features/purchase/component/QRCodeDisplay';
import { useGiftCard } from '../../features/giftCards/hooks/useGiftCards';
import { usePurchaseGiftCard } from '../../features/purchase/hooks/usePurchaseGiftCard';
import { Spinner } from '../../shared/components/ui/Spinner';
import type { PurchaseData, PurchasedGiftCard } from '../../features/purchase/types/purchase.types';

export const PurchasePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: giftCard, isLoading } = useGiftCard(id || '');
  const purchaseMutation = usePurchaseGiftCard();
  const [purchasedCard, setPurchasedCard] = useState<PurchasedGiftCard | null>(null);

  const handlePurchase = (data: PurchaseData) => {
    if (id) {
      purchaseMutation.mutate(
        { giftCardId: id, data },
        {
          onSuccess: (response) => {
            setPurchasedCard(response);
          },
        }
      );
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (!giftCard) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Gift card not found</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        {purchasedCard ? (
          <QRCodeDisplay purchase={purchasedCard} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Gift Card Info */}
            <Card>
              <CardHeader>
                <CardTitle>Gift Card Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {giftCard.title}
                    </h3>
                    {giftCard.description && (
                      <p className="text-gray-600">{giftCard.description}</p>
                    )}
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600 mb-2">Merchant</p>
                    <p className="font-semibold">
                      {giftCard.merchant?.merchantProfile?.businessName ||
                        giftCard.merchant?.name}
                    </p>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600 mb-2">Price</p>
                    <p className="text-3xl font-bold text-blue-600">
                      ₹{giftCard.price}
                    </p>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600 mb-2">Valid Until</p>
                    <p className="font-semibold">
                      {new Date(giftCard.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Purchase Form */}
            <Card>
              <CardHeader>
                <CardTitle>Purchase Information</CardTitle>
              </CardHeader>
              <CardContent>
                <PurchaseForm
                  onSubmit={handlePurchase}
                  isLoading={purchaseMutation.isLoading}
                  giftCardPrice={giftCard.price}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
};