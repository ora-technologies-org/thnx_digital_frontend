/* eslint-disable react-hooks/purity */


// src/features/giftCards/components/EnhancedGiftCardList.tsx - FULLY INTERACTIVE! ⚡
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Filter, Grid, List, Download, 
  TrendingUp, DollarSign, Gift, AlertCircle,
   RefreshCw
} from 'lucide-react';

import { GiftCardCard } from './GiftCard';
import { GiftCardForm } from './GiftCardForm';
import { Button } from '../../../shared/components/ui/Button';
import { Modal } from '../../../shared/components/ui/Modal';
import { Spinner } from '../../../shared/components/ui/Spinner';
import { useModal } from '../../../shared/hooks/useModal';
import { useGiftCards } from '../hooks/useGiftCards';
import { useCreateGiftCard } from '../hooks/useCreateGiftCard';
import { useUpdateGiftCard } from '../hooks/useUpdateGiftCard';
import { useDeleteGiftCard } from '../hooks/useDeleteGiftCard';
import type { GiftCard, CreateGiftCardData, UpdateGiftCardData } from '../types/giftCard.types';

type ViewMode = 'grid' | 'list';
type SortOption = 'newest' | 'oldest' | 'price-high' | 'price-low' | 'expiry';
type FilterOption = 'all' | 'active' | 'inactive' | 'expiring';

