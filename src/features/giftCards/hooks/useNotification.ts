// src/shared/hooks/useNotificationModal.ts
import { useState, useCallback } from "react";

interface NotificationData {
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  duration?: number;
}

export const useNotificationModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationData, setNotificationData] = useState<NotificationData>({
    type: "info",
    title: "",
    message: "",
    duration: 3000,
  });

  const open = useCallback((data: NotificationData) => {
    setNotificationData(data);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const show = useCallback((data: NotificationData) => {
    setNotificationData(data);
    setIsOpen(true);
  }, []);

  return {
    isOpen,
    type: notificationData.type,
    title: notificationData.title,
    message: notificationData.message,
    duration: notificationData.duration,
    open,
    close,
    show,
  };
};
