<template>
  <div>
    <div>
      <el-card class="searchCard">
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
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QueryTable',
  data () {
    return {
      queryForm: {},
      optionLists: {}
    }
  },
  props: {
    queryFormData: {
      type: Array,
      default: () => {
        return []
      }
    },
    rules: {}
  },
  created () {
    this.init()
  },
  mounted () {
  },
  methods: {
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
              if (index === 0 && !item.defaultValue) {
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
                      data[linkagePropItemObj.resVal.resData].forEach((resItem) => {
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
    }
  },
  computed: {},
  components: {}
}
</script>

<style scoped>

</style>
