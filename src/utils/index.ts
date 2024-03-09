export function getObjectValues(obj: any): any[] {
  const values: any[] = []
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key]
      values.push(value)
    }
  }
  return values
}
