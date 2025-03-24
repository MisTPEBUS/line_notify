import { Router } from 'express';
import userRouter from './user/user.routes';
import configRouter from './user/config.routes';
import RoadRouter from './user/road.routes';

const router = Router();
// 前台
router.use('/user', userRouter);
router.use('/config', configRouter);
router.use('/roadRecord', RoadRouter);
router.use('/:chanelId/webhook', configRouter);

export default router;
