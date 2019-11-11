<template>
  <div>
    <div>
      <el-card class="searchCard" style="margin-bottom: 5px">
        <el-form :model="queryForm" :rules="rules" :inline="true" size="small" label-width="70px" class="topform multi_row">
          <template v-for="item in queryFormData" v-if="!item.hide">
            <el-form-item
              v-if="item.type === 'select'"
              :label="`${item.label}：` || ''"
              :prop="item.prop"
              :key="item.prop">
              <el-select
                style="width: 170px"
                :ref="item.prop"
                v-model="queryForm[item.prop]"
                :disabled="item.disabled"
                :placeholder="'请选择'+item.label">
                <el-option
                  v-for="opt in optionLists[item.prop]"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value">
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
          </template>
          <el-form-item class="floatr">
            <el-button type="primary" size="small" @click="GetDataList(true)">查询</el-button>
            <slot name="mds-button"></slot>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card class="tableCard">
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
  },
  methods: {
    // 初始化
    init () {
      this.queryFormData.forEach((item) => {
        // 设置查询表单
        this.$set(this.queryForm, item.prop, item.defaultValue || '')
        // 下拉框获取下拉
        if (item.options) {
          this.$set(this.optionLists, item.prop, item.options || [])
        } else if (item.defaultOptionsFn) {
          // 初始化下拉
          item.defaultOptionsFn().then(({data}) => {
            data[item.resVal.resData].forEach((resItem, index) => {
              if (index === 0 && !item.defaultValue && item.defaultValue !== '') {
                this.$set(this.queryForm, item.prop, resItem[item.resVal.value])
                this.$nextTick(function () {
                  this.$refs[item.prop][0].emitChange(resItem[item.resVal.value])
                })
              }
              resItem.label = resItem[item.resVal.label]
              resItem.value = resItem[item.resVal.value]
            })
            this.$set(this.optionLists, item.prop, data[item.resVal.resData])
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
                      data[linkagePropItemObj.resVal.resData].forEach((resItem, index) => {
                        if (index === 0 && !linkagePropItemObj.defaultValue && linkagePropItemObj.defaultValue !== '') {
                          this.$set(this.queryForm, linkagePropItemObj.prop, resItem[linkagePropItemObj.resVal.value])
                          this.$nextTick(function () {
                            this.$refs[linkagePropItemObj.prop][0].emitChange(resItem[linkagePropItemObj.resVal.value])
                          })
                        }
                        resItem.label = resItem[linkagePropItemObj.resVal.label]
                        resItem.value = resItem[linkagePropItemObj.resVal.value]
                      })
                      this.$set(this.optionLists, linkagePropItemObj.prop, data[linkagePropItemObj.resVal.resData])
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
