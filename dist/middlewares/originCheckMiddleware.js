"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const allowedOrigin = 'http://localhost:3000';
const checkOrigin = (req, res, next) => {
    const origin = req.headers.origin;
    if (origin && origin === allowedOrigin) {
        next();
    }
    else {
        res.status(403).json({ message: 'Forbidden: Invalid Origin' });
    }
};
exports.default = checkOrigin;
//# sourceMappingURL=originCheckMiddleware.js.map