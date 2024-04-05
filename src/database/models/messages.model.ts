import mongoose from 'mongoose';

const messagesSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rooms',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: {
      type: String
    },
    type: {
      type: String,
      default: 'message'
    }
  },
  {
    timestamps: true
  }
);

export const Messages = mongoose.model('Messages', messagesSchema);
