"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = __importDefault(require("../controllers/userController"));
const messageController_1 = __importDefault(require("../controllers/messageController"));
const router = (0, express_1.Router)();
//DB routers
router.post('/checkIfUserExistInDB', userController_1.default.checkIfUserExists);
router.post('/createUserInDb', userController_1.default.createUser);
//Messages routers
router.post('/retrieveChatMessagesInOrder', messageController_1.default.retrieveChatMessagesInOrder);
//Translate routers
//router.post('/api/translate', UserController.createUser);
exports.default = router;
//# sourceMappingURL=index.js.map