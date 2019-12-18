<template>
  <div class="header_main">
    <query-table
      ref="queryTable"
      :queryFormData="queryFormData"
      :list-interface="listInterface"
      :query-auth="'report:formh:getAllStatusList'"
      :column="column"
      :export-excel="true"
      :export-option="exportOption">
    </query-table>
  </div>
</template>

<script>
import { REP_API, BASICDATA_API } from '@/api/api'
export default {
  name: 'JuiceOccupation',
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
          linkageProp: ['workShop']
        },
        {
          type: 'select',
          label: '生产车间',
          prop: 'workShop',
          optionsFn: (val) => {
            return this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', { deptId: val, deptName: '' })
          },
          resVal: {
            resData: 'typeList',
            label: ['deptName'],
            value: 'deptId'
          }
        },
        {
          type: 'input',
          label: '生产订单',
          prop: 'orderNo'
        },
        {
          type: 'select',
          label: '品项',
          prop: 'materialCode',
          filterable: true,
          resVal: {
            resData: 'list',
            label: ['sapCode', 'itemName'],
            value: 'sapCode'
          },
          defaultValue: '',
          defaultOptionsFn: (val) => {
            return this.$http(`${BASICDATA_API.FINDSAP_API}`, 'POST', {params: ''}, false, false, false)
          }
        },
        {
          type: 'date-interval',
          label: '生产日期',
          prop: 'commitDateOne',
          propTwo: 'commitDateTwo'
        }
      ],
      listInterface: (params) => {
        return this.$http(`${REP_API.ORDER_STATUS_LIST_API}`, 'POST', params)
      },
      exportOption: {
        exportInterface: REP_API.ORDER_STATUS_OUT_API,
        auth: 'report:formh:getAllStatusList',
        text: '原汁占用报表数据导出'
      },
      column: [
        {
          prop: 'factoryName',
          label: '工厂'
        },
        {
          prop: 'workShopName',
          label: '车间'
        },
        {
          prop: 'productDate',
          label: '生产日期'
        },
        {
          prop: 'materialNameH',
          label: '生产物料',
          width: '180',
          formatter: (row, column, value, index) => {
            return row.materialCodeH + ' ' + row.materialNameH
          }
        },
        {
          prop: 'batch',
          label: '生产批次',
          width: '120'
        },
        {
          prop: 'belowGradeNum',
          label: '数量',
          width: '80'
        },
        {
          prop: 'unitP',
          label: '单位',
          width: '50'
        }
      ]
    }
  },
  mounted () {
  },
  methods: {},
  computed: {},
  components: {}
}
</script>

<style scoped>

</style>
