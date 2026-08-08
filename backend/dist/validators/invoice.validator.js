"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInvoiceStatusSchema = void 0;
const zod_1 = require("zod");
exports.updateInvoiceStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(["UNPAID", "PARTIAL", "PAID"]),
    amountPaid: zod_1.z.number().min(0).optional(),
});
