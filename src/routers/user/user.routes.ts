import { Router } from 'express';
import { UserController } from '../../controllers/user.controller';
import { validateData } from '../../middleware/validateRequest';

import { createUserRequestSchema, isCheckRequestSchema } from '../../Validation/user.dto';

// Import the missing CheckUserType type
const userRouter = Router();

userRouter.post('/checkUser', validateData(isCheckRequestSchema, 'body'), UserController.getUserByLineUserId);
//註冊
userRouter.post('/', validateData(createUserRequestSchema, 'body'), UserController.createUser);
//註冊取消
userRouter.delete('/:channelId/:userId', validateData(isCheckRequestSchema, 'params'), UserController.deleteUser);
/*
userRouter.get('/getUser/:userId');
userRouter.post('/sendMsg', sendMsgController.sendMsg);
userRouter.post('/sendMsgToGrop'); */

export default userRouter;
