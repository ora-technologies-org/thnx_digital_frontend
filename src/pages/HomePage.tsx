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
  ChevronRight,
} from "lucide-react";

import { GradientText } from "../shared/components/animated/GradientText";
import { MagneticButton } from "../shared/components/animated/MagneticButton";
import { TiltCard } from "../shared/components/animated/TiltCard";
import { StatsCounter } from "../shared/components/animated/StatsCounter";
import { FloatingGiftCard } from "../shared/components/animated/FloatingGiftCard";
import { ScrollProgress } from "../shared/components/animated/ScrollProgress";
import { FAQAccordion } from "../shared/components/animated/FAQAccordion";
import { TestimonialCard } from "../shared/components/animated/TestimonialCard";
import { NewsletterSignup } from "../shared/components/animated/NewsletterSignup";
import { GiftCardBuilder } from "../shared/components/animated/GiftCardBuilder";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  fadeInUp,
  staggerContainer,
  slideInLeft,
  slideInRight,
} from "../shared/utils/animations";
import { FloatingChatButton } from "@/shared/components/animated";
import { useAppSelector } from "@/app/hooks";
import { ContactSection } from "@/shared/components/animated/Contactus";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [heroRef, heroInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const [featuresRef, featuresInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const [statsRef] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  // FAQ data
  const faqs = [
    {
      question: "How do I purchase a gift card?",
      answer:
        "Simply browse our marketplace, select a gift card, enter your details, and make payment. No account needed! You'll receive your QR code instantly via email.",
    },
    {
      question: "Can I use a gift card partially?",
      answer:
        "Yes! Our QR codes support partial redemption. Use any amount up to your balance, and the remaining balance stays on the same QR code.",
    },
    {
      question: "What if I lose my QR code?",
      answer:
        'No worries! You can always retrieve your gift card using your email address in the "Track My Gift Card" section.',
    },
    {
      question: "How do I become a merchant?",
      answer:
        'Click "Become a Merchant", fill out the registration form, complete your profile with documents, and wait for admin verification. Once approved, you can start creating gift cards!',
    },
    {
      question: "Are there any fees for merchants?",
      answer:
        "We charge a small transaction fee only when a gift card is redeemed. Creating and listing gift cards is completely free!",
    },
  ];

  // Testimonials data
  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Restaurant Owner",
      avatar: "RK",
      rating: 5,
      text: "Thnx Digital transformed how we sell gift cards! The QR code system is brilliant and our customers love the convenience.",
    },
    {
      name: "Priya Sharma",
      role: "Happy Customer",
      avatar: "PS",
      rating: 5,
      text: "I bought gift cards for my entire family! The process was so smooth, and they could use them at multiple locations. Highly recommend!",
    },
    {
      name: "Amit Patel",
      role: "Spa Owner",
      avatar: "AP",
      rating: 5,
      text: "Managing gift cards was always a headache until we found Thnx Digital. Now everything is tracked digitally and redemption is instant!",
    },
  ];
  useEffect(() => {
    const qrFromUrl = searchParams.get("qr");

    if (qrFromUrl) {
      console.log("🔍 QR code detected in URL:", qrFromUrl);

      // Change 'merchant' to 'MERCHANT' (uppercase)
      if (isAuthenticated && user?.role === "MERCHANT") {
        console.log(
          "✅ Authenticated merchant detected, redirecting to scan page",
        );
        navigate(`/merchant/scan?qr=${encodeURIComponent(qrFromUrl)}`, {
          replace: true,
        });
      } else if (isAuthenticated && user?.role !== "MERCHANT") {
        console.log("ℹ️ User is authenticated but not a merchant");
      } else {
        console.log("ℹ️ User not authenticated, staying on homepage");
      }
    }
  }, [searchParams, isAuthenticated, user, navigate]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 overflow-hidden">
      {/* Scroll Progress Bar */}
      <ScrollProgress />

      {/* Floating Chat Button */}
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
            {/* Logo */}
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

            {/* Nav */}
            <div className="flex items-center gap-3">
              <Link to="/browse">
                <motion.button
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Browse
                </motion.button>
              </Link>
              <Link to="/login">
                <motion.button
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Login
                </motion.button>
              </Link>
              <Link to="/register">
                <MagneticButton size="md" variant="primary">
                  Get Started
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
        {/* Animated background elements */}
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
            {/* Left: Text */}
            <motion.div
              initial="hidden"
              animate={heroInView ? "visible" : "hidden"}
              variants={staggerContainer}
            >
              {/* Badge */}
              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6"
              >
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">
                  🎉 Over 10,000 Happy Users!
                </span>
              </motion.div>

              {/* Heading */}
              <motion.h1
                variants={fadeInUp}
                className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight"
              >
                Digital Gift Cards
                <br />
                Made <GradientText>Magical</GradientText>
              </motion.h1>

              {/* Subheading */}
              <motion.p
                variants={fadeInUp}
                className="text-xl text-gray-600 mb-8 leading-relaxed"
              >
                Create, purchase, and redeem gift cards with{" "}
                <span className="font-semibold text-gray-900">QR codes</span>.
                Simple, fast, and secure.{" "}
                <span className="text-blue-600 font-semibold">
                  No account needed to buy!
                </span>
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap gap-4 mb-8"
              >
                <Link to="/browse">
                  <MagneticButton size="lg" variant="primary">
                    Browse Gift Cards
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </MagneticButton>
                </Link>
                <Link to="/register">
                  <MagneticButton size="lg" variant="outline">
                    Become a Merchant
                  </MagneticButton>
                </Link>
              </motion.div>

              {/* Trust indicators */}
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

            {/* Right: Floating Cards */}
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
            <StatsCounter value={10000} suffix="+" label="Active Users" />
            <StatsCounter value={500} suffix="+" label="Merchants" />
            <StatsCounter value={50000} suffix="+" label="Gift Cards Sold" />
            <StatsCounter value={99} suffix="%" label="Satisfaction Rate" />
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section ref={featuresRef} className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
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

          {/* Features Grid */}
          <motion.div
            className="grid md:grid-cols-3 gap-8 mb-12"
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            {/* Feature 1 */}
            <motion.div variants={fadeInUp}>
              <TiltCard>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Gift className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  Create Gift Cards
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Merchants can create beautiful, custom gift cards for their
                  business in minutes. Set your price, expiry, and start
                  selling!
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Easy setup in 5 minutes</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Unlimited customization</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Real-time analytics</span>
                  </li>
                </ul>
              </TiltCard>
            </motion.div>

            {/* Feature 2 */}
            <motion.div variants={fadeInUp}>
              <TiltCard>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <ShoppingBag className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  Easy Purchase
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Customers can buy gift cards without creating an account. Just
                  enter details, pay, and receive your QR code instantly!
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>No signup required</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Instant QR code delivery</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Email & SMS alerts</span>
                  </li>
                </ul>
              </TiltCard>
            </motion.div>

            {/* Feature 3 */}
            <motion.div variants={fadeInUp}>
              <TiltCard>
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <QrCode className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  QR Code Redemption
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Use QR codes to redeem at any merchant location instantly.
                  Track balance, history, and use partially - all in one code!
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Scan & redeem instantly</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Partial redemption support</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Full transaction history</span>
                  </li>
                </ul>
              </TiltCard>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== INTERACTIVE GIFT CARD BUILDER ===== */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <GiftCardBuilder />
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden relative">
        {/* Background pattern */}
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
            {/* Step 1 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideInLeft}
              className="text-center relative"
            >
              <motion.div
                className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-6 relative z-10"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                1
              </motion.div>
              <h3 className="text-2xl font-semibold mb-3">Choose Gift Card</h3>
              <p className="text-blue-100">
                Browse from hundreds of gift cards from your favorite local
                merchants
              </p>

              {/* Connecting line */}
              <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-white/20" />
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center relative"
            >
              <motion.div
                className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-6 relative z-10"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                2
              </motion.div>
              <h3 className="text-2xl font-semibold mb-3">
                Purchase Instantly
              </h3>
              <p className="text-blue-100">
                Enter your details and get your QR code immediately via email
              </p>

              {/* Connecting line */}
              <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-white/20" />
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideInRight}
              className="text-center"
            >
              <motion.div
                className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-6"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                3
              </motion.div>
              <h3 className="text-2xl font-semibold mb-3">Redeem Anywhere</h3>
              <p className="text-blue-100">
                Show your QR code at any merchant location to redeem your gift
                card
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-20 px-4">
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

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                {...testimonial}
                delay={index * 0.2}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
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

          <FAQAccordion items={faqs} />
        </div>
      </section>

      {/* ===== NEWSLETTER SECTION ===== */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <NewsletterSignup />
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
          {/* Background decoration */}
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
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
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of happy customers and merchants using Thnx Digital
              today
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/browse">
                <MagneticButton size="lg" variant="secondary">
                  Browse Gift Cards
                  <ArrowRight className="ml-2 h-5 w-5" />
                </MagneticButton>
              </Link>
              <Link to="/register">
                <MagneticButton
                  size="lg"
                  variant="outline"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  Become a Merchant
                  <ChevronRight className="ml-2 h-5 w-5" />
                </MagneticButton>
              </Link>
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
            {/* Brand */}
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

            {/* Product */}
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    For Merchants
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Refund Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-500 text-sm">
              © 2025 Thnx Digital. All rights reserved. Made with ❤️ in Nepal By
              OraTechnologies
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
