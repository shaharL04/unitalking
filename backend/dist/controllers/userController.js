"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userService_1 = __importDefault(require("../services/userService"));
class UserController {
    async checkIfUserExists(req, res) {
        const { email, password } = req.body;
        try {
            const userExists = await userService_1.default.checkIfUserExists(email, password);
            res.status(200).json({ exists: userExists });
        }
        catch (error) {
            console.error('Error checking user existence:', error);
            res.status(500).json({ message: 'An error occurred while checking user existence.' });
        }
    }
    async createUser(req, res) {
        const { name, email, password } = req.body;
        try {
            const newUser = await userService_1.default.createUser(name, email, password);
            res.status(201).json(newUser);
        }
        catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ message: 'An error occurred while creating the user.' });
        }
    }
}
exports.default = new UserController();
//# sourceMappingURL=userController.js.map