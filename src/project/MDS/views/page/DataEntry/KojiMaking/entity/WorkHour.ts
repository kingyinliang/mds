// 毫无意义的类声明。。。
export class WorkHour {
  [propName: string]: any // eslint-disable-line
  // 不可编辑
  disabled = true
  constructor(obj: object) {
    for (const key of Object.keys(obj)) {
      this[key] = obj[key]
    }
  }
}

export class InStock {
  [propName: string]: any // eslint-disable-line
  constructor(obj: object) {
    for (const key of Object.keys(obj)) {
      this[key] = obj[key]
    }
  }
}

export class Material {
  [propName: string]: any // eslint-disable-line
  disabled = true
  constructor(obj: object) {
    for (const key of Object.keys(obj)) {
      this[key] = obj[key]
    }
  }
}
