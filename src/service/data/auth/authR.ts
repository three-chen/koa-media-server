export default interface AuthR {
  id: number
  /**
   * 用户角色
   * admin 代表管理员，可访问一切路由
   * vip 代表vip，可访问听歌路由、直播和rtc聊天
   * normal 代表普通，可访问直播和rtc聊天
   */
  role: string
}
