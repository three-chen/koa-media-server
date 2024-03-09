import { Room } from '@/entity/Room'

import RoomMapper from '@/mapper/room'
import RoomInfo from './data/RoomInfo'

export default class RoomService {
  public static async filterRoomParam(room: string) {
    //
  }
  public static async getRoom(room: string): Promise<Room> | null {
    if (!room) return null

    const roomid = Number(room)
    // 如果room可以被转成数字类型，就用getRoomById
    if (!isNaN(roomid)) {
      return await RoomMapper.getRoomById(roomid)
    }
    // 否则调用getRoomByAlias
    else {
      return await RoomMapper.getRoomByAlias(room)
    }
  }

  public static async createRoom(roomInfo: RoomInfo): Promise<Room> | null {
    return await RoomMapper.createRoom(roomInfo)
  }

  public static async dissolveRoom(room: string): Promise<Room> | null {
    if (!room) return null

    const roomid = Number(room)
    if (!isNaN(roomid)) {
      return await RoomMapper.dissolveRoomById(roomid)
    } else {
      return await RoomMapper.dissolveRoomByAlias(room)
    }
  }
}
