import axios from 'axios';
import { createUserType } from '../repo/user.repo';

export const sendMsgService = async (user: createUserType, msg?: string) => {
  const CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN_TP;
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
      Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
    },
  });
};
