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

export default { get };
