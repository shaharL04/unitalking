import { json } from 'body-parser';
import { pool } from '../config/dbConfig';

class chatService{
    async retrieveAllChatsTheUserHasByTimeOrder (userId: string) {
      const query = `
      SELECT chats.*, chat_participants.*
        FROM chat_participants
        JOIN chats ON chat_participants.chat_id = chats.id
        WHERE chat_participants.user_id = $1
        ORDER BY chats.updated_at DESC;
      `;
      
      try {
        const result = await pool.query(query, [userId]);
        console.log("this is result rows"+ JSON.stringify(result.rows))
        return result.rows;
      } catch (error) {
        console.error('Error executing query:', error);
        throw error;
      }
    };

    async getChatUsers (userId: string, chatID: string) {
      console.log(userId);
      console.log(chatID);
      const query = `
      SELECT user_id from chat_participants WHERE user_id != $1 AND chat_id = $2  
      `;
      
      try {
        const result = await pool.query(query, [userId, chatID]);
        console.log("this is getChatUsers"+ JSON.stringify(result.rows))
        return result.rows;
      } catch (error) {
        console.error('Error executing query:', error);
        throw error;
      }
    };
    

}
export default new chatService();