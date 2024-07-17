import { Router } from 'express';
import userRoutes from './userRoutes.js';
import messengerRoutes from './messengerRoutes.js';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).send('Api running.');
});

router.use('/api/user', userRoutes);
router.use('/api/messenger', messengerRoutes);

export default router;
