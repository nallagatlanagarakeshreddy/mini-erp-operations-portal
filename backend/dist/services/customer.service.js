"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCustomer = exports.getCustomerById = exports.getCustomers = exports.updateCustomer = exports.createCustomer = void 0;
const db_1 = __importDefault(require("../config/db"));
const createCustomer = async (data) => {
    return await db_1.default.customer.create({
        data,
    });
};
exports.createCustomer = createCustomer;
const updateCustomer = async (id, data) => {
    const existing = await db_1.default.customer.findUnique({ where: { id } });
    if (!existing) {
        throw { status: 404, message: "Customer not found" };
    }
    return await db_1.default.customer.update({
        where: { id },
        data,
    });
};
exports.updateCustomer = updateCustomer;
const getCustomers = async (query) => {
    const page = parseInt(query.page || "1");
    const limit = parseInt(query.limit || "10");
    const skip = (page - 1) * limit;
    const where = {};
    if (query.search) {
        where.OR = [
            { customerName: { contains: query.search, mode: "insensitive" } },
            { mobile: { contains: query.search } },
            { businessName: { contains: query.search, mode: "insensitive" } },
        ];
    }
    if (query.status) {
        where.status = query.status;
    }
    if (query.type) {
        where.customerType = query.type;
    }
    const [data, total] = await Promise.all([
        db_1.default.customer.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
        }),
        db_1.default.customer.count({ where }),
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
exports.getCustomers = getCustomers;
const getCustomerById = async (id) => {
    const customer = await db_1.default.customer.findUnique({
        where: { id },
        include: {
            challans: {
                orderBy: { createdAt: "desc" },
                take: 5,
            },
        },
    });
    if (!customer) {
        throw { status: 404, message: "Customer not found" };
    }
    return customer;
};
exports.getCustomerById = getCustomerById;
const deleteCustomer = async (id) => {
    const existing = await db_1.default.customer.findUnique({ where: { id } });
    if (!existing) {
        throw { status: 404, message: "Customer not found" };
    }
    return await db_1.default.customer.delete({
        where: { id },
    });
};
exports.deleteCustomer = deleteCustomer;
