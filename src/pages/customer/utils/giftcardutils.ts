export const getQRCodeFromURL = () => {
  // Method 1: From URL path (e.g., /balance/THNX-60C48F8E-2026-UIWIG)
  const pathParts = window.location.pathname
    .split("/")
    .filter((part) => part.length > 0);
  let qrCode = null;

  // Find the part after 'balance' or 'redemption'
  const balanceIndex = pathParts.indexOf("balance");
  const redemptionIndex = pathParts.indexOf("redemption");

  if (balanceIndex !== -1 && balanceIndex < pathParts.length - 1) {
    qrCode = pathParts[balanceIndex + 1];
  } else if (redemptionIndex !== -1 && redemptionIndex < pathParts.length - 1) {
    qrCode = pathParts[redemptionIndex + 1];
  } else if (pathParts.length > 0) {
    // Fallback: take the last part of the URL
    qrCode = pathParts[pathParts.length - 1];
  }

  // Method 2: From URL query parameter (e.g., ?qrCode=THNX-60C48F8E-2026-UIWIG)
  if (!qrCode || qrCode === "balance" || qrCode === "redemption") {
    const urlParams = new URLSearchParams(window.location.search);
    qrCode =
      urlParams.get("qrCode") || urlParams.get("id") || urlParams.get("code");
  }

  // Method 3: From URL hash (e.g., #THNX-60C48F8E-2026-UIWIG)
  if (!qrCode || qrCode === "balance" || qrCode === "redemption") {
    qrCode = window.location.hash.substring(1);
  }

  console.log("Extracted QR Code from URL:", qrCode);
  console.log("Full URL:", window.location.href);
  console.log("Path parts:", pathParts);

  return qrCode;
};

/**
 * Format date to readable string
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Format currency amount
 * @param {string|number} amount - Amount to format
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount) => {
  return `Rs ${parseFloat(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
