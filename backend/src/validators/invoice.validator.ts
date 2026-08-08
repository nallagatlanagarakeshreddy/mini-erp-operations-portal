import { z } from "zod";

export const updateInvoiceStatusSchema = z.object({
  status: z.enum(["UNPAID", "PARTIAL", "PAID"]),
  amountPaid: z.number().min(0).optional(),
});
