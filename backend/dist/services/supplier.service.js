"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSupplier = exports.getSupplierById = exports.getSuppliers = exports.createSupplier = void 0;
const db_1 = __importDefault(require("../config/db"));
const createSupplier = async (data) => {
    return await db_1.default.supplier.create({ data });
};
exports.createSupplier = createSupplier;
const getSuppliers = async (search) => {
    if (search) {
        return await db_1.default.supplier.findMany({
            where: {
                OR: [
                    { supplierName: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } },
                ],
            },
            orderBy: { createdAt: "desc" },
        });
    }
    return await db_1.default.supplier.findMany({ orderBy: { createdAt: "desc" } });
};
exports.getSuppliers = getSuppliers;
const getSupplierById = async (id) => {
    const supplier = await db_1.default.supplier.findUnique({ where: { id } });
    if (!supplier)
        throw { status: 404, message: "Supplier not found" };
    return supplier;
};
exports.getSupplierById = getSupplierById;
const updateSupplier = async (id, data) => {
    return await db_1.default.supplier.update({
        where: { id },
        data,
    });
};
exports.updateSupplier = updateSupplier;
