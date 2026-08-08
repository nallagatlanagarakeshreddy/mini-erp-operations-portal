import { z } from "zod";

export const createProductSchema = z.object({
  productName: z.string().min(2, "Product Name must be at least 2 characters"),
  sku: z.string().min(2, "SKU must be at least 2 characters"),
  category: z.string().min(2, "Category is required"),
  unitPrice: z.number().positive("Unit Price must be positive"),
  minimumStock: z.number().int().nonnegative().optional(),
  warehouseLocation: z.string().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const stockMovementSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  quantityChanged: z.number().int().positive("Quantity must be a positive integer"),
  movementType: z.enum(["IN", "OUT"]),
  reason: z.string().optional(),
});
