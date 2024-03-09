interface DataInfo {
  roomAlias?: string //房间名
  userName?: string //用户名
  message?: string //要发送的消息
  socketId?: string // username | 随机uuid
  connSocketIds?: string[] //所有对方连接的socketId数组
  offer?: any //sdp offer
  answer?: any //sdp answer
  iceCandidate?: any // ice candidate
}

export default interface RoomSocketEvent {
  eventName: string
  data: DataInfo
}
