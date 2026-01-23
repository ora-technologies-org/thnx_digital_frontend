import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, HelpCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import { Card } from "@/shared/components/ui/Card";
import { Modal } from "@/shared/components/ui/Modal";
import { createSupportTicket } from "@/features/giftCards/services/SuportTicketService";
import { DashboardLayout } from "@/shared/components/layout/DashboardLayout";

export const SupportTicketPage: React.FC = () => {
  // Form state management
  const [formData, setFormData] = useState({
    title: "",
    query: "",
  });
  const [errors, setErrors] = useState<{
    title?: string;
    query?: string;
  }>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Handle ticket submission with success/error states
  const mutation = useMutation({
    mutationFn: createSupportTicket,
    onSuccess: () => {
      setShowSuccessModal(true);
      setFormData({ title: "", query: "" });
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        setErrors({
          query: error.message || "Failed to submit ticket. Please try again.",
        });
      } else {
        setErrors({
          query: "Failed to submit ticket. Please try again.",
        });
      }
    },
  });

  // Validate form fields before submission
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    }

    if (!formData.query.trim()) {
      newErrors.query = "Query description is required";
    } else if (formData.query.length < 10) {
      newErrors.query = "Query must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Clear errors as user types
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    mutation.mutate(formData);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Support</h1>
          </div>
          <p className="text-gray-600">
            Need help? Submit a support ticket and we'll get back to you soon
          </p>
        </motion.div>

        <div className="max-w-3xl">
          {/* Main Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Create Support Ticket
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    disabled={mutation.isPending}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.title ? "border-red-500" : "border-gray-300"
                    } disabled:bg-gray-50 disabled:cursor-not-allowed`}
                    placeholder="Brief description of your issue"
                  />
                  {errors.title && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-red-600"
                    >
                      {errors.title}
                    </motion.p>
                  )}
                </div>

                {/* Query Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Query Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="query"
                    value={formData.query}
                    onChange={handleInputChange}
                    disabled={mutation.isPending}
                    rows={8}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${
                      errors.query ? "border-red-500" : "border-gray-300"
                    } disabled:bg-gray-50 disabled:cursor-not-allowed`}
                    placeholder="Please describe your issue in detail. Include any relevant information that will help us understand and resolve your problem..."
                  />
                  {errors.query && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-red-600"
                    >
                      {errors.query}
                    </motion.p>
                  )}
                  <p className="mt-2 text-sm text-gray-500">
                    Minimum 10 characters required
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {mutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting Ticket...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Submit Ticket
                      </>
                    )}
                  </button>
                </div>
              </form>
            </Card>
          </motion.div>

          {/* Help Information Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6"
          >
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
              <h3 className="font-semibold text-gray-900 mb-3">
                What happens next?
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">1.</span>
                  <span>Your ticket will be reviewed by our support team</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">2.</span>
                  <span>
                    We'll investigate the issue and gather necessary information
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">3.</span>
                  <span>
                    You'll receive a response via email with a solution or
                    further questions
                  </span>
                </li>
              </ul>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        title="Ticket Submitted Successfully!"
        type="success"
        size="md"
        showActions
        confirmText="Got it"
        cancelText="Cancel"
        onConfirm={handleCloseSuccessModal}
      >
        <div className="text-center space-y-4">
          <p className="text-gray-700 mb-2">
            We've received your support ticket. Our team will review it and get
            back to you as soon as possible.
          </p>
        </div>
      </Modal>
    </DashboardLayout>
  );
};
