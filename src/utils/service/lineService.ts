import axios from 'axios';
import { createUserType } from '../../repo/user.repo';
import { msgResponse } from '../msgResponse';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
export const sendMsgService = async (user: createUserType, company: string, msg?: string) => {
  let token =
    company === 'T' ? (process.env.LINE_CHANNEL_ACCESS_TOKEN_TP ? process.env.LINE_CHANNEL_ACCESS_TOKEN_CP : '') : '';

  const configMapping = {
    88764: process.env.LINE_CHANNEL_ACCESS_TOKEN_TP,
  };
  const messageText = msg ?? '這是一則範例訊息';
  console.log(123);
  const payload = {
    to: user.userId,
    messages: [
      {
        type: 'text',
        text: `\n${messageText}\n`,
      },
    ],
  };

  await axios.post('https://api.line.me/v2/bot/message/push', payload, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
};

export const sendMsgServiceV2 = async (userId: string, channelId: string, msg?: string) => {
  let token = process.env.LINE_CHANNEL_ACCESS_TOKEN_TP;

  const messageText = msg;

  const payload = {
    to: userId,
    messages: [
      {
        type: 'text',
        text: `\n${messageText}\n`,
      },
    ],
  };

  await axios.post('https://api.line.me/v2/bot/message/push', payload, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
};

export const sendMsgServiceV3 = async (userId: string, channelId: string, msg?: string) => {
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

  const payload = {
    to: userId,
    messages: [flexMessage],
  };

  await axios.post('https://api.line.me/v2/bot/message/push', payload, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
};
export const sendMsgServiceV4 = async (
  userId: string,
  channelId: string,
  msg: string = '',
  cmpName: string,
  deptName: string,
  title: string = '',
) => {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN_TP;
  const now = new Date(); // 或你自己的日期
  const formatted = formatInTimeZone(now, 'Asia/Taipei', 'yyyy-MM-dd HH:mm');

  const flexMessage = {
    type: 'flex',
    altText: `${title}通知`,
    contents: {
      type: 'bubble',
      header: {
        type: 'box',
        layout: 'horizontal',
        backgroundColor: '#00C300', // ✅ LINE 綠
        paddingAll: 'md',
        contents: [
          {
            type: 'box',
            layout: 'baseline',
            contents: [
              {
                type: 'icon',
                url: 'https://img.icons8.com/?size=100&id=ZRVMY0SUfdBx&format=png&color=000000',
                size: 'sm',
              },
              {
                type: 'text',
                text: `${title} 系統通知`,
                weight: 'bold',
                size: 'sm',
                margin: 'sm',
                color: '#FFFFFF',
                flex: 0,
              },
            ],
            flex: 1,
          },
          {
            type: 'text',
            text: `${formatted}`,
            size: 'xs',
            color: '#FFFFFF',
            align: 'end',
            gravity: 'center',
          },
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        spacing: 'md',
        contents: [
          {
            type: 'text',
            text: msg,
            size: 'md',
            weight: 'bold',
            wrap: true,
          },

          {
            type: 'text',
            text: `${cmpName}-${deptName}`,
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
            style: 'secondary',
            action: {
              type: 'postback',
              label: '點我回報確認',
              data: `action=confirm_report&channelId=${channelId}&system=${title}&company=${cmpName}&dept=${deptName}&userId=${userId}`,
            },
          },
        ],
      },
    },
  };

  const payload = {
    to: userId,
    messages: [flexMessage],
  };

  await axios.post('https://api.line.me/v2/bot/message/push', payload, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
};
