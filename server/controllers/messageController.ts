import { Request, Response } from 'express';
import  messageService from '../services/messageService';
import userService from '../services/userService';
import axios from 'axios';
import validateAuthToken from '../utils/validateAuthToken';
class messageController{
    async retrieveChatMessagesInOrder(req: Request, res: Response) {
        const userId: string = req.body.userId;
        const groupId: string = req.body.groupId;
        try {
        const userMessages = await messageService.retrieveMessagesSentByUser(userId, groupId);
        const contactMessages = await messageService.retrieveMessagesSentByGroupUsers(userId, groupId );
        const mixedMessagesArr = [...userMessages, ...contactMessages]
        
        const userLangCode = await userService.getUserLangCode(userId)
        const translatedMessagesArr = await messageService.batchTranslateMessages(mixedMessagesArr, userLangCode);
        console.log("this is the translated messages array   "+JSON.stringify(translatedMessagesArr))

        //Sort the messages by timestamps and return them
        const SortedMessages = await messageService.sortMessagesByTimeOrder(translatedMessagesArr);
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

    async translateNewMessage(req:Request, res: Response){
        const authToken = req.cookies.authToken
        const userId: string | null = validateAuthToken(authToken);
        if (userId === null) {
            return res.status(401).json({ message: 'Unauthorized: Invalid or missing auth token' });
        }
        const newMessageForTranslate = req.body.newMessageForTranslate;
        try {
        const translatedMessage = await messageService.translateNewMessage(userId, newMessageForTranslate);
        res.status(200).json({ message: translatedMessage});
        
        } catch (error) {
        console.error('Error sending request:', error);
        res.status(500).json({ message: 'An error occurred while sending the request.' });
        }
    }

    async getTranslationLangs(req: Request, res: Response){
        try {
            const response = await axios.get('http://127.0.0.1:5000/languages');
            res.json(response.data);
          } catch (error) {
            console.error('Error fetching translation languages:', error);
            res.status(500).send('Failed to retrieve languages');
          }
    }
}

export default new messageController();