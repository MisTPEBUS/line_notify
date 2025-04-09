import { NextFunction, Request, Response } from 'express';
import handleErrorAsync from '../middleware/handleErrorAsync';
import { Success, appError } from '../utils/appResponse';
import logger from '../utils/logger';

import { CheckUserType, UserRepo, createUserType } from '../repo/user.repo';
import { sendMsgServiceV2 } from '../utils/service/lineService';
import { msgResponse } from '../utils/msgResponse';

export const UserController = {
  getUserByLineUserId: handleErrorAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { userId, channelId, menu }: CheckUserType & { menu: string } = req.body;
    const resData = await UserRepo.getUserByUserId({ userId, channelId });
    logger.info(`resData POST: ${req.path}`);
    console.log(1222);
    Success(res, { ...resData, menu });
  }),
  getAllByChannelId: handleErrorAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const { channelId } = req.params;
    const resData = await UserRepo.getUserByChannelId(channelId);
    logger.info(`resData GET: ${req.path}`);
    Success(res, resData);
  }),
  getAllFilter: handleErrorAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const { company, dept, job, empId, message, requireConfirmation, channelId } = req.body;
    // 依據條件取得目標成員資料
    let condition = '';
    const cmpName = company === 'T' ? '臺北客運' : company === 'C' ? '首都客運' : '';
    if (company) condition = `company = ${cmpName};`;
    if (dept) condition = condition + `dept = ${dept};`;
    if (job) condition = condition + `job = ${job};`;
    if (empId) condition = condition + `empId = ${empId};`;
    console.log(condition);

    const msgGroup = await UserRepo.findUsersByField({ company: cmpName, channelId, dept, job, empId });
    Success(res, msgGroup);
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
      console.log(data.userId);
      console.log(data.channelId);
      sendMsgServiceV2(data.userId, data.channelId, msgResponse.REGISTER);
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
    sendMsgServiceV2(userId, channelId, msgResponse.DELETE_ACCOUNT);

    logger.info(`resData GET: ${req.path}`);
    Success(res, '刪除成功', 200);
  }),
};
