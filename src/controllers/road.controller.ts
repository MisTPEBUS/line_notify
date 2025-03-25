import { NextFunction, Request, Response } from 'express';
import handleErrorAsync from '../middleware/handleErrorAsync';
import { Success, appError } from '../utils/appResponse';
import logger from '../utils/logger';

/* import { CheckUserType, UserRepo, createUserType } from '../repo/user.repo';
import { sendMsgServiceV2 } from '../service/lineService';
import { msgResponse } from '../utils/msgResponse'; */
import { RoadRepo, createRoadType } from '../repo/road.repo';

export const RoadController = {
  createRecord: handleErrorAsync(async (req: Request, res: Response, next: NextFunction) => {
    const data: createRoadType = req.body;
    /*  const checkBeforeCreate = await UserRepo.getUserByUserId({ userId: data.userId, channelId: data.channelId });

    if (checkBeforeCreate) {
      return appError('使用者已經註冊', next, 409);
    } */

    logger.info(`resData GET: ${req.path}`);
    //201;
    try {
      console.log(data);
      const newRoad = await RoadRepo.createRoad({ ...data });
      //sendMsgServiceV2(data.userId, data.channelId, msgResponse.REGISTER);
      Success(res, newRoad);
    } catch (error) {
      if (error instanceof Error) {
        return appError(error.message, next, 400);
      } else {
        return appError('未知錯誤', next, 500);
      }
    }
  }),
  getRecords: handleErrorAsync(async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`resData GET: ${req.path}`);
    //201;
    try {
      const RoadRecords = await RoadRepo.getAllRoad();

      Success(res, RoadRecords);
    } catch (error) {
      if (error instanceof Error) {
        return appError(error.message, next, 400);
      } else {
        return appError('未知錯誤', next, 500);
      }
    }
  }),
};
