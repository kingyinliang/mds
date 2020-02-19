<template>
  <div class="header_main">
    <query-table
      ref="queryTable"
      :rules="rules"
      :queryFormData="queryFormData"
      :list-interface="listInterface"
      :query-auth="'juice:occupy:report'"
      :column="column"
      :export-excel="true"
      :export-option="exportOption">
    </query-table>
  </div>
</template>

<script>
import { dateFormat } from '@/net/validate'
import { REP_API, BASICDATA_API } from '@/api/api'
export default {
  name: 'JuiceOccupation',
  data () {
    return {
      rules: [
        {
          prop: 'factory',
          text: '请选择工厂'
        }
      ],
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
          defaultValue: dateFormat(new Date(), 'yyyy-MM'),
          valueFormat: 'yyyy-MM'
        }
      ],
      listInterface: (params) => {
        return this.$http(`${REP_API.JUICEOCCUPATION_LIST}`, 'POST', params)
      },
      exportOption: {
        exportInterface: REP_API.JUICEOCCUPATION_OUT,
        auth: 'juice:occupy:export',
        text: '原汁占用报表数据导出'
      },
      column: [
        {
          prop: 'factory',
          label: ' '
        },
        {
          prop: 'factory',
          label: '<30'
        },
        {
          prop: 'workShop',
          label: '30≤N<60'
        },
        {
          prop: 'productDate',
          label: '60≤N<90'
        },
        {
          prop: 'material',
          label: '90≤N<130',
          width: '200'
        },
        {
          prop: 'batch',
          label: '130≤N<150',
          width: '120'
        },
        {
          prop: 'amount',
          label: '150≤N<180'
        },
        {
          prop: 'unit',
          label: '150≤N<180',
          width: '50'
        },
        {
          prop: 'unit',
          label: '200≤N',
          width: '50'
        }
      ]
    }
  },
  mounted () {
  },
  methods: {},
  computed: {},
  components: {}
}
</script>

<style scoped>

</style>
