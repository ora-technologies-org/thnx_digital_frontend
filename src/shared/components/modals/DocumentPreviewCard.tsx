import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileText, X, Maximize2, Minimize2 } from "lucide-react";

// Utility function to convert URLs
const convertToFullUrl = (url: string): string => {
  if (!url) return url;

  if (url.startsWith("http://") || url.startsWith("https://")) {
    if (url.includes("localhost")) {
      const baseUrl = import.meta.env.VITE_DOMAIN;
      try {
        const urlObj = new URL(url);
        return `${baseUrl}${urlObj.pathname}${urlObj.search}${urlObj.hash}`;
      } catch {
        return url;
      }
    }
    return url;
  }

  const baseUrl = import.meta.env.VITE_DOMAIN;
  const cleanPath = url.startsWith("/") ? url : `${url}`;
  return `${baseUrl}${cleanPath}`;
};

const DocumentPreviewCard: React.FC<{
  label: string;
  url?: string | null;
}> = ({ label, url }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Convert URL to full URL with proper domain
  const fullUrl = url ? convertToFullUrl(url) : "";

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "auto";
    }
    setIsFullscreen(!isFullscreen);
  };

  // Close modal handler
  const handleCloseModal = () => {
    document.documentElement.style.overflow = "auto";
    setIsPreviewOpen(false);
    setIsFullscreen(false);
  };

  if (!url) {
    return (
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-cyan-50/50 to-teal-100/30 rounded-xl border border-cyan-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-lg flex items-center justify-center">
            <FileText className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{label}</p>
            <p className="text-xs text-gray-500">PDF Document</p>
          </div>
        </div>
        <span className="px-3 py-1.5 bg-gray-100 text-gray-500 rounded-lg text-sm font-medium">
          Not Uploaded
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-cyan-50/50 to-teal-100/30 rounded-xl border border-cyan-100 hover:border-cyan-200 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-lg flex items-center justify-center">
            <FileText className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{label}</p>
            <p className="text-xs text-gray-500">PDF Document</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsPreviewOpen(true)}
          className="px-3 py-1.5 bg-white hover:bg-gray-50 text-cyan-600 rounded-lg text-sm font-semibold border border-cyan-200 transition-colors flex items-center gap-1.5"
        >
          View
          <FileText className="w-3 h-3" />
        </motion.button>
      </div>

      {/* Document Preview Modal */}
      {isPreviewOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm ${
            isFullscreen ? "p-0" : ""
          }`}
          onClick={handleCloseModal}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className={`relative bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col ${
              isFullscreen
                ? "w-full h-full rounded-none"
                : "w-full max-w-5xl h-[90vh]"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-cyan-50 to-teal-50 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {label}
                  </h3>
                  <p className="text-xs text-gray-500">PDF Document</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleFullscreen}
                  className="p-2 bg-white hover:bg-gray-100 rounded-lg transition-all border border-gray-200"
                  title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-5 h-5 text-gray-600" />
                  ) : (
                    <Maximize2 className="w-5 h-5 text-gray-600" />
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCloseModal}
                  className="p-2 bg-white hover:bg-gray-100 rounded-lg transition-all border border-gray-200"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </motion.button>
              </div>
            </div>

            {/* Document Viewer - Takes all remaining space */}
            <div className="flex-grow bg-gray-50 overflow-hidden">
              <iframe
                src={fullUrl}
                className="w-full h-full border-0"
                title={label}
                style={{ height: "100%" }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default DocumentPreviewCard;
