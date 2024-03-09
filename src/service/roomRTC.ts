import { EventEmitter } from 'events'

import RoomSocketEvent from './data/RoomSocketEvent'
import SignalWebSocket from './SignalWebSocket'

class RoomRTC extends EventEmitter {
  //   private eventEmitter: EventEmitter = new EventEmitter()
  // key 是socketId，value是自定义的websocket的拓展，加上了socketId和roomAlias
  private socketMap: Map<string, SignalWebSocket> = new Map()
  private roomAlias: string

  constructor(roomAlias: string) {
    super()
    this.roomAlias = roomAlias
  }

  public getOtherSocketsExclude(sws: SignalWebSocket): SignalWebSocket[] {
    return Array.from(this.socketMap.values()).filter(swsocket => swsocket !== sws)
  }

  public getAllSockets(): SignalWebSocket[] {
    return Array.from(this.socketMap.values())
  }

  // public getSocketByUserName(userName: string): SignalWebSocket {
  //   return this.socketMap.get(userName)
  // }

  // public getAllUserNames(): string[] {
  //   return Array.from(this.socketMap.keys())
  // }

  // public gerUserNamesExclude(userName: string): string[] {
  //   return this.getAllUserNames().filter(name => name !== userName)
  // }

  public addSocket(sws: SignalWebSocket) {
    this.socketMap.set(sws.socketId, sws)
  }

  public removeSocket(sws: SignalWebSocket) {
    this.socketMap.delete(sws.socketId)
  }

  public removeAllSockets() {
    this.socketMap.clear()
  }

  /**
   * 单个 sws 发送单个信息
   * @param sws 发送者
   * @param roomSocketEvent 发送信息
   */
  public swsSendSocketEvent(sws: SignalWebSocket, roomSocketEvent: RoomSocketEvent) {
    sws.webSocket.send(JSON.stringify(roomSocketEvent))
  }

  /**
   * 多个 sws 发送单个信息
   * @param swss 发送者
   * @param roomSocketEvent 发送信息
   */
  public swssSendSocketEvent(swss: SignalWebSocket[], roomSocketEvent: RoomSocketEvent) {
    const message = JSON.stringify(roomSocketEvent)
    swss.forEach(sws => sws.webSocket.send(message))
  }

  public broadCast(roomSocketEvent: RoomSocketEvent) {
    const swsArray = this.getAllSockets()
    const message = JSON.stringify(roomSocketEvent)
    swsArray.forEach(swsocket => swsocket.webSocket.send(message))
  }

  public broadCastExclude(sws: SignalWebSocket, roomSocketEvent: RoomSocketEvent) {
    const swsArray = this.getOtherSocketsExclude(sws)
    const message = JSON.stringify(roomSocketEvent)
    swsArray.forEach(swsocket => swsocket.webSocket.send(message))
  }

  public leave(userName: string) {
    this.socketMap.delete(userName)
  }

  public getRoomAlias() {
    return this.roomAlias
  }

  public getSocketCount() {
    return this.socketMap.size
  }

  public join(sws: SignalWebSocket) {
    const that = this
    that.addSocket(sws)
    const roomSocketEvent: RoomSocketEvent = {
      eventName: '_message',
      data: {
        socketId: sws.socketId,
        message: `欢迎${sws.socketId}加入${that.roomAlias}`
      }
    }
    that.broadCast(roomSocketEvent)
  }

  public newPeer(sws: SignalWebSocket) {
    const that = this
    let roomSocketEvent: RoomSocketEvent = {
      eventName: '_new_peer',
      data: {
        socketId: sws.socketId
      }
    }
    that.broadCastExclude(sws, roomSocketEvent)
    roomSocketEvent = {
      eventName: '_joined',
      data: {
        roomAlias: that.roomAlias,
        socketId: sws.socketId,
        connSocketIds: that.getOtherSocketsExclude(sws).map(sws => sws.socketId)
      }
    }
    that.swsSendSocketEvent(sws, roomSocketEvent)
  }

  /**
   *
   * @param sws 发送ice candidate一方的 socket
   * @param socketId 发送给 socketId 一方
   * @param iceCandidate 待发送的ice candidate
   */
  public retransIceCandidate(sws: SignalWebSocket, socketId: string, iceCandidate: RTCIceCandidateInit) {
    const remoteSWS: SignalWebSocket = this.socketMap.get(socketId)
    const roomSocketEvent: RoomSocketEvent = {
      eventName: '_ice_candidate',
      data: {
        socketId: sws.socketId, //发送者的socketId
        iceCandidate: iceCandidate
      }
    }
    this.swsSendSocketEvent(remoteSWS, roomSocketEvent)
  }

  /**
   *
   * @param sws 发送 offer 一方的 socket
   * @param socketIds 发送给 socketIds
   * @param offer 待发送的 offer
   */
  public retransOffer(sws: SignalWebSocket, socketId: string, offer: RTCSessionDescriptionInit) {
    const remoteSWS: SignalWebSocket = this.socketMap.get(socketId)
    const roomSocketEvent: RoomSocketEvent = {
      eventName: '_offer',
      data: {
        socketId: sws.socketId, //发送者的socketId
        offer: offer
      }
    }
    this.swsSendSocketEvent(remoteSWS, roomSocketEvent)
  }

  /**
   *
   * @param sws 发送者的socket
   * @param socketId 发送给 socketId
   * @param answer 待发送answer
   */
  public retransAnswer(sws: SignalWebSocket, socketId: string, answer: RTCSessionDescriptionInit) {
    const remoteSWS: SignalWebSocket = this.socketMap.get(socketId)
    const roomSocketEvent: RoomSocketEvent = {
      eventName: '_answer',
      data: {
        socketId: sws.socketId, //发送者的socketId
        answer: answer
      }
    }
    this.swsSendSocketEvent(remoteSWS, roomSocketEvent)
  }

  public removePeer(sws: SignalWebSocket) {
    const remoteSWSs: SignalWebSocket[] = this.getOtherSocketsExclude(sws)
    const roomSocketEvent: RoomSocketEvent = {
      eventName: '_remove_peer',
      data: {
        socketId: sws.socketId //发送者的socketId
      }
    }
    this.swssSendSocketEvent(remoteSWSs, roomSocketEvent)
    this.socketMap.delete(sws.socketId)
    // sws.webSocket.close()
    console.log(`current ${this.roomAlias} socketCount: `, this.getSocketCount())
  }

  public retransMessage(sws: SignalWebSocket, message: string) {
    const remoteSWSs: SignalWebSocket[] = this.getAllSockets()
    const roomSocketEvent: RoomSocketEvent = {
      eventName: '_message',
      data: {
        socketId: sws.socketId, //发送者的socketId
        message: message
      }
    }
    this.swssSendSocketEvent(remoteSWSs, roomSocketEvent)
    remoteSWSs.forEach(sws => {
      sws.resetHeartBeatTimeout()
    })
  }

  public sendHeartBeat(sws: SignalWebSocket) {
    const roomSocketEvent: RoomSocketEvent = {
      eventName: '_heart_beat',
      data: {
        message: 'pong'
      }
    }

    this.swsSendSocketEvent(sws, roomSocketEvent)
  }
}

export default RoomRTC
