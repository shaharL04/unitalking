import { Request, Response } from 'express';
import userService from '../services/userService';
import generateToken from '../utils/generateToken'
import validateAuthToken from '../utils/validateAuthToken'

class userController{
    async checkIfUserExists(req: Request, res: Response) {
      console.log("hi I am here")
        const { email, password } = req.body;
        try {
          const getUserIfExist = await userService.checkIfUserInDB(email);
          console.log(getUserIfExist);
          if(getUserIfExist != null){
            const checkUserPassword = await userService.verifyUserPassword(password,getUserIfExist)
            if(checkUserPassword){
              const token = generateToken(getUserIfExist.id)
              console.log(token);
              res.cookie('authToken', token, {
                httpOnly: true,
                secure: false, // Ensure this is set correctly
                maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
                path: '/',
              });
              res.status(200).json({ message :"success" });
            }
            else{
              res.status(400).json({ message :"wrong credentials" });
            }
          }
          else{
            res.status(404).json({ message :"user doesn't exist" });
          }
          
        } catch (error) {
          console.error('Error checking user existence:', error);
          res.status(500).json({ message: 'An error occurred while checking user existence.' });
        }
      }

      async getUserInfo(req: Request, res: Response) {
        const authToken = req.cookies.authToken
        console.log(authToken)
        const userId: string | null = validateAuthToken(authToken);
          if (userId === null) {
              return res.status(401).json({ message: 'Unauthorized: Invalid or missing auth token' });
          }  
          try{
            const userInfo = await userService.getUserInfoByUserID(userId)
            res.status(201).json(userInfo);
          }catch(error){
            console.log('error getting all users:', error);
            res.status(500).json({message: 'An error occurred while getting all users.'})
          }
        }
    
      async createUser(req: Request, res: Response) {
        const { name, email, password, langCode } = req.body;
        try {
          const newUser = await userService.createUser(name, email, password,langCode);
          res.status(201).json(newUser);
        } catch (error) {
          console.error('Error creating user:', error);
          res.status(500).json({ message: 'An error occurred while creating the user.' });
        }
      }

      async getAllUsers(req:Request, res:Response){
        const authToken = req.cookies.authToken
        console.log(authToken)
        const userId: string | null = validateAuthToken(authToken);
        if (userId === null) {
            return res.status(401).json({ message: 'Unauthorized: Invalid or missing auth token' });
        }  
        try{
          const allUsers = await userService.getAllUsers(userId)
          res.status(201).json(allUsers);
        }catch(error){
          console.log('error getting all users:', error);
          res.status(500).json({message: 'An error occurred while getting all users.'})
        }
      }

      async updateUserPassword(req:Request, res:Response){
        const authToken = req.cookies.authToken
        const userId: string | null = validateAuthToken(authToken);
        if (userId === null) {
            return res.status(401).json({ message: 'Unauthorized: Invalid or missing auth token' });
        }  
        try{
          const userPassword = req.body.newPassword
          const userUpdatedPasswordStatus = await userService.updateUserPassword(userId,userPassword)
          res.status(201).json(userUpdatedPasswordStatus);
        }catch(error){
          console.log('error getting all users:', error);
          res.status(500).json({message: 'An error occurred while getting all users.'})
        }
      }

      async updatePreferedLang(req:Request, res:Response){
        const authToken = req.cookies.authToken
        const userId: string | null = validateAuthToken(authToken);
        if (userId === null) {
            return res.status(401).json({ message: 'Unauthorized: Invalid or missing auth token' });
        }  
        try{
          const userLangCode = req.body.langCode
          const userUpdatedLangStatus = await userService.updateUserLang(userId, userLangCode)
          res.status(201).json(userUpdatedLangStatus);
        }catch(error){
          console.log('error getting all users:', error);
          res.status(500).json({message: 'An error occurred while getting all users.'})
        }
      }
}

export default new userController();