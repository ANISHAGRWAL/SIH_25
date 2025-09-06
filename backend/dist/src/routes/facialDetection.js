"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const facialDetection_1 = require("../controllers/facialDetection");
const router = express_1.default.Router();
router.post('/', (req, res) => {
    (0, facialDetection_1.facialDetection)(req.body)
        .then((data) => {
        res.status(200).json({ data });
    })
        .catch((error) => {
        res
            .status(400)
            .json({ success: false, error: { message: error.message } });
    });
});
exports.default = router;
