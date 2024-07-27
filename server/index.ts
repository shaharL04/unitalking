import express, { Request, Response ,NextFunction} from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import axios from 'axios'

const app = express();
const port = process.env.PORT || 8080;



const checkOrigin = (req: Request, res: Response, next: NextFunction) => {
  const allowedOrigin = 'http://localhost:3000';
  const origin = req.headers.origin;

  if (origin && origin === allowedOrigin) {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Invalid Origin' });
  }
};

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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
