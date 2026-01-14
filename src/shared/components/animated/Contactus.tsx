import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Sparkles,
  Loader2,
} from "lucide-react";
import { submitContactForm } from "@/features/auth/services/LandingContactService";
import { useLandingPageData } from "@/features/merchant/hooks/useLanding";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export const ContactSection = () => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  // Fetch dynamic contact data
  const { data: landingData, isLoading: isLoadingData } = useLandingPageData();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) {
      setError("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await submitContactForm(formData);

      if (result.success) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({ name: "", email: "", phone: "", message: "" });
        }, 3000);
      } else {
        setError(result.message);
      }
    } catch {
      setError("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Dynamic contact info using data from API
  const contactInfo = landingData?.contact
    ? [
        {
          icon: Mail,
          title: "Email",
          detail: landingData.contact.email,
          gradient: "from-blue-500 to-cyan-500",
        },
        {
          icon: Phone,
          title: "Phone",
          detail: landingData.contact.phone,
          gradient: "from-purple-500 to-pink-500",
        },
        {
          icon: MapPin,
          title: "Location",
          detail: landingData.contact.location,
          gradient: "from-orange-500 to-red-500",
        },
      ]
    : [];

  // Dynamic text content with fallbacks
  const content = {
    badge: landingData?.contact?.title || "We'd Love to Hear From You",
    heading: landingData?.contact?.heading || "Get in Touch",
    subtitle:
      landingData?.contact?.subtitle ||
      "Questions or feedback? Drop us a message!",
    responseTime: landingData?.contact?.responseTime || "2–4 hours",
  };

  // Loading state
  if (isLoadingData) {
    return (
      <section className="py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        </div>
      </section>
    );
  }

  // No data state
  if (!landingData?.contact) {
    return null;
  }

  return (
    <section ref={ref} className="py-16 px-4 relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Compact Header - Dynamic */}
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="text-center mb-10"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-3"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs font-semibold text-blue-700">
              {content.badge}
            </span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {content.heading.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {content.heading.split(" ").slice(-1)[0]}
            </span>
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">{content.subtitle}</p>
        </motion.div>

        <div>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Contact Info - Horizontal Cards */}
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                variants={fadeInUp}
                custom={index}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex flex-col items-center text-center">
                  <motion.div
                    className={`w-12 h-12 bg-gradient-to-r ${info.gradient} rounded-xl flex items-center justify-center mb-3 shadow-lg`}
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <info.icon className="h-6 w-6 text-white" />
                  </motion.div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">
                    {info.title}
                  </h3>
                  <p className="text-xs text-gray-600">{info.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Compact Contact Form */}
          <motion.div
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100"
          >
            {!isSubmitted ? (
              <div className="space-y-4">
                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Your Name *
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-sm"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Email Address *
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-sm"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Phone Number
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-sm"
                      placeholder="9860120392"
                    />
                  </div>

                  {/* Empty div for grid spacing */}
                  <div></div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Your Message *
                  </label>
                  <motion.textarea
                    whileFocus={{ scale: 1.01 }}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none text-sm"
                    placeholder="How can we help you?"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-center">
                  <motion.button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span className="text-sm">Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span className="text-sm">Send Message</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                >
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  Message Sent! 🎉
                </h3>
                <p className="text-sm text-gray-600">
                  We'll get back to you within {content.responseTime}
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Trust Badge with Dynamic Response Time */}
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="text-center mt-6"
        >
          <p className="text-xs text-gray-500">
            <span className="font-semibold text-gray-700">
              {content.responseTime}
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};
