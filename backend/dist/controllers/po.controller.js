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
exports.receivePo = exports.getPoById = exports.getPos = exports.createPo = void 0;
const poService = __importStar(require("../services/po.service"));
const po_validator_1 = require("../validators/po.validator");
const createPo = async (req, res, next) => {
    try {
        const validatedData = po_validator_1.createPoSchema.parse(req.body);
        const userId = req.user.userId;
        const po = await poService.createPo(validatedData, userId);
        res.status(201).json({ success: true, data: po });
    }
    catch (error) {
        if (error.name === "ZodError") {
            res.status(422).json({ success: false, message: "Validation Error", error: error.errors });
            return;
        }
        next(error);
    }
};
exports.createPo = createPo;
const getPos = async (req, res, next) => {
    try {
        const pos = await poService.getPos();
        res.status(200).json({ success: true, data: pos });
    }
    catch (error) {
        next(error);
    }
};
exports.getPos = getPos;
const getPoById = async (req, res, next) => {
    try {
        const po = await poService.getPoById(req.params.id);
        res.status(200).json({ success: true, data: po });
    }
    catch (error) {
        next(error);
    }
};
exports.getPoById = getPoById;
const receivePo = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const po = await poService.receivePo(req.params.id, userId);
        res.status(200).json({ success: true, data: po, message: "Purchase Order Received. Stock updated." });
    }
    catch (error) {
        next(error);
    }
};
exports.receivePo = receivePo;
