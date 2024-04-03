import express from 'express';
import dotenv from 'dotenv';
import http from 'http';

import { Server } from 'socket.io';

import cors from 'cors';
import connectDB from './database/config/connect';

import router from './router/router';
import userServices from './services/user.services';
import messagesServices from './services/messages.services';

import * as crypto from 'crypto';
import { Rooms } from './database/models/room.model';

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

      console.log(roomId);

      const user = await userServices.findUser(userName);
      const messages = await messagesServices.getRoomMessages(roomId);

      if (user) {
        if (user.roomId && user.roomId._id.toString() !== roomId) {
          console.log(true);
          socket.leave(user.roomId._id.toString());
        }
        const updatedUser = await userServices.updateUserRoom(user._id, roomId);
        await Rooms.findByIdAndUpdate(roomId, { $push: { users: updatedUser._id } });
        socket.join(roomId);
      } else {
        const createdUser = await userServices.addUser(userName, roomId);
        await Rooms.findByIdAndUpdate(roomId, { $push: { users: createdUser._id } });
        socket.join(roomId);
      }

      socket.to(roomId).emit('message', {
        _id: crypto.randomUUID(),
        message: `${userName} joined room`,
        roomId,
        user: {
          userName: 'Admin',
          _id: crypto.randomUUID()
        },
        createdAt: new Date()
      });

      socket.emit('messages', { messages });
    } catch (e) {
      console.error(e);
    }
  });

  socket.on('sendMessage', async (data) => {
    try {
      const { roomId, userName, message } = data;

      console.log(roomId);

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

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('leaveRoom', async ({ roomId, userName }) => {
    await userServices.leaveRoom(userName, roomId);
    socket.leave(roomId);
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
