import { AppDataSource } from '@/data-source'

import { Room } from '@/entity/Room'
import RoomInfo from '@/service/data/RoomInfo'
import { Repository } from 'typeorm'

export default class RoomMapper {
  private static roomRepository: Repository<Room> = AppDataSource.getRepository(Room)

  public static async getRoomById(id: number): Promise<Room> {
    const room = await this.roomRepository.findOneBy({ id: id })

    console.log('RoomMapper getRoomById', room)
    return room
  }
  public static async getRoomByAlias(alias: string): Promise<Room> | null {
    const room = await this.roomRepository.findOneBy({ alias: alias })

    console.log('RoomMapper getRoomByAlias', room)
    return room
  }

  public static async createRoom(roomInfo: RoomInfo): Promise<Room> | null {
    const newRoom = new Room()
    newRoom.alias = roomInfo.alias
    newRoom.owner = roomInfo.owner

    console.log('RoomMapper createRoom', newRoom)
    return newRoom
  }

  public static async dissolveRoomById(id: number): Promise<Room> | null {
    const room = await this.roomRepository.findOneBy({ id: id })

    return await this.roomRepository.remove(room)
  }

  public static async dissolveRoomByAlias(alias: string): Promise<Room> | null {
    const room = await this.roomRepository.findOneBy({ alias: alias })

    return await this.roomRepository.remove(room)
  }
}
