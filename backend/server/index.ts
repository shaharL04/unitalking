  import express from 'express';
  import bodyParser from 'body-parser';
  import router from './routes/index';
  import cookieParser from 'cookie-parser';
  import corsMiddleware from './middlewares/corsMiddleware';
  import checkOrigin from './middlewares/originCheckMiddleware';
  import cors from "cors"
  import validateAuthToken from './utils/validateAuthToken';
  import path from 'path';
  import WebSocket from 'ws';
  import { IncomingMessage } from 'http';
  import { connectRedis } from './config/redisClient';
  import messageService from './services/messageService';

  const app = express();
  const port = Number(process.env.PORT) || 8080;
  app.use(corsMiddleware);
  app.use(checkOrigin);

  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use('/', router);

  const staticFilesPath = path.join(__dirname, '..', 'photos', 'chatPhotos');
  app.use('/chatPhotos', express.static(staticFilesPath));



  // WebSocket START commit2

  const wss = new WebSocket.Server({ port: 9000 });
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
          const { targetChatUserIdArr, data } = JSON.parse(message.toString());
      
          if (Array.isArray(targetChatUserIdArr) && targetChatUserIdArr.length > 0) {
            // Send the message to all users specified in targetUserIds array
            targetChatUserIdArr.forEach(userId => sendToUser(userId, data));
          } else {
            console.log('No valid target users provided or targetUserIds is empty');
          }
        } catch (error) {
          console.error('Message handling error:', error);
        }
      });
      
      // Helper function to send a message to a single user
      async function sendToUser(targetUserId: number, data: any) {
        console.log("this is the data send to user: "+ JSON.stringify(data))
        const translatedData = await messageService.translateNewMessage(targetUserId, data)
        if (userConnections[targetUserId]) {
          userConnections[targetUserId].forEach(conn => conn.send(JSON.stringify(translatedData)));
          console.log(`Message sent to user ${targetUserId}`);
        } else {
          console.log(`User ${targetUserId} not connected`);
        }
      }

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

  async function startServer() {
    await connectRedis(); 

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
  }

  startServer();