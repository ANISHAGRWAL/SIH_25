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
const db_1 = require("../db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = yield db_1.db.query.user.findFirst({
            where: (user, { eq }) => eq(user.email, decodedToken.email),
        });
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
    catch (error) {
        throw error;
    }
});
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res
            .status(401)
            .json({ success: false, error: { message: "No token provided" } });
    }
    verifyToken(token)
        .then((user) => {
        if (!user) {
            return res
                .status(401)
                .json({ success: false, error: { message: "Invalid token" } });
        }
        req.user = { email: user.email, role: user.role };
        next();
    })
        .catch((error) => {
        res
            .status(401)
            .json({ success: false, error: { message: "Invalid token" } });
    });
};
exports.default = authMiddleware;
