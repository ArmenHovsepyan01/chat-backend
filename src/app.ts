import express from 'express';
import dotenv from 'dotenv';
import http from 'http';

import { Server } from 'socket.io';
import cors from 'cors';
import connectDB from './database/config/connect';

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

const Users = {
  users: [],
  setUsers: function (newUser) {
    this.users = [...this.users, newUser];
  }
};

io.on('connection', (socket) => {
  socket.on('joinRoom', ({ roomId, message, userName }) => {
    const user = Users.users.find((user) => user.id === socket.id);

    if (user) {
      if (user.roomId !== roomId) {
        socket.leave(user.roomId);
        Users.users = Users.users.map((item) => {
          if (item.id === user.id) {
            return {
              ...item,
              roomId
            };
          }

          return item;
        });

        socket.join(roomId);
      }
    } else {
      Users.setUsers({ id: socket.id, roomId, userName }); // Add id: socket.id to identify users uniquely
      socket.join(roomId);
    }

    socket.on('sendMessage', (message) => {
      console.log(socket.rooms, message);
      io.to(message.roomId).emit('receiveMessage', { message });
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

  socket.on('disconnect', () => {
    console.log('User disconnected');
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
