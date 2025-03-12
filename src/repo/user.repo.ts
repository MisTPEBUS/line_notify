import prisma from '../prisma';

import { User } from '@prisma/client';

export type CheckUserType = Pick<User, 'userId' | 'channelId'>;
export type createUserType = Omit<User, 'id'>;

export const UserRepo = {
  /**
   * 取得單一 User 資料，包含關聯的 dept 與 msgRecords
   * @param id User 的 id
   */
  getUserByChannelId: async (channelId: string) => {
    return await prisma.user.findFirst({
      where: { channelId },
      include: {
        dept: true,
        msgRecords: true,
      },
    });
  },
  getUserByUserId: async (CheckUser: CheckUserType): Promise<User | null> => {
    return await prisma.user.findFirst({
      where: { userId: CheckUser.userId, channelId: CheckUser.channelId },
      include: {
        dept: true,
        msgRecords: true,
      },
    });
  },

  /**
   * 取得所有 User 資料
   */
  getAllUsers: async (): Promise<User[]> => {
    return await prisma.user.findMany({
      include: {
        dept: true,
        msgRecords: true,
      },
    });
  },

  /**
   * 新增一筆 User 資料
   * @param data 要新增的 User 資料
   */
  createUser: async (data: createUserType): Promise<User> => {
    return await prisma.user.create({
      data,
    });
  },

  /**
   * 更新指定 id 的 User 資料
   * @param id 要更新的 User id
   * @param data 更新內容
   */
  updateUser: async (id: string, data: Partial<Omit<User, 'id'>>): Promise<User> => {
    return await prisma.user.update({
      where: { id },
      data,
    });
  },

  /**
   * 註銷刪除指定 id 的 User 資料
   * @param id 要刪除的 User id
   */
  deleteUserByID: async (userId: string): Promise<User> => {
    return await prisma.user.delete({
      where: { userId },
    });
  },
};
