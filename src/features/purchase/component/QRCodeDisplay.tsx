import React from "react";
import { Download, Share2, Printer, Mail } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../shared/components/ui/Card";
import { Button } from "../../../shared/components/ui/Button";
import { Badge } from "../../../shared/components/ui/Badge";
import type { PurchasedGiftCard } from "../types/purchase.types";
import {
  formatCurrency,
  formatDate,
  downloadFile,
} from "../../../shared/utils/helpers";

interface QRCodeDisplayProps {
  purchase: PurchasedGiftCard;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ purchase }) => {
  /**
   * Downloads the QR code image to user's device
   */
  const handleDownload = () => {
    downloadFile(purchase.qrCodeImage, `gift-card-${purchase.qrCode}.png`);
  };
  /**
   * Shares QR code using native share API (mobile) or falls back to download
   */
  const handleShare = async () => {
    if (navigator.share) {
      try {
        // Convert base64 to blob
        const base64Response = await fetch(purchase.qrCodeImage);
        const blob = await base64Response.blob();
        const file = new File([blob], "gift-card.png", { type: "image/png" });

        await navigator.share({
          title: "My Gift Card",
          text: `Gift Card Balance: ${formatCurrency(purchase.currentBalance)}`,
          files: [file],
        });
      } catch (error) {
        console.log("Share cancelled or failed", error);
      }
    } else {
      handleDownload();
    }
  };
  /**
   * Opens a new window with printable gift card voucher
   * Creates a clean, printer-friendly HTML document
   */
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Print Gift Card</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              text-align: center; 
              padding: 40px; 
            }
            img { 
              width: 400px; 
              height: 400px; 
              margin: 20px auto;
            }
            .balance { 
              font-size: 36px; 
              font-weight: bold; 
              color: #10b981; 
              margin: 20px 0;
            }
            .info {
              margin: 10px 0;
              color: #374151;
            }
          </style>
        </head>
        <body>
          <h1>${purchase.giftCard.title}</h1>
          <img src="${purchase.qrCodeImage}" alt="QR Code" />
          <div class="balance">₹${purchase.currentBalance}</div>
          <div class="info"><strong>Customer:</strong> ${purchase.customerName}</div>
          <div class="info"><strong>Code:</strong> ${purchase.qrCode}</div>
          <div class="info"><strong>Expires:</strong> ${formatDate(purchase.expiresAt)}</div>
          <div class="info"><strong>Merchant:</strong> ${purchase.merchant.businessName}</div>
        </body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 500);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="text-center">
          <Badge variant="success" className="mb-2">
            Purchase Successful!
          </Badge>
          <CardTitle className="text-2xl">{purchase.giftCard.title}</CardTitle>
          <p className="text-gray-600 mt-2">{purchase.merchant.businessName}</p>
        </div>
      </CardHeader>

      <CardContent>
        <div className="text-center mb-6">
          <img
            src={purchase.qrCodeImage}
            alt="Gift Card QR Code"
            className="w-80 h-80 mx-auto rounded-lg border-2 border-gray-200"
          />
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg mb-6">
          <p className="text-sm text-gray-600 text-center mb-2">
            Current Balance
          </p>
          <p className="text-4xl font-bold text-green-600 text-center">
            {formatCurrency(purchase.currentBalance)}
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Customer Name:</span>
            <span className="font-medium">{purchase.customerName}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Email:</span>
            <span className="font-medium">{purchase.customerEmail}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">QR Code:</span>
            <span className="font-mono text-sm">{purchase.qrCode}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Expires:</span>
            <span className="font-medium">
              {formatDate(purchase.expiresAt)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Important:</strong> Save this QR code! You can use it
            multiple times at any {purchase.merchant.businessName} location
            until the balance reaches ₹0.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
