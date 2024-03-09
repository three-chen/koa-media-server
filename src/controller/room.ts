import { Context } from 'koa'

import RoomInfo from '@/service/data/RoomInfo'
import RoomService from '@/service/room'

class RoomController {
  public async getRoom(ctx: Context) {
    const room = await RoomService.getRoom(ctx.params.room)
    console.log('getRoom', room)

    if (room) {
      ctx.body = room
      ctx.status = 200
    } else {
      ctx.body = '房间列表为空'
      ctx.status = 404
    }
  }

  public async createRoom(ctx: Context) {
    const roomInfo: RoomInfo = ctx.request.body
    const room = await RoomService.createRoom(roomInfo)

    if (room) {
      ctx.body = room
      ctx.status = 200
    } else {
      ctx.body = '创建房间失败'
      ctx.status = 500
    }
  }

  public async dissolveRoom(ctx: Context) {
    const room = await RoomService.dissolveRoom(ctx.params.room)

    if (room) {
      ctx.body = room
      ctx.status = 200
    } else {
      ctx.body = '解散房间失败'
      ctx.status = 500
    }
  }
}

export default new RoomController()
