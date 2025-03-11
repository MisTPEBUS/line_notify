import { NextFunction, Request, Response } from 'express';
import handleErrorAsync from '../middleware/handleErrorAsync';
import { Success, appError, delSuccess } from '../utils/appResponse';
import logger from '../utils/logger';
import { ZodError } from 'zod';
import { CheckUserType } from '../Validation/lineHook.dto';
import { UserRepo } from '../repo/user.repo';


export const UiFormSettingController = {

   /**
   * 取得單一 User 資料，包含關聯的 dept 與 msgRecords
   * @param id User 的 id
   */
/*    senMsg: async (userId: string): Promise<User | null>=> {
    return await prisma.user.findFirst({
      where: { userId:userId },
      include: {
        dept: true,
        msgRecords: true,
      },
    });
  }, */

  /**
   * 取得所有 User 資料
   */
  UiFormSettingController:handleErrorAsync(async (req: Request, res: Response) => {
    const  { userId,channelId}:CheckUserType = req.body;
    const resData = await UserRepo.getUserByUserId({userId,channelId});
    logger.info(`resData GET: ${req.path}`);
    Success(res, resData);
  })
 

};
