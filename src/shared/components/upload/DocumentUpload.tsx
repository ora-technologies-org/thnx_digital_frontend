// src/shared/components/upload/DocumentUpload.tsx - FIXED
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  X,
  FileText,
  CheckCircle,
  AlertCircle,
  Eye,
  Download,
} from "lucide-react";
import toast from "react-hot-toast";
import { FileRejection } from "react-dropzone";

const cn = (...classes: (string | undefined | false | null)[]) => {
  return classes.filter(Boolean).join(" ");
};

interface DocumentUploadProps {
  label: string;
  accept?: Record<string, string[]>;
  maxSize?: number;
  required?: boolean;
  error?: string;
  value?: File | null;
  onChange: (file: File | null) => void;
  helperText?: string;
  existingDocumentUrl?: string;
  existingDocumentName?: string;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  label,
  accept = {
    "application/pdf": [".pdf"],
    "image/*": [".png", ".jpg", ".jpeg"],
  },
  maxSize = 10 * 1024 * 1024,
  required = false,
  error,
  value,
  onChange,
  helperText,
  existingDocumentUrl,
  existingDocumentName,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      setIsDragActive(false);
      setUploadError(null);

      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        let errorMsg = "File upload failed";

        if (rejection.errors) {
          const error = rejection.errors[0];
          if (error.code === "file-too-large") {
            errorMsg = `File is too large. Maximum size is ${formatFileSize(maxSize)}`;
          } else if (error.code === "file-invalid-type") {
            errorMsg = "Invalid file type. Please upload PDF, PNG, or JPG";
          } else {
            errorMsg = error.message || "File upload failed";
          }
        }

        setUploadError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      // Handle accepted files
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        console.log("✅ File accepted:", file.name, formatFileSize(file.size));
        onChange(file);
        toast.success(`File "${file.name}" uploaded successfully`);
      }
    },
    [onChange, maxSize],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
    onDragEnter: () => {
      setIsDragActive(true);
      setUploadError(null);
    },
    onDragLeave: () => setIsDragActive(false),
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setUploadError(null);
    toast.success("File removed");
  };

  const handleViewExisting = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (existingDocumentUrl) {
      window.open(existingDocumentUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleDownloadExisting = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (existingDocumentUrl) {
      const link = document.createElement("a");
      link.href = existingDocumentUrl;
      link.download = existingDocumentName || "document";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const hasError = error || uploadError;
  const hasExistingDocument = existingDocumentUrl && !value;

  // Get dropzone props and separate event handlers from other props
  const rootProps = getRootProps();
  const { onClick, onKeyDown, onFocus, onBlur, ...otherRootProps } = rootProps;

  return (
    <div className="w-full">
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Existing Document Display (for edit mode) */}
      {hasExistingDocument && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-green-900 truncate">
                  Existing document uploaded
                </p>
                <p className="text-xs text-green-700 truncate">
                  {existingDocumentName || "Document"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <motion.button
                type="button"
                onClick={handleViewExisting}
                className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="View document"
              >
                <Eye className="w-4 h-4 text-green-600" />
              </motion.button>
              <motion.button
                type="button"
                onClick={handleDownloadExisting}
                className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Download document"
              >
                <Download className="w-4 h-4 text-green-600" />
              </motion.button>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">
            This document is already uploaded. Upload a new file only if you
            want to replace it.
          </p>
        </motion.div>
      )}

      {/* Upload Area */}
      <div
        {...otherRootProps}
        onClick={onClick}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer",
          isDragActive && !hasError && "border-blue-500 bg-blue-50",
          hasError && "border-red-500 bg-red-50/50",
          !isDragActive &&
            !hasError &&
            !value &&
            "border-gray-300 hover:border-blue-400 hover:bg-gray-50",
          value && !hasError && "border-green-500 bg-green-50",
        )}
      >
        <input {...getInputProps()} />

        <AnimatePresence mode="wait">
          {!value ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center"
            >
              <motion.div
                animate={isDragActive ? { scale: [1, 1.2, 1] } : {}}
                transition={{
                  duration: 0.5,
                  repeat: isDragActive ? Infinity : 0,
                }}
              >
                <Upload
                  className={cn(
                    "mx-auto h-12 w-12 mb-3",
                    isDragActive
                      ? "text-blue-500"
                      : hasError
                        ? "text-red-400"
                        : "text-gray-400",
                  )}
                />
              </motion.div>

              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold text-blue-600">
                  Click to upload
                </span>{" "}
                or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                PDF, PNG, JPG up to {formatFileSize(maxSize)}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="filled"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {value.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(value.size)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <motion.button
                  type="button"
                  onClick={handleRemove}
                  className="p-1 hover:bg-red-100 rounded-full transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5 text-red-600" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Helper Text or Error */}
      <AnimatePresence mode="wait">
        {hasError ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="mt-2 flex items-start gap-1"
          >
            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-600">{error || uploadError}</p>
          </motion.div>
        ) : helperText ? (
          <motion.div
            key="helper"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="mt-2"
          >
            <p className="text-sm text-gray-500">{helperText}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
