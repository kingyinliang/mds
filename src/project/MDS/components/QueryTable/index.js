import QueryTable from './QueryTable';

export default function(Vue) {
    Vue.component('QueryTable', QueryTable);
}
/**
 * QueryTable
 * @property 表单表格组件
 * @param {array} queryFormData 查询表单
 *   type 单表单组件类型 select下拉 input输入框 date-interval日期范围
 *   label 单表单名称
 *   prop 单表单字段名
 *   propTwo 日期范围表单第二字段名
 *   options 下拉框的下拉值
 *   defaultValue 下拉框的默认下拉值
 *   defaultOptionsFn 下拉框的默认下拉数组接口
 *   optionsFn 下拉框的获取下拉值接口
 *   resVal 下拉框的获取下拉值接口的响应体取值字段 resData响应体取值字段 label下拉框中的lable数组 value下拉绑定的值字段
 *   linkageProp 联动的下拉框字段名数组
 * @param {Fn} listInterface 查询接口函数
 * @param {String} returnColumnType 查询接口返回list传参字段, 默认page
 * @param {String} queryAuth 权限，默认false不校验
 * @param {array} column 表格数组
 *   prop 字段名
 *   label 表头名
 *   width 单元格宽度
 *   formatter 单元格自定义内容
 * @param {Boolean} showSelectColumn 是否显示表格内复选框
 * @param {Boolean} showIndexColumn 是否显示表格内序号
 * @param {Fn} selectableFn 表格复选框选中逻辑
 * @param slot mds-button 查询按钮类
 * @param slot operation_column 表格内操作
 */
