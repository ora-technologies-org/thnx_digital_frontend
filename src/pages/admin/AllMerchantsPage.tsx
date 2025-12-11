// src/pages/admin/AllMerchantsPage.tsx - ALL MERCHANTS PAGE! 👥✨

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  Building,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  SortAsc,
  RefreshCw,
} from 'lucide-react';
import { AdminLayout } from '../../shared/components/layout/AdminLayout';
import { Card, CardContent } from '../../shared/components/ui/Card';
import { Spinner } from '../../shared/components/ui/Spinner';
import { useAllMerchants } from '../../features/admin/hooks/useAdmin';
import MerchantCard from '../merchant/MerchantCard';

type FilterStatus = 'all' | 'verified' | 'pending' | 'rejected' | 'incomplete';
type SortBy = 'name' | 'date' | 'status';

export const AllMerchantsPage: React.FC = () => {
  const { data: merchants, isLoading, refetch, isRefetching } = useAllMerchants();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortBy, setSortBy] = useState<SortBy>('date');

  const filteredAndSortedMerchants = useMemo(() => {
    if (!merchants) return [];

    let filtered = merchants;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.businessName.toLowerCase().includes(query) ||
          m.businessEmail?.toLowerCase().includes(query) ||
          m.user.email.toLowerCase().includes(query) ||
          m.city?.toLowerCase().includes(query) ||
          m.user.name.toLowerCase().includes(query)
      );
    }

    // Status filter
    switch (filterStatus) {
      case 'verified':
        filtered = filtered.filter((m) => m.profileStatus === 'VERIFIED');
        break;
      case 'pending':
        filtered = filtered.filter((m) => m.profileStatus === 'PENDING_VERIFICATION');
        break;
      case 'rejected':
        filtered = filtered.filter((m) => m.profileStatus === 'REJECTED');
        break;
      case 'incomplete':
        filtered = filtered.filter((m) => m.profileStatus === 'INCOMPLETE');
        break;
    }

    // Sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.businessName.localeCompare(b.businessName);
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'status':
          return a.profileStatus.localeCompare(b.profileStatus);
        default:
          return 0;
      }
    });

    return sorted;
  }, [merchants, searchQuery, filterStatus, sortBy]);

  // Stats
  const stats = useMemo(() => {
    if (!merchants) return { total: 0, verified: 0, pending: 0, rejected: 0 };
    return {
      total: merchants.length,
      verified: merchants.filter((m) => m.profileStatus === 'VERIFIED').length,
      pending: merchants.filter((m) => m.profileStatus === 'PENDING_VERIFICATION').length,
      rejected: merchants.filter((m) => m.profileStatus === 'REJECTED').length,
    };
  }, [merchants]);

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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30"
              >
                <Users className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">All Merchants</h1>
                <p className="text-gray-600 mt-1">Manage and monitor your merchant network</p>
              </div>
            </div>

            {/* Refresh Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => refetch()}
              disabled={isRefetching}
              className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
            >
              <RefreshCw className={`w-5 h-5 text-gray-600 ${isRefetching ? 'animate-spin' : ''}`} />
            </motion.button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border border-blue-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total</p>
                  <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
                </div>
                <Building className="w-8 h-8 text-blue-600" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 bg-gradient-to-br from-emerald-50 to-teal-100 rounded-xl border border-emerald-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-600 font-medium">Verified</p>
                  <p className="text-3xl font-bold text-emerald-900">{stats.verified}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl border border-amber-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-600 font-medium">Pending</p>
                  <p className="text-3xl font-bold text-amber-900">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-4 bg-gradient-to-br from-red-50 to-rose-100 rounded-xl border border-red-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600 font-medium">Rejected</p>
                  <p className="text-3xl font-bold text-red-900">{stats.rejected}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
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
                placeholder="Search by name, email, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all bg-white"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                className="pl-10 pr-8 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all cursor-pointer appearance-none bg-white min-w-[160px]"
              >
                <option value="all">All Status</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
                <option value="incomplete">Incomplete</option>
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <SortAsc className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="pl-10 pr-8 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all cursor-pointer appearance-none bg-white min-w-[160px]"
              >
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Name</option>
                <option value="status">Sort by Status</option>
              </select>
            </div>
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
            Showing <span className="font-bold text-gray-900">{filteredAndSortedMerchants.length}</span>{' '}
            of <span className="font-bold text-gray-900">{merchants?.length || 0}</span> merchants
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
            <Card className="border-0 shadow-lg">
              <CardContent className="p-16 text-center">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                  className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center"
                >
                  <Search className="w-12 h-12 text-gray-400" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No merchants found</h3>
                <p className="text-gray-600 text-lg">Try adjusting your search or filters</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AllMerchantsPage;