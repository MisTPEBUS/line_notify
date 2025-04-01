import { NextFunction, Request, Response } from 'express';
import handleErrorAsync from '../middleware/handleErrorAsync';

import { UserRepo } from '../repo/user.repo';
import { Success } from '../utils/appResponse';
import { sendMsgServiceV2 } from '../service/lineService';
import { MsgRecordsRepo } from '../repo/msgRecord.repo';
import { ErrorCode, ErrorStatus } from '../utils/errorCode';

export const sendMsgController = {
  sendMsg: handleErrorAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { company, dept, job, empId, message, requireConfirmation, channelId } = req.body;
    // 依據條件取得目標成員資料
    let condition = '';
    const cmpName = company === 'T' ? '臺北客運' : company === 'C' ? '首都客運' : '';
    if (company) condition = `company = ${cmpName};`;
    if (dept) condition = condition + `dept = ${dept};`;
    if (job) condition = condition + `job = ${job};`;
    if (empId) condition = condition + `empId = ${empId};`;

    const msgGroup = await UserRepo.findUsersByField({ channelId, dept, job, empId });
    let successCount: number = 0;
    let failMember: string[] = [];
    console.log(msgGroup);
    // 逐一發送訊息，統計成功/失敗
    for (const user of msgGroup) {
      try {
        // 假設 sendMsgToUser 為發送訊息給單一使用者的 service 函式
        await sendMsgServiceV2(user.userId, user.channelId, message);
        await MsgRecordsRepo.createMsgRecords({
          company: cmpName,
          user_id: user.userId,
          message,
          status: ErrorStatus[ErrorCode.SUCCESS],
        });
        successCount++;
      } catch (error) {
        console.error(`發送訊息給 ${user.userId} 失敗`, error);
        await MsgRecordsRepo.createMsgRecords({
          company: cmpName,
          user_id: user.userId,
          message,
          status: ErrorStatus[ErrorCode.BAD_REQUEST],
        });
        failMember.push(user.name);
      }
    }

    Success(res, {
      channelId,
      condition,
      totalUsers: msgGroup.length,
      successCount,
      failMember,
    });
  }),
};
