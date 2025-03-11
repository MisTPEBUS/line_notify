import { Router } from 'express';
import userRouter from './user/user.routes';
import configRouter from './user/config.routes';



const router = Router();
// 前台
router.use('/user', userRouter );
router.use('/config',configRouter)


export default router;
