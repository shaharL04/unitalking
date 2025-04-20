"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretKey = process.env.JWT_SECRET || 'your-secret-key'; // Make sure to set a strong secret key in your environment variables
const generateToken = (userId) => {
    const token = jsonwebtoken_1.default.sign({ id: userId }, secretKey, { expiresIn: '1h' });
    return token;
};
exports.default = generateToken;
//# sourceMappingURL=generateToken.js.map