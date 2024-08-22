import express from 'express';
import bodyParser from 'body-parser';
import router from './routes/index';
import cookieParser from 'cookie-parser';
import corsMiddleware from './middlewares/corsMiddleware';
import checkOrigin from './middlewares/originCheckMiddleware';
import validateAuthToken from './utils/validateAuthToken';
import https from 'https';
import fs from 'fs';
import WebSocket from 'ws';
import { IncomingMessage } from 'http';

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(corsMiddleware);
app.use(checkOrigin);
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/', router);

// WebSocket START

const wss = new WebSocket.Server({ port: 9000 });

// Store multiple connections per user
const userConnections: Record<string, WebSocket[]> = {};

wss.on('listening', () => {
  console.log('WebSocket server is listening for connections');
});

wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
  console.log('New WebSocket connection established');

  // Extract cookies from the request header
  const cookiesHeader = req.headers.cookie || '';
  const cookies = cookiesHeader.split('; ').reduce((prev, curr) => {
    const [name, value] = curr.split('=');
    prev[name] = value;
    return prev;
  }, {} as Record<string, string>);
  const authToken = cookies['authToken'] || '';
  const userId = validateAuthToken(authToken);

  if (userId) {
    // Initialize connection array if not present
    if (!userConnections[userId]) {
      userConnections[userId] = [];
    }

    // Add the new WebSocket connection to the user's connection array
    userConnections[userId].push(ws);
    console.log(`User ${userId} connected`);


    ws.on('message', (message: WebSocket.MessageEvent) => {
      console.log(`Received message from user ${userId}: ${message.toString()}`);
      try {
        const { targetUserId, data } = JSON.parse(message.toString());
        if (userConnections[targetUserId]) {
          // Send the message to all connections of the target user
          userConnections[targetUserId].forEach(conn => conn.send(data));
          console.log(`Message sent to user ${targetUserId}`);
        } else {
          console.log(`User ${targetUserId} not connected`);
        }
      } catch (error) {
        console.error('Message handling error:', error);
      }
    });

    // Handle WebSocket closure
    ws.on('close', (code: number, reason: string) => {
      console.log(`WebSocket connection closed for user ${userId} with code ${code} and reason: ${reason}`);
      userConnections[userId] = userConnections[userId].filter(conn => conn !== ws);

      // If no more connections for this user, delete the entry
      if (userConnections[userId].length === 0) {
        delete userConnections[userId];
      }
    });
  } else {
    console.log('Invalid user, closing WebSocket connection');
    ws.close();
  }
});

wss.on('error', (error) => {
  console.error('WebSocket server error:', error);
});

// WebSocket END

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
