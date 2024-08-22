import { Request, Response } from 'express';
import  messageService from '../services/messageService';
import validateAuthToken from '../utils/validateAuthToken';
class messageController{
    async retrieveChatMessagesInOrder(req: Request, res: Response) {
        const userId: string = req.body.userId;
        const contactUserId: string = req.body.otherUserId;
        try {
        const userMessages = await messageService.retrieveMessagesSentByUser(userId, contactUserId);
        const contactMessages = await messageService.retrieveMessagesSentByContact(userId, contactUserId );
        const SortedMessages = await messageService.sortAllMessagesByTimeOrder(userMessages,contactMessages)
        res.status(200).json({ SortedMessagesArr: SortedMessages});
        
        } catch (error) {
        console.error('Error sending request:', error);
        res.status(500).json({ message: 'An error occurred while sending the request.' });
        }
    }

    async newIncomingMessage(req: Request, res: Response){
        const authToken = req.cookies.authToken
        console.log("auth tokennnn"+authToken )
        const userId: string | null = validateAuthToken(authToken);
        if (userId === null) {
            return res.status(401).json({ message: 'Unauthorized: Invalid or missing auth token' });
        }

        const incomingMessage: string = req.body.newMessage;
        const targetUserId: string = req.body.targertedUserId;
        try {
        const userMessages = await messageService.newMessageIncoming(userId, targetUserId,incomingMessage);
        res.status(200).json({ message: userMessages});
        
        } catch (error) {
        console.error('Error sending request:', error);
        res.status(500).json({ message: 'An error occurred while sending the request.' });
        }
    }
}

export default new messageController();