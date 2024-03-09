import { Context } from 'koa'

const path = require('path')
const uploadDir = path.join(__dirname, '../../public', 'webRTC_chat', 'imgs', 'chatImgs') // 指定切片保存的目录

import R from '@/service/data/R'
import { ChunkR } from '@/service/data/postImg/chunkR'
import MergeInfo from '@/service/data/postImg/mergeInfo'
import MergeR from '@/service/data/postImg/mergeR'
import VerifyInfo from '@/service/data/postImg/verifyInfo'
import VerifyR from '@/service/data/postImg/verifyR'
import PostImgService from '@/service/postImg'

class PostImgController {
  public async postChunk(ctx: Context) {
    console.log('postChunk userid', ctx.state.user.id)

    // 获取文件信息
    const chunk: Buffer = ctx.file
    const hash = ctx.request.body.hash
    const index = ctx.request.body.index

    console.log(chunk, hash, index, uploadDir)

    // 保存上传的文件夹
    const dirPath = path.join(uploadDir, `${hash}_chunks`)
    // 保存上传的文件
    const filePath = path.join(uploadDir, `${hash}_chunks`, index)
    // // 新建chunks文件夹
    await PostImgService.createDir(dirPath)
    const str = await PostImgService.createChunk(filePath, chunk)

    if (str instanceof Error) {
      const r = new R(false, null, str.message)
      ctx.body = r
      ctx.status = 500
    } else {
      const chunkR: ChunkR = '接收到了请求'
      const r = new R(true, chunkR, null)
      ctx.body = r
      ctx.status = 200
    }
  }

  public async merge(ctx: Context) {
    const mergeInfo: MergeInfo = ctx.request.body
    console.log('merge', mergeInfo)

    // 保存上传的文件夹
    const oldDir = path.join(uploadDir, `${mergeInfo.hash}_chunks`)
    const newDir = path.join(uploadDir, `${mergeInfo.hash}`)
    const newUrl = await PostImgService.merge(oldDir, newDir, mergeInfo.hash, mergeInfo.chunkSize, mergeInfo.imgtype)

    if (newUrl instanceof Error) {
      const r = new R(false, null, newUrl.message)
      ctx.body = r
      ctx.status = 500
    } else {
      const mergeR: MergeR = { url: newUrl }
      console.log('new url', newUrl)

      const r = new R(true, mergeR, null)
      ctx.body = r
      ctx.status = 200
    }
  }

  public async verify(ctx: Context) {
    // console.log('verify userid', ctx.state.user.id)
    const verifyInfo: VerifyInfo = ctx.request.body
    // 保存上传的文件夹
    const hash = verifyInfo.hash
    const verifyDir = path.join(uploadDir, hash)
    const veri: VerifyR = await PostImgService.verify(verifyDir)
    console.log('veri', veri)

    const r = new R(true, veri, null)
    ctx.body = r
    ctx.status = 200
  }
}

export default new PostImgController()
