import { Messages } from '../database/models/messages.model';

async function addMessage(userName: string, roomId: string, message: string) {
  try {
    return await Messages.create({ userName, roomId, message });
  } catch (e) {
    throw new Error(e);
  }
}

async function getRoomMessages(roomId: string) {
  try {
    return await Messages.find({ roomId });
  } catch (e) {
    throw new Error(e);
  }
}

export default { addMessage, getRoomMessages };
