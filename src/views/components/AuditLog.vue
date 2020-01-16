<template>
<mds-card :title="'审核日志'" :name="name" :iconBg="'#f05c4a'">
  <el-table class="newTable" :data="tableData" header-row-class-name="tableHead" border style="width: 100%; max-height: 200px;">
    <el-table-column label="序号" type="index" width="180"></el-table-column>
    <el-table-column prop="status" label="审核动作" width="180">
      <template slot-scope="scope">{{scope.row.status === 'noPass'? '不通过':scope.row.status === 'checked'? '通过' : scope.row.status === 'submit'?  '反审' : '' }}</template>
    </el-table-column>
    <el-table-column prop="memo" label="审核意见"></el-table-column>
    <el-table-column prop="verify_man" label="审核人"></el-table-column>
    <el-table-column prop="verify_date" label="审核时间"></el-table-column>
  </el-table>
</mds-card>
</template>

<script>
import { ShowHiddenNameBox } from '@/utils/index'
export default {
  name: 'AuditLog',
  props: {
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    },
    name: {
      type: String,
      default: 'audit'
    }
  },
  data () {
    return {}
  },
  mounted () {
    ShowHiddenNameBox(this.$)
  },
  methods: {},
  computed: {},
  components: {}
}
</script>

<style lang="scss" scoped>
</style>
