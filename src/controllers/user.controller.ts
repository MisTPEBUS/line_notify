import { Request, Response } from 'express';
import handleErrorAsync from '../middleware/handleErrorAsync';
import { Success } from '../utils/appResponse';
import logger from '../utils/logger';


import { CheckUserType } from '../Validation/lineHook.dto';
import { UserRepo, createUserType } from '../repo/user.repo';


export const UserController = {

  getUserByLineUserId:handleErrorAsync(async (req: Request, res: Response) => {
    const  { userId,channelId}:CheckUserType = req.body;
    const resData = await UserRepo.getUserByUserId({userId,channelId});
    logger.info(`resData GET: ${req.path}`);
    Success(res, resData);
  }),
  createUser:handleErrorAsync(async (req: Request, res: Response) => {
    const  data :createUserType = req.body;
    const resData = await UserRepo.getUserByUserId(data);
    logger.info(`resData GET: ${req.path}`);
    Success(res, resData);
  }),
  deleteUser: handleErrorAsync(async (req: Request, res: Response) => {
    const {user_id} = req.params;

    try {
      const deletedUser =await UserRepo.deleteUserByID(user_id); 
      Success(res,"刪除成功");
    } catch (error: any) {
      // 根據錯誤判斷
      if (error.code === 'P2025') {
        // Prisma 的 P2025 錯誤表示找不到紀錄
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
      // 其他錯誤
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }),
  
};
