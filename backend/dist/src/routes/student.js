"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const student_1 = require("../controllers/student");
const router = express_1.default.Router();
router.post('/facial-detection', (req, res) => {
    if (!req.user) {
        return res
            .status(401)
            .json({ success: false, error: { message: 'Unauthorized' } });
    }
    (0, student_1.facialDetection)(req.user, req.body)
        .then((data) => {
        res.status(200).json({ data });
    })
        .catch((error) => {
        res
            .status(400)
            .json({ success: false, error: { message: error.message } });
    });
});
router.get('/me', (req, res) => {
    res.status(200).json({ success: true, data: req.user });
});
exports.default = router;
