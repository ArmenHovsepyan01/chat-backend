import express from 'express';
import dotenv from 'dotenv';
import http from 'http';

import { Server } from 'socket.io';

import cors from 'cors';
import connectDB from './database/config/connect';

import router from './router/router';
import userServices from './services/user.services';
import messagesServices from './services/messages.services';

import roomService from './services/room.service';
import { generateAdminMessage } from './utilis/generateAdminMessage';

import { User } from './types/types';

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

app.use(express.json());

app.use('/', router);

io.on('connection', (socket) => {
  socket.on('joinRoom', async ({ roomId, userName }) => {
    try {
      if (!roomId || !userName) throw new Error("Room id or user name is missing, can't join room");

      const user = await userServices.findUser(userName);
      const messages = await messagesServices.getRoomMessages(roomId);

      let modifiedUser: User;

      if (user) {
        if (user.roomId && user.roomId._id.toString() !== roomId) {
          socket.leave(user.roomId._id.toString());
        }
        modifiedUser = await userServices.updateUserRoom(user._id, roomId);
      } else {
        modifiedUser = await userServices.addUser(userName, roomId);
      }

      await roomService.addUser(roomId, modifiedUser._id);

      socket.join(roomId);

      socket.to(roomId).emit('message', generateAdminMessage(userName, roomId));
    } catch (e) {
      console.error(e);
    }
  });

  socket.on('sendMessage', async (data) => {
    try {
      const { roomId, userName, message } = data;

      if (!roomId || !userName || !message)
        throw new Error("Can't send message because there are empty fields.");

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

  socket.on('leaveRoom', async ({ roomId, userName }) => {
    if (roomId && userName) {
      await userServices.leaveRoom(userName, roomId);
      socket.leave(roomId);
    }
  });
});

const start = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => console.log(`Server is listening on port::${PORT}`));
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};

start();
