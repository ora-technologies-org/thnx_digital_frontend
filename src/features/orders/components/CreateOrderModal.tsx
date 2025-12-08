// src/features/orders/components/CreateOrderModal.tsx - FIXED! ⚡
import React, { useState } from 'react';
import { X, User, Mail, Phone, CreditCard, ShoppingBag, Gift, CheckCircle } from 'lucide-react';
import { Modal } from '../../../shared/components/ui/Modal';
import { Input } from '../../../shared/components/ui/Input';
import { Button } from '../../../shared/components/ui/Button';
import { useGiftCards } from '../../giftCards/hooks/useGiftCards';
import type { CreateOrderData } from '../types/order.types';

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateOrderData) => Promise<void>;
  isLoading?: boolean;
}

const PAYMENT_METHODS = [
  { id: 'ESEWA', name: 'eSewa' },
  { id: 'KHALTI', name: 'Khalti' },
  { id: 'IME_PAY', name: 'IME Pay' },
  { id: 'CASH', name: 'Cash' },
  { id: 'CARD', name: 'Card' },
];

export const CreateOrderModal: React.FC<CreateOrderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const { data: giftCardsData } = useGiftCards();
  const giftCards = giftCardsData?.data.giftCards.filter(card => card.isActive) || [];

  const [formData, setFormData] = useState<CreateOrderData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    giftCardId: '',
    paymentMethod: 'CASH',
    transactionId: '',
  });

  const [errors, setErrors] = useState<Partial<CreateOrderData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (field: keyof CreateOrderData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateOrderData> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Invalid email';
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Phone is required';
    }

    if (!formData.giftCardId) {
      newErrors.giftCardId = 'Select a gift card';
    }

    if (!formData.transactionId.trim()) {
      newErrors.transactionId = 'Transaction ID is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      
      // Show success
      setShowSuccess(true);
      
      // Reset form
      setFormData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        giftCardId: '',
        paymentMethod: 'CASH',
        transactionId: '',
      });
      
      // Close modal after 1 second
      setTimeout(() => {
        setShowSuccess(false);
        setIsSubmitting(false);
        onClose();
      }, 1500);
      
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        giftCardId: '',
        paymentMethod: 'CASH',
        transactionId: '',
      });
      setErrors({});
      setShowSuccess(false);
      onClose();
    }
  };

  const selectedGiftCard = giftCards.find(card => card.id === formData.giftCardId);

  if (showSuccess) {
    return (
      <Modal isOpen={isOpen} onClose={() => {}} title="" size="md">
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Order Created!
          </h3>
          <p className="text-gray-600">
            The order has been created successfully
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="text-center pb-6 border-b border-gray-200">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Create Order
          </h2>
          <p className="text-gray-600">
            Enter customer details and select gift card
          </p>
        </div>

        {/* Customer Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Customer Information
          </h3>
          <div className="space-y-4">
            <Input
              label="Customer Name"
              placeholder="Kritim Prasad Kafle"
              value={formData.customerName}
              onChange={(e) => handleChange('customerName', e.target.value)}
              error={errors.customerName}
              disabled={isSubmitting}
              required
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="kritimprasadk@gmail.com"
              value={formData.customerEmail}
              onChange={(e) => handleChange('customerEmail', e.target.value)}
              error={errors.customerEmail}
              disabled={isSubmitting}
              required
            />
            <Input
              label="Phone Number"
              placeholder="+9779876543210"
              value={formData.customerPhone}
              onChange={(e) => handleChange('customerPhone', e.target.value)}
              error={errors.customerPhone}
              disabled={isSubmitting}
              required
            />
          </div>
        </div>

        {/* Gift Card Selection */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Gift className="w-5 h-5 text-purple-600" />
            Gift Card
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Gift Card *
            </label>
            <select
              value={formData.giftCardId}
              onChange={(e) => handleChange('giftCardId', e.target.value)}
              disabled={isSubmitting}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.giftCardId ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            >
              <option value="">-- Select Gift Card --</option>
              {giftCards.map((card) => (
                <option key={card.id} value={card.id}>
                  {card.title} - ₹{card.price}
                </option>
              ))}
            </select>
            {errors.giftCardId && (
              <p className="mt-1 text-sm text-red-600">{errors.giftCardId}</p>
            )}
          </div>

          {selectedGiftCard && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-900">{selectedGiftCard.title}</p>
                  {selectedGiftCard.description && (
                    <p className="text-sm text-gray-600">{selectedGiftCard.description}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{parseFloat(selectedGiftCard.price).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Payment Details */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-green-600" />
            Payment Details
          </h3>
          
          {/* Payment Method */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => handleChange('paymentMethod', method.id)}
                  disabled={isSubmitting}
                  className={`p-3 border rounded-lg transition-all text-sm font-medium ${
                    formData.paymentMethod === method.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {method.name}
                </button>
              ))}
            </div>
          </div>

          {/* Transaction ID */}
          <Input
            label="Transaction ID"
            placeholder="TXN123456789"
            value={formData.transactionId}
            onChange={(e) => handleChange('transactionId', e.target.value)}
            error={errors.transactionId}
            disabled={isSubmitting}
            required
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="flex-1"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="inline-block animate-spin mr-2">⏳</span>
                Creating...
              </>
            ) : (
              'Create Order'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};