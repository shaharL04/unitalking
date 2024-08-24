import { Request, Response } from 'express';
import  messageService from '../services/messageService';
import validateAuthToken from '../utils/validateAuthToken';
class messageController{
    async retrieveChatMessagesInOrder(req: Request, res: Response) {
        const userId: string = req.body.userId;
        const groupId: string = req.body.groupId;
        try {
        const userMessages = await messageService.retrieveMessagesSentByUser(userId, groupId);
        const contactMessages = await messageService.retrieveMessagesSentByGroupUsers(userId, groupId );
        const SortedMessages = await messageService.sortAllMessagesByTimeOrder(userMessages,contactMessages)
        res.status(200).json({ SortedMessagesArr: SortedMessages});
        
        } catch (error) {
        console.error('Error sending request:', error);
        res.status(500).json({ message: 'An error occurred while sending the request.' });
        }
    }

    async newMessage(req: Request, res: Response){
        console.log("bodyyy"+ JSON.stringify(req.body))
        const authToken = req.cookies.authToken
        console.log("auth tokennnn"+authToken )
        const userId: string | null = validateAuthToken(authToken);
        if (userId === null) {
            return res.status(401).json({ message: 'Unauthorized: Invalid or missing auth token' });
        }

        const incomingMessage: string = req.body.newMessage;
        const targetChatId: string = req.body.targetChatId;
        try {
        const userMessages = await messageService.newMessage(userId, targetChatId,incomingMessage);
        res.status(200).json({ message: userMessages});
        
        } catch (error) {
        console.error('Error sending request:', error);
        res.status(500).json({ message: 'An error occurred while sending the request.' });
        }
    }
}

export default new messageController();