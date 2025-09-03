"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateAccessToken = (user) => {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
        throw new Error("Missing ACCESS_TOKEN_SECRET environment variable");
    }
    return jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, secret, {
        expiresIn: "2h",
    });
};
const registerUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Registering user:", userData);
        const existingUser = yield db_1.db.query.user.findFirst({
            where: (user, { eq }) => eq(user.email, userData.email),
        });
        if (existingUser) {
            throw new Error("User already exists");
        }
        const hashedPassword = yield bcryptjs_1.default.hash(userData.password, 10);
        const user = yield db_1.db
            .insert(schema_1.user)
            .values({
            email: userData.email,
            password: hashedPassword,
            role: userData.role,
        })
            .returning();
        if (!user) {
            throw new Error("User registration failed");
        }
        return { token: generateAccessToken(user[0]) };
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
exports.registerUser = registerUser;
const loginUser = (credentials) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Logging in user:", credentials);
        const user = yield db_1.db.query.user.findFirst({
            where: (user, { eq }) => eq(user.email, credentials.email),
        });
        if (!user) {
            throw new Error("Invalid email or password");
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(credentials.password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid email or password");
        }
        return { token: generateAccessToken(user) };
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
exports.loginUser = loginUser;
