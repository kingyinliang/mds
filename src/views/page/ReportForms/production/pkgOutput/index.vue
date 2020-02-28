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
    <el-table :data="tableData">
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
    </el-table>
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
      }
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
        this.$refs.queryTable.tableData = [{
          item0: 395062,
          item1: 5551722.86,
          item2: 469521.2,
          item3: 1656567.8,
          item4: 5620.5,
          item5: 344197.5,
          item6: 14595,
          item7: 21957
        }]
      }
    }
  },
  computed: {},
  components: {}
}
</script>

<style scoped>

</style>
