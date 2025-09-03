"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const adminMiddleware = (req, res, next) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "admin") {
        return res
            .status(403)
            .json({ success: false, error: { message: "Access denied" } });
    }
    next();
};
exports.default = adminMiddleware;
