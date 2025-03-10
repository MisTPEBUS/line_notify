import { z } from 'zod';
/**
 * 定義 lineHook 資料驗證的 Schema。
 *
 * 此模式用於驗證與 lineHook 相關的資料結構，包含：
 * - name: string必填。
 * - credit_amount: 必須為一個正整數。
 * - price: 必須為一個正整數。
 */
export const lineHookSchema = z.object({
  id: z.string().uuid({ message: 'ID錯誤,請輸入正確格式' }),
  company: z.string(),
  groupCode: z.string(),
  phone: z.string(),
  job: z.string(),
  dept: z.string(),
  empId: z.string(),
  name: z.string(),
  userId: z.string(),
  insert_at: z.string(),
});

export default {
  lineHookSchema,
};
