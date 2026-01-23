import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../../../shared/components/ui/Input";
import { Button } from "../../../shared/components/ui/Button";

const purchaseSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Invalid email address"),
  customerPhone: z.string().min(10, "Phone must be at least 10 digits"),
  paymentMethod: z.string().optional(),
  transactionId: z.string().optional(),
});

type PurchaseFormData = z.infer<typeof purchaseSchema>;

interface PurchaseFormProps {
  onSubmit: (data: PurchaseFormData) => void;
  isLoading?: boolean;
  giftCardPrice?: string;
}

export const PurchaseForm: React.FC<PurchaseFormProps> = ({
  onSubmit,
  isLoading = false,
  giftCardPrice,
}) => {
  // Generate the default transaction ID safely
  const [defaultTransactionId] = React.useState(() => "TXN" + Date.now());

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PurchaseFormData>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      paymentMethod: "UPI",
      transactionId: defaultTransactionId,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <p className="text-sm text-gray-600">Total Amount</p>
        <p className="text-3xl font-bold text-blue-600">₹{giftCardPrice}</p>
      </div>

      <Input
        label="Full Name"
        placeholder="John Doe"
        error={errors.customerName?.message}
        {...register("customerName")}
      />

      <Input
        label="Email"
        type="email"
        placeholder="your@email.com"
        error={errors.customerEmail?.message}
        {...register("customerEmail")}
      />

      <Input
        label="Phone Number"
        type="tel"
        placeholder="+919876543210"
        error={errors.customerPhone?.message}
        {...register("customerPhone")}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Payment Method"
          placeholder="UPI, Card, etc."
          error={errors.paymentMethod?.message}
          {...register("paymentMethod")}
        />

        <Input
          label="Transaction ID (Optional)"
          placeholder="TXN123456"
          error={errors.transactionId?.message}
          {...register("transactionId")}
        />
      </div>

      <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
        Purchase Gift Card
      </Button>

      <p className="text-xs text-gray-500 text-center">
        No account required. You'll receive your QR code immediately.
      </p>
    </form>
  );
};
