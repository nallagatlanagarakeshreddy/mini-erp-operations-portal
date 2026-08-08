import { z } from "zod";

export const createCustomerSchema = z.object({
  customerName: z.string().min(2, "Customer Name must be at least 2 characters"),
  mobile: z.string().min(10, "Mobile number must be at least 10 characters"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  businessName: z.string().optional(),
  gstNumber: z.string().optional(),
  customerType: z.enum(["RETAIL", "WHOLESALE", "DISTRIBUTOR"]).optional(),
  address: z.string().optional(),
  status: z.enum(["LEAD", "ACTIVE", "INACTIVE"]).optional(),
  followUpDate: z.string().optional().transform((str) => (str ? new Date(str) : undefined)),
  notes: z.string().optional(),
});

export const updateCustomerSchema = createCustomerSchema.partial();
