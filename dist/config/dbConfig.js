"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
require("dotenv/config");
const pg_1 = require("pg");
console.log(process.env.DB_USER);
const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;
console.log("Database Connection String:", connectionString);
const pool = new pg_1.Pool({
    connectionString: connectionString,
});
exports.pool = pool;
//# sourceMappingURL=dbConfig.js.map