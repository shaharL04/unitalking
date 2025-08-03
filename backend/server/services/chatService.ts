import { json } from 'body-parser';
import { pool } from '../config/dbConfig';
import { sumUser } from '../types/sumUser';
import { User } from '../types/user';
import { Chat } from '../types/chat';
import findPhotosByUnique from '../utils/findPhotoByUnique';

class chatService{
    async retrieveAllChatsTheUserHasByTimeOrder (userId: number): Promise<Chat[]> {
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

    async retrieveAllChatsPhotos(sortedChatsArr: Chat[]): Promise<Chat[]>{
      const chatIdNUniqueArray: { chatId: number; uniqueToMatchInFolder: string | undefined }[] = [];
      sortedChatsArr.forEach((chat, index) => {
        const uniqueToMatchInFolder: string | undefined = chat.group_photo;
        chatIdNUniqueArray[index] = { chatId: chat.id, uniqueToMatchInFolder: uniqueToMatchInFolder }; 
      });
      const photosPathArray = findPhotosByUnique(chatIdNUniqueArray);
      const sortedChatsArrWPhotoPaths = sortedChatsArr.map((chat,index) =>{
        if(photosPathArray[index]?.chatId == chat.id){
          chat.group_photo = photosPathArray[index]?.pathToPhoto;
        }
        return chat
      })
      return sortedChatsArrWPhotoPaths;
    }

    async chatUsers (userId: number, chatID: number): Promise<Chat[]> {
      console.log(userId);
      console.log(chatID);
      const query = `
      SELECT user_id from chat_participants WHERE user_id != $1 AND chat_id = $2  
      `;
      
      try {
        const result = await pool.query(query, [userId, chatID]);
        console.log("this is chatUsers"+ JSON.stringify(result.rows))
        return result.rows;
      } catch (error) {
        console.error('Error executing query:', error);
        throw error;
      }
    };
    
    async newChat(groupName: string , photoUnique: string ): Promise<number>{
      const query = `INSERT INTO chats (name, group_photo)VALUES ($1, $2) RETURNING id;`
      try {
        const result = await pool.query(query, [groupName, photoUnique]);
        return result.rows[0].id
      } catch (error) {
        console.error('Error executing query:', error);
        throw error;
      }
    }

    async insertUsersToNewChat(chat_id: number, groupMembersArr: sumUser[], currentLoggedUser: number): Promise<{ message: string; type: string }>{
      const query = `INSERT INTO chat_participants(chat_id, user_id)VALUES ($1, $2) `
      try {
        
        console.log("groupMembersArr backend"+ groupMembersArr)
        groupMembersArr.map(async (userObject) =>{
          const userIdToInsert = userObject.id;
          await pool.query(query, [chat_id, userIdToInsert]);
        }) 
        await pool.query(query, [chat_id, currentLoggedUser]);
        return { message: 'Users were inserted to the new chat successfully.', type:"success" };
      } catch (error) {
        console.error('Error executing query:', error);
        throw error;
      }
    }

    async chatInfoByChatId(chat_id: number): Promise<Chat>{
      const query = `SELECT name, group_photo from chats WHERE id = $1`
      try {
        const result = await pool.query(query, [chat_id]);
        console.log("Chat Info By Chat Id "+JSON.stringify(result.rows[0]))
        const chatObject  = [ { chatId: chat_id, uniqueToMatchInFolder: result.rows[0].group_photo} ]
        result.rows[0].group_photo = findPhotosByUnique(chatObject)
        return result.rows[0]
      } catch (error) {
        console.error('Error executing query:', error);
        throw error;
      }
    }
}
export default new chatService();