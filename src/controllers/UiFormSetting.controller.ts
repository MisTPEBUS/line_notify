import { NextFunction, Request, Response } from 'express';
import handleErrorAsync from '../middleware/handleErrorAsync';
import { Success, appError, delSuccess } from '../utils/appResponse';
import logger from '../utils/logger';
import { ZodError } from 'zod';

import { UserRepo } from '../repo/user.repo';
import { DeptRepo } from '../repo/setting.repo';

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
  UiFormSetting: handleErrorAsync(async (req: Request, res: Response) => {
    const { channelId } = req.params;
    const resData = await DeptRepo.getDeptSelects(channelId);
    logger.info(`resData GET: ${req.path}`);
    Success(res, resData);
  }),
};
