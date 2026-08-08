"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stockMovementSchema = exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
exports.createProductSchema = zod_1.z.object({
    productName: zod_1.z.string().min(2, "Product Name must be at least 2 characters"),
    sku: zod_1.z.string().min(2, "SKU must be at least 2 characters"),
    category: zod_1.z.string().min(2, "Category is required"),
    unitPrice: zod_1.z.number().positive("Unit Price must be positive"),
    minimumStock: zod_1.z.number().int().nonnegative().optional(),
    warehouseLocation: zod_1.z.string().optional(),
});
exports.updateProductSchema = exports.createProductSchema.partial();
exports.stockMovementSchema = zod_1.z.object({
    productId: zod_1.z.string().uuid("Invalid product ID"),
    quantityChanged: zod_1.z.number().int().positive("Quantity must be a positive integer"),
    movementType: zod_1.z.enum(["IN", "OUT"]),
    reason: zod_1.z.string().optional(),
});
