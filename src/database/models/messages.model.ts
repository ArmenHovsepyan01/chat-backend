import mongoose from 'mongoose';

const messagesSchema = new mongoose.Schema(
  {
    roomId: {
      type: Number,
      required: true
    },
    userName: {
      type: String,
      ref: 'User'
    },
    message: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

export const Messages = mongoose.model('Messages', messagesSchema);
