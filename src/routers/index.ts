import { Router } from 'express';
import userRouter from './user/user.routes';
import configRouter from './user/config.routes';
import RoadRouter from './user/road.routes';

import sendMsgRouter from './user/sendMsg.routes';
import webhookRouter from './user/webhook.routes';

const router = Router();
// 前台
router.use('/user', userRouter);
router.use('/config', configRouter);
router.use('/roadRecord', RoadRouter);

router.use('/sendMsg', sendMsgRouter);
router.use('/webhook', webhookRouter);

export default router;
