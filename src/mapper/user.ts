import { AppDataSource } from '@/data-source'

import { User } from '@/entity/User'
import UserInfo from '@/service/data/UserInfo'
import { Repository } from 'typeorm'

export default class UserMapper {
  private static userRepository: Repository<User> = AppDataSource.getRepository(User)
  public static async getUsers(): Promise<User[]> {
    // const userRepository = AppDataSource.getRepository(User)
    const users = await UserMapper.userRepository.find()

    console.log('UserMapper getUsers', users)
    return users
  }

  public static async getUserById(id: number): Promise<User> | null {
    // const userRepository = AppDataSource.getRepository(User)
    const user = await UserMapper.userRepository.findOneBy({ id: id })

    console.log('UserMapper getUserDetail', user)
    return user
  }

  public static async getUserByEmail(email: string): Promise<User> | null {
    // const userRepository = AppDataSource.getRepository(User)
    const user = await UserMapper.userRepository.findOneBy({ email: email })

    console.log('UserMapper getUserByEmail', user)
    return user
  }

  public static async getUserByEmailWhenLogin(email: string): Promise<User> | null {
    // const userRepository = AppDataSource.getRepository(User)
    const user = await UserMapper.userRepository
      .createQueryBuilder()
      .where({ email: email })
      .addSelect('User.password') // 选择密码字段
      .getOne()

    console.log('UserMapper getUserByEmail', user)
    return user
  }

  public static async createUser(userInfo: UserInfo): Promise<User> | null {
    // const userRepository = AppDataSource.getRepository(User)
    const user = new User()
    user.name = userInfo.name
    user.email = userInfo.email
    user.password = userInfo.password
    user.role = 'normal'

    return await UserMapper.userRepository.save(user)
  }

  public static async updateUser(user: User, userInfo: UserInfo): Promise<User> | null {
    // const userRepository = AppDataSource.getRepository(User)
    user.name = userInfo.name
    user.email = userInfo.email
    user.password = userInfo.password

    return await UserMapper.userRepository.save(user)
  }

  public static async deleteUser(id: number) {
    // const userRepository = AppDataSource.getRepository(User)
    const deletedUser = await UserMapper.userRepository.findOneBy({ id: id })

    return await UserMapper.userRepository.remove(deletedUser)
  }
}
