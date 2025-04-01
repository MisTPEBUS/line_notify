import { MsgRecord } from '@prisma/client';
import prisma from '../prisma';
import { getUTC8DateTime } from '../utils/tools/dateToole';

export type msgRecords = MsgRecord;

export interface msgRecordsFilters {
  company?: string;
  dept?: string;
  empId?: string;
  job?: string;
  channelId?: string;
}

export type createMsgRecords = {
  company: string;
  user_id: string;
  groupCode?: string | null; // ⬅ 明確標示為 optional
  message: string;
  status: string;
};
export const MsgRecordsRepo = {
  /**
   * 取得單一 User 資料，包含關聯的 dept 與 msgRecords
   * @param id User 的 id
   */
  findMsgRecordsByField: async (filters: msgRecordsFilters): Promise<msgRecords[]> => {
    // 建立動態查詢條件
    const query: Record<string, any> = {};
    if (filters.company) query.company = filters.company;
    if (filters.dept) query.dept = filters.dept;
    if (filters.empId) query.empId = filters.empId;
    if (filters.job) query.job = filters.job;
    if (filters.channelId) query.channelId = filters.channelId;
    return await prisma.msgRecord.findMany({
      where: query,
    });
  },
  /**
   * 新增一筆 User 資料
   * @param data 要新增的 User 資料
   */
  createMsgRecords: async (data: createMsgRecords): Promise<msgRecords> => {
    const dateNow = getUTC8DateTime().formatted;
    return await prisma.msgRecord.create({
      data: {
        ...data,
        sendAt: dateNow,
      },
    });
  },
};
