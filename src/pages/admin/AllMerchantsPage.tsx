// src/pages/admin/AllMerchantsPage.tsx - ALL MERCHANTS PAGE! 👥✨
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Search, Filter, Building, MapPin, Mail, Phone,
  CheckCircle, XCircle, Eye, Edit, Trash2, MoreVertical,
  Calendar, DollarSign, TrendingUp, Award, Star, Shield
} from 'lucide-react';
import { AdminLayout } from '../../shared/components/layout/AdminLayout';
import { Card, CardContent } from '../../shared/components/ui/Card';
import { Spinner } from '../../shared/components/ui/Spinner';
import { Badge } from '../../shared/components/ui/Badge';
import { useAllMerchants } from '../../features/admin/hooks/useAdmin';
import type { MerchantUser } from '../../features/admin/api/admin.api';

const MerchantCard = ({ merchant, index }: { merchant: MerchantUser; index: number }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.05,
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1]
      }}
      layout
    >
      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 group">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4 flex-1">
              {/* Logo/Avatar */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0"
              >
                {merchant.businessName.substring(0, 2).toUpperCase()}
              </motion.div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">
                  {merchant.businessName}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant={merchant.isVerified ? 'success' : 'destructive'}
                    className="text-xs"
                  >
                    {merchant.isVerified ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </>
                    ) : merchant.profileStatus === 'REJECTED' ? (
                      <>
                        <XCircle className="w-3 h-3 mr-1" />
                        Rejected
                      </>
                    ) : (
                      'Pending'
                    )}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {merchant.businessCategory}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {merchant.city}, {merchant.state}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(merchant.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions Menu */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowActions(!showActions)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </motion.button>

              <AnimatePresence>
                {showActions && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-10"
                      onClick={() => setShowActions(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-20"
                    >
                      <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-700">
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-700">
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-red-600">
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Contact Info Grid */}
          <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Mail className="w-4 h-4 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {merchant.businessEmail}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Phone className="w-4 h-4 text-green-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">Phone</p>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {merchant.businessPhone}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-sm font-bold text-gray-900">
                <DollarSign className="w-4 h-4 text-green-600" />
                $12.5k
              </div>
              <p className="text-xs text-gray-500 mt-1">Revenue</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-sm font-bold text-gray-900">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                45
              </div>
              <p className="text-xs text-gray-500 mt-1">Orders</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-sm font-bold text-gray-900">
                <Star className="w-4 h-4 text-yellow-500" />
                4.8
              </div>
              <p className="text-xs text-gray-500 mt-1">Rating</p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex gap-2 mt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              View Profile
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
              Contact
            </motion.button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const AllMerchantsPage: React.FC = () => {
  const { data: merchants, isLoading } = useAllMerchants();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'rejected'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'revenue'>('date');

  const filteredAndSortedMerchants = useMemo(() => {
    if (!merchants) return [];

    let filtered = merchants;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (m) =>
          m.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.businessEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus === 'verified') {
      filtered = filtered.filter((m) => m.isVerified);
    } else if (filterStatus === 'rejected') {
      filtered = filtered.filter((m) => m.profileStatus === 'REJECTED');
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.businessName.localeCompare(b.businessName);
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'revenue':
          return 0; // Mock for now
        default:
          return 0;
      }
    });

    return sorted;
  }, [merchants, searchQuery, filterStatus, sortBy]);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex flex-col justify-center items-center h-64">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Loading merchants...</p>
        </div>
      </AdminLayout>
    );
  }

  const verifiedCount = merchants?.filter((m) => m.isVerified).length || 0;
  const rejectedCount = merchants?.filter((m) => m.profileStatus === 'REJECTED').length || 0;

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <Users className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">All Merchants</h1>
              <p className="text-gray-600 mt-1 text-lg">
                Manage and monitor your merchant network
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total</p>
                  <p className="text-3xl font-bold text-blue-900">{merchants?.length || 0}</p>
                </div>
                <Building className="w-8 h-8 text-blue-600" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Verified</p>
                  <p className="text-3xl font-bold text-green-900">{verifiedCount}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border-2 border-red-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600 font-medium">Rejected</p>
                  <p className="text-3xl font-bold text-red-900">{rejectedCount}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Active</p>
                  <p className="text-3xl font-bold text-purple-900">{verifiedCount}</p>
                </div>
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
            </motion.div>
          </div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col md:flex-row gap-4"
          >
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search merchants by name, email, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified Only</option>
              <option value="rejected">Rejected Only</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all cursor-pointer"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="revenue">Sort by Revenue</option>
            </select>
          </motion.div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-6"
        >
          <p className="text-gray-600">
            Showing <span className="font-bold text-gray-900">{filteredAndSortedMerchants.length}</span> of{' '}
            <span className="font-bold text-gray-900">{merchants?.length || 0}</span> merchants
          </p>
        </motion.div>

        {/* Merchants Grid */}
        {filteredAndSortedMerchants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedMerchants.map((merchant, index) => (
              <MerchantCard key={merchant.id} merchant={merchant} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardContent className="p-16 text-center">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                  className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center"
                >
                  <Search className="w-12 h-12 text-gray-400" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  No merchants found
                </h3>
                <p className="text-gray-600 text-lg">
                  Try adjusting your search or filters
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
};