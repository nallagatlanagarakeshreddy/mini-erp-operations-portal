"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.receivePo = exports.getPoById = exports.getPos = exports.createPo = void 0;
const db_1 = __importDefault(require("../config/db"));
const generatePoNumber = async () => {
    const count = await db_1.default.purchaseOrder.count();
    return `PO-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`;
};
const createPo = async (data, userId) => {
    const poNumber = await generatePoNumber();
    // Calculate totals and fetch product info
    const productIds = data.items.map((i) => i.productId);
    const products = await db_1.default.product.findMany({ where: { id: { in: productIds } } });
    let totalQuantity = 0;
    let totalAmount = 0;
    const poItemsData = data.items.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product)
            throw { status: 400, message: `Product ${item.productId} not found` };
        const subtotal = item.quantity * product.unitPrice;
        totalQuantity += item.quantity;
        totalAmount += subtotal;
        return {
            productId: product.id,
            productNameSnapshot: product.productName,
            skuSnapshot: product.sku,
            unitCostSnapshot: product.unitPrice,
            quantity: item.quantity,
            subtotal,
        };
    });
    return await db_1.default.purchaseOrder.create({
        data: {
            poNumber,
            supplierId: data.supplierId,
            totalQuantity,
            totalAmount,
            createdBy: userId,
            items: { create: poItemsData },
        },
        include: { items: true },
    });
};
exports.createPo = createPo;
const getPos = async () => {
    return await db_1.default.purchaseOrder.findMany({
        include: { supplier: true },
        orderBy: { createdAt: "desc" },
    });
};
exports.getPos = getPos;
const getPoById = async (id) => {
    const po = await db_1.default.purchaseOrder.findUnique({
        where: { id },
        include: { supplier: true, items: true },
    });
    if (!po)
        throw { status: 404, message: "Purchase Order not found" };
    return po;
};
exports.getPoById = getPoById;
const receivePo = async (id, userId) => {
    return await db_1.default.$transaction(async (tx) => {
        const po = await tx.purchaseOrder.findUnique({
            where: { id },
            include: { items: true },
        });
        if (!po)
            throw { status: 404, message: "Purchase Order not found" };
        if (po.status !== "DRAFT" && po.status !== "SENT") {
            throw { status: 400, message: "Only DRAFT or SENT Purchase Orders can be received" };
        }
        // Process Stock Movement IN
        for (const item of po.items) {
            // 1. Update product stock
            await tx.product.update({
                where: { id: item.productId },
                data: { currentStock: { increment: item.quantity } },
            });
            // 2. Create StockMovement Ledger Entry
            await tx.stockMovement.create({
                data: {
                    productId: item.productId,
                    quantityChanged: item.quantity,
                    movementType: "IN",
                    reason: `Received PO ${po.poNumber}`,
                    createdBy: userId,
                },
            });
        }
        // Mark PO as received
        return await tx.purchaseOrder.update({
            where: { id },
            data: { status: "RECEIVED" },
            include: { supplier: true, items: true },
        });
    });
};
exports.receivePo = receivePo;
