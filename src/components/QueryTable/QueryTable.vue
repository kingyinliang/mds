<template>
  <div>
    <div>
      <el-card class="searchCard" style="margin-bottom: 5px;">
        <el-form :model="queryForm" :rules="queryFormRules" :inline="true" size="small" label-width="70px" class="multi_row clearfix" style="font-size: 0;">
          <template v-for="item in queryFormData" v-if="!item.hide">
            <el-form-item
              v-if="item.type === 'select'"
              :label="`${item.label}：` || ''"
              :prop="item.prop"
              :key="item.prop">
              <el-select
                style="width: 170px;"
                :ref="item.prop"
                :filterable="item.filterable"
                v-model="queryForm[item.prop]"
                :disabled="item.disabled"
                :placeholder="'请选择'+item.label">
                <el-option label="请选择"  value=""></el-option>
                <el-option
                  v-for="(opt, optIndex) in optionLists[item.prop]"
                  :key="optIndex"
                  :label="setLabel(opt, item)"
                  :value="opt[item.resVal.value]">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="item.type === 'input'"
              :label="`${item.label}：` || ''"
              :prop="item.prop"
              :key="item.prop">
              <el-input
                :ref="item.prop"
                style="width: 170px;"
                v-model="queryForm[item.prop]"></el-input>
            </el-form-item>
            <el-form-item
              class="dateinput"
              v-if="item.type === 'date-interval'"
              :label="`${item.label}：` || ''"
              :prop="item.prop"
              :key="item.prop">
              <el-row>
                <el-col :span="12">
                  <el-date-picker :ref="item.prop" v-model="queryForm[item.prop]" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 135px;"></el-date-picker>
                  <span>-</span>
                </el-col>
                <el-col :span="12">
                  <el-date-picker :ref="item.propTwo" v-model="queryForm[item.propTwo]" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 135px;"></el-date-picker>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item
              v-if="item.type === 'date-picker'"
              :label="`${item.label}：` || ''"
              :prop="item.prop"
              :key="item.prop">
              <el-date-picker :ref="item.prop" :type="item.dataType" v-model="queryForm[item.prop]" placeholder="请选择" :value-format="item.valueFormat" style="width: 170px;"></el-date-picker>
            </el-form-item>
          </template>
          <el-form-item class="floatr">
            <el-button type="primary" size="small" @click="GetDataList(true)">查询</el-button>
            <el-button type="primary" size="small" @click="FormExportExcel" v-if="exportExcel">导出</el-button>
            <slot name="mds-button"></slot>
          </el-form-item>
        </el-form>
        <div class="toggleSearchBottom">
          <i class="el-icon-caret-top"></i>
        </div>
      </el-card>
      <el-card class="tableCard" style="min-height: 400px;">
        <div class="toggleSearchTop">
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-row>
          <el-col style="text-align: right; margin-bottom: 10px;">
            <slot name="mds-button-middle"></slot>
          </el-col>
        </el-row>
        <el-table :data="tableData" ref="table" :height="tableHeight" @selection-change="handleSelectionChange" border tooltip-effect="dark" header-row-class-name="tableHead" style="width: 100%; margin-bottom: 20px;">
          <el-table-column
            v-if="showSelectColumn"
            :selectable="selectableFn"
            type="selection"
            width="50px">
          </el-table-column>
          <el-table-column
            v-if="showIndexColumn"
            type="index"
            :index="indexMethod"
            label="序号"
            width="50px">
          </el-table-column>
          <el-table-column
            v-for="item in column"
            v-if="!item.hide"
            :key="item.prop"
            :fixed="item.fixed"
            :prop="item.prop"
            :label="item.label"
            :width="item.width || ''"
            :formatter="item.formatter"
            :show-overflow-tooltip="true">
            <el-table-column
              v-for="chind in item.child"
              v-if="item.child"
              :key="chind.prop"
              :prop="chind.prop"
              :label="chind.label"
              :formatter="chind.formatter"
              :show-overflow-tooltip="chind.showOverFlowTooltip"
              :width="chind.width || ''">
            </el-table-column>
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            :width="operationColumnWidth"
            v-if="showOperationColumn">
            <template slot-scope="scope">
              <slot :scope="scope" name="operation_column"/>
            </template>
          </el-table-column>
        </el-table>
        <el-row v-if="showPage === true">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryForm.currPage"
            :page-sizes="[10, 20, 50]"
            :page-size="queryForm.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="queryForm.totalCount">
          </el-pagination>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
