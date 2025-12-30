import React, { useState, useMemo } from "react";
import {
  X,
  CheckCircle,
  User,
  Mail,
  Calendar,
  MessageSquare,
  Building2,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchSupportTicketById,
  updateSupportTicket,
} from "@/features/admin/services/adminTicketService";

// Import reusable components
import { Button } from "@/shared/components/ui/Button";
import { Modal } from "@/shared/components/ui/Modal";

type TicketStatus = "OPEN" | "IN_PROGRESS" | "CLOSE";

// Updated interface to match API response
interface SupportTicket {
  id: string;
  title: string;
  merchantQuery: string;
  adminResponse: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  merchant?: {
    businessName?: string;
    businessEmail?: string;
    user?: {
      name?: string;
      email?: string;
    };
  };
}

interface TicketDetailModalProps {
  ticketId: string;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
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
    response: string;
  }>({
    status: "OPEN",
    response: "",
  });

  // State for response modal
  const [responseModal, setResponseModal] = useState<{
    isOpen: boolean;
    type: "success" | "error" | "info";
    title: string;
    message: string;
    onConfirm?: () => void;
    confirmText?: string;
  }>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
    confirmText: "OK",
  });
  //Fetches a support ticket by its ID using React Query.
  const { data, isLoading } = useQuery({
    queryKey: ["supportTicket", ticketId],
    queryFn: () => fetchSupportTicketById(ticketId),
    enabled: !!ticketId && isOpen,
  });

  const ticket: SupportTicket | null = data?.data || null;

  // Compute current form data - avoids useEffect for syncing state
  const currentFormData = useMemo(() => {
    if (!ticket) return formData;

    // Only use ticket data if formData hasn't been modified
    if (formData.status === "OPEN" && formData.response === "") {
      return {
        status: ticket.status as TicketStatus,
        response: ticket.adminResponse || "",
      };
    }

    return formData;
  }, [ticket, formData]);

  const mutation = useMutation({
    mutationFn: (data: { status: TicketStatus; response: string }) =>
      updateSupportTicket(ticketId, data),
    onSuccess: () => {
      // Show success modal
      openResponseModal(
        "success",
        "Ticket Updated Successfully",
        "Ticket has been updated successfully.",
        () => {
          queryClient.invalidateQueries({ queryKey: ["supportTickets"] });
          queryClient.invalidateQueries({
            queryKey: ["supportTicket", ticketId],
          });
          onUpdate();
          onClose();
        },
      );
    },
    onError: (error: unknown) => {
      const typedError = error as ErrorResponse;
      const errorMessage =
        typedError?.response?.data?.message ||
        typedError?.message ||
        "Failed to update ticket. Please try again.";

      openResponseModal("error", "Update Failed", errorMessage);
    },
  });

  // Open response modal
  const openResponseModal = (
    type: "success" | "error" | "info",
    title: string,
    message: string,
    onConfirm?: () => void,
    confirmText: string = "OK",
  ) => {
    setResponseModal({
      isOpen: true,
      type,
      title,
      message,
      onConfirm,
      confirmText,
    });
  };

  // Close response modal
  const closeResponseModal = () => {
    setResponseModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate response if status is being closed
    if (
      currentFormData.status === "CLOSE" &&
      !currentFormData.response.trim()
    ) {
      openResponseModal(
        "error",
        "Validation Error",
        "Please provide a response before closing the ticket.",
      );
      return;
    }

    mutation.mutate(currentFormData);
  };

  const handleClose = () => {
    if (
      currentFormData.response !== (ticket?.adminResponse || "") ||
      currentFormData.status !== ticket?.status
    ) {
      openResponseModal(
        "info",
        "Unsaved Changes",
        "You have unsaved changes. Are you sure you want to leave?",
        () => {
          setFormData({
            status: (ticket?.status as TicketStatus) || "OPEN",
            response: ticket?.adminResponse || "",
          });
          onClose();
        },
        "Leave",
      );
    } else {
      onClose();
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800";
      case "CLOSE":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      {/* Main Modal */}
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Ticket Details"
        size="lg"
      >
        {isLoading ? (
          <div className="p-12 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-600">Loading ticket details...</p>
            </div>
          </div>
        ) : ticket ? (
          <div className="space-y-6">
            {/* Ticket Info */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {ticket.title}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {ticket.merchant?.user?.name && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <User className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">User:</span>
                    <span>{ticket.merchant.user.name}</span>
                  </div>
                )}
                {ticket.merchant?.businessName && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Building2 className="w-4 h-4 text-purple-600" />
                    <span className="font-medium">Business:</span>
                    <span>{ticket.merchant.businessName}</span>
                  </div>
                )}
                {ticket.merchant?.user?.email && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">Email:</span>
                    <span className="truncate">
                      {ticket.merchant.user.email}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">Created:</span>
                  <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">Status:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      ticket.status,
                    )}`}
                  >
                    {ticket.status.replace("_", " ")}
                  </span>
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
                  value={currentFormData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: e.target.value as TicketStatus,
                    }))
                  }
                  disabled={mutation.isPending}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 transition-colors"
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
                  {currentFormData.status === "CLOSE" && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
                <textarea
                  value={currentFormData.response}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      response: e.target.value,
                    }))
                  }
                  disabled={mutation.isPending}
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none disabled:bg-gray-50 transition-colors"
                  placeholder="Enter your response to the merchant..."
                  required={currentFormData.status === "CLOSE"}
                />
                {currentFormData.status === "CLOSE" && (
                  <p className="mt-1 text-sm text-gray-500">
                    A response is required when closing a ticket.
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={mutation.isPending}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="gradient"
                  isLoading={mutation.isPending}
                  disabled={mutation.isPending}
                  className="flex-1"
                >
                  Update Ticket
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <X className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Ticket Not Found
            </h3>
            <p className="text-sm text-gray-500">
              The requested ticket could not be found.
            </p>
            <div className="mt-6">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Response Modal */}
      <Modal
        isOpen={responseModal.isOpen}
        onClose={closeResponseModal}
        title={responseModal.title}
        size="md"
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
            {responseModal.type === "success" ? (
              <CheckCircle className="h-6 w-6 text-green-600" />
            ) : responseModal.type === "error" ? (
              <X className="h-6 w-6 text-red-600" />
            ) : (
              <MessageSquare className="h-6 w-6 text-blue-600" />
            )}
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-500 whitespace-pre-line">
              {responseModal.message}
            </p>
          </div>

          <div className="mt-6 flex gap-3 justify-center">
            {responseModal.type === "info" && (
              <Button
                variant="outline"
                onClick={closeResponseModal}
                className="px-4"
              >
                Cancel
              </Button>
            )}
            <Button
              variant={responseModal.type === "error" ? "danger" : "gradient"}
              onClick={() => {
                if (responseModal.onConfirm) {
                  responseModal.onConfirm();
                }
                closeResponseModal();
              }}
              className="px-6"
            >
              {responseModal.confirmText}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
