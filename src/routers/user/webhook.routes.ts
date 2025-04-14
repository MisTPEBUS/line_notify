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
    altText: '薪資單 PDF 測試',
    contents: {
      type: 'bubble',
      hero: {
        type: 'image',
        url: 'https://cdn-icons-png.flaticon.com/512/337/337946.png',
        size: 'full',
        aspectRatio: '16:9',
        aspectMode: 'cover',
      },
      body: {
        type: 'box',
        layout: 'vertical',
        spacing: 'md',
        contents: [
          {
            type: 'text',
            text: '3月薪資單 PDF 測試',
            weight: 'bold',
            size: 'lg',
            wrap: true,
          },
          {
            type: 'text',
            text: '資訊中心－Lobinda',
            size: 'sm',
            color: '#999999',
            wrap: true,
          },
          {
            type: 'text',
            text: '密碼：abcd1234',
            size: 'sm',
            color: '#999999',
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
            color: '#0D99FF',
            action: {
              type: 'uri',
              label: '查看 PDF',
              uri: 'https://firebasestorage.googleapis.com/v0/b/fir-express-80358.appspot.com/o/sodu%2F%E5%AF%86%E7%A2%BCabcd1234.pdf?alt=media&token=01954d19-3ced-4fa6-9428-fd5a7b37a82a',
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
