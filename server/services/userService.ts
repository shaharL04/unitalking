import { pool } from '../config/dbConfig';
import bcrypt from 'bcrypt'
import hashPassword from '../utils/hashPassword';
import {User} from '../types/user'
import { QueryResult } from 'pg';

class userService {

  async checkIfUserInDB(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1 LIMIT 1';
    try {
      const result: QueryResult<User> = await pool.query(query, [email]);
      const rowCount: number = result.rowCount as number;

      if (rowCount > 0) {
        return result.rows[0]; 
      } else {
        return null; 
      }
    } catch (error) {
      console.error('Error checking user in database:', error);
      throw error; 
    }
  }

  async getUserInfoByUserID(userId: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    try {
      const result = await pool.query(query, [userId]);  
      return result.rows[0]; 
    } catch (error) {
      console.error('Error checking user in database:', error);
      throw error; 
    }
  }

  async createUser(name: string, email: string, password: string, langCode:string): Promise<any> {
    const hashedPassword: string = await hashPassword(password);
    const query = 'INSERT INTO users (username, email, password_hash, lang_code) VALUES ($1, $2, $3, $4) RETURNING *';
    const result = await pool.query(query, [name, email, hashedPassword, langCode]);
    return result.rows[0];
  }

  async verifyUserPassword( password: string, user: User): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, user.password_hash);
    return isMatch;
  }

  async getAllUsers(userId: string): Promise<any>{
    const query = 'SELECT id,username FROM users WHERE id != $1'
    const result = await pool.query(query, [userId]);
    console.log("ALL users results"+JSON.stringify(result.rows));
    return result
  }

  async getUserLangCode(userId: string): Promise<string>{
    console.log("user Lang code ");
    const query = 'SELECT lang_code FROM users WHERE id = $1'
    const result = await pool.query(query, [userId]);
    console.log("user Lang code "+JSON.stringify(result.rows));
    return result.rows[0].lang_code
  }

  async updateUserPassword(userId: string,userNewPassword: string ){
    const hashedPassword: string = await hashPassword(userNewPassword);
    const query = 'UPDATE users SET password_hash = $1 WHERE id = $2'
    const result = await pool.query(query, [userNewPassword,userId]);
    console.log(JSON.stringify(result.rows));
    return result
  }

  async updateUserLang(userId: string,userNewLang: string ){
    const query = 'UPDATE users SET lang_code = $1 WHERE id = $2'
    const result = await pool.query(query, [userNewLang,userId]);
    console.log(JSON.stringify(result.rows));
    return result
  }

  async updateUserData(name: string, email: string, phoneNumber: string, dateOfBirth: string, userId: string){
    const query = 'UPDATE users SET username = $1, email = $2, phone_number = $3, date_of_birth = $4  WHERE id = $5'
    const result = await pool.query(query, [name ,email ,phoneNumber, dateOfBirth, userId]);
    console.log(JSON.stringify("this updateUserData"+result.rows));
    return result
  }
}

export default new userService();
