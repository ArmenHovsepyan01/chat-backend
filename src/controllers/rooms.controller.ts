import { Response, Request } from 'express';
import roomService from '../services/room.service';

async function get(req: Request, res: Response) {
  try {
    const rooms = await roomService.getAllRooms();

    res.json({
      message: 'Successfully getted all rooms.',
      data: rooms
    });
  } catch (e) {
    res.status(400).json({
      message: `Something gone wrong, ${e}`
    });
  }
}

async function create(req: Request, res: Response) {
  try {
    const { name } = req.body;

    const room = await roomService.createRoom(name);

    res.json({
      message: 'You successfully create new room',
      data: room
    });
  } catch (e) {
    res.status(400).json({
      message: `Something gone wrong, ${e}`
    });
  }
}

export default { get, create };
