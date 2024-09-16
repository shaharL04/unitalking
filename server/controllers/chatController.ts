import { Request, Response } from 'express';
import chatService from '../services/chatService';
import validateAuthToken from '../utils/validateAuthToken'

class chatController{
    async retrieveAllChatsTheUserHasByTimeOrder(req: Request, res: Response) {
        console.log("reached here")
        const authToken = req.cookies.authToken
        console.log(authToken)
        const userId: string | null = validateAuthToken(authToken);
        if (userId === null) {
            return res.status(401).json({ message: 'Unauthorized: Invalid or missing auth token' });
        }
        try {
            console.log("reached here 22")
            const sortedChats = await chatService.retrieveAllChatsTheUserHasByTimeOrder(userId);
            const sortedChatsWithPhotoPaths = await chatService.retrieveAllChatsPhotos(sortedChats)
            console.log("sortedChatsWithPhotoPaths "+JSON.stringify(sortedChatsWithPhotoPaths))
            res.status(200).json({ sortedChats: sortedChatsWithPhotoPaths});     
            } catch (error) {
            console.error('Error sending request:', error);
            res.status(500).json({ message: 'An error occurred while sending the request.' });
        }
    }

    async getChatUsers(req: Request, res: Response) {
        try {
            const usersInChats = await chatService.getChatUsers(req.body.currentLoggedUser, req.body.chatID);
            console.log("usersInChats:"+JSON.stringify(usersInChats))
            res.status(200).json({ usersInChats: usersInChats});     
            } catch (error) {
            console.error('Error sending request:', error);
            res.status(500).json({ message: 'An error occurred while sending the request.' });
        }
    }

    async createNewChat(req: Request, res: Response){
        const { groupName, groupMembersArr } = req.body; 

        const authToken = req.cookies.authToken
        const userId: string | null = validateAuthToken(authToken);
        if (userId === null) {
            return res.status(401).json({ message: 'Unauthorized: Invalid or missing auth token' });
        }
        if (!req.file) {
            return res.status(400).send("No file uploaded.");
        }
        const fileNameParts = req.file.filename.split('_');
        const uniqueToSendToDB = fileNameParts[0];
        const parsedgroupMembersArr = JSON.parse(groupMembersArr);
        try{
            const chat_id = await chatService.createNewChat(groupName, uniqueToSendToDB);
            const insertIntoChatParticipants = await chatService.insertUsersToNewChat(chat_id, parsedgroupMembersArr,userId)
            res.status(200).json({message: "chat was succesfully initiated"})
        }catch(error){
            console.error('Error sending request:', error);
            res.status(500).json({ message: 'An error occurred while sending the request.' });
        }
    }

    async getChatInfoByChatId(req: Request, res: Response){
        const {groupId} = req.body;
        try{
            const chatObject = await chatService.getChatInfoByChatId(groupId)
            res.status(200).json({chatObject: chatObject})
        }catch(error){
            console.error('Error sending request:', error);
            res.status(500).json({ message: 'An error occurred while sending the request.' });
        }
    }
}

export default new chatController();