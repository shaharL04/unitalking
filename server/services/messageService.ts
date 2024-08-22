import { pool } from '../config/dbConfig';
import { Message } from '../types/message';

class messageService{
  
   async retrieveMessagesSentByUser (userId: string, groupId: string): Promise<Message[]> {
    const query = `
      SELECT * FROM messages
      WHERE sender_id = $1 AND receiver_group_id = $2
      ORDER BY timestamp;
    `;
    
    try {
      const result = await pool.query(query, [userId, groupId]);
      return result.rows;
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  };

   async retrieveMessagesSentByContact (userId: string, groupId: string): Promise<Message[]> {
    const query = `
      SELECT * FROM messages
      WHERE sender_id = $1 AND receiver_group_id = $2
      ORDER BY timestamp;
    `;
    
    try {
      const result = await pool.query(query, [groupId, userId]);
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

  async newMessage (userId: string, targetGroupId: string, incomingMessage: string): Promise<Message[]> {
    const query = `
    INSERT INTO messages (sender_id, receiver_group_id, message_type, content)
    VALUES ($1, $2, 'text', $3)
    RETURNING *;
  `;
    
    try {
      const result = await pool.query(query, [userId, targetGroupId, incomingMessage]);
      console.log("this is the result rows after new incoming message"+JSON.stringify(result.rows[0]))
      return result.rows[0];
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  };

}

export default new messageService();

