import connectDB from '../config/connect.js';
import { Rooms } from '../models/room.model.js';

const rooms = [
  {
    name: 'First Room'
  },
  {
    name: 'Second Room'
  },
  {
    name: 'Third Room'
  }
];

export async function addRooms() {
  try {
    await connectDB();
    const res = await Rooms.insertMany(rooms);

    console.log(res);
  } catch (e) {
    throw new Error(e);
  }
}
