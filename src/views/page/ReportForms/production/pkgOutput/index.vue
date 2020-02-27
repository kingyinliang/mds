<template>
  <div class="header_main">
    <query-table
      ref="queryTable"
      :queryFormData="queryFormData"
      :getListField="'packing'"
      :showPage="false"
      :list-interface="listInterface"
      @get-data-success="getDataSuccess"
      :query-auth="'report:fromEs:materialSummary'"
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
        return this.$http(`${REP_API.PKGOUTPUT_LIST_API}`, 'POST', params)
      },
      spanMethod: ({ row, column, rowIndex, columnIndex }) => {
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
        exportInterface: REP_API.PKGOUTPUT_EXPORT_API,
        auth: 'report:fromEs:expectMaterialSummary',
        text: '包装品项产量汇总导出'
      },
      column: [
        {
          prop: 'brand',
          label: '包装品项产量汇总'
        }
      ]
    }
  },
  mounted () {
  },
  methods: {
    getDataSuccess (data) {
      if (data.list.length) {
        let arr = []
        let keyIndex = 0
        for (var item of data.list) {
          let arrTwo = []
          if (item.summary.length) {
            for (var it of item.summary) {
              arrTwo.push({
                label: it.largeClassName,
                prop: 'item' + keyIndex
              })
              keyIndex++
            }
          }
          arr.push({
            label: item.brand,
            child: arrTwo
          })
        }
        console.log(arr)
        let obj = {}
        let num = 0
        for (var items of data.content) {
          obj['item' + num] = items
          num++
        }
        console.log(obj)
        this.column = arr
        this.$refs.queryTable.tableData = [obj]
      }
    }
  },
  computed: {},
  components: {}
}
</script>

<style scoped>

</style>
