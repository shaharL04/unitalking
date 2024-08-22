import { pool } from '../config/dbConfig';
import { Message } from '../types/message';

class messageService{
  
   async retrieveMessagesSentByUser (userId: string, contactUserId: string): Promise<Message[]> {
    const query = `
      SELECT * FROM messages
      WHERE sender_id = $1 AND receiver_id = $2
      ORDER BY timestamp;
    `;
    
    try {
      const result = await pool.query(query, [userId, contactUserId]);
      return result.rows;
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  };

   async retrieveMessagesSentByContact (userId: string, contactUserId: string): Promise<Message[]> {
    const query = `
      SELECT * FROM messages
      WHERE sender_id = $1 AND receiver_id = $2
      ORDER BY timestamp;
    `;
    
    try {
      const result = await pool.query(query, [contactUserId, userId]);
      return result.rows;
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  };

   async sortAllMessagesByTimeOrder (userMessagesArray: Message[], contactMessagesArray: Message[]): Promise<Message[]> {
    let combinedMessagesArr = userMessagesArray.concat(contactMessagesArray);
    combinedMessagesArr.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    return combinedMessagesArr;
  }

  async newMessageIncoming (userId: string, targetUserId: string, incomingMessage: string): Promise<Message[]> {
    const query = `
    INSERT INTO messages (sender_id, receiver_id, message_type, content)
    VALUES ($1, $2, 'text', $3)
    RETURNING *;
  `;
    
    try {
      const result = await pool.query(query, [userId, targetUserId, incomingMessage]);
      console.log("this is the result rows after new incoming message"+JSON.stringify(result.rows[0]))
      return result.rows[0];
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  };

}

export default new messageService();

