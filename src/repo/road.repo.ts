import prisma from '../prisma';

export interface Road {
  id: string;
  userId: string;
  groupCode?: string | null;
  company: string;
  channelId: string;
  lineName: string;
  carNo: string;
  status?: string | null;
  score: string[]; // 使用 `string[]` 而不是 `String[]`
  createdAt: Date;
  user_id: string;
}

export type createRoadType = {
  userId: string;
  user_id: string; // 關聯用
  groupCode?: string | null;
  company: string;
  channelId: string;
  status?: string | null;
  score: string[];
  lineName: string;
  carNo: string;
};
export const RoadRepo = {
  /**
   * 新增一筆 RoadRecord 資料
   * @param data 要新增的 RoadRecord 資料
   */
  createRoad: async (data: createRoadType): Promise<Road> => {
    return await prisma.roadRecord.create({
      data: {
        company: data.company,
        groupCode: data.groupCode,
        lineName: data.lineName,
        carNo: data.carNo,
        channelId: data.channelId,
        userId: data.userId, // 系統識別用（非關聯）
        user_id: data.user_id, // Prisma 關聯用外鍵
        status: data.status ?? null,
        score: Array.isArray(data.score) ? data.score.map((s) => s.toString()) : [],
      },
    });
  },
  getAllRoad: async (): Promise<Road[]> => {
    return (
      await prisma.roadRecord.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              company: true,
              channelId: true,
            },
          },
        },
      })
    ).map((road) => ({
      ...road,
      status: road.status ?? '', // 確保 status 為 string，避免 null 問題
    }));
  },
};
