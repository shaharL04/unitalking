"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const messageService = __importStar(require("../services/messageService"));
class messageController {
    async retrieveChatMessagesInOrder(req, res) {
        const userId = req.body.userId;
        const contactUserId = req.body.otherUserId;
        try {
            const userMessages = await messageService.retrieveMessagesSentByUser(userId, contactUserId);
            const contactMessages = await messageService.retrieveMessagesSentByContact(userId, contactUserId);
            const SortedMessages = await messageService.sortAllMessagesByTimeOrder(userMessages, contactMessages);
            res.status(200).json({ SortedMessagesArr: SortedMessages });
        }
        catch (error) {
            console.error('Error sending request:', error);
            res.status(500).json({ message: 'An error occurred while sending the request.' });
        }
    }
}
exports.default = new messageController();
//# sourceMappingURL=messageController.js.map