export const EnhancedGiftCardList: React.FC = () => {
  const { data, isLoading, refetch } = useGiftCards();
  const createMutation = useCreateGiftCard();
  const updateMutation = useUpdateGiftCard();
  const deleteMutation = useDeleteGiftCard();

  const createModal = useModal();
  const editModal = useModal();
  const [selectedCard, setSelectedCard] = useState<GiftCard | null>(null);

  // UI State
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [showFilters, setShowFilters] = useState(false);

  const giftCards = data?.data.giftCards || [];
  const canCreateMore = (data?.data.remaining || 0) > 0;

  // Statistics
  const stats = useMemo(() => {
    const total = giftCards.length;
    const active = giftCards.filter(card => card.isActive).length;
    const totalValue = giftCards.reduce((sum, card) => sum + parseFloat(card.price), 0);
    const expiringSoon = giftCards.filter(card => {
      const expiryDate = new Date(card.expiryDate);
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
    }).length;

    return { total, active, totalValue, expiringSoon };
  }, [giftCards]);

  // Filtered and sorted cards
  const processedCards = useMemo(() => {
    let filtered = giftCards;

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(card =>
        card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filter
    if (filterBy !== 'all') {
      filtered = filtered.filter(card => {
        if (filterBy === 'active') return card.isActive;
        if (filterBy === 'inactive') return !card.isActive;
        if (filterBy === 'expiring') {
          const expiryDate = new Date(card.expiryDate);
          const daysUntilExpiry = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
        }
        return true;
      });
    }

    // Apply sort
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === 'price-high') return parseFloat(b.price) - parseFloat(a.price);
      if (sortBy === 'price-low') return parseFloat(a.price) - parseFloat(b.price);
      if (sortBy === 'expiry') return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
      return 0;
    });

    return sorted;
  }, [giftCards, searchQuery, filterBy, sortBy]);

  // Handlers
  const handleCreate = (formData: CreateGiftCardData) => {
    createMutation.mutate(formData, {
      onSuccess: () => {
        createModal.close();
      },
    });
  };

  const handleEdit = (giftCard: GiftCard) => {
    setSelectedCard(giftCard);
    editModal.open();
  };

  const handleUpdate = (formData: UpdateGiftCardData) => {
    if (selectedCard) {
      updateMutation.mutate(
        { id: selectedCard.id, data: formData },
        {
          onSuccess: () => {
            editModal.close();
            setSelectedCard(null);
          },
        }
      );
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this gift card?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleDuplicate = (card: GiftCard) => {
    const duplicateData = {
      title: `${card.title} (Copy)`,
      description: card.description,
      price: parseFloat(card.price),
      expiryDate: card.expiryDate,
    };
    createMutation.mutate(duplicateData);
  };

  const handleExport = () => {
    const csvContent = [
      ['Title', 'Price', 'Status', 'Expiry Date', 'Created At'],
      ...giftCards.map(card => [
        card.title,
        card.price,
        card.isActive ? 'Active' : 'Inactive',
        new Date(card.expiryDate).toLocaleDateString(),
        new Date(card.createdAt).toLocaleDateString(),
      ]),
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gift-cards-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {/* Total Cards */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Gift className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">
              {data?.data.total}/{data?.data.limit}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.total}</h3>
          <p className="text-sm text-gray-600">Total Gift Cards</p>
        </div>

        {/* Active Cards */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-green-600 text-sm font-medium">
              {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.active}</h3>
          <p className="text-sm text-gray-600">Active Cards</p>
        </div>

        {/* Total Value */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            ₹{stats.totalValue.toFixed(2)}
          </h3>
          <p className="text-sm text-gray-600">Total Value</p>
        </div>

        {/* Expiring Soon */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.expiringSoon}</h3>
          <p className="text-sm text-gray-600">Expiring Soon</p>
        </div>
      </motion.div>

      {/* Controls Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm p-4 border border-gray-200"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search gift cards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-wrap">
            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                showFilters
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${
                  viewMode === 'grid'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 border-l border-gray-300 ${
                  viewMode === 'list'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Refresh */}
            <button
              onClick={() => refetch()}
              className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>

            {/* Export */}
            <button
              onClick={handleExport}
              disabled={giftCards.length === 0}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Export
            </button>

            {/* Create Button */}
            <Button
              onClick={createModal.open}
              disabled={!canCreateMore}
              title={!canCreateMore ? 'You have reached the maximum limit' : ''}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Card
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="flex flex-wrap gap-4">
                {/* Filter By Status */}
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value as FilterOption)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Cards</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                    <option value="expiring">Expiring Soon</option>
                  </select>
                </div>

                {/* Sort By */}
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="expiry">Expiry Date</option>
                  </select>
                </div>

                {/* Clear Filters */}
                {(searchQuery || filterBy !== 'all' || sortBy !== 'newest') && (
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setFilterBy('all');
                        setSortBy('newest');
                      }}
                      className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Results Info */}
      {searchQuery || filterBy !== 'all' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between text-sm text-gray-600"
        >
          <span>
            Showing {processedCards.length} of {giftCards.length} gift cards
          </span>
        </motion.div>
      ) : null}

      {/* Gift Cards Grid/List */}
      {processedCards.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchQuery || filterBy !== 'all' ? 'No results found' : 'No gift cards yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || filterBy !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Create your first gift card to get started'}
          </p>
          {!searchQuery && filterBy === 'all' && (
            <Button onClick={createModal.open}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Gift Card
            </Button>
          )}
        </motion.div>
      ) : (
        <motion.div
          layout
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          <AnimatePresence mode="popLayout">
            {processedCards.map((giftCard) => (
              <motion.div
                key={giftCard.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <GiftCardCard
                  giftCard={giftCard}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onDuplicate={handleDuplicate}
                  viewMode={viewMode}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={createModal.isOpen}
        onClose={createModal.close}
        title="Create Gift Card"
        size="lg"
      >
        <GiftCardForm
          onSubmit={handleCreate}
          isLoading={createMutation.isPending}
          submitLabel="Create Gift Card"
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={() => {
          editModal.close();
          setSelectedCard(null);
        }}
        title="Edit Gift Card"
        size="lg"
      >
        {selectedCard && (
          <GiftCardForm
            initialData={selectedCard}
            onSubmit={handleUpdate}
            isLoading={updateMutation.isPending}
            submitLabel="Update Gift Card"
          />
        )}
      </Modal>
    </div>
  );
};

export default EnhancedGiftCardList;