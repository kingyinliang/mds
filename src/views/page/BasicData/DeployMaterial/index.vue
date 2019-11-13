<template>
  <div class="header_main">
    <query-table
      :query-auth="'report:formh:getAllStatusList'"
      :show-operation-column="true"
      :show-select-column="true"
      :list-interface="listInterface"
      :queryFormData="queryFormData"
      :column="column">
      <template slot="operation_column" slot-scope="{scope}">
        <el-button class="ra_btn" type="primary" round size="mini">编辑</el-button>
      </template>
    </query-table>
  </div>
</template>

<script>
import {BASICDATA_API, REP_API} from '@/api/api'
export default {
  name: 'index',
  data () {
    return {
      queryFormData: [
        {
          type: 'select',
          label: '生产工厂',
          prop: 'factory',
          defaultOptionsFn: () => {
            return this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST', {}, false, false, false)
          },
          resVal: {
            resData: 'typeList',
            label: ['deptName'],
            value: 'deptId'
          }
        }
      ],
      listInterface: (params) => {
        return this.$http(`${REP_API.ORDER_STATUS_LIST_API}`, 'POST', params)
      },
      column: [{
        prop: 'factory',
        label: '工厂',
        width: '100'
      }, {
        prop: 'factory',
        label: '生产物料'
      }, {
        prop: 'factory',
        label: '领用物料'
      }, {
        prop: 'factory',
        label: 'BL与LY',
        width: '100'
      }, {
        prop: 'factory',
        label: '备注',
        width: '100',
        formatter: (row, col, value) => {
          let h = this.$createElement
          return h('el-input', {
            attrs: {
              size: 'small'
            }
          })
        }
      }, {
        prop: 'factory',
        label: '操作人员',
        width: '100'
      }, {
        prop: 'factory',
        label: '操作时间'
      }]
    }
  },
  mounted () {
  },
  methods: {},
  computed: {},
  components: {
    QueryTable: resolve => {
      require(['@/components/QueryTable'], resolve)
    }
  }
}
</script>

<style scoped>

</style>
