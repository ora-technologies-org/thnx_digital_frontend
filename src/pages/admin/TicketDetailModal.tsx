import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Loader2,
  CheckCircle,
  User,
  Mail,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchSupportTicketById,
  SupportTicket,
  updateSupportTicket,
} from "@/features/admin/services/adminTicketService";
type TicketStatus = "IN_PROGRESS" | "CLOSE";
interface TicketDetailModalProps {
  ticketId: string;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({
  ticketId,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<{
    status: TicketStatus;
  }>({
    status: "OPEN",
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["supportTicket", ticketId],
    queryFn: () => fetchSupportTicketById(ticketId),
    enabled: !!ticketId,
  });

  const ticket: SupportTicket | null = data?.data || null;

  const mutation = useMutation({
    mutationFn: (data: { status: string; response: string }) =>
      updateSupportTicket(ticketId, data),
    onSuccess: () => {
      setShowSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["supportTickets"] });
      setTimeout(() => {
        setShowSuccess(false);
        onUpdate();
        onClose();
      }, 1500);
    },
  });

  React.useEffect(() => {
    if (ticket) {
      setFormData({
        status: ticket.status,
        response: ticket.response || "",
      });
    }
  }, [ticket]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto z-10"
        >
          {/* Success Overlay */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white rounded-2xl flex items-center justify-center z-20"
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                  >
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Ticket Updated!
                  </h3>
                  <p className="text-gray-600">Changes saved successfully.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Ticket Details
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                View and respond to support ticket
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={mutation.isPending}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="p-12 flex items-center justify-center">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
            </div>
          ) : ticket ? (
            <div className="p-6 space-y-6">
              {/* Ticket Info */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {ticket.title}
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {ticket.merchantName && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <User className="w-4 h-4 text-blue-600" />
                      <span>{ticket.merchantName}</span>
                    </div>
                  )}
                  {ticket.merchantEmail && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <span>{ticket.merchantEmail}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">Status: {ticket.status}</span>
                  </div>
                </div>
              </div>

              {/* Query */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Query Description
                </label>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-800 whitespace-pre-wrap">
                    {ticket.merchantQuery}
                  </p>
                </div>
              </div>

              {/* Update Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Status Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Update Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: e.target.value as TicketStatus,
                      }))
                    }
                    disabled={mutation.isPending}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  >
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="CLOSE">Close</option>
                  </select>
                </div>

                {/* Response */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Response
                  </label>
                  <textarea
                    value={formData.response}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        response: e.target.value,
                      }))
                    }
                    disabled={mutation.isPending}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:bg-gray-50"
                    placeholder="Enter your response to the merchant..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={mutation.isPending}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {mutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Ticket"
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500">
              Ticket not found
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
