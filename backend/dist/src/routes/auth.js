"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controllers/auth");
const router = express_1.default.Router();
router.post('/register', (req, res) => {
    (0, auth_1.registerUser)(req.body)
        .then((data) => {
        res.status(200).json({ success: true, data });
    })
        .catch((error) => {
        res
            .status(400)
            .json({ success: false, error: { message: error.message } });
    });
});
router.post('/login', (req, res) => {
    (0, auth_1.loginUser)(req.body)
        .then((data) => {
        res.status(200).json({ success: true, data });
    })
        .catch((error) => {
        res
            .status(400)
            .json({ success: false, error: { message: error.message } });
    });
});
exports.default = router;
