// import React, { useEffect } from 'react';
// import { X } from 'lucide-react';
// import { cn } from '../../../shared/utils/helpers';

// interface ModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   title?: string;
//   children: React.ReactNode;
//   size?: 'sm' | 'md' | 'lg' | 'xl';
// }

// export const Modal: React.FC<ModalProps> = ({
//   isOpen,
//   onClose,
//   title,
//   children,
//   size = 'md',
// }) => {
//   useEffect(() => {
//     if (isOpen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }

//     return () => {
//       document.body.style.overflow = 'unset';
//     };
//   }, [isOpen]);

//   if (!isOpen) return null;

//   const sizes = {
//     sm: 'max-w-md',
//     md: 'max-w-lg',
//     lg: 'max-w-2xl',
//     xl: 'max-w-4xl',
//   };

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto">
//       {/* Backdrop */}
//       <div
//         className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
//         onClick={onClose}
//       />

//       {/* Modal */}
//       <div className="flex min-h-full items-center justify-center p-4">
//         <div
//           className={cn(
//             'relative bg-white rounded-lg shadow-xl w-full',
//             sizes[size]
//           )}
//         >
//           {/* Header */}
//           {title && (
//             <div className="flex items-center justify-between p-6 border-b border-gray-200">
//               <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
//               <button
//                 onClick={onClose}
//                 className="text-gray-400 hover:text-gray-600 transition-colors"
//               >
//                 <X size={24} />
//               </button>
//             </div>
//           )}

//           {/* Content */}
//           <div className="p-6">{children}</div>
//         </div>
//       </div>
//     </div>
//   );
// };
import React, { useEffect } from "react";
import { X, CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  showActions?: boolean;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: "default" | "success" | "error" | "warning" | "info";
}

const cn = (...classes: (string | undefined | null | false)[]): string =>
  classes.filter(Boolean).join(" ");

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showActions = false,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "default",
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  const iconConfig = {
    success: {
      icon: CheckCircle,
      gradient: "from-emerald-100 to-teal-200",
      iconColor: "text-emerald-600",
    },
    error: {
      icon: XCircle,
      gradient: "from-red-100 to-rose-200",
      iconColor: "text-red-600",
    },
    warning: {
      icon: AlertCircle,
      gradient: "from-amber-100 to-orange-200",
      iconColor: "text-amber-600",
    },
    info: {
      icon: Info,
      gradient: "from-blue-100 to-cyan-200",
      iconColor: "text-blue-600",
    },
  };

  const showIcon = type !== "default";
  const IconComponent = showIcon ? iconConfig[type].icon : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
              "relative w-full bg-white rounded-2xl shadow-2xl",
              "max-h-[90vh] flex flex-col",
              sizes[size],
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              {title && (
                <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
                  {title}
                </h2>
              )}
              <button
                onClick={onClose}
                className="ml-auto p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {showIcon && IconComponent && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.1,
                  }}
                  className={cn(
                    "w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center",
                    "bg-gradient-to-br shadow-lg",
                    iconConfig[type].gradient,
                  )}
                >
                  <IconComponent
                    className={cn("w-10 h-10", iconConfig[type].iconColor)}
                  />
                </motion.div>
              )}
              {children}
            </div>

            {/* Footer Actions (Optional) */}
            {showActions && (
              <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  {cancelText}
                </Button>
                <Button
                  variant="gradient"
                  onClick={() => {
                    onConfirm?.();
                    onClose();
                  }}
                  className="flex-1"
                >
                  {confirmText}
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
