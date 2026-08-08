"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.loginUser = exports.registerUser = void 0;
const db_1 = __importDefault(require("../config/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../utils/jwt");
const registerUser = async (data) => {
    const existingUser = await db_1.default.user.findUnique({
        where: { email: data.email },
    });
    if (existingUser) {
        throw { status: 409, message: "User with this email already exists" };
    }
    const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
    const user = await db_1.default.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role: data.role || "SALES",
        },
    });
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
};
exports.registerUser = registerUser;
const loginUser = async (data) => {
    const user = await db_1.default.user.findUnique({
        where: { email: data.email },
    });
    if (!user) {
        throw { status: 401, message: "Invalid email or password" };
    }
    const isPasswordValid = await bcrypt_1.default.compare(data.password, user.password);
    if (!isPasswordValid) {
        throw { status: 401, message: "Invalid email or password" };
    }
    const token = (0, jwt_1.generateToken)({
        userId: user.id,
        email: user.email,
        role: user.role,
    });
    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
};
exports.loginUser = loginUser;
const getMe = async (userId) => {
    const user = await db_1.default.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
    });
    if (!user) {
        throw { status: 404, message: "User not found" };
    }
    return user;
};
exports.getMe = getMe;
