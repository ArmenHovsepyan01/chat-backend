import { Messages } from '../database/models/messages.model';
import { User } from '../database/models/user.model';

async function addMessage(userName: string, roomId: string, message: string) {
  try {
    //  TODO:get user id instead of username

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
    if (!roomId) throw new Error('Room id is missing.');

    return await Messages.find({ roomId }).populate('user', 'userName');
  } catch (e) {
    throw new Error(e);
  }
}

export default { addMessage, getRoomMessages };
