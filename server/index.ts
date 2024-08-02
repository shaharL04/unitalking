import express, { Request, Response ,NextFunction} from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import axios from 'axios'
import { pool } from './dbConfig';
import { Query } from 'pg';

const app = express();
const port = process.env.PORT || 8080;

const corsOptions = {
  origin: 'http://localhost:3000', 
};


const checkOrigin = (req: Request, res: Response, next: NextFunction) => {
  const allowedOrigin = 'http://localhost:3000';
  const origin = req.headers.origin;

  if (origin && origin === allowedOrigin) {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Invalid Origin' });
  }
};

//Middleware
app.use(cors(corsOptions));
app.use(checkOrigin);
app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, world!');
});

app.post('/api/translate', async (req: Request, res: Response) => {
  const inputText: string = req.body.text;
    try {
      const translatedRes = await axios.post('http://localhost:5000/translate', {
        q: inputText,
        source: "auto",
        target: "en",
        format: "text",
        alternatives: 3
      }, {
        headers: { "Content-Type": "application/json" }
      });

      res.status(200).json({ translatedText: translatedRes.data.translatedText });
    } catch (error) {
      console.error('Error sending request:', error);
      res.status(500).json({ message: 'An error occurred while sending the request.' });
    }
});

app.post('/retrieveChatMessagesInOrder',  (req: Request, res: Response) => {
  const userId: string = req.body.userId;
  const contactUserId: string = req.body.otherUserId;
    try {
      

      res.status(200).json({ message: 'An error occurred while sending the request.' });
    } catch (error) {
      console.error('Error sending request:', error);
      res.status(500).json({ message: 'An error occurred while sending the request.' });
    }
});

async function retrieveMessagesSentByUser(userId: string,contactUserId: string){
  const query = `
    SELECT * FROM messages
    WHERE sender_id = $1 AND receiver_id = $2
    ORDER BY timestamp;
  `;

  try {

    const result = await pool.query(query, [userId, contactUserId]);
    console.log(result.rows);
    return result.rows;

  } catch (error) {

    console.error('Error executing query:', error);
    throw error; 
  }
  
}

async function retrieveMessagesSentByContact(userId: string,contactUserId: string ) {
  const query = `
    SELECT * FROM messages
    WHERE sender_id = $1 AND receiver_id = $2
    ORDER BY timestamp;
  `;

  try {

    const result = await pool.query(query, [contactUserId, userId]);
    console.log(result.rows);
    return result.rows;

  } catch (error) {

    console.error('Error executing query:', error);
    throw error; 
  }
  
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
