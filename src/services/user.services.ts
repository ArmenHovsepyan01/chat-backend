import { User } from '../database/models/user.model';
import { ObjectId } from 'mongodb';
import { Rooms } from '../database/models/room.model';

async function getAllUsers() {
  try {
    return await User.find({});
  } catch (e) {
    throw new Error(e);
  }
}

async function deleteUser(userName: string) {
  try {
    await User.findOneAndDelete({ userName });
  } catch (e) {
    throw new Error(e);
  }
}

async function addUser(userName: string, roomId?: string) {
  try {
    return await User.create({ userName, roomId });
  } catch (e) {
    throw new Error(e);
  }
}

async function findUser(userName: string) {
  try {
    return await User.findOne({ userName }).populate('roomId', '_id');
  } catch (e) {
    throw new Error(e);
  }
}

async function updateUserRoom(id: ObjectId, roomId: string) {
  try {
    return await User.findByIdAndUpdate(id, { roomId }, { new: true });
  } catch (e) {
    throw new Error(e);
  }
}

async function leaveRoom(userName: string, roomId: string) {
  try {
    console.log(userName, roomId);
    const updatedUser = await User.findOneAndUpdate({ userName }, { roomId: null }, { new: true });

    await Rooms.findByIdAndUpdate(roomId, { $pull: { users: updatedUser._id } });
  } catch (e) {
    throw new Error(e);
  }
}

export default {
  findUser,
  addUser,
  deleteUser,
  getAllUsers,
  updateUserRoom,
  leaveRoom
};
