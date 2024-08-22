import { Router } from 'express';
import userController from '../controllers/userController';
import messageController from '../controllers/messageController';
import chatController from '../controllers/chatController'

const router: Router = Router();

//DB routers
router.post('/checkIfUserExistInDB', userController.checkIfUserExists);
router.post('/createUserInDB', userController.createUser);

//Messages routers
router.post('/retrieveChatMessagesInOrder', messageController.retrieveChatMessagesInOrder);
router.post('/newMessage', messageController.newMessage);


//Chat routers
router.post('/retrieveAllChatsTheUserHasByTimeOrder', chatController.retrieveAllChatsTheUserHasByTimeOrder);
router.post('/getChatUsers', chatController.getChatUsers);
//Translate routers
//router.post('/api/translate', UserController.createUser);

export default router;
