<template>
<div class="header_main">
  <el-tabs v-model="activeName" @tab-click="setType" class="NewDaatTtabs" type="border-card">
    <el-tab-pane name="1">
      <span slot="label" class="spanview">半成品罐区报表</span>
      <div class="titleLeft">
        <i class="iconfont factory-kucun" style="color: #666; margin-right: 10px;"></i>半成品罐区报表
        <el-button type="primary" size="small" @click="ExportExcelB(true)"  v-if="isAuth('ste:semi:reportFormExport')" style="background-color: #1890ff; color: #fff; float: right;">导出</el-button>
      </div>
      <el-table :data="tableData1" header-row-class-name="tableHead" border tooltip-effect="dark">
        <el-table-column v-for="(item, index) in column" :key="index" :prop="item.prop" :label="item.label" :width="item.width || ''" :formatter="item.formatter" :show-overflow-tooltip="true"></el-table-column>
      </el-table>
      <el-row >
        <el-pagination
          @size-change="handleSizeChange1"
          @current-change="handleCurrentChange1"
          :current-page="queryForm1.currPage"
          :page-sizes="[10, 20, 50]"
          :page-size="queryForm1.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="queryForm1.totalCount">
        </el-pagination>
      </el-row>
    </el-tab-pane>
    <el-tab-pane name="2">
      <span slot="label" class="spanview">成品罐区报表</span>
      <div class="titleLeft">
        <i class="iconfont factory-kucun" style="color: #666; margin-right: 10px;"></i>成品罐区报表
        <el-button type="primary" size="small" @click="ExportExcelB(true)"  v-if="isAuth('ste:semi:reportFormExport')" style="background-color: #1890ff; color: #fff; float: right;">导出</el-button>
      </div>
      <el-table :data="tableData2" header-row-class-name="tableHead" border tooltip-effect="dark">
        <el-table-column v-for="(item, index) in column" :key="index" :prop="item.prop" :label="item.label" :width="item.width || ''" :formatter="item.formatter" :show-overflow-tooltip="true"></el-table-column>
      </el-table>
      <el-row >
        <el-pagination
          @size-change="handleSizeChange2"
          @current-change="handleCurrentChange2"
          :current-page="queryForm2.currPage"
          :page-sizes="[10, 20, 50]"
          :page-size="queryForm2.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="queryForm2.totalCount">
        </el-pagination>
      </el-row>
    </el-tab-pane>
    <el-tab-pane name="3">
      <span slot="label" class="spanview">半成品库存汇总</span>
      <div class="titleLeft">
        <i class="iconfont factory-kucun" style="color: #666; margin-right: 10px;"></i>半成品库存汇总
        <el-button type="primary" size="small" @click="ExportExcelB(true)"  v-if="isAuth('ste:semi:steStock')" style="background-color: #1890ff; color: #fff; float: right;">导出</el-button>
      </div>
      <el-table :data="tableData3Top" header-row-class-name="tableHead" border tooltip-effect="dark" style="margin-bottom: 10px;">
        <el-table-column v-for="(item, index) in column1" :key="index" :prop="item.prop" :label="item.label" :width="item.width || ''" :formatter="item.formatter" :show-overflow-tooltip="true"></el-table-column>
      </el-table>
      <el-table :data="tableData3Bottom" header-row-class-name="tableHead" border tooltip-effect="dark">
        <el-table-column v-for="(item, index) in column2" :key="index" :prop="item.prop" :label="item.label" :width="item.width || ''" :formatter="item.formatter" :show-overflow-tooltip="true"></el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane name="4">
      <span slot="label" class="spanview">成品库存汇总</span>
      <div class="titleLeft">
        <i class="iconfont factory-kucun" style="color: #666; margin-right: 10px;"></i>成品库存汇总
        <el-button type="primary" size="small" @click="ExportExcelB(true)"  v-if="isAuth('ste:semi:steStock')" style="background-color: #1890ff; color: #fff; float: right;">导出</el-button>
      </div>
      <el-table :data="tableData4" header-row-class-name="tableHead" border tooltip-effect="dark">
        <el-table-column v-for="(item, index) in column3" :class="{bg: item.classSt}" :key="index" :prop="item.prop" :label="item.label" :width="item.width || ''" :formatter="item.formatter" :show-overflow-tooltip="true"></el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>
</div>
</template>

