import { z } from 'zod';

export const sendMsgQuerySchema = z.object({
  company: z.string().optional().nullable(), // ✅ 可以為 undefined 或 null，但如果有值要是 string
  sendAt: z.string().optional().nullable(),
});
