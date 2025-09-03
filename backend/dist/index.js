"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const corsOptions = {
    origin: [
        /^https?:\/\/([a-zA-Z0-9-]+\.)*mindmates\.com$/,
        "http://localhost:3000",
    ],
    optionsSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
const BASE_PATH = "/api";
app.use(`${BASE_PATH}/health`, (req, res) => {
    res.status(200).send("OK2");
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
