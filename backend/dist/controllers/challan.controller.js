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
exports.cancelChallan = exports.confirmChallan = exports.createChallan = exports.getChallan = exports.getChallans = void 0;
const challanService = __importStar(require("../services/challan.service"));
const challan_validator_1 = require("../validators/challan.validator");
const getChallans = async (req, res, next) => {
    try {
        const query = req.query;
        const result = await challanService.getChallans(query);
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
exports.getChallans = getChallans;
const getChallan = async (req, res, next) => {
    try {
        const challan = await challanService.getChallanById(req.params.id);
        res.status(200).json({
            success: true,
            data: challan,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getChallan = getChallan;
const createChallan = async (req, res, next) => {
    try {
        const validatedData = challan_validator_1.createChallanSchema.parse(req.body);
        const challan = await challanService.createChallan(validatedData, req.user.userId);
        res.status(201).json({
            success: true,
            data: challan,
            message: "Draft Challan created successfully",
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
exports.createChallan = createChallan;
const confirmChallan = async (req, res, next) => {
    try {
        const challan = await challanService.confirmChallan(req.params.id, req.user.userId);
        res.status(200).json({
            success: true,
            data: challan,
            message: "Challan confirmed and stock updated",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.confirmChallan = confirmChallan;
const cancelChallan = async (req, res, next) => {
    try {
        const challan = await challanService.cancelChallan(req.params.id);
        res.status(200).json({
            success: true,
            data: challan,
            message: "Challan cancelled",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.cancelChallan = cancelChallan;
