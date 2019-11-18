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
          },
          linkageProp: ['productionMaterielCode', 'useMaterielCode']
        },
        {
          type: 'select',
          label: '生产物料',
          prop: 'productionMaterielCode',
          optionsFn: (val) => {
            return this.$http(`${BASICDATA_API.DEPLOY_MATERIAL_SELECT_LIST}`, 'POST', {factory: val})
          },
          defaultValue: '',
          resVal: {
            resData: 'materielList.productionMateriel',
            label: ['MATERIAL_CODE', 'MATERIAL_NAME'],
            value: 'MATERIAL_CODE'
          }
        },
        {
          type: 'select',
          label: '领用物料',
          prop: 'useMaterielCode',
          optionsFn: (val) => {
            return this.$http(`${BASICDATA_API.DEPLOY_MATERIAL_SELECT_LIST}`, 'POST', {factory: val})
          },
          defaultValue: '',
          resVal: {
            resData: 'materielList.useMateriel',
            label: ['MATERIAL_CODE', 'MATERIAL_NAME'],
            value: 'MATERIAL_CODE'
          }
        },
        {
          type: 'select',
          label: '标识',
          prop: 'type',
          options: [{label: 'BL', value: 'BL'}, {label: 'LY', value: 'LY'}, {label: 'BL_LY', value: 'BL_LY'}],
          resVal: {
            label: ['label'],
            value: 'value'
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
  }
}
</script>

<style scoped>

</style>
