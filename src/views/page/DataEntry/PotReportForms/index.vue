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
export default {
  name: 'index',
  data () {
    return {
      queryForm: {
        currPage: 1,
        pageSize: 10,
        totalCount: 0
      },
      tableData: [],
      column: [
        {
          label: '车间',
          prop: '',
          width: ''
        },
        {
          label: '罐号',
          prop: '',
          width: ''
        },
        {
          label: '物料编码',
          prop: '',
          width: ''
        },
        {
          label: '物料名称',
          prop: '',
          width: ''
        },
        {
          label: '批次',
          prop: '',
          width: ''
        },
        {
          label: '存储时间（H）',
          prop: '',
          width: '150px'
        },
        {
          label: '状态',
          prop: '',
          width: ''
        },
        {
          label: '搅罐',
          prop: '',
          width: ''
        },
        {
          label: '超期时间',
          prop: '',
          width: ''
        },
        {
          label: '是否超期',
          prop: '',
          width: ''
        }
      ]
    }
  },
  mounted () {
  },
  methods: {
    GetDataList () {},
    // 改变每页条数
    handleSizeChange (val) {
      this.queryForm.pageSize = val
      this.GetDataList()
    },
    // 跳转页数
    handleCurrentChange (val) {
      this.queryForm.currPage = val
      this.GetDataList()
    }
  },
  computed: {},
  components: {}
}
</script>

<style scoped>

</style>
