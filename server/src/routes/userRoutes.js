import { Router } from 'express';
const router = Router();

import { registerUser } from '../controllers/userController.js';
import { uploadSingleImage } from '../middlewares/fileUploadMiddleware.js';

router.route('/register').post(uploadSingleImage, registerUser);

export default router;
