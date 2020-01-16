<template>
  <div class="header_main">
    <query-table
      ref="queryTable"
      :queryFormData="queryFormData"
      :getListField="'packing'"
      :showPage="false"
      :list-interface="listInterface"
      @get-data-success="getDataSuccess"
      :query-auth="'report:production:packing'"
      :spanMethod="spanMethod"
      :column="column"
      :export-excel="true"
      :export-option="exportOption">
    </query-table>
  </div>
</template>

<script>
import { BASICDATA_API, REP_API } from '@/api/api'
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
        },
        {
          type: 'date-picker',
          label: '月份',
          prop: 'productDate',
          dataType: 'month',
          valueFormat: 'yyyy-MM'
        }
      ],
      listInterface: (params) => {
        return this.$http(`${REP_API.PKGSPECANDOUTPUT_LIST}`, 'POST', params)
      },
      spanMethod: ({ row, column, rowIndex, columnIndex }) => {
        if (row.brand * 1 > 1000) {
          row.brand = '大包装'
        }
        if (row.brand * 1 === 1000) {
          row.brand = '1L'
        }
        if (row.brand === '总计') {
          if (columnIndex === 0) {
            return [1, 3]
          } else if (columnIndex === 1) {
            return [0, 0]
          } else if (columnIndex === 2) {
            return [0, 0]
          }
        }
        if (columnIndex === 0 || columnIndex === 4 || columnIndex === 6) {
          return {
            rowspan: row.mergeNums,
            colspan: 1
          }
        } else {
          return {
            rowspan: 1,
            colspan: 1
          }
        }
      },
      exportOption: {
        exportInterface: REP_API.PKGSPECANDOUTPUT_OUT,
        auth: 'report:production:packingExport',
        text: '包装规格&品项产量分析报表导出'
      },
      column: [
        {
          prop: 'brand',
          label: '品相'
        },
        {
          prop: 'productLine',
          label: '产线'
        },
        {
          prop: 'type',
          label: '类别'
        },
        {
          prop: 'boxNums',
          label: '箱数'
        },
        {
          prop: 'boxNumsSum',
          label: '小计'
        },
        {
          prop: 'squareNums',
          label: '方数'
        },
        {
          prop: 'squareNumsSum',
          label: '小计'
        }
      ]
    }
  },
  mounted () {
  },
  methods: {
    getDataSuccess (data) {
      this.$refs.queryTable.tableData.push({
        brand: '总计',
        productLine: '',
        type: '',
        boxNums: this.$refs.queryTable.tableData[0].boxNumsTotal,
        boxNumsSum: '',
        squareNums: this.$refs.queryTable.tableData[0].squareNumsTotal,
        squareNumsSum: '',
        boxNumsTotal: 0,
        squareNumsTotal: 0,
        mergeNums: 1
      })
    }
  },
  computed: {},
  components: {}
}
</script>

<style scoped>

</style>
