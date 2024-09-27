import { pool } from '../config/dbConfig';
import bcrypt from 'bcrypt';
import hashPassword from '../utils/hashPassword';
import { User } from '../types/user';
import { QueryResult } from 'pg';

class UserService {

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

  async getUserInfoByUserID(userId: number): Promise<User> {
    const query = 'SELECT * FROM users WHERE id = $1';
    try {
      const result: QueryResult<User> = await pool.query(query, [userId]);
      return result.rows[0]; 
    } catch (error) {
      console.error('Error retrieving user info:', error);
      throw error; 
    }
  }

  async createUser(name: string, email: string, password: string, langCode: string, uniqueToSendToDB: string): Promise<User> {
    const hashedPassword: string = await hashPassword(password);
    const query = 'INSERT INTO users (username, email, password_hash, lang_code, user_photo_unique) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    
    try {
      const result: QueryResult<User> = await pool.query(query, [name, email, hashedPassword, langCode, uniqueToSendToDB]);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async verifyUserPassword(password: string, user: User): Promise<boolean> {
    try {
      const isMatch = await bcrypt.compare(password, user.password_hash);
      return isMatch;
    } catch (error) {
      console.error('Error verifying password:', error);
      throw error; 
    }
  }

  async getAllUsers(userId: number): Promise<User[]> {
    const query = 'SELECT id, username FROM users WHERE id != $1';
    try {
      const result: QueryResult<User> = await pool.query(query, [userId]);
      console.log("ALL users results: " + JSON.stringify(result.rows));
      return result.rows;
    } catch (error) {
      console.error('Error retrieving all users:', error);
      throw error; 
    }
  }

  async getUserLangCode(userId: number): Promise<string> {
    console.log("Fetching user language code...");
    const query = 'SELECT lang_code FROM users WHERE id = $1';
    try {
      const result: QueryResult<{ lang_code: string }> = await pool.query(query, [userId]);
      console.log("User language code: " + JSON.stringify(result.rows));
      return result.rows[0]?.lang_code || '';
    } catch (error) {
      console.error('Error fetching user language code:', error);
      throw error; 
    }
  }

  async updateUserPassword(userId: number, userNewPassword: string): Promise<{ message: string; type: string }> {
    const hashedPassword: string = await hashPassword(userNewPassword);
    const query = 'UPDATE users SET password_hash = $1 WHERE id = $2';

    try {
      const result = await pool.query(query, [hashedPassword, userId]);
      console.log('User password updated:', result.rowCount);
      return { message: 'User password updated successfully.', type:"success" };
    } catch (error) {
      console.error('Error updating user password:', error);
      throw error; 
    }
  }

  async updateUserLang(userId: number, userNewLang: string): Promise<{ message: string; type: string }> {
    const query = 'UPDATE users SET lang_code = $1 WHERE id = $2';
    
    try {
      const result = await pool.query(query, [userNewLang, userId]);
      console.log('User language updated:', result.rowCount);
      return { message: 'User language updated successfully.', type:"success" };
    } catch (error) {
      console.error('Error updating user language:', error);
      throw error; 
    }
  }

  async updateUserData(name: string, email: string, phoneNumber: string, dateOfBirth: string, userId: number): Promise<{ message: string; type: string }> {
    const query = 'UPDATE users SET username = $1, email = $2, phone_number = $3, date_of_birth = $4 WHERE id = $5';

    try {
      const result = await pool.query(query, [name, email, phoneNumber, dateOfBirth, userId]);
      console.log('User data updated:', result.rowCount);
      return { message: 'User data updated successfully.', type:"success" };
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error; 
    }
  }
}

export default new UserService();
