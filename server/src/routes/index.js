import { Router } from 'express';
import userRoutes from './userRoutes.js';
import messageRoutes from './messageRoutes.js';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).send('Api running.');
});

router.use('/api/user', userRoutes);
router.use('/api/message', messageRoutes);

export default router;
