import { Router } from 'express';
import multer from 'multer';
import userController from '../controllers/userController';
import messageController from '../controllers/messageController';
import chatController from '../controllers/chatController'
import { multerChatStorage, multerUserStorage } from '../utils/handleFiles';

const router: Router = Router();

// Multer instances for different types of uploads
const uploadChatPhoto = multer({ storage: multerChatStorage }); // For chat group images
const uploadUserPhoto = multer({ storage: multerUserStorage }); // For user profile photos

//user routers
router.post('/checkIfUserExistInDB', userController.checkIfUserExists);
router.post('/userInfo', userController.userInfo);
router.post('/createUserInDB', uploadUserPhoto.single('userPhoto'), userController.createUser);
router.post('/allUsers', userController.allUsers);
router.post('/updateUserPassword', userController.updateUserPassword);
router.post('/updatePreferedLang', userController.updatePreferedLang);
router.post('/updateUserData', userController.updateUserData)
router.get('/checkToken', userController.checkIfUserHasToken)

//Messages routers
router.post('/retrieveChatMessagesInOrder', messageController.retrieveChatMessagesInOrder);
router.post('/newMessage', messageController.newMessage);
router.post('/translateNewMessage', messageController.translateNewMessage)
router.get('/translationLangs', messageController.translationLangs)


//Chat routers
router.post('/retrieveAllChatsTheUserHasByTimeOrder', chatController.retrieveAllChatsTheUserHasByTimeOrder);
router.post('/newChat', uploadChatPhoto.single('groupImage'), chatController.newChat);
router.post('/chatUsers', chatController.chatUsers);
router.post('/chatInfoByChatId', chatController.chatInfoByChatId)

//Translate routers
//router.post('/api/translate', UserController.createUser);

export default router;
