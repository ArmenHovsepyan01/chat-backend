import { User } from '../database/models/user.model';
import { ObjectId } from 'mongodb';

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

async function addUser(userName: string, roomId: string) {
  try {
    return await User.create({ userName, roomId });
  } catch (e) {
    throw new Error(e);
  }
}

async function findUser(userName: string) {
  try {
    return await User.findOne({ userName });
  } catch (e) {
    throw new Error(e);
  }
}

async function updateUserRoom(id: ObjectId, roomId: string) {
  try {
    return await User.findByIdAndUpdate(id, { roomId });
  } catch (e) {
    throw new Error(e);
  }
}

export default {
  findUser,
  addUser,
  deleteUser,
  getAllUsers,
  updateUserRoom
};
