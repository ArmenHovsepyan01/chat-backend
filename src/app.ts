import express from 'express';
import dotenv from 'dotenv';
import http from 'http';

import { Server } from 'socket.io';
import cors from 'cors';
import connectDB from './database/config/connect';
import router from './router/router';
import userServices from './services/user.services';
import { User } from './database/models/user.model';
import { Messages } from './database/models/messages.model';
import messagesServices from './services/messages.services';

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173'
  }
});

const PORT = process.env.PORT || 5005;

app.use(cors());

app.use('/', router);

let users = [];

io.on('connection', (socket) => {
  socket.on('joinRoom', async ({ roomId, userName }) => {
    try {
      const user = await userServices.findUser(userName);
      const messages = await messagesServices.getRoomMessages(roomId);

      if (user) {
        socket.leave(user.roomId);
        await userServices.updateUserRoom(user._id, roomId);
        socket.join(roomId);
      } else {
        await userServices.addUser(userName, roomId);
        socket.join(roomId);
      }

      io.to(roomId).emit('message', {
        message: `${userName} joined room`,
        roomId,
        userName: 'Admin'
      });

      socket.emit('messages', { messages });
    } catch (e) {
      console.error(e);
    }
  });

  socket.on('sendMessage', async (data) => {
    try {
      const { roomId, userName, message } = data;

      const createdMessage = await messagesServices.addMessage(userName, roomId, message);

      io.to(data.roomId).emit('receiveMessage', { message: createdMessage });
    } catch (e) {
      console.error(e);
    }
  });

  socket.on('typing', (event) => {
    socket
      .to(event.roomId)
      .emit('userTyping', { message: `${event.userName} is typing...`, isTyping: event.isTyping });
  });

  socket.on('disconnect', (data) => {
    console.log('User disconnected');
  });
});

const start = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => console.log(`Server is listening on port::${PORT}`));
  } catch (e) {
    throw new Error(e);
  }
};

start();
