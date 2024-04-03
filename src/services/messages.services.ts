import { Messages } from '../database/models/messages.model';
import { User } from '../database/models/user.model';

async function addMessage(userName: string, roomId: string, message: string) {
  try {
    const user = await User.findOne({ userName });

    const newMessage = await Messages.create({ user: user._id, roomId, message });

    await newMessage.populate('user', 'userName');

    return newMessage;
  } catch (e) {
    throw new Error(e);
  }
}

async function getRoomMessages(roomId: string) {
  try {
    return await Messages.find({ roomId }).populate('user', 'userName');
  } catch (e) {
    throw new Error(e);
  }
}

export default { addMessage, getRoomMessages };
