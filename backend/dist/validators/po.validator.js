"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPoSchema = void 0;
const zod_1 = require("zod");
exports.createPoSchema = zod_1.z.object({
    supplierId: zod_1.z.string().uuid(),
    items: zod_1.z.array(zod_1.z.object({
        productId: zod_1.z.string().uuid(),
        quantity: zod_1.z.number().int().positive(),
    })).min(1, "At least one item is required"),
});
