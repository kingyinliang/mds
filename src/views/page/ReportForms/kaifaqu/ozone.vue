<template>
  <div class="header_main">
    <query-table
      ref="queryTable"
      :queryFormData="queryFormData"
      :list-interface="listInterface"
      :query-auth="'report:formh:getAllStatusList'"
      :column="column"
      :export-excel="true"
      :export-option="exportOption"
      :showPage="false">
    </query-table>
  </div>
</template>

<script>
import { REP_API, BASICDATA_API } from '@/api/api'
export default {
  name: 'index',
  data () {
    return {
      queryFormData: [
        {
          type: 'select',
          label: '名称',
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
          type: 'date-interval',
          label: '时间选择',
          dataType: 'month',
          prop: 'productDate',
          propTwo: 'productDate2'
        },
        {
          type: 'input',
          label: '限定值',
          dataType: 'month',
          prop: 'productDate'
        }
      ],
      listInterface: (params) => {
        return this.$http(`${REP_API.DAYS_REPROT_LIST}`, 'POST', params)
      },
      exportOption: {
        exportInterface: REP_API.ORDER_STATUS_OUT_API,
        auth: 'report:formh:getAllStatusList',
        text: '制曲日报表数据导出'
      },
      column: [
        {
          prop: 'theDate',
          label: '名称'
        },
        {
          prop: 'workShopName',
          label: '数值'
        },
        {
          prop: 'productLineName',
          label: '时间'
        }
      ]
    }
  },
  mounted () {},
  methods: {
  },
  computed: {},
  components: {
  }
}
</script>

<style scoped>

</style>
