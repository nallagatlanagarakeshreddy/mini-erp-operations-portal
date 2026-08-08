import { z } from "zod";

export const createSupplierSchema = z.object({
  supplierName: z.string().min(2),
  contactName: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  mobile: z.string().optional(),
  address: z.string().optional(),
  gstNumber: z.string().optional(),
});

export const updateSupplierSchema = createSupplierSchema.partial();
