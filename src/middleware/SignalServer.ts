import RoomSocketEvent from '@/service/data/RoomSocketEvent'
import RoomRTC from '@/service/roomRTC'
import SignalWebSocket from '@/service/SignalWebSocket'

import { getObjectValues } from '@/utils'
import { EventEmitter } from 'events'

class SignalServer extends EventEmitter {
  private roomMap = new Map<string, RoomRTC>()

  constructor() {
    super()
    this.init()
  }

  public init() {
    this.on('__message', this.retransMessage)
    this.on('__joinRoom', this.joinRoom)
    this.on('__ice_candidate', this.iceCandidate)
    this.on('__offer', this.retransOffer)
    this.on('__answer', this.retransAnswer)
    this.on('__remove_peer', this.removePeer)
    this.on('__heart_beat', this.handleHeartBeat)
  }

  public initSignalSocket(ws: WebSocket) {
    const sws = new SignalWebSocket(ws)
    const that = this
    sws.webSocket.addEventListener('message', (message: MessageEvent<any>) => {
      const roomSocketEvent: RoomSocketEvent = JSON.parse(message.data)
      that.emit(roomSocketEvent.eventName, sws, ...getObjectValues(roomSocketEvent.data))
    })
    sws.webSocket.onclose = () => {
      console.log('socket closed')
    }
  }

  public joinRoom(sws: SignalWebSocket, roomAlias: string, userName: string) {
    const that = this
    let room = that.roomMap.get(roomAlias)
    if (!room) {
      room = new RoomRTC(roomAlias)
      that.roomMap.set(roomAlias, room)
    }
    sws.socketId = userName
    sws.roomAlias = roomAlias
    room.join(sws)
    room.newPeer(sws)
  }

  /**
   *
   * @param sws 发送ice candidate一方的 socket
   * @param socketId 发送给 socketId 一方
   * @param iceCandidate 待发送的ice candidate
   */
  public iceCandidate(sws: SignalWebSocket, socketId: string, iceCandidate: RTCIceCandidateInit) {
    const that = this
    const room = that.roomMap.get(sws.roomAlias)
    if (room) {
      room.retransIceCandidate(sws, socketId, iceCandidate)
    }
  }

  /**
   *
   * @param sws 发送者的socket
   * @param socketIds 发送给 socketId
   * @param offer 待发送offer
   */
  public retransOffer(sws: SignalWebSocket, socketId: string, offer: RTCSessionDescriptionInit) {
    const that = this
    const room = that.roomMap.get(sws.roomAlias)
    if (room) {
      room.retransOffer(sws, socketId, offer)
    }
  }

  /**
   *
   * @param sws 发送者的socket
   * @param socketId 发送给 socketId
   * @param answer 待发送answer
   */
  public retransAnswer(sws: SignalWebSocket, socketId: string, answer: RTCSessionDescriptionInit) {
    const that = this
    const room = that.roomMap.get(sws.roomAlias)
    if (room) {
      room.retransAnswer(sws, socketId, answer)
    }
  }

  public removePeer(sws: SignalWebSocket) {
    console.log('removePeer', sws.roomAlias, sws.socketId)

    const that = this
    const room = that.roomMap.get(sws.roomAlias)
    if (room) {
      room.removePeer(sws)
    }
    // 如果room为空，就删除该room
    if (room && room.getSocketCount() === 0) {
      that.roomMap.delete(sws.roomAlias)
    }
  }

  /**
   *
   * @param sws 发送者
   * @param message 代发送的信息
   */
  public retransMessage(sws: SignalWebSocket, message: string) {
    const that = this
    const room = that.roomMap.get(sws.roomAlias)
    if (room) {
      room.retransMessage(sws, message)
    }
  }

  /**
   *
   * @param sws 发送者
   * @param ping 发送来的ping
   */
  public handleHeartBeat(sws: SignalWebSocket, ping: string) {
    const that = this
    const room = that.roomMap.get(sws.roomAlias)
    console.log(ping)
    if (room) {
      room.sendHeartBeat(sws)
    }
  }
}

const signalServer = new SignalServer()

export { signalServer }
