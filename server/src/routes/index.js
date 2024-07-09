import { Router } from 'express';
import userRoutes from './userRoutes.js';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).send('Api running.');
});

router.use('/api/user', userRoutes);

export default router;
