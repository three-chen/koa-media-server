import PostimgController from '@/controller/postImg'
import Router from '@koa/router'
const multer = require('@koa/multer')

const postImgRouter = new Router({ prefix: '/api/webrtcchat' })
const upload = multer() // note you can pass `multer` options here

// auth 相关的路由
postImgRouter.post('/chunk', upload.single('chunk'), PostimgController.postChunk)
postImgRouter.post('/merge', PostimgController.merge)
postImgRouter.post('/verify', PostimgController.verify)

export default postImgRouter
