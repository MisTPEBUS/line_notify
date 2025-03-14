import { NextFunction, Request, Response } from 'express';
import handleErrorAsync from '../middleware/handleErrorAsync';

import axios from 'axios';
import { UserRepo } from '../repo/user.repo';
import { Success } from '../utils/appResponse';
import { sendMsgService } from '../service/lineService';

const USER_ID = 'U75e1554845bd81cba2151682ee99363d';

const messageData = {
  to: USER_ID,
  messages: [
    {
      type: 'text',
      text: 'Hello, this is a test message from LINE API!',
    },
  ],
};

export const sendMsgController = {
  sendMsg: handleErrorAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { company, dept, job, empId, message, requireConfirmation } = req.body;
    // 依據條件取得目標成員資料
    let condition = '';
    condition = company ?? condition + `company = ${company}`;
    condition = dept ?? condition + `company = ${dept}`;
    condition = job ?? condition + `company = ${job}`;
    condition = empId ?? condition + `company = ${empId}`;

    let channelId = company == 'T' ? '2007028490' : '2007028490';
    const msgGroup = await UserRepo.findUsersByField({ channelId, dept, job, empId });
    let successCount: number = 0;
    let failMember: string[] = [];
    console.log(msgGroup);
    // 逐一發送訊息，統計成功/失敗
    for (const user of msgGroup) {
      try {
        // 假設 sendMsgToUser 為發送訊息給單一使用者的 service 函式
        await sendMsgService(user, message);
        successCount++;
      } catch (error) {
        console.error(`發送訊息給 ${user.userId} 失敗`, error);
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
