import express from 'express';
import dotenv from 'dotenv';
import http from 'http';

import { Server } from 'socket.io';
import cors from 'cors';
import connectDB from './database/config/connect';
import { Room } from './database/models/room.model';

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

app.get('/', (req, res) => {
  console.log(req);
  res.send('Hi');
});

io.on('connection', (socket) => {
  socket.on('joinRoom', ({ roomId, message, userName }) => {
    socket.join(roomId);

    socket.on('sendMessage', (message) => {
      io.to(roomId).emit('receiveMessage', { message });
    });

    io.to(roomId).emit('message', {
      message,
      roomId,
      userName
    });

    io.to(roomId).emit('roomSettings', {
      roomId
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
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
