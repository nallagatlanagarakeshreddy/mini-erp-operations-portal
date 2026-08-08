"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authentication token is missing or invalid",
                error: "UNAUTHORIZED",
            });
        }
        const token = authHeader.split(" ")[1];
        const decoded = (0, jwt_1.verifyToken)(token);
        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token",
                error: "UNAUTHORIZED",
            });
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error during authentication",
            error: "SERVER_ERROR",
        });
    }
};
exports.authenticate = authenticate;
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
                error: "UNAUTHORIZED",
            });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to perform this action",
                error: "FORBIDDEN",
            });
        }
        next();
    };
};
exports.requireRole = requireRole;
