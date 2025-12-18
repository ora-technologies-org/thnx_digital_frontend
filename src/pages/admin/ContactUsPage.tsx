import {
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  User,
  Loader2,
  AlertCircle,
} from "lucide-react";
import AdminLayout from "@/shared/components/layout/AdminLayout";
import { useContactMessages } from "@/features/admin/hooks/useAdmin";
import { ContactMessage } from "@/features/admin/services/contactusService";

export default function ContactUsPage() {
  // Fetch contact messages using custom hook
  const { data: messages = [], isLoading, error } = useContactMessages();

  // Loading state - show spinner while fetching messages
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600"></p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Error state - display error message if fetch fails
  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
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
          {/* Header Section - Responsive text sizing and spacing */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Contact Messages
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Manage and respond to user inquiries
            </p>
            {/* Message count badge */}
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

          {/* Messages Grid - Empty state or message cards */}
          {messages.length === 0 ? (
            /* Empty state when no messages exist */
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
            /* Responsive grid: 1 column on mobile, 2 columns on large screens */
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

// Contact Card Component - Displays individual message details
interface ContactCardProps {
  message: ContactMessage;
}

function ContactCard({ message }: ContactCardProps) {
  // Returns appropriate color classes based on message status
  const getStatusColor = (status?: string) => {
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
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-4 sm:p-6 border border-gray-200">
      {/* Header - User info and status badge. Stacks vertically on mobile */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-3">
        <div className="flex items-center gap-3">
          {/* Avatar with gradient background */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          {/* User name and timestamp - truncate prevents overflow */}
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
        {/* Status badge */}
        {message.status && (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(message.status)}`}
          >
            {message.status}
          </span>
        )}
      </div>

      {/* Contact Information - Email and phone with clickable links */}
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

      {/* Message Content - break-words prevents long text overflow */}
      <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
        <div className="flex items-start gap-2 mb-2">
          <MessageSquare className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
          <p className="text-xs sm:text-sm font-medium text-gray-700">
            Message
          </p>
        </div>
        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed break-words">
          {message.message}
        </p>
      </div>

      {/* Action Button - Opens default email client */}
      <div className="mt-4">
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition-colors text-sm font-medium active:bg-blue-800"
          onClick={() => (window.location.href = `mailto:${message.email}`)}
        >
          Reply via Email
        </button>
      </div>
    </div>
  );
}
