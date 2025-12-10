/* eslint-disable react-hooks/purity */

// src/features/giftCards/components/GiftCardCard.tsx - ENHANCED! 🎨
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Edit, Trash2, Calendar, DollarSign, Copy, 
   MoreVertical, Power, PowerOff 
} from 'lucide-react';
import { Card, CardContent } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Badge } from '../../../shared/components/ui/Badge';
import type { GiftCard } from '../types/giftCard.types';
import { formatCurrency, formatDate } from '../../../shared/utils/helpers';

interface GiftCardCardProps {
  giftCard: GiftCard;
  onEdit?: (giftCard: GiftCard) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (giftCard: GiftCard) => void;
  onToggleStatus?: (giftCard: GiftCard) => void;
  showActions?: boolean;
  viewMode?: 'grid' | 'list';
}

export const GiftCardCard: React.FC<GiftCardCardProps> = ({
  giftCard,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleStatus,
  showActions = true,
  viewMode = 'grid',
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isExpired = new Date(giftCard.expiryDate) < new Date();
  const isExpiringSoon =
    !isExpired &&
    new Date(giftCard.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const daysUntilExpiry = Math.ceil(
    (new Date(giftCard.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  // Grid View
  if (viewMode === 'grid') {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <Card className="hover:shadow-xl transition-all duration-300 overflow-hidden">
          <CardContent className="p-0">
            {/* Card Preview/Image */}
            <div className="h-40 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden">
              <motion.div
                animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full flex items-center justify-center"
              >
                <div className="text-center text-white p-6">
                  <DollarSign className="w-16 h-16 mx-auto mb-2 opacity-80" />
                  <p className="text-3xl font-bold">
                    {formatCurrency(giftCard.price)}
                  </p>
                </div>
              </motion.div>

              {/* Status Badge Overlay */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Badge
                  variant={giftCard.isActive ? 'success' : 'danger'}
                  className="shadow-lg"
                >
                  {giftCard.isActive ? 'Active' : 'Inactive'}
                </Badge>
                {isExpired && (
                  <Badge variant="danger" className="shadow-lg">
                    Expired
                  </Badge>
                )}
                {isExpiringSoon && (
                  <Badge variant="warning" className="shadow-lg">
                    {daysUntilExpiry}d left
                  </Badge>
                )}
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                    {giftCard.title}
                  </h3>
                  {giftCard.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {giftCard.description}
                    </p>
                  )}
                </div>

                {/* More Menu */}
                {showActions && (
                  <div className="relative">
                    <button
                      onClick={() => setShowMenu(!showMenu)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-600" />
                    </button>

                    {showMenu && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setShowMenu(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20"
                        >
                          <button
                            onClick={() => {
                              onEdit?.(giftCard);
                              setShowMenu(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              onDuplicate?.(giftCard);
                              setShowMenu(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Copy className="w-4 h-4" />
                            Duplicate
                          </button>
                          <button
                            onClick={() => {
                              onToggleStatus?.(giftCard);
                              setShowMenu(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                          >
                            {giftCard.isActive ? (
                              <>
                                <PowerOff className="w-4 h-4" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <Power className="w-4 h-4" />
                                Activate
                              </>
                            )}
                          </button>
                          <hr className="my-2" />
                          <button
                            onClick={() => {
                              onDelete?.(giftCard.id);
                              setShowMenu(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </motion.div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Expiry Info */}
              <div className="flex items-center text-gray-600 text-sm mb-4">
                <Calendar className="h-4 w-4 mr-2" />
                <span>
                  Expires: {formatDate(giftCard.expiryDate)}
                  {!isExpired && daysUntilExpiry > 0 && (
                    <span className="ml-2 text-xs text-gray-500">
                      ({daysUntilExpiry} days)
                    </span>
                  )}
                </span>
              </div>

              {/* Quick Actions */}
              {showActions && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
                  className="flex gap-2 pt-4 border-t border-gray-200"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit?.(giftCard)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDuplicate?.(giftCard)}
                    className="flex-1"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // List View
  return (
    <motion.div whileHover={{ x: 4 }}>
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            {/* Preview */}
            <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-10 h-10 text-white" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-4 mb-2">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {giftCard.title}
                  </h3>
                  {giftCard.description && (
                    <p className="text-sm text-gray-600 line-clamp-1">
                      {giftCard.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Badge variant={giftCard.isActive ? 'success' : 'danger'}>
                    {giftCard.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  {isExpired && <Badge variant="danger">Expired</Badge>}
                  {isExpiringSoon && <Badge variant="warning">{daysUntilExpiry}d</Badge>}
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-semibold">{formatCurrency(giftCard.price)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(giftCard.expiryDate)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            {showActions && (
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit?.(giftCard)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDuplicate?.(giftCard)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete?.(giftCard.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};