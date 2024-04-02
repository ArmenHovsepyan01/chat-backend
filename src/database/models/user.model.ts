import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    unique: true,
    required: true
  },
  roomId: {
    type: String,
    required: true
  }
});

export const User = mongoose.model('User', UserSchema);
