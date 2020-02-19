<template>
  <div class="header_main">
    <query-table
      ref="queryTable"
      :queryFormData="queryFormData"
      :list-interface="listInterface"
      :query-auth="'report:production:packing'"
      :column="column"
      :export-excel="true"
      :export-option="exportOption">
    </query-table>
  </div>
</template>

<script>
import { dateFormat } from '@/net/validate'
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
          defaultValue: dateFormat(new Date(), 'yyyy-MM'),
          valueFormat: 'yyyy-MM'
        }
      ],
      listInterface: (params) => {
        return this.$http(`${REP_API.PKGSPECANDOUTPUT_LIST}`, 'POST', params)
      },
      exportOption: {
        exportInterface: REP_API.PKGSPECANDOUTPUT_OUT,
        auth: 'report:production:packingExport',
        text: 'JBS出品率'
      },
      column: [
        {
          prop: 'brand',
          label: '大类'
        },
        {
          prop: 'productLine',
          label: '单位'
        },
        {
          prop: 'type',
          label: 'JBS出库数'
        },
        {
          prop: 'boxNums',
          label: '过滤领用数'
        },
        {
          prop: 'boxNumsSum',
          label: 'JBS出品率'
        }
      ]
    }
  },
  mounted () {
  },
  methods: {
  },
  computed: {},
  components: {}
}
</script>

<style scoped>

</style>
