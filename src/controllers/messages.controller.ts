import messagesServices from '../services/messages.services';
import { Request, Response } from 'express';

async function get(req: Request, res: Response) {
  try {
    const { id: roomId } = req.params;
    const messages = await messagesServices.getRoomMessages(roomId);

    res.json({
      message: 'Got all messages successfully.',
      data: messages
    });
  } catch (e) {
    res.status(400).json({
      message: `Bad request, ${e}`
    });
  }
}

export default { get };
