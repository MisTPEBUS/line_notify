import { Dept } from '@prisma/client';
import prisma from '../prisma';

export type DeptSelectType = {
  value: string;
  text: string;
};

export const DeptRepo = {
  /**
   * 根據 channelId 撈取所有 Dept 資料並轉換成下拉選單格式
   * @param channelId Dept 的 channelId
   */
  getDeptSelects: async (
    channelId: string
  ): Promise<DeptSelectType[]> => {
    const depts = await prisma.dept.findMany({
      where: { channelId },
      select: {
        id: true,
        deptCode: true,
        name: true,
      },
    });

    return depts.map((dept) => ({
      value: dept.id,
      text: `${dept.deptCode}-${dept.name}`,
    }));
  },
};
