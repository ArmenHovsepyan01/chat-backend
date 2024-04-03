import { Router } from 'express';
import roomsController from '../controllers/rooms.controller';

const router = Router();

router.route('/rooms').get(roomsController.get);
router.route('/rooms').post(roomsController.create);

export default router;
