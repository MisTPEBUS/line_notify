import { z } from 'zod';

export const roadSchema = z.object({
  id: z.string().optional(), // optional 只是保留型別一致性
  company: z.string({
    required_error: 'company 為必填',
    invalid_type_error: 'company 必須是字串',
  }),
  groupCode: z.string().optional(),

  lineName: z.string({
    required_error: 'lineName 為必填',
    invalid_type_error: 'lineName 必須是字串',
  }),

  carNo: z.string({
    required_error: 'carNo 為必填',
    invalid_type_error: 'carNo 必須是字串',
  }),

  channelId: z.string({
    required_error: 'channelId 為必填',
    invalid_type_error: 'channelId 必須是字串',
  }),

  userId: z.string({
    required_error: 'userId 為必填',
    invalid_type_error: 'userId 必須是字串',
  }),

  user_id: z.string({
    required_error: 'user_id 為必填',
    invalid_type_error: 'user_id 必須是字串(UUID)',
  }),

  status: z.string().nullable().optional(),

  score: z
    .array(
      z.string({
        invalid_type_error: 'score 項目必須是字串',
      }),
      {
        required_error: 'score 為必填',
      },
    )
    .min(1, '至少需要一個 score 項目'),

  createdAt: z.date().optional(), // Prisma 預設會產生
});

export const createRoadRequestSchema = roadSchema.omit({
  id: true,
  createdAt: true,
});
