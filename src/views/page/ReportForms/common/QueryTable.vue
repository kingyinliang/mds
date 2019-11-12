<template>
  <div>
    <div>
      <el-card class="searchCard" style="margin-bottom: 5px">
        <el-form :model="queryForm" :rules="rules" :inline="true" size="small" label-width="70px" class="topform multi_row clearfix" style="font-size: 0;">
          <template v-for="item in queryFormData" v-if="!item.hide">
            <el-form-item
              v-if="item.type === 'select'"
              :label="`${item.label}：` || ''"
              :prop="item.prop"
              :key="item.prop">
              <el-select
                style="width: 170px"
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
                style="width: 170px"
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
                  <el-date-picker v-model="queryForm[item.prop]" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 135px"></el-date-picker>
                  <span>-</span>
                </el-col>
                <el-col :span="12">
                  <el-date-picker v-model="queryForm[item.propTwo]" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 135px"></el-date-picker>
                </el-col>
              </el-row>
            </el-form-item>
          </template>
          <el-form-item class="floatr">
            <el-button type="primary" size="small" @click="GetDataList(true)">查询</el-button>
            <slot name="mds-button"></slot>
          </el-form-item>
        </el-form>
        <div class="toggleSearchBottom">
          <i class="el-icon-caret-top"></i>
        </div>
      </el-card>
      <el-card class="tableCard">
        <div class="toggleSearchTop">
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-table :data="tableData" border tooltip-effect="dark" header-row-class-name="tableHead" style="width: 100%;margin-bottom: 20px">
          <el-table-column
            v-for="item in column"
            v-if="!item.hide"
            :key="item.name"
            :prop="item.prop"
            :label="item.label"
            :width="item.width || ''"
            :formatter="item.formatter"
            :show-overflow-tooltip="true">
          </el-table-column>
        </el-table>
        <el-row >
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
export default {
  name: 'QueryTable',
  data () {
    return {
      queryForm: {
        currPage: 1,
        pageSize: 10,
        totalCount: 0
      },
      optionLists: {},
      tableData: []
    }
  },
  props: {
    queryFormData: {
      type: Array,
      default: () => {
        return []
      }
    },
    rules: {},
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
    }
  },
  created () {
    this.init()
  },
  mounted () {
    this.headanimation(this.$)
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
            this.$set(this.optionLists, item.prop, data[item.resVal.resData])
            if (data[item.resVal.resData].length > 0 && !item.defaultValue && item.defaultValue !== '') {
              this.$set(this.queryForm, item.prop, data[item.resVal.resData][0][item.resVal.value])
              this.$nextTick(function () {
                this.$refs[item.prop][0].emitChange(data[item.resVal.resData][0][item.resVal.value])
              })
            }
          })
        }
        // 联动监听事件对象
        if (item.linkageProp) {
          this.$nextTick(function () {
            // 添加监听
            this.$refs[item.prop][0].emitChange = (val) => {
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
                      this.$set(this.optionLists, linkagePropItemObj.prop, data[linkagePropItemObj.resVal.resData])
                      if (data[linkagePropItemObj.resVal.resData].length > 0 && !linkagePropItemObj.defaultValue && linkagePropItemObj.defaultValue !== '') {
                        this.$set(this.queryForm, linkagePropItemObj.prop, data[linkagePropItemObj.resVal.resData][0][linkagePropItemObj.resVal.value])
                        this.$nextTick(function () {
                          this.$refs[linkagePropItemObj.prop][0].emitChange(data[linkagePropItemObj.resVal.resData][0][linkagePropItemObj.resVal.value])
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
        }
      })
    },
    // 获取table数据
    GetDataList (st) {
      if (!this.isAuth(this.queryAuth)) {
        this.$warning_SHINHO('无查询权限')
        return false
      }
      if (st) {
        this.queryForm.currPage = 1
      }
      this.listInterface(this.queryForm).then(({data}) => {
        if (data.code === 0) {
          this.tableData = data.page.list
          this.queryForm.currPage = data.page.currPage
          this.queryForm.pageSize = data.page.pageSize
          this.queryForm.totalCount = data.page.totalCount
          this.$emit('get-data-success', data)
        } else {
          this.$error_SHINHO(data.msg)
        }
      })
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
