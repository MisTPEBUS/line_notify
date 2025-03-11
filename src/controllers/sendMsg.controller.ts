import { NextFunction, Request, Response } from 'express';
import handleErrorAsync from '../middleware/handleErrorAsync';
import { Success, appError, delSuccess } from '../utils/appResponse';
import logger from '../utils/logger';


import { ZodError } from 'zod';

import { CheckUserType } from '../Validation/lineHook.dto';
import { UserRepo } from '../repo/user.repo';
import axios from 'axios';

// 請將下面的 YOUR_CHANNEL_ACCESS_TOKEN 替換為你從 LINE Developers 取得的存取權杖


// 這是你要發送訊息的對象（通常為使用者的 ID）
const USER_ID = 'U75e1554845bd81cba2151682ee99363d';

const messageData = {
    to: USER_ID,
    messages: [
      {
        type: "text",
        text: "Hello, this is a test message from LINE API!"
      }
    ]
  };

export const sendMsgController = {

  sendMsg:handleErrorAsync(async (req: Request, res: Response) => {
    const CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  console.log(CHANNEL_ACCESS_TOKEN);
    // 這裡提供的資訊
    const channelId = "2006992891";
    const userId = "U77bc55ff44a63d93b88e891780b6c04f";
    
    // 將資訊組合成要發送的訊息內容
    const messageText = `Channel ID: ${channelId}\nUser ID: ${userId}`;
    
    // 建立 push message 的資料結構
    const data = {
      to: userId,
      messages: [
        {
          type: "text",
          text: messageText
        }
      ]
    };
   
    try {
      const response = await axios.post('https://api.line.me/v2/bot/message/push', data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`
        }
      });
      res.status(200).json({
        success: true,
        message: 'Message sent successfully!',
        data: response.data
      });
    } catch (error: any) {
      console.error('Error sending message:', error.response ? error.response.data : error.message);
      res.status(500).json({
        success: false,
        error: error.response ? error.response.data : error.message
      });
    }
  })
 

};
