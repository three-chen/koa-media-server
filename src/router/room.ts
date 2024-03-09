import Router from '@koa/router'

import roomController from '@/controller/room'

const roomRouter = new Router({ prefix: '/api/room' })

// room 相关的路由
roomRouter.get('/:room', roomController.getRoom)
roomRouter.post('/:room', roomController.createRoom)
roomRouter.delete('/:room', roomController.dissolveRoom)

export default roomRouter
