import { Context } from 'koa'

export function loggerFactory() {
  return async (ctx: Context, next: () => Promise<void>) => {
    const start = process.hrtime()
    await next()
    const end = process.hrtime(start)
    const durationInMs = (end[0] * 1e9 + end[1]) / 1e6 // 将纳秒转换为毫秒
    console.log(`${ctx.method} ${ctx.url} - ${durationInMs}ms`)
  }
}
