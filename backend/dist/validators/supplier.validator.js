"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSupplierSchema = exports.createSupplierSchema = void 0;
const zod_1 = require("zod");
exports.createSupplierSchema = zod_1.z.object({
    supplierName: zod_1.z.string().min(2),
    contactName: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional().or(zod_1.z.literal("")),
    mobile: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    gstNumber: zod_1.z.string().optional(),
});
exports.updateSupplierSchema = exports.createSupplierSchema.partial();
