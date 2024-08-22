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
            res.status(200).json({ sortedChats: sortedChats});     
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
}

export default new chatController();