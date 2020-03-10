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
      :show-table="false"
      :export-excel="true"
      :export-option="exportOption">
      <template slot="card-main" slot-scope="data">
        <el-table :data="tableData" :span-method="spanMethod" class="newTable borderTable">
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
      </template>
    </query-table>
  </div>
</template>

<script>
import { BASICDATA_API, REP_API } from '@/api/api'
import { accAdd, dateFormat, accSub } from '@/net/validate'
export default {
  name: 'index',
  data () {
    // let self = this
    return {
      tableData: [],
      datas: [],
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
          valueFormat: 'yyyy-MM',
          defaultValue: dateFormat(new Date(), 'yyyy-MM')
        }
      ],
      listInterface: (params) => {
        return this.$http(`${REP_API.PKGOUTPUT_LIST_API}`, 'POST', params)
      },
      spanMethod: ({ row, column, rowIndex, columnIndex }) => {
        if (rowIndex === 1) {
          if (columnIndex === Number(accSub(this.datas.length, 2))) {
            return {
              rowspan: 2,
              colspan: 2
            }
          } else {
            if (this.tableData[1].spanMethodObj.hasOwnProperty(columnIndex)) {
              return {
                rowspan: 1,
                colspan: this.tableData[1].spanMethodObj[columnIndex]
              }
            } else {
              return {
                rowspan: 1,
                colspan: 0
              }
            }
          }
        } else if (rowIndex === 2 && this.datas.length > 2) {
          return {
            rowspan: 1,
            colspan: Number(accSub(this.datas.length, 2))
          }
        }
      },
      column: [],
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
        this.datas = data.content
        let arr = []
        let keyIndex = 0
        for (var item of data.list) {
          let arrTwo = []
          let spanMethodNum = 0
          let spanMethod = 0
          if (item.summary.length) {
            for (var it of item.summary) {
              arrTwo.push({
                label: it.largeClassName,
                prop: 'item' + keyIndex
              })
              keyIndex++
              spanMethodNum++
              spanMethod = accAdd(spanMethod, it.amount)
            }
          }
          arr.push({
            label: item.brand,
            child: arrTwo,
            spanMethodNum: spanMethodNum,
            spanMethod: spanMethod
          })
        }
        let obj = {}
        let obj1 = {
          spanMethodObj: {},
          spanMethodArr: []
        }
        let obj2 = {
          item0: data.total
        }
        let num = 0
        let sNum = 0
        arr.forEach((item, index) => {
          obj1['item' + sNum] = item.spanMethod
          obj1.spanMethodObj[sNum] = item.spanMethodNum
          obj1.spanMethodArr.push(sNum)
          sNum += item.spanMethodNum
        })
        for (var items of data.content) {
          obj['item' + num] = items
          num++
        }
        this.column = arr
        if (arr.length > 1) {
          this.tableData = [obj, obj1, obj2]
        } else {
          this.tableData = [obj, obj1]
        }
      }
    }
  },
  computed: {},
  components: {}
}
</script>

<style scoped>

</style>
