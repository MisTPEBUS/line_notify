import { NextFunction, Router } from 'express';
import { UserController } from '../../controllers/user.controller';
import { validateData } from '../../middleware/validateRequest';

import { createUserRequestSchema, isCheckRequestSchema } from '../../Validation/user.dto';
import axios from 'axios';

// Import the missing CheckUserType type
const webhookRouter = Router();

const replyWithSalaryCard = async (replyToken: string) => {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN_TP;

  const flexMessage = {
    type: 'flex',
    altText: '薪資單查詢結果',
    contents: {
      type: 'bubble',
      size: 'mega',
      body: {
        type: 'box',
        layout: 'vertical',
        spacing: 'md',
        contents: [
          {
            type: 'text',
            text: '📄 您的 2024 年 3 月薪資單已產生',
            weight: 'bold',
            size: 'lg',
            wrap: true,
          },
          {
            type: 'text',
            text: '🔐 密碼：abcd1234\n👉 點下方按鈕下載 PDF 檔案',
            size: 'sm',
            color: '#555555',
            wrap: true,
          },
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        contents: [
          {
            type: 'button',
            style: 'primary',
            color: '#1E88E5',
            action: {
              type: 'uri',
              label: '查看 PDF',
              uri: 'https://firebasestorage.googleapis.com/v0/b/fir-express-80358.appspot.com/o/sodu%2F%E5%AF%86%E7%A2%BCabcd1234.pdf?alt=media&token=01954d19-3ced-4fa6-9428-fd5a7b37a82a',
            },
          },
          {
            type: 'button',
            style: 'secondary',
            action: {
              type: 'message',
              label: '其他問題',
              text: '我有其他問題',
            },
          },
        ],
      },
    },
  };

  await axios.post(
    'https://api.line.me/v2/bot/message/reply',
    {
      replyToken,
      messages: [flexMessage],
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

webhookRouter.post('/', async (req, res, _next: NextFunction) => {
  const events = req.body.events;

  for (const event of events) {
    const message = event.message?.text;
    const replyToken = event.replyToken;
    const _userId = event.source?.userId;

    if (message === '/薪資查詢') {
      await replyWithSalaryCard(replyToken);
    }
  }

  res.status(200).send('OK');
});

export default webhookRouter;
