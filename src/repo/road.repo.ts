import prisma from '../prisma';

export interface Road {
  id: string;
  userId: string;
  groupCode?: string | null;
  company: string;
  channelId: string;
  status: string;
  score: string[]; // 使用 `string[]` 而不是 `String[]`
  createdAt: Date;
  user_id: string;
}

export type createRoadType = Omit<Road, 'id' | 'createdAt'>;
export const RoadRepo = {
  /**
   * 新增一筆 RoadRecord 資料
   * @param data 要新增的 RoadRecord 資料
   */
  createRoad: async (data: createRoadType): Promise<Road> => {
    return await prisma.roadRecord.create({
      data: {
        ...data,
        score: data.score.map((s) => s.toString()), // 確保 score 陣列內的元素是 string
      },
    });
  },
  getAllRoad: async (): Promise<Road[]> => {
    return (await prisma.roadRecord.findMany()) ?? [];
  },
};
