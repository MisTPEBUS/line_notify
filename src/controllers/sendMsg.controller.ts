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
    const cmpName = company ?? '';
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
        await MsgRecordsRepo.createMsgRecord({
          company: user.company,
          user_id: user.userId,
          groupCode: groupCode ?? '營收通知系統',
          message,
          dept: user.dept,

          status: ErrorStatus[ErrorCode.SUCCESS],
        });
        successCount++;
      } catch (error) {
        console.error(`發送訊息給 ${user.userId} 失敗`, error);
        await MsgRecordsRepo.createMsgRecord({
          company: cmpName,
          user_id: user.userId,
          message,
          dept: user.dept,
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
      const cmpName = company ?? '';
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
          if (type === 'notify') {
            await sendMsgServiceV4(user.userId, user.channelId, message, user.company, user.dept, '營收比對');
          } else {
            await sendMsgServiceV3(user.userId, user.channelId, message);
          }
          await MsgRecordsRepo.createMsgRecord({
            company: user.company,
            user_id: user.userId,
            dept: user.dept,
            message: message,
            groupCode: groupCode ?? '營收訊息通報',
            status: ErrorStatus[ErrorCode.SUCCESS],
          });
          successCount++;
        } catch (error) {
          console.error(`發送訊息給 ${user.userId} 失敗`, error);
          await MsgRecordsRepo.createMsgRecord({
            company: cmpName,
            dept: user.dept,
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
  getAllByDate: handleErrorAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { date } = req.query;

    // 你也可以明確指定型別：
    const query = req.query as {
      date?: string;
      company?: string;
      system?: string;
    };

    const filterData = await MsgRecordsRepo.getMsgRecordsByDate(query.date as string);
    Success(res, filterData);
  }),
};
