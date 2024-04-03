import mongoose from 'mongoose';

const RoomsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
});

export const Rooms = mongoose.model('Rooms', RoomsSchema);
