<template>
<div class="audit-card">
  <div class="audit"><i class="title-icon"></i><span>审核日志</span></div>
  <el-table
    class="newTable"
    :data="tableData"
    header-row-class-name="tableHead"
    border
    style="width: 100%;">
    <el-table-column
      label="序号"
      type="index"
      width="180">
    </el-table-column>
    <el-table-column
      prop="status"
      label="审核动作"
      width="180">
      <template slot-scope="scope">{{scope.row.status === 'noPass'? '不通过':scope.row.status === 'checked'? '通过' : scope.row.status === 'submit'?  '反审' : '' }}</template>
    </el-table-column>
    <el-table-column
      prop="memo"
      label="审核意见">
    </el-table-column>
    <el-table-column
      prop="verify_man"
      label="审核人">
    </el-table-column>
    <el-table-column
      prop="verify_date"
      label="审核时间">
    </el-table-column>
  </el-table>
</div>
</template>

<script>
export default {
  name: 'AuditLog',
  props: {
    tableData: {}
  },
  data () {
    return {}
  },
  mounted () {
  },
  methods: {},
  computed: {},
  components: {}
}
</script>

<style lang="scss" scoped>
.audit-card {
  box-shadow: 3px 3px 4px 0 rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(171, 171, 171, 0.5);
  padding: 12px 16px;
}
.audit {
  line-height: 40px;
  .title-icon {
    float: left;
    width: 4px;
    height: 12px;
    background: #487bff;
    border-radius: 2px;
    margin-top: 10px;
    margin-right: 5px;
  }
  i {
    font-size: 22px;
    float: left;
  }
  span {
    margin-left: 12px;
    font-size: 16px;
    font-weight: bold;
  }
}
</style>
