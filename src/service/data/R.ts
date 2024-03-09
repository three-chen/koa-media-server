export default class R<T> {
  private success: boolean = false
  private data: T | null = null
  private msg: string | null = null

  constructor(success: boolean, data: T | null, msg: string | null) {
    this.success = success
    this.data = data
    this.msg = msg
  }
}
