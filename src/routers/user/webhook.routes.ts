import { NextFunction, Router } from 'express';
import axios from 'axios';

const webhookRouter = Router();

const LINE_API = 'https://api.line.me/v2/bot/message/reply';
const token = process.env.LINE_CHANNEL_ACCESS_TOKEN_TP;

// 1️⃣ 薪資卡片
const salaryCardMessage = {
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

// 2️⃣ 三個月份按鈕（Quick Reply 版本）
const monthSelectorMessage = {
  type: 'text',
  text: '請選擇想查詢的月份 👇',
  quickReply: {
    items: [
      {
        type: 'action',
        action: {
          type: 'message',
          label: '三月',
          text: '/薪資查詢 三月',
        },
      },
      {
        type: 'action',
        action: {
          type: 'message',
          label: '二月',
          text: '/薪資查詢 二月',
        },
      },
      {
        type: 'action',
        imageUrl: 'https://storage.googleapis.com/你的icon連結.png',
        action: {
          type: 'location',
          label: '傳送位置',
        },
      },
    ],
  },
};

webhookRouter.post('/', async (req, res, _next: NextFunction) => {
  const events = req.body.events;

  for (const event of events) {
    const message = event.message?.text;
    const replyToken = event.replyToken;

    if (message?.startsWith('/薪資查詢')) {
      await axios.post(
        LINE_API,
        {
          replyToken,
          messages: [salaryCardMessage, monthSelectorMessage],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
    }
  }

  res.status(200).send('OK');
});

export default webhookRouter;
