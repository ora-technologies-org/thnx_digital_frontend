// src/features/admin/components/notifications/NotificationPreferences.tsx

import React from 'react';
import { Loader2, Bell, BellOff } from 'lucide-react';
import { useNotificationPreferences } from '@/features/admin/hooks/useNotifications';
import { useAppSelector } from '@/app/hooks';
// import { useNotificationPreferences } from '../../hooks/useNotifications';
// import { useAppSelector } from '../../../../app/hooks';

interface PreferenceToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const PreferenceToggle: React.FC<PreferenceToggleProps> = ({
  label,
  description,
  checked,
  onChange,
  disabled,
}) => (
  <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
    <div className="flex-1">
      <p className="text-sm font-medium text-gray-900">{label}</p>
      <p className="text-sm text-gray-500 mt-0.5">{description}</p>
    </div>
    <button
      onClick={() => onChange(!checked)}
      disabled={disabled}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors
        ${checked ? 'bg-blue-600' : 'bg-gray-200'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
          ${checked ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </button>
  </div>
);

const NotificationPreferences: React.FC = () => {
  const { preferences, isLoading, updatePreference, isUpdating } =
    useNotificationPreferences();
  const user = useAppSelector((state) => state.auth.user);
  const isAdmin = user?.role === 'ADMIN';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="text-center py-12 text-gray-500">
        <BellOff className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>Unable to load preferences</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Bell className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Notification Preferences
            </h2>
            <p className="text-sm text-gray-500">
              Choose which notifications you want to receive
            </p>
          </div>
        </div>
      </div>

      {/* Admin Preferences */}
      {isAdmin && (
        <div className="px-6 py-4">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Admin Notifications
          </h3>
          <div className="space-y-0">
            <PreferenceToggle
              label="New Merchant Registration"
              description="Get notified when a new merchant registers"
              checked={preferences.merchantRegistered}
              onChange={(checked) => updatePreference('merchantRegistered', checked)}
              disabled={isUpdating}
            />
            <PreferenceToggle
              label="Profile Verification Requests"
              description="Get notified when a merchant submits their profile for verification"
              checked={preferences.profileSubmittedForVerification}
              onChange={(checked) =>
                updatePreference('profileSubmittedForVerification', checked)
              }
              disabled={isUpdating}
            />
            <PreferenceToggle
              label="Purchases"
              description="Get notified when a gift card is purchased"
              checked={preferences.purchaseMade}
              onChange={(checked) => updatePreference('purchaseMade', checked)}
              disabled={isUpdating}
            />
            <PreferenceToggle
              label="Redemptions"
              description="Get notified when a gift card is redeemed"
              checked={preferences.redemptionMade}
              onChange={(checked) => updatePreference('redemptionMade', checked)}
              disabled={isUpdating}
            />
          </div>
        </div>
      )}

      {/* Merchant Preferences */}
      {!isAdmin && (
        <div className="px-6 py-4">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Merchant Notifications
          </h3>
          <div className="space-y-0">
            <PreferenceToggle
              label="Profile Verified"
              description="Get notified when your profile is verified by admin"
              checked={preferences.profileVerified}
              onChange={(checked) => updatePreference('profileVerified', checked)}
              disabled={isUpdating}
            />
            <PreferenceToggle
              label="Profile Rejected"
              description="Get notified if your profile is rejected"
              checked={preferences.profileRejected}
              onChange={(checked) => updatePreference('profileRejected', checked)}
              disabled={isUpdating}
            />
            <PreferenceToggle
              label="Gift Card Purchased"
              description="Get notified when someone buys your gift card"
              checked={preferences.giftCardPurchased}
              onChange={(checked) => updatePreference('giftCardPurchased', checked)}
              disabled={isUpdating}
            />
            <PreferenceToggle
              label="Gift Card Redeemed"
              description="Get notified when your gift card is redeemed"
              checked={preferences.giftCardRedeemed}
              onChange={(checked) => updatePreference('giftCardRedeemed', checked)}
              disabled={isUpdating}
            />
          </div>
        </div>
      )}

      {/* Updating Indicator */}
      {isUpdating && (
        <div className="px-6 py-3 bg-blue-50 border-t border-blue-100">
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving preferences...
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPreferences;