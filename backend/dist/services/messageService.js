"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortAllMessagesByTimeOrder = exports.retrieveMessagesSentByContact = exports.retrieveMessagesSentByUser = void 0;
const dbConfig_1 = require("../config/dbConfig");
const retrieveMessagesSentByUser = async (userId, contactUserId) => {
    const query = `
    SELECT * FROM messages
    WHERE sender_id = $1 AND receiver_id = $2
    ORDER BY timestamp;
  `;
    try {
        const result = await dbConfig_1.pool.query(query, [userId, contactUserId]);
        return result.rows;
    }
    catch (error) {
        console.error('Error executing query:', error);
        throw error;
    }
};
exports.retrieveMessagesSentByUser = retrieveMessagesSentByUser;
const retrieveMessagesSentByContact = async (userId, contactUserId) => {
    const query = `
    SELECT * FROM messages
    WHERE sender_id = $1 AND receiver_id = $2
    ORDER BY timestamp;
  `;
    try {
        const result = await dbConfig_1.pool.query(query, [contactUserId, userId]);
        return result.rows;
    }
    catch (error) {
        console.error('Error executing query:', error);
        throw error;
    }
};
exports.retrieveMessagesSentByContact = retrieveMessagesSentByContact;
const sortAllMessagesByTimeOrder = async (userMessagesArray, contactMessagesArray) => {
    let combinedMessagesArr = userMessagesArray.concat(contactMessagesArray);
    combinedMessagesArr.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    return combinedMessagesArr;
};
exports.sortAllMessagesByTimeOrder = sortAllMessagesByTimeOrder;
//# sourceMappingURL=messageService.js.map