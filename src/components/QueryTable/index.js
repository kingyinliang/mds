import QueryTable from './QueryTable'

export default function (Vue) {
  Vue.component('QueryTable', QueryTable)
}
/**
 * QueryTable
 * @property 表单表格组件
 * @param {string} queryFormData 查询表单
 * type 单表单组件类型 select下拉 input输入框 date-interval日期范围
 * label 单表单名称
 * prop 日期范围表单第二字段名
 * propTwo 单表单字段名
 * defaultValue 下拉框的默认下拉值
 * defaultOptionsFn 下拉框的默认下拉数组接口
 * optionsFn 下拉框的获取下拉值接口
 * resVal 下拉框的获取下拉值接口的响应体取值字段 resData响应体取值字段 label下拉框中的lable数组 value下拉绑定的值字段
 */
