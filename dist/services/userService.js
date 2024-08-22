"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbConfig_1 = require("../config/dbConfig");
class UserService {
    async checkIfUserExists(email, password) {
        const query = 'SELECT 1 FROM users WHERE email = $1 LIMIT 1';
        const result = await dbConfig_1.pool.query(query, [email]);
        return (result?.rowCount ?? 0) > 0;
    }
    async createUser(name, email, password) {
        const query = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *';
        const result = await dbConfig_1.pool.query(query, [name, email, password]);
        return result.rows[0];
    }
}
exports.default = new UserService();
//# sourceMappingURL=userService.js.map