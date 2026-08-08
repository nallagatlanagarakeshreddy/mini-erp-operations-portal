"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChallanSchema = void 0;
const zod_1 = require("zod");
const challanItemSchema = zod_1.z.object({
    productId: zod_1.z.string().uuid("Invalid product ID"),
    quantity: zod_1.z.number().int().positive("Quantity must be positive"),
});
exports.createChallanSchema = zod_1.z.object({
    customerId: zod_1.z.string().uuid("Invalid customer ID"),
    items: zod_1.z.array(challanItemSchema).min(1, "At least one item is required"),
});
