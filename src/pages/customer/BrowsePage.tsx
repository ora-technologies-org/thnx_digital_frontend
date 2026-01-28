// BrowsePage.tsx - Enhanced Gift Cards Browse Page with Purchase Modal
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useActiveGiftCards } from "../../features/giftCards/hooks/useGiftCards";
import { giftCardService } from "../../features/giftCards/services/giftCardService";
import { Spinner } from "../../shared/components/ui/Spinner";
import { Button } from "../../shared/components/ui/Button";
import { Header } from "../../shared/components/layout/Header";
import { GiftCardDisplay } from "../../features/giftCards/components/GiftCardDisplay";
import { PurchaseModal } from "../../features/giftCards/components/PurchaseModal";
import { ShoppingCart, ArrowLeft, Search, Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";
import type { GiftCard } from "../../features/giftCards/types/giftCard.types";

interface PurchaseData {
  name: string;
  email: string;
  phone: string;
  merchantId: string;
  giftCardId: string;
}

export const BrowsePage: React.FC = () => {
  const navigate = useNavigate();
  const { data: giftCards, isLoading } = useActiveGiftCards();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCard, setSelectedCard] = useState<GiftCard | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load Google Fonts dynamically based on merchant settings
  useEffect(() => {
    const fonts = new Set<string>();
    giftCards?.forEach(() => {
      // Note: Font family would come from settings, not merchantProfile
      // This might need to be fetched separately or included in the API response
    });

    fonts.forEach((font) => {
      const link = document.createElement("link");
      link.href = `https://fonts.googleapis.com/css2?family=${font.replace(
        / /g,
        "+",
      )}:wght@400;500;600;700;800;900&display=swap`;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    });
  }, [giftCards]);

  const handleBack = () => {
    navigate(-1);
  };

  const handlePurchaseClick = (card: GiftCard) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const handlePurchaseSubmit = async (data: PurchaseData) => {
    try {
      await giftCardService.notifyMerchant(data);
      toast.success("Purchase request sent successfully!");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to send request";
      toast.error(errorMessage);
      throw error;
    }
  };

  const filteredCards =
    giftCards?.filter(
      (card) =>
        card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.merchant?.merchantProfile?.businessName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()),
    ) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600 font-medium">
            Loading amazing gift cards...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 overflow-hidden">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 px-4 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute top-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute bottom-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ x: -5 }}
          >
            <div className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow border border-gray-200">
              <ArrowLeft className="h-5 w-5" />
            </div>
            <span className="font-semibold">Back</span>
          </motion.button>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full mb-4 shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-semibold">
                  {filteredCards.length}{" "}
                  {filteredCards.length === 1 ? "Card" : "Cards"} Available
                </span>
              </motion.div>

              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-3">
                Browse{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Gift Cards
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl">
                Discover amazing gift cards from your favorite merchants. No
                account needed to purchase!
              </p>
            </motion.div>

            <motion.div
              className="w-full lg:w-96"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Search cards or merchants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm hover:shadow-md text-gray-900 placeholder-gray-500"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gift Cards Grid */}
      <main className="max-w-7xl mx-auto px-4 pb-20">
        {filteredCards && filteredCards.length > 0 ? (
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {filteredCards.map((card) => {
              return (
                <motion.div
                  key={card.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  {/* Use GiftCardDisplay Component */}
                  {/* Settings should come from a separate API call or be included in the gift card data */}
                  <GiftCardDisplay
                    giftCard={card}
                    settings={undefined}
                    showActions={false}
                    clickable={false}
                  />

                  {/* Purchase Button using Button component */}
                  <Button
                    onClick={() => handlePurchaseClick(card)}
                    variant="gradient"
                    size="lg"
                    className="w-full mt-3 gap-2 shadow-lg hover:shadow-xl"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Purchase Now
                  </Button>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="inline-block p-8 bg-white rounded-3xl shadow-lg mb-6"
            >
              <ShoppingCart className="h-20 w-20 text-gray-300 mx-auto" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No gift cards found
            </h3>
            <p className="text-lg text-gray-500 mb-6">
              {searchQuery
                ? "Try adjusting your search filters"
                : "No gift cards available at the moment"}
            </p>
            {searchQuery && (
              <Button
                onClick={() => setSearchQuery("")}
                variant="gradient"
                size="md"
              >
                Clear Search
              </Button>
            )}
          </motion.div>
        )}
      </main>

      {/* Purchase Modal */}
      {selectedCard && selectedCard.merchant?.merchantProfile && (
        <PurchaseModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCard(null);
          }}
          giftCardId={selectedCard.id}
          merchantId={selectedCard.merchantId}
          giftCardTitle={selectedCard.title}
          giftCardPrice={selectedCard.price.toString()}
          onSubmit={handlePurchaseSubmit}
        />
      )}
    </div>
  );
};
