// 一定要将import './init/alias' 放到最开头,因为它里面初始化了路径别名
import './init/alias'

import { AppDataSource } from '@/data-source'
import cors from '@koa/cors'
import { createServer } from 'http'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import 'reflect-metadata'
// import { WebSocketServer } from 'ws'

// middleware
import { loggerFactory } from '@/middleware/logger'
// import { signalServer } from './middleware/SignalServer'

// router
// import authRouter from '@/router/auth'
// import roomRouter from '@/router/room'
// import userRouter from '@/router/user'
// import postImgRouter from './router/postImg'

// 初始化 Koa 应用实例
const app = new Koa()
const server = createServer(app.callback())
// const liveWebsocketServer: WebSocketServer = new WebSocketServer({ noServer: true })

// 设置静态文件目录
// app.use(koaStatic(path.join(__dirname, '../public')))

// 初始化数据库
AppDataSource.initialize()
  .then(async () => {
    // 注册中间件
    app.use(loggerFactory())
    app.use(cors())
    app.use(bodyParser())

    // 无需 JWT Token 即可访问
    // app.use(authRouter.routes()).use(authRouter.allowedMethods())
    // 注册 JWT 中间件
    // app.use(jwt({ secret: JWT_SECRET }).unless({ method: 'GET' }))
    // 需要 JWT Token 才可访问
    // app.use(roomRouter.routes()).use(roomRouter.allowedMethods())
    // app.use(postImgRouter.routes()).use(postImgRouter.allowedMethods())
    // app.use(userRouter.routes()).use(userRouter.allowedMethods())
  })
  .catch(err => {
    console.log(err)
  })

// 升级websocket
// server.on('upgrade', function upgrade(request, socket, head) {
//   liveWebsocketServer.handleUpgrade(request, socket, head, function done(ws) {
//     signalServer.initSignalSocket(ws)
//   })
// })

// 运行服务器
server.listen(3000)
