import React from 'react';
import { MainLayout } from '../../shared/components/layout/MainLayout';
import { useRedemptionHistory } from '../../features/purchase/hooks/useQRCode';
import { Spinner } from '../../shared/components/ui/Spinner';
import { formatCurrency, formatDateTime } from '../../shared/utils/helpers';
import { RedeemScanner } from '@/features/purchase/component/RedeemScanner';
export const RedemptionsPage: React.FC = () => {
  const { data: redemptions, isLoading } = useRedemptionHistory();

  return (
    <MainLayout showSidebar>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Redemptions</h1>
          <p className="text-gray-600 mt-2">
            Scan customer QR codes to redeem gift cards
          </p>
        </div>

        {/* Scanner */}
        <RedeemScanner />

        {/* History */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Redemptions</h2>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : redemptions && redemptions.length > 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gift Card</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance After</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {redemptions.map((redemption: any) => (
                    <tr key={redemption.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {redemption.purchasedGiftCard.customerName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {redemption.purchasedGiftCard.customerEmail}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {redemption.purchasedGiftCard.giftCard.title}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-green-600">
                        {formatCurrency(redemption.amount)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatCurrency(redemption.balanceAfter)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {redemption.locationName || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDateTime(redemption.redeemedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <p className="text-gray-500">No redemptions yet</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};


// import React from 'react';
// import { Calendar } from 'lucide-react';
// import { Sidebar } from '@/shared/components/layout/Sidebar';

// export const RedemptionsPage: React.FC = () => {
//   return (
//     <div className="flex">
//       <Sidebar />
//       <main className="flex-1 p-8 bg-gray-50">
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">Redemptions</h1>
//             <p className="text-gray-600">View gift card redemption history</p>
//           </div>
//           <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
//             <Calendar className="w-4 h-4" />
//             Filter Date
//           </button>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//           <div className="bg-white p-6 rounded-lg shadow">
//             <p className="text-sm text-gray-600 mb-1">Total Redeemed</p>
//             <p className="text-2xl font-bold text-gray-900">0</p>
//           </div>
//           <div className="bg-white p-6 rounded-lg shadow">
//             <p className="text-sm text-gray-600 mb-1">Amount Redeemed</p>
//             <p className="text-2xl font-bold text-gray-900">₹0</p>
//           </div>
//           <div className="bg-white p-6 rounded-lg shadow">
//             <p className="text-sm text-gray-600 mb-1">This Month</p>
//             <p className="text-2xl font-bold text-gray-900">0</p>
//           </div>
//         </div>

//         {/* Redemptions List */}
//         <div className="bg-white rounded-lg shadow">
//           <div className="p-8 text-center">
//             <p className="text-gray-600">No redemptions yet</p>
//             <p className="text-sm text-gray-500 mt-2">Redemption history will appear here</p>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };