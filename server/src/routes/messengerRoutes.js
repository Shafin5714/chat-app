import { Router } from 'express';
const router = Router();

import {
  getFriends,
  sendMessage,
  getMessage,
} from '../controllers/messengerController.js';
import { protect } from '../middlewares/authMiddleware.js';

router.route('/friends').get(protect, getFriends);
router.route('/send-message').post(protect, sendMessage);
router.route('/message/:id').get(protect, getMessage);

export default router;
