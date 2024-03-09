export default class SignalWebSocket {
  public webSocket: WebSocket
  public socketId: string
  public roomAlias: string

  // 心跳间隔 60 秒
  private heartBeatTimeout: number
  // timeout 计时器
  private timeout: NodeJS.Timeout | null = null

  constructor(ws: WebSocket, heartBeatT: number = 60 * 1000) {
    this.webSocket = ws
    this.heartBeatTimeout = heartBeatT

    this.startHearBeatTimeout()
    this.webSocket.addEventListener('message', () => {
      this.resetHeartBeatTimeout()
    })
  }

  public startHearBeatTimeout() {
    const that = this
    console.log('startHearBeatTimeout', that.socketId)

    that.timeout = setTimeout(() => {
      that.closeWebsocket()
    }, this.heartBeatTimeout)
  }

  public resetHeartBeatTimeout() {
    const that = this
    console.log('resetHeartBeatTimeout', that.socketId)
    clearTimeout(that.timeout!)
    that.timeout = setTimeout(() => {
      that.closeWebsocket()
    }, that.heartBeatTimeout)
  }

  public closeWebsocket() {
    const that = this
    console.log('我关的')

    that.webSocket.close()
  }
}
