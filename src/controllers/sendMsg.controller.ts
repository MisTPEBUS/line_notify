import { NextFunction, Request, Response } from 'express';
import handleErrorAsync from '../middleware/handleErrorAsync';

import { UserRepo } from '../repo/user.repo';
import { Success } from '../utils/appResponse';
import { sendMsgServiceV2, sendMsgServiceV3, sendMsgServiceV4 } from '../utils/service/lineService';
import { MsgRecordsRepo } from '../repo/msgRecord.repo';
import { ErrorCode, ErrorStatus } from '../utils/errorCode';
import { getUTC8DateTime } from '../utils/tools/dateToole';

export const sendMsgController = {
  sendMsg: handleErrorAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { company, dept, job, empId, message, requireConfirmation, channelId, groupCode } = req.body;
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
          company: user.company,
          user_id: user.userId,
          message,
          groupCode: groupCode ?? '營收通知系統',
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
  sendMsgByCard: (type: string = '') =>
    handleErrorAsync(async (req: Request, res: Response, next: NextFunction) => {
      const { company, dept, job, empId, message, requireConfirmation, channelId, groupCode } = req.body;
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
          if (type === 'notify') {
            await sendMsgServiceV4(user.userId, user.channelId, message);
          } else {
            await sendMsgServiceV3(user.userId, user.channelId, message);
          }

          await MsgRecordsRepo.createMsgRecords({
            company: user.company,
            user_id: user.userId,
            message: '薪資單測試',
            groupCode: groupCode ?? 'PDF讀取測試',
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
  getAll: handleErrorAsync(async (req: Request, res: Response, next: NextFunction) => {
    const dateNow = getUTC8DateTime();
    const sendAt =
      (req.query.sendAt as string) ??
      `${dateNow.year}-${dateNow.month}-${dateNow.date} ${dateNow.hour}:${dateNow.minute}`;
    const company = req.query.company as string;
    const filterData = await MsgRecordsRepo.findMsgRecordsByField({
      company,
      sendAt,
    });
    Success(res, filterData);
  }),
};
