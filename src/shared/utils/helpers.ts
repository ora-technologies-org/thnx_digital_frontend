import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: string | number): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(num);
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function downloadFile(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "VERIFIED":
      return "bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-800 border-emerald-200";
    case "PENDING_VERIFICATION":
      return "bg-gradient-to-r from-amber-100 to-amber-50 text-amber-800 border-amber-200";
    case "REJECTED":
      return "bg-gradient-to-r from-rose-100 to-rose-50 text-rose-800 border-rose-200";
    case "INCOMPLETE":
      return "bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 border-gray-200";
    default:
      return "bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 border-gray-200";
  }
};
/**
 * Returns Tailwind CSS classes for order status badge styling
 * @param status - The order status string
 * @returns String of Tailwind CSS classes
 */
export const getOrderStatusColor = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "bg-green-50 text-green-700 border border-green-200";
    case "USED":
      return "bg-blue-50 text-blue-700 border border-blue-200";
    case "EXPIRED":
      return "bg-rose-50 text-rose-700 border border-rose-200";
    default:
      return "bg-gray-50 text-gray-700 border border-gray-200";
  }
};
export const getStatusIcon = (status: string): LucideIcon | null => {
  switch (status) {
    case "VERIFIED":
      return CheckCircle;
    case "PENDING_VERIFICATION":
      return Clock;
    case "REJECTED":
      return XCircle;
    case "INCOMPLETE":
      return AlertTriangle;
    default:
      return null;
  }
};
