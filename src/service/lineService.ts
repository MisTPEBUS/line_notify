import axios from 'axios';
import { createUserType } from '../repo/user.repo';

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

export const sendMsgService = async (user: createUserType, channelId: string, msg?: string) => {
  let token =
    company === 'T' ? (process.env.LINE_CHANNEL_ACCESS_TOKEN_TP ? process.env.LINE_CHANNEL_ACCESS_TOKEN_CP : '') : '';

  const configMapping = {
    88764: process.env.LINE_CHANNEL_ACCESS_TOKEN_TP,
  };
  const messageText = msg ?? '這是一則範例訊息';

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
