import { Mail, Phone, MessageSquare, Calendar, User, X } from "lucide-react";
import AdminLayout from "@/shared/components/layout/AdminLayout";
import { useContactMessages } from "@/features/admin/hooks/useAdmin";
import { ContactMessage } from "@/features/admin/services/contactusServices";
import { useState } from "react";
import { Spinner } from "@/shared/components/ui/Spinner";

/**
 * ContactUsPage Component
 *
 * Displays all contact form submissions from users with detailed information
 * and allows viewing full message content in a modal.
 */
export default function ContactUsPage() {
  const { data, isLoading, error } = useContactMessages();

  // Handle different response structures
  // The API might return data directly as array or wrapped in an object with 'messages' property
  const messages: ContactMessage[] = (() => {
    if (Array.isArray(data)) {
      return data;
    }
    if (data && typeof data === "object" && "messages" in data) {
      const messagesData = (data as { messages?: unknown }).messages;
      if (Array.isArray(messagesData)) {
        return messagesData as ContactMessage[];
      }
    }
    return [];
  })();

  // Loading state
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen px-4">
          <Spinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-red-800 text-center mb-2">
              Error Loading Messages
            </h3>
            <p className="text-red-600 text-center">
              {error instanceof Error ? error.message : "An error occurred"}
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Contact Messages
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Manage and respond to user inquiries
            </p>
            <div className="mt-4">
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm inline-block">
                <p className="text-lg sm:text-xl text-blue-600">
                  {messages.length}{" "}
                  <span className="text-xs sm:text-sm text-gray-500">
                    Total Messages
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Messages List or Empty State */}
          {messages.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 sm:p-12 text-center">
              <MessageSquare className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                No Messages Yet
              </h3>
              <p className="text-sm sm:text-base text-gray-500">
                Contact messages will appear here when submitted
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {messages.map((message) => (
                <ContactCard key={message.id} message={message} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

/**
 * Props for ContactCard component
 */
interface ContactCardProps {
  message: ContactMessage;
}

/**
 * ContactCard Component
 *
 * Displays a single contact message card with preview
 * and expandable modal for full message content.
 *
 * @param message - The contact message data to display
 */
function ContactCard({ message }: ContactCardProps) {
  const [showFullMessage, setShowFullMessage] = useState(false);

  /**
   * Returns appropriate color classes based on message status
   * @param status - The status of the message (new, read, replied)
   * @returns Tailwind CSS classes for status badge styling
   */
  const getStatusColor = (status?: string): string => {
    switch (status) {
      case "new":
        return "bg-green-100 text-green-800";
      case "read":
        return "bg-blue-100 text-blue-800";
      case "replied":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      {/* Message Card */}
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-4 sm:p-6 border border-gray-200">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 text-base sm:text-lg truncate">
                {message.name}
              </h3>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="truncate">
                  {new Date(message.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>
          {message.status && (
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(message.status)}`}
            >
              {message.status}
            </span>
          )}
        </div>

        {/* Contact Information */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-gray-700 min-w-0">
            <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <a
              href={`mailto:${message.email}`}
              className="hover:text-blue-600 transition-colors text-sm truncate"
            >
              {message.email}
            </a>
          </div>
          {message.phone && (
            <div className="flex items-center gap-2 text-gray-700 min-w-0">
              <Phone className="w-4 h-4 text-green-500 flex-shrink-0" />
              <a
                href={`tel:${message.phone}`}
                className="hover:text-green-600 transition-colors text-sm truncate"
              >
                {message.phone}
              </a>
            </div>
          )}
        </div>

        {/* Message Content - Single Line Preview */}
        <div
          className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => setShowFullMessage(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setShowFullMessage(true);
            }
          }}
        >
          <div className="flex items-start gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
            <p className="text-xs sm:text-sm font-medium text-gray-700">
              Message (Click to view full)
            </p>
          </div>
          <div className="relative">
            {/* Single line with ellipsis */}
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed truncate">
              {message.message}
            </p>
          </div>
        </div>
      </div>

      {/* Full Message Modal */}
      {showFullMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Background overlay */}
          <div
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            onClick={() => setShowFullMessage(false)}
            role="button"
            tabIndex={0}
            aria-label="Close modal"
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setShowFullMessage(false);
              }
            }}
          />

          {/* Modal panel */}
          <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3 min-w-0 flex-1 mr-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 break-words">
                      {message.name}
                    </h3>
                    <p className="text-sm text-gray-500 break-all">
                      {message.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowFullMessage(false)}
                  className="text-gray-400 hover:text-gray-500 flex-shrink-0"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="space-y-4">
                {/* Contact Information Section */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">
                    Contact Information
                  </h4>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2 min-w-0">
                      <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <a
                        href={`mailto:${message.email}`}
                        className="hover:text-blue-600 break-all"
                      >
                        {message.email}
                      </a>
                    </div>
                    {message.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <a
                          href={`tel:${message.phone}`}
                          className="hover:text-green-600"
                        >
                          {message.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submission Date Section */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">
                    Submitted On
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    {new Date(message.createdAt).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                {/* Full Message Section */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Full Message
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed break-words">
                      {message.message}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={() => setShowFullMessage(false)}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
