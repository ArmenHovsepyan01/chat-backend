import { Rooms } from '../database/models/room.model';
import { ObjectId } from 'mongodb';

async function getAllRooms() {
  try {
    return await Rooms.find({});
  } catch (e) {
    throw new Error(e);
  }
}

async function createRoom(name: string) {
  try {
    return await Rooms.create({ name });
  } catch (e) {
    throw new Error(e);
  }
}

async function addUser(id: ObjectId, userId: ObjectId) {
  try {
    await Rooms.findByIdAndUpdate(id, { $push: { users: userId } });
  } catch (e) {
    throw new Error(e);
  }
}

export default { getAllRooms, createRoom, addUser };
