import { z } from 'zod';
/**
 * 定義 lineHook 資料驗證的 Schema。
 *
 * 此模式用於驗證與 lineHook 相關的資料結構，包含：
 * - name: string必填。
 * - credit_amount: 必須為一個正整數。
 * - price: 必須為一個正整數。
 */
export const userSchema = z.object({
  id: z.string({
    required_error: 'id 為必填',
    invalid_type_error: 'id 必須是字串',
  }),
  company: z.string({
    required_error: 'company 為必填',
    invalid_type_error: 'company 必須是字串',
  }),
  groupCode: z
    .string({
      invalid_type_error: 'groupCode 必須是字串',
    })
    .optional(),
  phone: z
    .string({
      invalid_type_error: 'phone 必須是字串',
    })
    .optional(),
  job: z
    .string({
      invalid_type_error: 'job 必須是字串',
    })
    .optional(),
  dept: z.string({
    required_error: 'dept 為必填',
    invalid_type_error: 'dept 必須是字串',
  }),

  empId: z.string({
    required_error: 'empId 為必填',
    invalid_type_error: 'empId 必須是字串',
  }),
  name: z.string({
    required_error: 'name 為必填',
    invalid_type_error: 'name 必須是字串',
  }),
  channelId: z.string({
    required_error: 'channelId 為必填',
    invalid_type_error: 'channelId 必須是字串',
  }),
  userId: z.string({
    required_error: 'userId 為必填',
    invalid_type_error: 'userId 必須是字串',
  }),
  insertedAt: z.date({
    required_error: 'insertedAt 為必填',
    invalid_type_error: 'insertedAt 必須是日期',
  }),
});

export const isCheckRequestSchema = userSchema.pick({ userId: true, channelId: true });
export const createUserRequestSchema = userSchema.omit({ id: true, insertedAt: true });

export type CreteUserType = z.infer<typeof userSchema>;
export type createUserRequestSchemaType = z.infer<typeof createUserRequestSchema>;

export default {
  userSchema,
  createUserRequestSchema,
};
