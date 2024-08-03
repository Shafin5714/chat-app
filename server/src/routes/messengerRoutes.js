import { Router } from 'express';
const router = Router();

import {
  getFriends,
  sendMessage,
  getMessage,
  sendImage,
} from '../controllers/messengerController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { uploadSingleImage } from '../middlewares/fileUploadMiddleware.js';

router.route('/friends').get(protect, getFriends);
router.route('/send-message').post(protect, sendMessage);
router.route('/message/:id').get(protect, getMessage);
router.route('/send-image').post(protect, uploadSingleImage, sendImage);

export default router;
