import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { QrCode, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components/ui/Card';
import { Input } from '../../../shared/components/ui/Input';
import { Button } from '../../../shared/components/ui/Button';
import { Badge } from '../../../shared/components/ui/Badge';
import { useQRCode } from '../hooks/useQRCode';
import { useRedeemGiftCard } from '../hooks/useRedeemGiftCard';
import { formatCurrency, formatDateTime } from '../../../shared/utils/helpers';

const redeemSchema = z.object({
  qrCode: z.string().min(1, 'QR code is required'),
  amount: z.number().positive('Amount must be positive'),
  locationName: z.string().optional(),
  notes: z.string().optional(),
});

type RedeemFormData = z.infer<typeof redeemSchema>;

export const RedeemScanner: React.FC = () => {
  const [qrCodeInput, setQrCodeInput] = useState('');
  const [searchedQRCode, setSearchedQRCode] = useState('');
  
  const { data: qrData, isLoading: isSearching } = useQRCode(searchedQRCode);
  const redeemMutation = useRedeemGiftCard();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RedeemFormData>({
    resolver: zodResolver(redeemSchema),
  });

  const handleSearch = () => {
    setSearchedQRCode(qrCodeInput);
  };

  const onSubmit = (data: RedeemFormData) => {
    redeemMutation.mutate(
      {
        qrCode: searchedQRCode,
        amount: data.amount,
        locationName: data.locationName,
        notes: data.notes,
      },
      {
        onSuccess: () => {
          reset();
          setQrCodeInput('');
          setSearchedQRCode('');
        },
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Search Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <QrCode className="h-6 w-6 mr-2" />
            Scan or Enter QR Code
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Enter QR code (e.g., GC-L5X9K-A1B2C3...)"
              value={qrCodeInput}
              onChange={(e) => setQrCodeInput(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={!qrCodeInput || isSearching}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Gift Card Details */}
      {qrData && (
        <>
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{qrData.giftCard.title}</CardTitle>
                  <p className="text-gray-600 mt-1">{qrData.merchant.businessName}</p>
                </div>
                <Badge
                  variant={
                    qrData.status === 'ACTIVE'
                      ? 'success'
                      : qrData.status === 'EXPIRED'
                      ? 'danger'
                      : 'warning'
                  }
                >
                  {qrData.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Current Balance</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(qrData.currentBalance)}
                  </p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Original Amount</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(qrData.purchaseAmount)}
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Customer</p>
                  <p className="text-lg font-semibold text-purple-600">
                    {qrData.customerName}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span>{qrData.customerEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span>{qrData.customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Purchased:</span>
                  <span>{formatDateTime(qrData.purchasedAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Expires:</span>
                  <span>{formatDateTime(qrData.expiresAt)}</span>
                </div>
                {qrData.lastUsedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Used:</span>
                    <span>{formatDateTime(qrData.lastUsedAt)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Redemptions */}
          {qrData.recentRedemptions && qrData.recentRedemptions.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Recent Redemptions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {qrData.recentRedemptions.map((redemption: any) => (
                    <div
                      key={redemption.id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          {formatCurrency(redemption.amount)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {redemption.locationName || 'Store'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          {formatDateTime(redemption.redeemedAt)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {redemption.redeemedBy.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Redeem Form */}
          {qrData.status === 'ACTIVE' && parseFloat(qrData.currentBalance) > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Redeem Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <Input
                    label="Amount to Redeem (₹)"
                    type="number"
                    step="0.01"
                    placeholder="50.00"
                    error={errors.amount?.message}
                    helperText={`Maximum: ${formatCurrency(qrData.currentBalance)}`}
                    {...register('amount', {
                      valueAsNumber: true,
                      max: {
                        value: parseFloat(qrData.currentBalance),
                        message: 'Amount exceeds available balance',
                      },
                    })}
                  />

                  <Input
                    label="Location (Optional)"
                    placeholder="e.g., Main Street Branch"
                    error={errors.locationName?.message}
                    {...register('locationName')}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes (Optional)
                    </label>
                    <textarea
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Order details or notes..."
                      {...register('notes')}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    isLoading={redeemMutation.isLoading}
                  >
                    Redeem Gift Card
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};