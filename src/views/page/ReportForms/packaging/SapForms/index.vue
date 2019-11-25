<template>
  <div class="header_main">
    <query-table
      ref="queryTable"
      :queryFormData="queryFormData"
      :list-interface="listInterface"
      :query-auth="'report:form:listMaterial'"
      :column="column"
      :export-excel="true"
      :export-option="exportOption">
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
          linkageProp: ['workshop']
        },
        {
          type: 'select',
          label: '生产车间',
          prop: 'workshop',
          optionsFn: (val) => {
            return this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', { deptId: val, deptName: '包装 组装' })
          },
          resVal: {
            resData: 'typeList',
            label: ['deptName'],
            value: 'deptId'
          },
          linkageProp: ['productline']
        },
        {
          type: 'select',
          label: '生产产线',
          prop: 'productline',
          resVal: {
            resData: 'childList',
            label: ['deptName'],
            value: 'deptId'
          },
          optionsFn: (val) => {
            return this.$http(`${BASICDATA_API.FINDORGBYPARENTID_API}`, 'POST', { parentId: val })
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
        return this.$http(`${REP_API.REPSAPLIST_API}`, 'POST', params)
      },
      exportOption: {
        exportInterface: REP_API.REPSAPOUTPUT_API,
        auth: 'report:form:exportMaterial',
        text: '物料领用报表数据导出'
      },
      column: [
        {
          prop: 'productDate',
          label: '生产日期',
          width: '100'
        },
        {
          prop: 'factoryName',
          label: '工厂',
          width: '90'
        },
        {
          prop: 'workShopName',
          label: '车间',
          width: '95'
        },
        {
          prop: 'productLineName',
          label: '产线',
          width: '70'
        },
        {
          prop: 'orderNo',
          label: '生产订单',
          width: '120'
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
          prop: 'materialCode',
          label: '组件物料',
          width: '180',
          formatter: (row, column, value, index) => {
            return row.materialCode + ' ' + row.materialName
          }
        },
        {
          prop: 'batchP',
          label: '组件物料批次',
          width: '120'
        },
        {
          prop: 'unitP',
          label: '单位',
          width: '50'
        },
        {
          prop: 'productUseNumP',
          label: '生产使用',
          width: '80',
          formatter: (row, column, value, index) => {
            return row.productUseNumP ? row.productUseNumP : row.productUseNumS
          }
        },
        {
          prop: 'classLoss',
          label: '本班损耗',
          width: '80'
        },
        {
          prop: 'belowGradeNum',
          label: '不合格数',
          width: '80'
        },
        {
          prop: 'badBatch',
          label: '不良批次',
          width: '80'
        },
        {
          prop: 'manufacturers',
          label: '厂家',
          width: '80'
        },
        {
          prop: 'potNo',
          label: '领用罐号',
          width: '90'
        },
        {
          prop: 'filterDate',
          label: '过滤日期',
          width: '120'
        },
        {
          prop: 'changePotDate',
          label: '换罐时间',
          width: '120'
        },
        {
          prop: 'usePotDate',
          label: '用完时间',
          width: '120'
        }
      ]
    }
  },
  mounted () {
  },
  methods: {
  },
  computed: {},
  components: {
  }
}
</script>

<style scoped>

</style>
