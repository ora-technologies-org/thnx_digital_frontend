import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../../../shared/components/ui/Input";
import { Button } from "../../../shared/components/ui/Button";
import type { GiftCard } from "../types/giftCard.types";

const giftCardSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  price: z
    .number()
    .positive("Price must be positive")
    .max(999999, "Price is too high"),
  expiryDate: z.string().min(1, "Expiry date is required"),
});

type GiftCardFormData = z.infer<typeof giftCardSchema>;

interface GiftCardFormProps {
  initialData?: GiftCard;
  onSubmit: (data: GiftCardFormData) => void;
  isLoading?: boolean;
  submitLabel?: string;
  buttonVariant?:
    | "primary"
    | "secondary"
    | "danger"
    | "outline"
    | "ghost"
    | "gradient";
}

export const GiftCardForm: React.FC<GiftCardFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
  submitLabel = "Create Gift Card",
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<GiftCardFormData>({
    resolver: zodResolver(giftCardSchema),
  });

  useEffect(() => {
    if (initialData) {
      setValue("title", initialData.title);
      setValue("description", initialData.description || "");
      setValue("price", parseFloat(initialData.price));
      setValue("expiryDate", initialData.expiryDate.split("T")[0]);
    }
  }, [initialData, setValue]);

  // Set minimum date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Title"
        placeholder="e.g., Holiday Special Gift Card"
        error={errors.title?.message}
        {...register("title")}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
          rows={4}
          placeholder="Describe your gift card..."
          {...register("description")}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Price (₹)"
          type="number"
          step="0.01"
          placeholder="100.00"
          error={errors.price?.message}
          {...register("price", { valueAsNumber: true })}
        />

        <Input
          label="Expiry Date"
          type="date"
          min={minDate}
          error={errors.expiryDate?.message}
          {...register("expiryDate")}
        />
      </div>

      <Button
        type="submit"
        variant="gradient"
        className="w-full"
        isLoading={isLoading}
      >
        {submitLabel}
      </Button>
    </form>
  );
};
