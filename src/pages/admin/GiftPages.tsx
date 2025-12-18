import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  Clock,
  Search,
  ArrowLeft,
  X,
  ShoppingBag,
  Calendar,
  Tag,
  Filter,
} from "lucide-react";
import { merchantService } from "@/features/admin/services/merchantService";
import AdminLayout from "@/shared/components/layout/AdminLayout";

// Custom useDebounce hook
const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Error Message
const ErrorMessage = ({ message, onRetry }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center p-12"
  >
    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
      <X className="w-8 h-8 text-red-600" />
    </div>
    <p className="text-lg text-red-600 mb-4">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Retry
      </button>
    )}
  </motion.div>
);

// Gift Card Modal - Made responsive
const GiftCardModal = ({ isOpen, onClose, card }) => {
  if (!card) return null;

  const expiryDate = new Date(card.expiryDate);
  const today = new Date();
  const daysUntilExpiry = Math.ceil(
    (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            {/* Header */}
            <div className="flex justify-between items-start p-4 sm:p-6 border-b border-gray-200">
              <div className="pr-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {card.title}
                </h2>
                <p className="text-sm text-gray-500 mt-1">Gift Card Details</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 space-y-6">
              {/* Price Card */}
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-4 sm:p-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="w-5 h-5" />
                  <span className="text-sm font-medium opacity-90">Price</span>
                </div>
                <div className="text-3xl sm:text-4xl font-bold">
                  ₹{parseFloat(card.price).toLocaleString()}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Expiry Date */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">Expiry Date</span>
                  </div>
                  <div className="text-gray-900 font-semibold text-sm sm:text-base">
                    {expiryDate.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div className="mt-2">
                    {daysUntilExpiry > 0 ? (
                      <span className="text-sm text-orange-600 font-medium">
                        Expires in {daysUntilExpiry} day
                        {daysUntilExpiry !== 1 ? "s" : ""}
                      </span>
                    ) : (
                      <span className="text-sm text-red-600 font-medium">
                        Expired
                      </span>
                    )}
                  </div>
                </div>

                {/* Status */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <ShoppingBag className="w-4 h-4" />
                    <span className="text-sm font-medium">Status</span>
                  </div>
                  <div>
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                        card.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {card.isActive ? "✓ Active" : "✗ Inactive"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              {card.description && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm font-medium text-gray-600 mb-2">
                    Description
                  </div>
                  <p className="text-gray-900 text-sm sm:text-base">
                    {card.description}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-4 sm:p-6 border-t border-gray-200">
              <button
                onClick={onClose}
                className="px-4 sm:px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Merchant Card Component - Made responsive
const MerchantCard = ({ merchant, onClick }) => {
  const displayName =
    merchant.businessName || merchant.user?.name || "Unnamed Merchant";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
      onClick={onClick}
      className="bg-white rounded-xl p-4 sm:p-6 cursor-pointer border border-gray-200 hover:border-purple-300 transition-all"
    >
      {/* Header */}
      <div className="flex items-center gap-3 sm:gap-4 mb-4">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg flex-shrink-0">
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">
            {displayName}
          </h3>
          {merchant.user?.name &&
            merchant.businessName &&
            merchant.user.name !== merchant.businessName && (
              <p className="text-xs sm:text-sm text-gray-500 truncate">
                Owner: {merchant.user.name}
              </p>
            )}
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <p className="text-xs sm:text-sm text-gray-600 truncate">
          {merchant.businessEmail || merchant.user?.email || "No email"}
        </p>
        {merchant.businessCategory && (
          <span className="inline-block px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">
            {merchant.businessCategory}
          </span>
        )}
        {merchant.description && (
          <p className="text-xs sm:text-sm text-gray-700 line-clamp-2">
            {merchant.description}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            merchant.profileStatus === "VERIFIED"
              ? "bg-green-100 text-green-800"
              : merchant.profileStatus === "PENDING_VERIFICATION"
                ? "bg-yellow-100 text-yellow-800"
                : merchant.profileStatus === "REJECTED"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
          }`}
        >
          {merchant.profileStatus === "VERIFIED"
            ? "✓ Verified"
            : merchant.profileStatus === "PENDING_VERIFICATION"
              ? "⏳ Pending"
              : merchant.profileStatus === "REJECTED"
                ? "✗ Rejected"
                : merchant.profileStatus || "Unknown"}
        </span>
        <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all whitespace-nowrap">
          View Cards →
        </button>
      </div>
    </motion.div>
  );
};

// Gift Card Component - Made responsive
const GiftCardItem = ({ card, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
      onClick={onClick}
      className="bg-white rounded-xl p-4 sm:p-6 cursor-pointer border border-gray-200 hover:border-purple-300 transition-all"
    >
      {/* Title */}
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
        {card.title || "Untitled Card"}
      </h3>

      {/* Description */}
      {card.description && (
        <p className="text-xs sm:text-sm text-gray-600 mb-4 line-clamp-2">
          {card.description}
        </p>
      )}

      {/* Price */}
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-2xl sm:text-3xl font-bold text-gray-900">
          ₹{parseFloat(card.price || "0").toLocaleString()}
        </span>
      </div>

      {/* Expiry */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mb-4">
        <Calendar className="w-4 h-4" />
        <span>
          Expires:{" "}
          {card.expiryDate
            ? new Date(card.expiryDate).toLocaleDateString()
            : "No date"}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            card.isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {card.isActive ? "Available" : "Sold Out"}
        </span>
        <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all whitespace-nowrap">
          View Details
        </button>
      </div>
    </motion.div>
  );
};

// Merchants Page - Made responsive
const MerchantsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [selectedMerchant, setSelectedMerchant] = useState(null);

  const {
    data: merchants,

    error,
    refetch,
  } = useQuery({
    queryKey: ["merchants"],
    queryFn: merchantService.getMerchants,
  });

  // Filter merchants based on debounced search
  const filteredMerchants = (merchants || []).filter((merchant) => {
    if (!merchant || !debouncedSearch) return true;

    const searchLower = debouncedSearch.toLowerCase();
    const name = (
      merchant.businessName ||
      merchant.user?.name ||
      ""
    ).toLowerCase();
    const email = (
      merchant.businessEmail ||
      merchant.user?.email ||
      ""
    ).toLowerCase();
    const category = (merchant.businessCategory || "").toLowerCase();

    return (
      name.includes(searchLower) ||
      email.includes(searchLower) ||
      category.includes(searchLower)
    );
  });

  if (error)
    return (
      <ErrorMessage message="Failed to load merchants" onRetry={refetch} />
    );

  if (selectedMerchant) {
    return (
      <MerchantGiftCardsPage
        merchant={selectedMerchant}
        onBack={() => setSelectedMerchant(null)}
      />
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
          >
            <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </motion.div>
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              Gift Cards Marketplace
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Click on any merchant to view their cards
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64 lg:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search merchants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Results Count */}
      {debouncedSearch && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 text-xs sm:text-sm text-gray-600"
        >
          Found {filteredMerchants.length} merchant
          {filteredMerchants.length !== 1 ? "s" : ""} matching "
          {debouncedSearch}"
        </motion.div>
      )}

      {/* Merchants Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredMerchants.length > 0 ? (
          filteredMerchants.map((merchant) => (
            <MerchantCard
              key={merchant.id}
              merchant={merchant}
              onClick={() => setSelectedMerchant(merchant)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12 sm:py-16">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full mb-4">
              <Search className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <p className="text-sm sm:text-base text-gray-500">
              {debouncedSearch
                ? "No merchants found"
                : "No merchants available"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Merchant Gift Cards Page - Made responsive
const MerchantGiftCardsPage = ({ merchant, onBack }) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [priceFilter, setPriceFilter] = useState("all");

  const {
    data: cards,

    error,
    refetch,
  } = useQuery({
    queryKey: ["merchant-gift-cards", merchant.userId],
    queryFn: () => merchantService.MerchantGiftCard(merchant.userId),
    enabled: !!merchant.userId,
  });

  const filterCards = (cards) => {
    if (priceFilter === "all") return cards;
    return cards.filter((card) => {
      const price = parseFloat(card.price || "0");
      switch (priceFilter) {
        case "low":
          return price < 1000;
        case "medium":
          return price >= 1000 && price <= 5000;
        case "high":
          return price > 5000;
        default:
          return true;
      }
    });
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  if (error)
    return (
      <ErrorMessage message="Failed to load gift cards" onRetry={refetch} />
    );

  const safeCards = cards || [];
  const filteredCards = filterCards(safeCards);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-4 sm:mb-6 transition-colors text-sm sm:text-base"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        Back to Merchants
      </button>

      {/* Merchant Info */}
      <div className="bg-white rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
              {merchant.businessName || merchant.user?.name || "Merchant"}'s
              Gift Cards
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              {merchant.businessEmail || merchant.user?.email || "No email"}
            </p>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  merchant.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {merchant.isActive ? "Active" : "Inactive"}
              </span>
              <span className="text-xs sm:text-sm text-gray-500">
                ID: {merchant.userId?.substring(0, 8)}...
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
            <label className="font-medium text-gray-700 text-sm sm:text-base">
              Filter by Price:
            </label>
          </div>
          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="px-3 sm:px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors text-sm sm:text-base"
          >
            <option value="all">All Prices</option>
            <option value="low">Under ₹1,000</option>
            <option value="medium">₹1,000 - ₹5,000</option>
            <option value="high">Over ₹5,000</option>
          </select>
        </div>
        <div className="text-xs sm:text-sm text-gray-600">
          Showing {filteredCards.length} of {safeCards.length} cards
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredCards.length > 0 ? (
          filteredCards.map((card) => (
            <GiftCardItem
              key={card.id}
              card={card}
              onClick={() => handleCardClick(card)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12 sm:py-16">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full mb-4">
              <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <p className="text-sm sm:text-base text-gray-500">
              No gift cards found
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      <GiftCardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        card={selectedCard}
      />
    </div>
  );
};

export default function MerchantsAndCardsApp() {
  return (
    <AdminLayout>
      <MerchantsPage />
    </AdminLayout>
  );
}
