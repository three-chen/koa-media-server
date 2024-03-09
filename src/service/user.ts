import UserMapper from '@/mapper/user'

import { User } from '@/entity/User'
import UserInfo from '@/service/data/UserInfo'

export default class UserService {
  public static async getUsers(): Promise<User[]> {
    return await UserMapper.getUsers()
  }

  public static async getUserById(id: number): Promise<User> | null {
    return await UserMapper.getUserById(id)
  }

  public static async getUserByEmail(email: string): Promise<User> | null {
    return await UserMapper.getUserByEmail(email)
  }

  public static async getUserByEmailWhenLogin(email: string): Promise<User> | null {
    return await UserMapper.getUserByEmailWhenLogin(email)
  }

  public static async createUser(userInfo: UserInfo): Promise<User> | null {
    return await UserMapper.createUser(userInfo)
  }

  public static async updateUser(id: number, userInfo: UserInfo): Promise<User> | null {
    const user = await UserMapper.getUserById(id)
    if (user) {
      return await UserMapper.updateUser(user, userInfo)
    } else {
      return null
    }
  }

  public static async deleteUser(id: number) {
    return await UserMapper.deleteUser(id)
  }
}
