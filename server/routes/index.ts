import { Router } from 'express';
import multer from 'multer';
import userController from '../controllers/userController';
import messageController from '../controllers/messageController';
import chatController from '../controllers/chatController'
import { multerStorage } from '../utils/handleFiles';

const router: Router = Router();

const uploadChatPhoto = multer({ storage: multerStorage });

//user routers
router.post('/checkIfUserExistInDB', userController.checkIfUserExists);
router.post('/getUserInfo', userController.getUserInfo);
router.post('/createUserInDB', userController.createUser);
router.post('/getAllUsers', userController.getAllUsers);
router.post('/updateUserPassword', userController.updateUserPassword);
router.post('/updatePreferedLang', userController.updatePreferedLang);

//Messages routers
router.post('/retrieveChatMessagesInOrder', messageController.retrieveChatMessagesInOrder);
router.post('/newMessage', messageController.newMessage);
router.post('/translateNewMessage', messageController.translateNewMessage)
router.get("/getTranslationLangs", messageController.getTranslationLangs)


//Chat routers
router.post('/retrieveAllChatsTheUserHasByTimeOrder', chatController.retrieveAllChatsTheUserHasByTimeOrder);
router.post('/createNewChat', uploadChatPhoto.single('groupImage'), chatController.createNewChat);
router.post('/getChatUsers', chatController.getChatUsers);
router.post('/getChatInfoByChatId', chatController.getChatInfoByChatId)

//Translate routers
//router.post('/api/translate', UserController.createUser);

export default router;
