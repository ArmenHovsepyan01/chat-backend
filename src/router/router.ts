import { Router } from 'express';
import roomsController from '../controllers/rooms.controller';
import messagesController from '../controllers/messages.controller';

const router = Router();

router.route('/rooms').get(roomsController.get);
router.route('/rooms').post(roomsController.create);
router.route('/messages/:id').get(messagesController.get);

export default router;
