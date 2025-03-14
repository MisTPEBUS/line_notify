import { NextFunction, Request, Response } from 'express';
import handleErrorAsync from '../middleware/handleErrorAsync';
import { Success, appError } from '../utils/appResponse';
import logger from '../utils/logger';

import { CheckUserType, UserRepo, createUserType } from '../repo/user.repo';

export const UserController = {
  getUserByLineUserId: handleErrorAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { userId, channelId }: CheckUserType = req.body;
    const resData = await UserRepo.getUserByUserId({ userId, channelId });
    logger.info(`resData POST: ${req.path}`);
    console.log(1222);
    Success(res, resData);
  }),
  getAllByChannelId: handleErrorAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const { channelId } = req.params;
    const resData = await UserRepo.getUserByChannelId(channelId);
    logger.info(`resData GET: ${req.path}`);
    Success(res, resData);
  }),

  createUser: handleErrorAsync(async (req: Request, res: Response, next: NextFunction) => {
    const data: createUserType = req.body;
    const checkBeforeCreate = await UserRepo.getUserByUserId({ userId: data.userId, channelId: data.channelId });

    if (checkBeforeCreate) {
      return appError('使用者已經註冊', next, 409);
    }

    logger.info(`resData GET: ${req.path}`);
    //201;
    try {
      const newUser = await UserRepo.createUser({ ...data });
      Success(res, newUser);
    } catch (error) {
      if (error instanceof Error) {
        return appError(error.message, next, 400);
      } else {
        return appError('未知錯誤', next, 500);
      }
    }
  }),
  deleteUser: handleErrorAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { userId, channelId } = req.params;

    const exciption = await UserRepo.getUserByUserId({ userId, channelId });
    if (!exciption) {
      logger.info(`resData DELETE: ${req.path}`);
      return appError('ID不存在', next, 409);
    }
    await UserRepo.deleteUserByID({ userId, channelId });

    logger.info(`resData GET: ${req.path}`);
    Success(res, '刪除成功', 200);
  }),
};
