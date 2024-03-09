import Router from '@koa/router'

import UserController from '@/controller/user'

const userRouter = new Router({ prefix: '/api/users' })

// users 相关的路由
userRouter.get('/', UserController.getUsers)
userRouter.get('/:id', UserController.getUserById)
userRouter.put('/:id', UserController.updateUser)
userRouter.delete('/:id', UserController.deleteUser)

export default userRouter
