// src/features/orders/components/OrderDetailsModal.tsx - DETAILED ORDER VIEW! 📋
import React from 'react';
import { motion } from 'framer-motion';
import { 
  X, User, Mail, Phone, MapPin, Calendar, CreditCard,
  Package, Gift, DollarSign, CheckCircle, Clock, XCircle,
  Download, Printer
} from 'lucide-react';
import { Modal } from '../../../shared/components/ui/Modal';
import { Badge } from '../../../shared/components/ui/Badge';
import { Button } from '../../../shared/components/ui/Button';
import type { Order } from '../types/order.types';

interface OrderDetailsModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'pending':
        return <Clock className="w-6 h-6 text-orange-600" />;
      case 'failed':
        return <XCircle className="w-6 h-6 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success" className="text-base">Completed</Badge>;
      case 'pending':
        return <Badge variant="warning" className="text-base">Pending</Badge>;
      case 'failed':
        return <Badge variant="danger" className="text-base">Failed</Badge>;
      default:
        return <Badge variant="default" className="text-base">{status}</Badge>;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadReceipt = () => {
    // Implementation for downloading receipt
    console.log('Downloading receipt for order:', order.orderId);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between pb-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Order Details
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Order ID:</span>
              <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                {order.orderId}
              </code>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(order.status)}
            {getStatusBadge(order.status)}
          </div>
        </div>

        {/* Order Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Customer Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">
                  Name
                </label>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {order.customer.name}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">
                  Email
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <a
                    href={`mailto:${order.customer.email}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {order.customer.email}
                  </a>
                </div>
              </div>
              {order.customer.phone && (
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">
                    Phone
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <a
                      href={`tel:${order.customer.phone}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {order.customer.phone}
                    </a>
                  </div>
                </div>
              )}
              {order.customer.address && (
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">
                    Address
                  </label>
                  <div className="flex items-start gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <p className="text-sm text-gray-900">{order.customer.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-600" />
              Order Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">
                  Order Date
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <p className="text-sm text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <p className="text-xs text-gray-500 ml-6">
                  {new Date(order.createdAt).toLocaleTimeString()}
                </p>
              </div>
              {order.completedAt && (
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">
                    Completed Date
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <p className="text-sm text-gray-900">
                      {new Date(order.completedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              )}
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">
                  Payment Method
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  <p className="text-sm text-gray-900 capitalize">
                    {order.paymentMethod || 'Card Payment'}
                  </p>
                </div>
              </div>
              {order.transactionId && (
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">
                    Transaction ID
                  </label>
                  <code className="block px-2 py-1 bg-white rounded text-xs font-mono mt-1">
                    {order.transactionId}
                  </code>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Gift Card Details */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Gift className="w-5 h-5 text-blue-600" />
            Gift Card Details
          </h3>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-1">
                  {order.giftCard.title}
                </h4>
                {order.giftCard.description && (
                  <p className="text-sm text-gray-600">{order.giftCard.description}</p>
                )}
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  ₹{parseFloat(order.giftCard.price).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">
                  Qty: {order.quantity}
                </div>
              </div>
            </div>
            {order.giftCard.code && (
              <div className="bg-gray-50 rounded-lg p-3">
                <label className="text-xs text-gray-500 uppercase tracking-wide">
                  Gift Card Code
                </label>
                <code className="block text-lg font-mono font-bold text-gray-900 mt-1 tracking-wider">
                  {order.giftCard.code}
                </code>
              </div>
            )}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Payment Summary
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">
                ₹{(parseFloat(order.giftCard.price) * order.quantity).toFixed(2)}
              </span>
            </div>
            {order.discount && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount</span>
                <span className="text-green-600">
                  -₹{parseFloat(order.discount).toFixed(2)}
                </span>
              </div>
            )}
            {order.tax && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">
                  ₹{parseFloat(order.tax).toFixed(2)}
                </span>
              </div>
            )}
            <div className="border-t border-gray-300 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="text-base font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">
                  ₹{parseFloat(order.amount).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {order.notes && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Notes</h4>
            <p className="text-sm text-gray-700">{order.notes}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={handlePrint}
            className="flex-1"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button
            variant="outline"
            onClick={handleDownloadReceipt}
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Receipt
          </Button>
          <Button
            variant="primary"
            onClick={onClose}
            className="flex-1"
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};