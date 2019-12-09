<template>
<div class="header_main">
  <el-table :data="tableData" header-row-class-name="tableHead" border tooltip-effect="dark">
    <el-table-column v-for="(item, index) in column" :key="index" :prop="item.prop" :label="item.label" :width="item.width || ''" :formatter="item.formatter" :show-overflow-tooltip="true"></el-table-column>
  </el-table>
  <el-row >
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryForm.currPage"
      :page-sizes="[10, 20, 50]"
      :page-size="queryForm.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="queryForm.totalCount">
    </el-pagination>
  </el-row>
</div>
</template>

<script>
import { POTREPORTFORMS_API } from '@/api/api'
export default {
  name: 'index',
  data () {
    return {
      queryForm: {
        workShop: this.$store.state.common.PotReportForms.workShop,
        currPage: 1,
        pageSize: 10,
        totalCount: 0
      },
      sumTableData: [],
      tableData: [],
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
          prop: '',
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
      ]
    }
  },
  mounted () {
    this.GetDataList(true)
  },
  methods: {
    GetDataList (st) {
      if (st) {
        this.queryForm.currPage = 1
      }
      this.$http(`${POTREPORTFORMS_API.POTREPORTFORMS_LIST}`, 'POST', this.queryForm).then(({data}) => {
        if (data.code === 0) {
          this.sumTableData = data.returnMap[this.$store.state.common.PotReportForms.type]
          this.queryForm.totalCount = data.returnMap[this.$store.state.common.PotReportForms.type].length
          this.tableData = data.returnMap[this.$store.state.common.PotReportForms.type].slice((this.queryForm.currPage - 1) * this.queryForm.pageSize, (this.queryForm.currPage - 1) * this.queryForm.pageSize + this.queryForm.pageSize)
        } else {
          this.$notify.error({title: '错误', message: data.msg})
        }
      })
    },
    // 改变每页条数
    handleSizeChange (val) {
      this.queryForm.pageSize = val
      this.tableData = this.sumTableData.slice((this.queryForm.currPage - 1) * this.queryForm.pageSize, (this.queryForm.currPage - 1) * this.queryForm.pageSize + this.queryForm.pageSize)
    },
    // 跳转页数
    handleCurrentChange (val) {
      this.queryForm.currPage = val
      this.tableData = this.sumTableData.slice((this.queryForm.currPage - 1) * this.queryForm.pageSize, (this.queryForm.currPage - 1) * this.queryForm.pageSize + this.queryForm.pageSize)
    }
  },
  computed: {},
  components: {}
}
</script>

<style scoped>

</style>
