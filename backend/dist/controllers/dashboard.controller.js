"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const db_1 = __importDefault(require("../config/db"));
const getDashboardStats = async (req, res, next) => {
    try {
        const [totalCustomers, totalProducts, lowStockProducts, totalChallans, confirmedChallans, draftChallans,] = await Promise.all([
            db_1.default.customer.count(),
            db_1.default.product.count(),
            db_1.default.product.count({ where: { currentStock: { lt: db_1.default.product.fields.minimumStock } } }),
            db_1.default.salesChallan.count(),
            db_1.default.salesChallan.count({ where: { status: "CONFIRMED" } }),
            db_1.default.salesChallan.count({ where: { status: "DRAFT" } }),
        ]);
        // Calculate total stock value roughly
        const products = await db_1.default.product.findMany({ select: { currentStock: true } });
        const totalStock = products.reduce((sum, p) => sum + p.currentStock, 0);
        // Recent activities (last 5 challans)
        const recentChallans = await db_1.default.salesChallan.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: { customer: { select: { customerName: true } } }
        });
        res.status(200).json({
            success: true,
            data: {
                totalCustomers,
                totalProducts,
                totalStock,
                lowStockProducts,
                totalChallans,
                confirmedChallans,
                draftChallans,
                recentChallans,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getDashboardStats = getDashboardStats;
