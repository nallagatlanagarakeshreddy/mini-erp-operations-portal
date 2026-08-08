"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInvoiceStatus = exports.getInvoiceById = exports.getInvoices = void 0;
const db_1 = __importDefault(require("../config/db"));
const getInvoices = async () => {
    return await db_1.default.invoice.findMany({
        include: { challan: { include: { customer: true } } },
        orderBy: { createdAt: "desc" },
    });
};
exports.getInvoices = getInvoices;
const getInvoiceById = async (id) => {
    const invoice = await db_1.default.invoice.findUnique({
        where: { id },
        include: { challan: { include: { customer: true, items: true } } },
    });
    if (!invoice)
        throw { status: 404, message: "Invoice not found" };
    return invoice;
};
exports.getInvoiceById = getInvoiceById;
const updateInvoiceStatus = async (id, data) => {
    return await db_1.default.invoice.update({
        where: { id },
        data: {
            status: data.status,
            amountPaid: data.amountPaid !== undefined ? data.amountPaid : undefined,
        },
        include: { challan: { include: { customer: true } } },
    });
};
exports.updateInvoiceStatus = updateInvoiceStatus;