<script>
import { POTREPORTFORMS_API } from '@/api/api'
import { exportFile } from '@/net/validate'
export default {
  name: 'index',
  data () {
    return {
      activeName: this.$store.state.common.PotReportForms.type === 'steHolder' ? '1' : '2',
      plantList: {
        factory: this.$store.state.common.PotReportForms.factory,
        workShop: this.$store.state.common.PotReportForms.workShop
      },
      queryForm1: {
        currPage: 1,
        pageSize: 10,
        totalCount: 0
      },
      queryForm2: {
        currPage: 1,
        pageSize: 10,
        totalCount: 0
      },
      sumTableData1: [],
      sumTableData2: [],
      tableData1: [],
      tableData2: [],
      tableData3Top: [],
      tableData3Bottom: [],
      tableData4: [],
      column: [
        {
          label: '车间',
          prop: 'DEPT_NAME',
          width: ''
        },
        {
          label: '罐号',
          prop: 'HOLDER_NO',
          width: ''
        },
        {
          label: '物料编码',
          prop: 'MATERIAL_CODE',
          width: ''
        },
        {
          label: '物料名称',
          prop: 'MATERIAL_NAME',
          width: ''
        },
        {
          label: '批次',
          prop: 'BATCH',
          width: ''
        },
        {
          label: '数量',
          prop: 'AMOUNT',
          width: ''
        },
        {
          label: '单位',
          prop: 'UNIT',
          width: ''
        },
        {
          label: '存储时间（H）',
          prop: 'STORAGE_DATE',
          width: '150px'
        },
        {
          label: '状态',
          prop: 'HOLDER_STATUS',
          width: ''
        },
        {
          label: this.$store.state.common.PotReportForms.type === 'filterHolder' ? '满罐' : '搅罐',
          prop: this.$store.state.common.PotReportForms.type === 'filterHolder' ? 'FULL_DATE' : 'GN_END_TIME',
          width: ''
        },
        {
          label: '超期时间',
          prop: 'OVERDUE_DATE',
          width: ''
        },
        {
          label: '是否超期',
          prop: 'IS_OVERDUE',
          width: ''
        }
      ],
      column1: [
        {
          label: '物料编码',
          prop: 'materialCode',
          width: '120'
        },
        {
          label: '物料名称',
          prop: 'materialName',
          width: '120'
        },
        {
          label: '7天以上',
          prop: 'gtSevenDay',
          width: ''
        },
        {
          label: '7天',
          prop: 'sevenDay',
          width: ''
        },
        {
          label: '6天',
          prop: 'sixDay',
          width: ''
        },
        {
          label: '5天',
          prop: 'fiveDay',
          width: ''
        },
        {
          label: '4天',
          prop: 'fourDay',
          width: ''
        },
        {
          label: '3天',
          prop: 'threeDay',
          width: ''
        },
        {
          label: '<=44H',
          prop: 'ltThreeDay',
          width: ''
        },
        {
          label: '合计',
          prop: 'sumAmount',
          width: ''
        }
      ],
      column2: [
        {
          label: '物料编码',
          prop: 'materialCode',
          width: '120'
        },
        {
          label: '物料名称',
          prop: 'materialName',
          width: '120'
        },
        {
          label: '合计',
          prop: 'sumAmount',
          width: ''
        }
      ],
      column3: [
        {
          label: '物料编码',
          prop: 'materialCode',
          width: '120'
        },
        {
          label: '物料名称',
          prop: 'materialName',
          width: '120'
        },
        {
          label: '>36h',
          prop: 'gtThirtysixHour',
          width: ''
          // formatter: (row, column, value, index) => {
          //   let h = this.$createElement
          //   return h('div', {
          //     // style: {
          //     //   background: 'red'
          //     // }
          //   }, row.MATERIAL_NAME)
          // }
        },
        {
          label: '<=36h',
          prop: 'ltThirtysixHour',
          width: ''
        },
        {
          label: '<=30h',
          prop: 'ltThirtyHour',
          width: ''
        },
        {
          label: '<=24H',
          prop: 'ltTwentyfourHour',
          width: ''
        },
        {
          label: '<=18H',
          prop: 'ltEighteenHour',
          width: ''
        },
        {
          label: '<=12H',
          prop: 'ltTwelveHour',
          width: ''
        },
        {
          label: '合计',
          prop: 'sumAmount',
          width: ''
        }
      ]
    }
  },
  mounted () {
    this.GetDataList()
    let arr = ['ltTwoDay', 'twoDay', 'threeDay', 'fourDay', 'fiveDay', 'sixDay', 'sevenDay', 'eightDay', 'nineDay', 'tenDay', 'elevenDay', 'tenerDay', 'thirteenDay', 'fourteenDay', 'fifteenDay', 'gtfifteenDay']
    arr.forEach((item, index) => {
      this.column2.splice(2, 0, {
        label: `${index === 0 ? '<=16H' : index === arr.length - 1 ? index + '天以上' : index + 1 + '天'}`,
        prop: `${item}`,
        width: '90'
      })
    })
  },
  methods: {
    setType (tab, event) {
      if (this.activeName === '1') {
        this.$store.state.common.PotReportForms.type = 'steHolder'
        this.column[9] = {
          label: '搅罐',
          prop: 'GN_END_TIME',
          width: ''
        }
      } else if (this.activeName === '2') {
        this.$store.state.common.PotReportForms.type = 'filterHolder'
        this.column[9] = {
          label: '满罐',
          prop: 'FULL_DATE',
          width: ''
        }
      }
    },
    GetDataList () {
      if (this.isAuth('ste:semi:reportForm')) {
        this.$http(`${POTREPORTFORMS_API.POTREPORTFORMS_LIST}`, 'POST', this.plantList).then(({data}) => {
          if (data.code === 0) {
            this.sumTableData1 = data.returnMap.steHolder
            this.sumTableData2 = data.returnMap.filterHolder
            this.queryForm1.totalCount = data.returnMap.steHolder.length
            this.queryForm2.totalCount = data.returnMap.filterHolder.length
            this.tableData1 = data.returnMap.steHolder.slice((this.queryForm1.currPage - 1) * this.queryForm1.pageSize, (this.queryForm1.currPage - 1) * this.queryForm1.pageSize + this.queryForm1.pageSize)
            this.tableData2 = data.returnMap.filterHolder.slice((this.queryForm2.currPage - 1) * this.queryForm2.pageSize, (this.queryForm2.currPage - 1) * this.queryForm2.pageSize + this.queryForm2.pageSize)
          } else {
            this.$error_SHINHO(data.msg)
          }
        })
      }
      if (this.isAuth('ste:semi:steStock')) {
        this.$http(`${POTREPORTFORMS_API.POTREPORTFORMS_STOCK_LIST}`, 'POST', this.plantList).then(({data}) => {
          if (data.code === 0) {
            this.tableData3Top = data.steStork.steHolder.steStork
            this.tableData3Bottom = data.steStork.steHolder.steHsStork
            this.tableData4 = data.steStork.filterHolder
          } else {
            this.$error_SHINHO(data.msg)
          }
        })
      }
    },
    ExportExcelB () {
      exportFile(`${POTREPORTFORMS_API.POTREPORTFORMS_OUT}`, '罐区报表', this)
    },
    ExportExcelA () {
      exportFile(`${POTREPORTFORMS_API.POTREPORTFORMS_STOCK_OUT}`, '库存报表', this)
    },
    // 改变每页条数
    handleSizeChange1 (val) {
      this.queryForm1.pageSize = val
      this.tableData1 = this.sumTableData1.slice((this.queryForm1.currPage - 1) * this.queryForm1.pageSize, (this.queryForm1.currPage - 1) * this.queryForm1.pageSize + this.queryForm1.pageSize)
    },
    // 跳转页数
    handleCurrentChange1 (val) {
      this.queryForm1.currPage = val
      this.tableData1 = this.sumTableData1.slice((this.queryForm1.currPage - 1) * this.queryForm1.pageSize, (this.queryForm1.currPage - 1) * this.queryForm1.pageSize + this.queryForm1.pageSize)
    },
    // 改变每页条数
    handleSizeChange2 (val) {
      this.queryForm2.pageSize = val
      this.tableData2 = this.sumTableData2.slice((this.queryForm2.currPage - 1) * this.queryForm2.pageSize, (this.queryForm2.currPage - 1) * this.queryForm2.pageSize + this.queryForm2.pageSize)
    },
    // 跳转页数
    handleCurrentChange2 (val) {
      this.queryForm.currPage = val
      this.tableData2 = this.sumTableData2.slice((this.queryForm2.currPage - 1) * this.queryForm2.pageSize, (this.queryForm2.currPage - 1) * this.queryForm2.pageSize + this.queryForm2.pageSize)
    }
  },
  computed: {},
  components: {}
}
</script>

<style scoped>
.bg {
  background: red;
}
</style>
