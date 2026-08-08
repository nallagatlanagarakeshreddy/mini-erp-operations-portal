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
exports.updateSupplier = exports.getSupplierById = exports.getSuppliers = exports.createSupplier = void 0;
const supplierService = __importStar(require("../services/supplier.service"));
const supplier_validator_1 = require("../validators/supplier.validator");
const createSupplier = async (req, res, next) => {
    try {
        const validatedData = supplier_validator_1.createSupplierSchema.parse(req.body);
        const supplier = await supplierService.createSupplier(validatedData);
        res.status(201).json({ success: true, data: supplier });
    }
    catch (error) {
        if (error.name === "ZodError") {
            res.status(422).json({ success: false, message: "Validation Error", error: error.errors });
            return;
        }
        next(error);
    }
};
exports.createSupplier = createSupplier;
const getSuppliers = async (req, res, next) => {
    try {
        const search = req.query.search;
        const suppliers = await supplierService.getSuppliers(search);
        res.status(200).json({ success: true, data: suppliers });
    }
    catch (error) {
        next(error);
    }
};
exports.getSuppliers = getSuppliers;
const getSupplierById = async (req, res, next) => {
    try {
        const supplier = await supplierService.getSupplierById(req.params.id);
        res.status(200).json({ success: true, data: supplier });
    }
    catch (error) {
        next(error);
    }
};
exports.getSupplierById = getSupplierById;
const updateSupplier = async (req, res, next) => {
    try {
        const validatedData = supplier_validator_1.updateSupplierSchema.parse(req.body);
        const supplier = await supplierService.updateSupplier(req.params.id, validatedData);
        res.status(200).json({ success: true, data: supplier });
    }
    catch (error) {
        if (error.name === "ZodError") {
            res.status(422).json({ success: false, message: "Validation Error", error: error.errors });
            return;
        }
        next(error);
    }
};
exports.updateSupplier = updateSupplier;
