import { Router } from 'express';
const router = Router();

import { registerUser, authUser } from '../controllers/userController.js';
import { uploadSingleImage } from '../middlewares/fileUploadMiddleware.js';

router.route('/register').post(uploadSingleImage, registerUser);
router.route('/login').post(authUser);

export default router;
