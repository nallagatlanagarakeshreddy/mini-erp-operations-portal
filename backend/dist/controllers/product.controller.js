"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStockMovements = exports.getAllStockMovements = exports.createStockMovement = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProduct = exports.getProducts = void 0;
const productService = __importStar(require("../services/product.service"));
const product_validator_1 = require("../validators/product.validator");
const getProducts = async (req, res, next) => {
    try {
        const query = req.query;
        const result = await productService.getProducts(query);
        res.status(200).json({
            success: true,
            data: result.data,
            meta: result.meta,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getProducts = getProducts;
const getProduct = async (req, res, next) => {
    try {
        const product = await productService.getProductById(req.params.id);
        res.status(200).json({
            success: true,
            data: product,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getProduct = getProduct;
const createProduct = async (req, res, next) => {
    try {
        const validatedData = product_validator_1.createProductSchema.parse(req.body);
        const product = await productService.createProduct(validatedData);
        res.status(201).json({
            success: true,
            data: product,
            message: "Product created successfully",
        });
    }
    catch (error) {
        if (error.name === "ZodError") {
            res.status(422).json({
                success: false,
                message: "Validation Error",
                error: error.errors,
            });
            return;
        }
        next(error);
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res, next) => {
    try {
        const validatedData = product_validator_1.updateProductSchema.parse(req.body);
        const product = await productService.updateProduct(req.params.id, validatedData);
        res.status(200).json({
            success: true,
            data: product,
            message: "Product updated successfully",
        });
    }
    catch (error) {
        if (error.name === "ZodError") {
            res.status(422).json({
                success: false,
                message: "Validation Error",
                error: error.errors,
            });
            return;
        }
        next(error);
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res, next) => {
    try {
        await productService.deleteProduct(req.params.id);
        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteProduct = deleteProduct;
const createStockMovement = async (req, res, next) => {
    try {
        const validatedData = product_validator_1.stockMovementSchema.parse(req.body);
        const movement = await productService.createStockMovement(validatedData, req.user.userId);
        res.status(201).json({
            success: true,
            data: movement,
            message: "Stock movement recorded successfully",
        });
    }
    catch (error) {
        if (error.name === "ZodError") {
            res.status(422).json({
                success: false,
                message: "Validation Error",
                error: error.errors,
            });
            return;
        }
        next(error);
    }
};
exports.createStockMovement = createStockMovement;
const getAllStockMovements = async (req, res, next) => {
    try {
        const movements = await productService.getAllStockMovements();
        res.status(200).json({
            success: true,
            data: movements,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllStockMovements = getAllStockMovements;
const getStockMovements = async (req, res, next) => {
    try {
        const movements = await productService.getStockMovements(req.params.id);
        res.status(200).json({
            success: true,
            data: movements,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getStockMovements = getStockMovements;
