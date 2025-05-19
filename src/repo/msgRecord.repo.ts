import { MsgRecord, Prisma } from '@prisma/client';
import prisma from '../prisma';
import { getUTC8DateTime } from '../utils/tools/dateToole';

export type msgRecords = MsgRecord;

export interface msgRecordsFilters {
  company?: string;
  dept?: string;
  sendAt?: string;
}

export type CreateMsgRecords = {
  company: string;
  user_id: string;
  groupCode?: string | null;
  message: string;
  status: string;
  dept: string;
  reported_at: Date | null; // ⬅ 可為 null 的時間型別
  has_reported: boolean;
};

export type updateMsgRecords = {
  company: string;
  user_id: string;
  groupCode?: string | null;
  message: string;
  status: string;
  dept: string;
  reported_at: Date | null; // ⬅ 可為 null 的時間型別
  has_reported: boolean;
};

export const MsgRecordsRepo = {
  /**
   * 取得單一 User 資料，包含關聯的 dept 與 msgRecords
   * @param id User 的 id
   */
  findMsgRecordsByField: async (filters: msgRecordsFilters): Promise<msgRecords[]> => {
    const query: Record<string, any> = {};

    if (filters.company) {
      query.company = filters.company;
    }

    if (filters.sendAt) {
      const startOfDay = new Date(filters.sendAt);
      const endOfDay = new Date(filters.sendAt);
      endOfDay.setHours(23, 59, 59, 999);

      query.sendAt = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    return await prisma.msgRecord.findMany({
      where: query,
    });
  },
  /**
   * 新增一筆 User 資料
   * @param data 要新增的 User 資料
   */
  createMsgRecord: async (
    data: Omit<CreateMsgRecords, 'reported_at' | 'has_reported' | 'sendAt'>,
  ): Promise<msgRecords> => {
    const dateNow = getUTC8DateTime().formatted;
    return await prisma.msgRecord.create({
      data: {
        ...data,
        reported_at: null,
        has_reported: false,
        sendAt: dateNow,
      },
    });
  },
  /**
   * 更新一筆 User 資料
   * @param data 要新增的 User 資料
   */
  updateMsgRecord: async (
    data: Pick<CreateMsgRecords, 'user_id' | 'groupCode'>,
  ): Promise<Prisma.BatchPayload | null> => {
    const dateNow = getUTC8DateTime().formatted;

    // 取得今天的起始與結束時間（UTC+8）
    const today = new Date(dateNow);
    today.setHours(0, 0, 0, 0);
    const endOfDay = new Date(dateNow);
    endOfDay.setHours(23, 59, 59, 999);

    return await prisma.msgRecord.updateMany({
      where: {
        user_id: data.user_id,
        groupCode: data.groupCode,
        createdAt: {
          gte: today,
          lte: endOfDay,
        },
      },
      data: {
        reported_at: dateNow,
        has_reported: true,
      },
    });
  },
  /**
   * 取資料
   */
  getMsgRecordsByDate: async (dateString: string): Promise<msgRecords[]> => {
    const inputDate = new Date(dateString); // 例如 '2025-05-19'

    const startOfDay = new Date(inputDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(inputDate);
    endOfDay.setHours(23, 59, 59, 999);

    return await prisma.msgRecord.findMany({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });
  },
};
