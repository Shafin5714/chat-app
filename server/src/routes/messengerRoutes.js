import { Router } from 'express';
const router = Router();

import { getFriends } from '../controllers/messengerController.js';
import { protect } from '../middlewares/authMiddleware.js';

router.route('/friends').get(protect, getFriends);

export default router;
