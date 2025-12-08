import { useQuery } from '@tanstack/react-query';
import { purchaseService } from '../services/purchaseService';

export const useQRCode = (qrCode: string) => {
  return useQuery({
    queryKey: ['qrCode', qrCode],
    queryFn: () => purchaseService.getGiftCardByQR(qrCode),
    enabled: !!qrCode && qrCode.length > 0,
  });
};

export const useRedemptionHistory = () => {
  return useQuery({
    queryKey: ['redemptions'],
    queryFn: purchaseService.getRedemptionHistory,
  });
};

export const useCustomerPurchases = (email: string) => {
  return useQuery({
    queryKey: ['customerPurchases', email],
    queryFn: () => purchaseService.getCustomerPurchases(email),
    enabled: !!email,
  });
};