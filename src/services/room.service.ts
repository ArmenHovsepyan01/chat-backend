import { Rooms } from '../database/models/room.model';

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

export default { getAllRooms, createRoom };
