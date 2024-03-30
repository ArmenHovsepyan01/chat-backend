import mongoose, { mongo } from 'mongoose';

const RoomSchema = new mongoose.Schema({
  roomId: {
    type: Number,
    unique: true,
    required: true
  },
  users: [
    {
      name: {
        type: String
      }
    }
  ],
  messages: [
    {
      userName: {
        type: String,
        required: true
      },
      message: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

export const Room = mongoose.model('Room', RoomSchema);
