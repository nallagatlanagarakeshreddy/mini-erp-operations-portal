"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStockMovements = exports.getAllStockMovements = exports.createStockMovement = exports.deleteProduct = exports.getProductById = exports.getProducts = exports.updateProduct = exports.createProduct = void 0;
const db_1 = __importDefault(require("../config/db"));
const createProduct = async (data) => {
    const existing = await db_1.default.product.findUnique({ where: { sku: data.sku } });
    if (existing) {
        throw { status: 409, message: "Product with this SKU already exists" };
    }
    return await db_1.default.product.create({
        data,
    });
};
exports.createProduct = createProduct;
const updateProduct = async (id, data) => {
    const existing = await db_1.default.product.findUnique({ where: { id } });
    if (!existing) {
        throw { status: 404, message: "Product not found" };
    }
    if (data.sku && data.sku !== existing.sku) {
        const skuExists = await db_1.default.product.findUnique({ where: { sku: data.sku } });
        if (skuExists) {
            throw { status: 409, message: "Product with this SKU already exists" };
        }
    }
    return await db_1.default.product.update({
        where: { id },
        data,
    });
};
exports.updateProduct = updateProduct;
const getProducts = async (query) => {
    const page = parseInt(query.page || "1");
    const limit = parseInt(query.limit || "10");
    const skip = (page - 1) * limit;
    const where = {};
    if (query.search) {
        where.OR = [
            { productName: { contains: query.search, mode: "insensitive" } },
            { sku: { contains: query.search, mode: "insensitive" } },
        ];
    }
    if (query.category) {
        where.category = query.category;
    }
    const [data, total] = await Promise.all([
        db_1.default.product.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
        }),
        db_1.default.product.count({ where }),
    ]);
    return {
        data,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};
exports.getProducts = getProducts;
const getProductById = async (id) => {
    const product = await db_1.default.product.findUnique({
        where: { id },
    });
    if (!product) {
        throw { status: 404, message: "Product not found" };
    }
    return product;
};
exports.getProductById = getProductById;
const deleteProduct = async (id) => {
    const existing = await db_1.default.product.findUnique({ where: { id } });
    if (!existing) {
        throw { status: 404, message: "Product not found" };
    }
    return await db_1.default.product.delete({
        where: { id },
    });
};
exports.deleteProduct = deleteProduct;
const createStockMovement = async (data, userId) => {
    return await db_1.default.$transaction(async (tx) => {
        const product = await tx.product.findUnique({ where: { id: data.productId } });
        if (!product) {
            throw { status: 404, message: "Product not found" };
        }
        if (data.movementType === "OUT" && product.currentStock < data.quantityChanged) {
            throw { status: 400, message: "Insufficient stock", error: "INSUFFICIENT_STOCK" };
        }
        const newStock = data.movementType === "IN"
            ? product.currentStock + data.quantityChanged
            : product.currentStock - data.quantityChanged;
        const movement = await tx.stockMovement.create({
            data: {
                productId: data.productId,
                quantityChanged: data.quantityChanged,
                movementType: data.movementType,
                reason: data.reason,
                createdBy: userId,
            },
        });
        await tx.product.update({
            where: { id: data.productId },
            data: { currentStock: newStock },
        });
        return movement;
    });
};
exports.createStockMovement = createStockMovement;
const getAllStockMovements = async () => {
    return await db_1.default.stockMovement.findMany({
        include: { product: true },
        orderBy: { createdAt: "desc" },
    });
};
exports.getAllStockMovements = getAllStockMovements;
const getStockMovements = async (productId) => {
    return await db_1.default.stockMovement.findMany({
        where: { productId },
        orderBy: { createdAt: "desc" },
        take: 50,
    });
};
exports.getStockMovements = getStockMovements;
