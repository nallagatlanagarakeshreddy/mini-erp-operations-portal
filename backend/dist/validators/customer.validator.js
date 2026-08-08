"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCustomerSchema = exports.createCustomerSchema = void 0;
const zod_1 = require("zod");
exports.createCustomerSchema = zod_1.z.object({
    customerName: zod_1.z.string().min(2, "Customer Name must be at least 2 characters"),
    mobile: zod_1.z.string().min(10, "Mobile number must be at least 10 characters"),
    email: zod_1.z.string().email("Invalid email format").optional().or(zod_1.z.literal("")),
    businessName: zod_1.z.string().optional(),
    gstNumber: zod_1.z.string().optional(),
    customerType: zod_1.z.enum(["RETAIL", "WHOLESALE", "DISTRIBUTOR"]).optional(),
    address: zod_1.z.string().optional(),
    status: zod_1.z.enum(["LEAD", "ACTIVE", "INACTIVE"]).optional(),
    followUpDate: zod_1.z.string().optional().transform((str) => (str ? new Date(str) : undefined)),
    notes: zod_1.z.string().optional(),
});
exports.updateCustomerSchema = exports.createCustomerSchema.partial();