import {exportFileForm} from '@/net/validate'
export default {
  name: 'QueryTable',
  data () {
    return {
      queryForm: {
        currPage: 1,
        pageSize: 10,
        totalCount: 0
      },
      queryFormRules: {},
      optionLists: {},
      tableData: [],
      multipleSelection: []
    }
  },
  props: {
    tableHeight: {
      type: String,
      default: ''
    },
    returnColumnType: {
      type: String,
      default: 'page'
    },
    queryFormData: {
      type: Array,
      default: () => {
        return []
      }
    },
    exportExcel: {
      type: Boolean,
      default: false
    },
    exportOption: {
      type: Object,
      default: () => {
        return {
          exportInterface: '',
          auth: '',
          text: ''
        }
      }
    },
    exportInterface: {
      type: String,
      default: ''
    },
    exportAuth: {
      type: String,
      default: ''
    },
    exportText: {
      type: String,
      default: ''
    },
    rules: {
      type: Array,
      default: () => {
        return []
      }
    },
    queryAuth: {
      type: String,
      default: ''
    },
    listInterface: {
      type: Function,
      default: () => {}
    },
    column: {
      type: Array,
      default: () => {
        return []
      }
    },
    showOperationColumn: {
      type: Boolean,
      default: false
    },
    operationColumnWidth: {
      type: Number,
      default: 0
    },
    showSelectColumn: {
      type: Boolean,
      default: false
    },
    showIndexColumn: {
      type: Boolean,
      default: false
    },
    selectableFn: {
      type: Function,
      default: () => true
    },
    showPage: {
      type: Boolean,
      default: true
    },
    fixTableHeightFromTop: {
      type: Number,
      default: 0
    }
  },
  created () {
    this.init()
  },
  mounted () {
    this.headanimation(this.$)
    this.$nextTick(function () {
      if (this.fixTableHeightFromTop !== 0) {
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - this.fixTableHeightFromTop
        // 监听窗口大小变化
        let self = this
        window.onresize = function () {
          self.tableHeight = window.innerHeight - self.$refs.table.$el.offsetTop - this.fixTableHeightFromTop
        }
      }
    })
  },
  methods: {
    // 设置下拉label
    setLabel (opt, item) {
      let label = ''
      item.resVal.label.forEach(it => {
        label += opt[it] + ' '
      })
      return label
    },
    // 初始化
    init () {
      console.time('组件初始化')
      this.queryFormData.forEach((item) => {
        // 设置查询表单
        this.$set(this.queryForm, item.prop, item.defaultValue || '')
        if (item.type === 'date-interval') {
          this.$set(this.queryForm, item.propTwo, item.defaultValue || '')
        }
        // 下拉框获取下拉
        if (item.options) {
          this.$set(this.optionLists, item.prop, item.options || [])
        } else if (item.defaultOptionsFn) {
          // 初始化下拉
          item.defaultOptionsFn().then(({data}) => {
            if (/\./g.test(item.resVal.resData)) {
              item.resVal.resData.split('.').forEach(resIt => {
                data = data[resIt]
              })
            } else {
              data = data[item.resVal.resData]
            }
            this.$set(this.optionLists, item.prop, data)
            if (data.length > 0 && !item.defaultValue && item.defaultValue !== '') {
              this.$set(this.queryForm, item.prop, data[0][item.resVal.value])
              this.$nextTick(function () {
                this.$refs[item.prop][0].emitChange(data[0][item.resVal.value])
              })
            }
          })
        } else if (item.defaultOptionsMore) {
          item.defaultOptionsMore().then(({data}) => {
            if (/\./g.test(item.resVal.resData)) {
              item.resVal.resData.split('.').forEach(resIt => {
                let dataSole = data.iotListInfo[resIt]
                // console.log(dataSole)
                if (dataSole.length > 0 && resIt === 'factory') {
                  this.$set(this.queryForm, resIt, dataSole[0][item.resVal.value])
                  this.$nextTick(function () {
                    this.$refs[item.prop][0].emitChange(dataSole[0][item.resVal.value])
                  })
                }
                this.$set(this.optionLists, resIt, dataSole)
              })
            }
          })
        }
        // 联动监听事件对象
        if (item.linkageProp) {
          this.$nextTick(function () {
            // 添加监听
            this.$refs[item.prop][0].emitChange = (val) => {
              this.clearTableAndPage()
              item.linkageProp.forEach(linkagePropItem => {
                // 联动的对象
                let linkagePropItemObj = this.queryFormData.filter(it => it.prop === linkagePropItem)[0]
                // 联动的对象赋值
                this.queryForm[linkagePropItemObj.prop] = ''
                this.$refs[linkagePropItemObj.prop][0].emitChange('')
                // 获取联动的下拉
                if (val) {
                  linkagePropItemObj.optionsFn(val).then(({data}) => {
                    if (data.code === 0) {
                      if (/\./g.test(linkagePropItemObj.resVal.resData)) {
                        linkagePropItemObj.resVal.resData.split('.').forEach(resIt => {
                          data = data[resIt]
                        })
                      } else {
                        data = data[linkagePropItemObj.resVal.resData]
                      }
                      this.$set(this.optionLists, linkagePropItemObj.prop, data)
                      if (data.length > 0 && !linkagePropItemObj.defaultValue && linkagePropItemObj.defaultValue !== '') {
                        this.$set(this.queryForm, linkagePropItemObj.prop, data[0][linkagePropItemObj.resVal.value])
                        this.$nextTick(function () {
                          this.$refs[linkagePropItemObj.prop][0].emitChange(data[0][linkagePropItemObj.resVal.value])
                        })
                      }
                    } else {
                      this.$error_SHINHO(data.msg)
                    }
                  })
                } else {
                  this.$set(this.optionLists, linkagePropItemObj.prop, [])
                }
              })
            }
          })
        } else {
          this.$nextTick(function () {
            this.$refs[item.prop][0].emitChange = (val) => {
              this.clearTableAndPage()
            }
            if (item.propTwo) {
              this.$refs[item.propTwo][0].emitChange = (val) => {
                this.clearTableAndPage()
              }
            }
          })
        }
      })
      console.timeEnd('组件初始化')
    },
    // 清空表格和分页
    clearTableAndPage () {
      this.tableData = []
      this.queryForm.currPage = 1
      this.queryForm.totalCount = 0
      // this.GetDataList()
    },
    // 获取table数据
    GetDataList (st) {
      if (this.rules.length) {
        for (let item of this.rules) {
          if (!this.queryForm[item.prop]) {
            this.$warning_SHINHO(item.text)
            return false
          }
        }
      }
      if (!this.isAuth(this.queryAuth) && this.queryAuth !== '') {
        this.$warning_SHINHO('无查询权限')
        return false
      }
      if (st) {
        this.queryForm.currPage = 1
      }
      this.listInterface(this.queryForm).then(({data}) => {
        if (data.code === 0) {
          this.tableData = data[this.returnColumnType].list
          this.queryForm.currPage = data[this.returnColumnType].currPage
          this.queryForm.pageSize = data[this.returnColumnType].pageSize
          this.queryForm.totalCount = data[this.returnColumnType].totalCount
          this.$emit('get-data-success', data)
        } else {
          this.$error_SHINHO(data.msg)
        }
      })
    },
    // 导出
    FormExportExcel () {
      if (this.rules.length) {
        for (let item of this.rules) {
          if (!this.queryForm[item.prop]) {
            this.$warning_SHINHO(item.text)
            return false
          }
        }
      }
      if (!this.isAuth(this.exportOption.auth) && this.exportOption.auth !== '') {
        this.$warning_SHINHO('无导出权限')
        return false
      }
      let that = this
      exportFileForm(`${this.exportOption.exportInterface}`, this.exportOption.text, that)
    },
    // 显示隐藏动画
    headanimation ($) {
      $('.toggleSearchBottom').parents('.searchCard').css('padding-bottom', '7px')
      // 搜索切换显隐
      $('.toggleSearchBottom').click(function () {
        $('.toggleSearchBottom').parents('.searchCard').css('padding-bottom', '0')
        $('.searchCard').animate({height: 0}, 300, () => {
          $(this).hide()
          $('.toggleSearchTop').show()
        })
      })
      $('.toggleSearchTop').click(function () {
        let hei = $('.searchCard .el-card__body').height()
        $('.searchCard').animate({height: `${hei + 20}px`}, 300, () => {
          $('.searchCard').css('padding-bottom', '15px')
          $(this).hide()
          $('.toggleSearchBottom').show()
        })
      })
    },
    // 序号
    indexMethod (index) {
      return index + 1 + (this.queryForm.currPage * 1 - 1) * (this.queryForm.pageSize * 1)
    },
    // 表格选中
    handleSelectionChange (val) {
      this.multipleSelection = []
      val.forEach((item, index) => {
        this.multipleSelection.push(item)
      })
    },
    // 改变每页条数
    handleSizeChange (val) {
      this.queryForm.pageSize = val
      this.GetDataList()
    },
    // 跳转页数
    handleCurrentChange (val) {
      this.queryForm.currPage = val
      this.GetDataList()
    }
  },
  computed: {},
  components: {}
}
</script>

<style scoped>

</style>
