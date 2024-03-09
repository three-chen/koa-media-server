import VerifyR from './data/postImg/verifyR'

const fs = require('fs')
const path = require('path')
const { pipeline } = require('stream') // 引入 stream 模块

const chatImgsDir = path.join('serverStatic/', 'webRTC_chat', 'imgs', 'chatImgs')

export default class PostImgService {
  public static async createDir(path): Promise<string> {
    return new Promise((resolve, reject) => {
      if (fs.existsSync(path)) {
        resolve('文件夹已存在')
      } else {
        console.log('create Dir')
        fs.mkdir(path, err => {
          if (err) {
            reject(err)
          } // 如果出现错误就抛出错误信息

          resolve('文件夹创建成功')
        })
      }
    })
  }

  public static async createChunk(newPath: string, chunk: Buffer): Promise<string | Error> {
    console.log('create chunk')
    return new Promise((resolve, reject) => {
      fs.writeFile(newPath, chunk.buffer, err => {
        if (err) {
          reject(err)
        }
        resolve(newPath)
      })
    })
  }

  public static async merge(oldDir, newDir, hash, chunkSize, imgtype: string): Promise<string | Error> {
    imgtype = imgtype.split('/')[1]
    const promises = []
    return new Promise((resolve, reject) => {
      let files = fs.readdirSync(oldDir)
      files.sort((a, b) => {
        return a.split('_')[1] - b.split('_')[1]
      })

      if (!fs.existsSync(newDir)) {
        fs.mkdir(newDir, err => {
          if (err) {
            reject(err)
          }

          for (let i = 0; i < files.length; i++) {
            promises.push(this.pipeStream(path.join(oldDir, files[i]), fs.createWriteStream(path.join(newDir, hash + '.' + imgtype), { start: chunkSize * i })))
          }

          // 在所有数据写入完成后执行 resolve
          Promise.all(promises)
            .then(res => {
              console.log(res)
              resolve(chatImgsDir + '/' + hash + '/' + hash + '.' + imgtype)
            })
            .catch(err => {
              console.log('merge err', err)

              reject(err)
            })
        })
      }
    })
  }

  public static pipeStream(oldFile, outputStream) {
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(oldFile)

      pipeline(stream, outputStream, err => {
        if (err) {
          reject(err)
        }
        resolve('pipe done')
      })
    })
  }

  public static verify(verifyDir): Promise<VerifyR> {
    return new Promise((resolve, reject) => {
      if (fs.existsSync(verifyDir)) {
        fs.readdir(verifyDir, (err, files) => {
          console.log('exist files', files)

          resolve({ exist: true, filePath: chatImgsDir + '/' + files[0].split('.')[0] + '/' + files[0] })
        })
      }
      console.log(verifyDir + '_chunks')
      if (!fs.existsSync(verifyDir + '_chunks')) {
        console.log('文件切片不存在')
        resolve({ exist: false, index: [] })
      }
      // 已经上传了片段，返回已上传的片段文件名
      else {
        fs.readdir(verifyDir + '_chunks', (err, files) => {
          if (err) {
            resolve({ exist: false })
          }
          const index = files.map(file => {
            const i = file.split('_')[1]
            return i
          })
          resolve({ exist: false, index: index })
        })
      }
    })
  }
}
