import { z } from "zod";

export const createPoSchema = z.object({
  supplierId: z.string().uuid(),
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.number().int().positive(),
    })
  ).min(1, "At least one item is required"),
});
