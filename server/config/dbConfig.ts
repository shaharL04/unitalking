import 'dotenv/config'; 
import { Pool } from 'pg';
console.log(process.env.DB_USER);
const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

console.log("Database Connection String:", connectionString);

const pool = new Pool({
    connectionString: connectionString,
});

export { pool };
