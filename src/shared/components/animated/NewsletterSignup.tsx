// src/shared/components/animated/NewsletterSignup.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle, Send } from "lucide-react";
import toast from "react-hot-toast";
import { subscribeToNewsletter } from "@/features/auth/services/LandingContactService";

interface NewsletterSignupProps {
  title?: string;
  subtitle?: string;
  privacyNote?: string;
}

export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  title = "Stay in the Loop",
  subtitle = "Get exclusive offers, new merchant alerts, and gift card deals straight to your inbox!",
  privacyNote = "🔒 We respect your privacy. Unsubscribe anytime.",
}) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await subscribeToNewsletter(email);

      if (response.success) {
        setIsSuccess(true);
        toast.success(
          response.message || "Successfully subscribed to newsletter!",
        );

        // Reset form after 3 seconds
        setTimeout(() => {
          setEmail("");
          setIsSuccess(false);
        }, 3000);
      } else {
        toast.error(
          response.message || "Failed to subscribe. Please try again.",
        );
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
      console.error("Subscription error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <motion.div
          className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Mail className="w-8 h-8 text-white" />
        </motion.div>

        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {title}
        </h2>
        <p className="text-lg text-blue-100 mb-8">{subtitle}</p>

        <form onSubmit={handleSubmit} className="relative">
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-white/50 transition-all"
              whileFocus={{ scale: 1.02 }}
              disabled={isSubmitting || isSuccess}
              required
            />

            <motion.button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSuccess ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Subscribed!
                </>
              ) : isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Send className="w-5 h-5" />
                  </motion.div>
                  Subscribing...
                </>
              ) : (
                <>
                  Subscribe
                  <Send className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </div>

          <motion.p
            className="text-sm text-blue-100 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {privacyNote}
          </motion.p>
        </form>
      </div>
    </motion.div>
  );
};
