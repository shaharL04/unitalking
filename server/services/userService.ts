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

  async createUser(name: string, email: string, password: string): Promise<any> {
    const hashedPassword: string = await hashPassword(password);
    const query = 'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *';
    const result = await pool.query(query, [name, email, hashedPassword]);
    return result.rows[0];
  }

  async verifyUserPassword( password: string, user: User): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, user.password_hash);
    return isMatch;
  }
}

export default new userService();
