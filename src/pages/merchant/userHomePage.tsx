import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Gift,
  ShoppingBag,
  QrCode,
  Zap,
  Shield,
  ArrowRight,
  Sparkles,
  Heart,
  Check,
} from "lucide-react";

import {
  FAQAccordion,
  FloatingChatButton,
  FloatingGiftCard,
  GradientText,
  MagneticButton,
  NewsletterSignup,
  ScrollProgress,
  StatsCounter,
  TiltCard,
} from "@/shared/components/animated";
import { ContactSection } from "@/shared/components/animated/Contactus";
import {
  useLandingPageData,
  useFormattedStats,
} from "@/features/merchant/hooks/useLanding";
import { TestimonialsScroll } from "@/shared/components/animated/TestimonialCard";
import {
  fadeInUp,
  staggerContainer,
  slideInLeft,
  slideInRight,
} from "@/shared/utils/animations";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { Spinner } from "@/shared/components/ui/Spinner";
export const UserHomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // Fetch landing page data
  const { data: landingData, isLoading, error } = useLandingPageData();
  const { stats: formattedStats } = useFormattedStats();

  // Trigger animations when hero section enters viewport
  const [heroRef, heroInView] = useInView({
    threshold: 0.2, // Trigger when 20% of element is visible
    triggerOnce: true, // Only trigger animation once (not on every scroll)
  });

  // Trigger animations when features section enters viewport
  const [featuresRef, featuresInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  // Trigger animations when stats section enters viewport
  const [statsRef] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  // Handle QR code deep linking from URL parameters
  useEffect(() => {
    const qrFromUrl = searchParams.get("qr");

    if (qrFromUrl) {
      console.log("🔍 QR code detected in URL:", qrFromUrl);

      // Redirect authenticated merchants to scan page with QR code
      if (isAuthenticated && user?.role === "MERCHANT") {
        console.log(
          "✅ Authenticated merchant detected, redirecting to scan page",
        );
        navigate(`/merchant/scan?qr=${encodeURIComponent(qrFromUrl)}`, {
          replace: true,
        });
      }
    }
  }, [searchParams, isAuthenticated, user, navigate]);

  // Helper function to check if data exists
  const hasTestimonials =
    landingData?.testimonials?.items &&
    Array.isArray(landingData.testimonials.items) &&
    landingData.testimonials.items.length > 0;

  const hasFAQs =
    landingData?.faqs?.items &&
    Array.isArray(landingData.faqs.items) &&
    landingData.faqs.items.length > 0;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <Spinner />
          <p className="text-gray-600">Loading </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">😔</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn't load the page. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!landingData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 overflow-hidden">
      <ScrollProgress />
      <FloatingChatButton />

      {/* ===== HEADER ===== */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200/50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <motion.div
                className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <Gift className="h-6 w-6 text-white" />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Thnx Digital
              </span>
            </Link>

            <div className="flex items-center gap-3">
              {/* Browse Gift Cards - Navigates to /browse */}
              <Link to="/merchants">
                <motion.button
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  For Merchant
                </motion.button>
              </Link>

              {/* Become a Merchant - Navigates to /register */}
              {/* <Link to="/register">
                <motion.button
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Become a Merchant
                </motion.button>
              </Link> */}

              {/* <Link to="/login">
                <motion.button
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Login
                </motion.button>
              </Link> */}
              <Link to="/browse">
                <MagneticButton size="md" variant="primary">
                  Browse Gift Cards
                </MagneticButton>
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ===== HERO SECTION ===== */}
      <section
        ref={heroRef}
        className="relative pt-32 pb-20 px-4 overflow-hidden min-h-screen flex items-center"
      >
        <motion.div
          style={{ y: y1 }}
          className="absolute top-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute bottom-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />

        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate={heroInView ? "visible" : "hidden"}
              variants={staggerContainer}
            >
              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6"
              >
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">
                  {landingData.hero.badge}
                </span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight"
              >
                {landingData.hero.title.split("Magical")[0]}
                <br />
                Made <GradientText>Magical</GradientText>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-xl text-gray-600 mb-8 leading-relaxed"
              >
                {landingData.hero.subtitle}
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap gap-4 mb-8"
              >
                <Link to={landingData.hero.primaryCTA.link}>
                  <MagneticButton size="lg" variant="primary">
                    {landingData.hero.primaryCTA.label}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </MagneticButton>
                </Link>
                {/* <Link to={landingData.hero.secondaryCTA.link}>
                  <MagneticButton size="lg" variant="primary">
                    {landingData.hero.secondaryCTA.label}
                  </MagneticButton>
                </Link> */}
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200"
              >
                <div className="text-center">
                  <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <span className="text-sm text-gray-600 block">
                    100% Secure
                  </span>
                </div>
                <div className="text-center">
                  <Zap className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <span className="text-sm text-gray-600 block">
                    Instant Delivery
                  </span>
                </div>
                <div className="text-center">
                  <Heart className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <span className="text-sm text-gray-600 block">
                    Loved by Many
                  </span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="relative h-[600px] hidden lg:block"
              initial="hidden"
              animate={heroInView ? "visible" : "hidden"}
              variants={staggerContainer}
            >
              <FloatingGiftCard
                delay={0.2}
                size="lg"
                className="absolute top-0 right-20"
              />
              <FloatingGiftCard
                delay={0.4}
                size="md"
                className="absolute top-40 left-10 rotate-12"
              />
              <FloatingGiftCard
                delay={0.6}
                size="md"
                className="absolute bottom-20 right-0 -rotate-12"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section
        ref={statsRef}
        className="py-20 px-4 bg-white/50 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-gray-600">
              Join our growing community of happy users and merchants
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {formattedStats.map((stat, index) => (
              <StatsCounter
                key={index}
                value={parseInt(stat.value.replace(/[^\d]/g, "")) || 0}
                suffix={stat.suffix}
                label={stat.label}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section ref={featuresRef} className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose <GradientText>Thnx Digital</GradientText>?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of gift cards with cutting-edge technology
              and seamless user experience
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8 mb-12"
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            {landingData.features.map((feature, index) => {
              const icons = [Gift, ShoppingBag, QrCode];
              const Icon = icons[index] || Gift;
              const gradients = [
                "from-blue-500 to-purple-600",
                "from-purple-500 to-pink-600",
                "from-green-500 to-teal-600",
              ];

              return (
                <motion.div key={index} variants={fadeInUp}>
                  <TiltCard>
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${gradients[index]} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {feature.description}
                    </p>
                    <ul className="space-y-2">
                      {feature.points.map((point, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-sm text-gray-600"
                        >
                          <Check className="w-4 h-4 text-green-600" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </TiltCard>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {landingData.steps.map((step, index) => {
              const variants = [slideInLeft, fadeInUp, slideInRight];
              return (
                <motion.div
                  key={step.step}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={variants[index]}
                  className={`text-center ${index < 2 ? "relative" : ""}`}
                >
                  <motion.div
                    className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-6 relative z-10"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {step.step}
                  </motion.div>
                  <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-blue-100">{step.description}</p>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-white/20" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      {hasTestimonials && (
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                What Our Users Say
              </h2>
              <p className="text-xl text-gray-600">
                Don't just take our word for it - hear from our community!
              </p>
            </motion.div>

            <TestimonialsScroll testimonials={landingData.testimonials.items} />
          </div>
        </section>
      )}

      {/* ===== FAQ SECTION ===== */}
      {hasFAQs && (
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600">
                Got questions? We've got answers!
              </p>
            </motion.div>

            <FAQAccordion items={landingData.faqs.items} />
          </div>
        </section>
      )}

      {/* ===== NEWSLETTER SECTION ===== */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <NewsletterSignup
            title={landingData.newsletter?.title}
            subtitle={landingData.newsletter?.subtitle}
            privacyNote={landingData.newsletter?.privacyNote}
          />
        </div>
      </section>

      {/* ===== FINAL CTA SECTION ===== */}
      <section className="py-20 px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 shadow-2xl relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {landingData.finalCTA?.title || "Ready to Get Started?"}
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              {landingData.finalCTA?.subtitle ||
                "Join thousands of happy customers and merchants using Thnx Digital today"}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to={
                  landingData.finalCTA?.primaryCTA?.link ||
                  landingData.hero.primaryCTA.link
                }
              >
                <MagneticButton size="lg" variant="secondary">
                  {landingData.finalCTA?.primaryCTA?.label ||
                    landingData.hero.primaryCTA.label}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </MagneticButton>
              </Link>
              {/* <Link
                to={
                  landingData.finalCTA?.secondaryCTA?.link ||
                  landingData.hero.secondaryCTA.link
                }
              >
                <MagneticButton
                  size="lg"
                  variant="outline"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  {landingData.finalCTA?.secondaryCTA?.label ||
                    landingData.hero.secondaryCTA.label}
                  <ChevronRight className="ml-2 h-5 w-5" />
                </MagneticButton>
              </Link> */}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ===== CONTACT SECTION ===== */}
      <ContactSection />

      {/* ===== FOOTER ===== */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Gift className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">Thnx Digital</span>
              </div>
              <p className="text-gray-400 text-sm">
                The easiest way to give and receive gift cards
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                {landingData.footer.links.product.map((link, i) => (
                  <li key={i}>
                    <a href="#" className="hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                {landingData.footer.links.company.map((link, i) => (
                  <li key={i}>
                    <a href="#" className="hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                {landingData.footer.links.legal.map((link, i) => (
                  <li key={i}>
                    <a href="#" className="hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-500 text-sm">
              {landingData.footer.copyright}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
