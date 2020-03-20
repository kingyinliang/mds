import { DayType, EMPType } from './Enum'

export class Employee {
  orderId: string
  classType: DayType = DayType.DAY
  deptId: string
  dinner: string
  endDate: string
  startDate: string
  productDate: string
  remark: string
  userId: string[]
  userType: EMPType = EMPType.FORMAL
  constructor(orderId: string, productDate: string, dinner: string) {
    this.deptId = ''
    this.endDate = ''
    this.startDate = ''
    this.remark = ''
    this.userId = []
    this.orderId = orderId
    this.productDate = productDate
    this.dinner = dinner
  }
}
