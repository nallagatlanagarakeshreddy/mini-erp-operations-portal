"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const customer_routes_1 = __importDefault(require("./routes/customer.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const challan_routes_1 = __importDefault(require("./routes/challan.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
const supplier_routes_1 = __importDefault(require("./routes/supplier.routes"));
const po_routes_1 = __importDefault(require("./routes/po.routes"));
const invoice_routes_1 = __importDefault(require("./routes/invoice.routes"));
// Routes
app.use("/api/auth", auth_routes_1.default);
app.use("/api/customers", customer_routes_1.default);
app.use("/api/products", product_routes_1.default);
app.use("/api/challans", challan_routes_1.default);
app.use("/api/dashboard", dashboard_routes_1.default);
app.use("/api/suppliers", supplier_routes_1.default);
app.use("/api/purchase-orders", po_routes_1.default);
app.use("/api/invoices", invoice_routes_1.default);
// Health check
app.get("/api/health", (req, res) => {
    res.status(200).json({ success: true, message: "API is running" });
});
// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
        error: err.name || "SERVER_ERROR",
    });
});
exports.default = app;
