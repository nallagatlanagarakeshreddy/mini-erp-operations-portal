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
exports.deleteCustomer = exports.updateCustomer = exports.createCustomer = exports.getCustomer = exports.getCustomers = void 0;
const customerService = __importStar(require("../services/customer.service"));
const customer_validator_1 = require("../validators/customer.validator");
const getCustomers = async (req, res, next) => {
    try {
        const query = req.query;
        const result = await customerService.getCustomers(query);
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
exports.getCustomers = getCustomers;
const getCustomer = async (req, res, next) => {
    try {
        const customer = await customerService.getCustomerById(req.params.id);
        res.status(200).json({
            success: true,
            data: customer,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getCustomer = getCustomer;
const createCustomer = async (req, res, next) => {
    try {
        const validatedData = customer_validator_1.createCustomerSchema.parse(req.body);
        const customer = await customerService.createCustomer(validatedData);
        res.status(201).json({
            success: true,
            data: customer,
            message: "Customer created successfully",
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
exports.createCustomer = createCustomer;
const updateCustomer = async (req, res, next) => {
    try {
        const validatedData = customer_validator_1.updateCustomerSchema.parse(req.body);
        const customer = await customerService.updateCustomer(req.params.id, validatedData);
        res.status(200).json({
            success: true,
            data: customer,
            message: "Customer updated successfully",
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
exports.updateCustomer = updateCustomer;
const deleteCustomer = async (req, res, next) => {
    try {
        await customerService.deleteCustomer(req.params.id);
        res.status(200).json({
            success: true,
            message: "Customer deleted successfully",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteCustomer = deleteCustomer;
