<template>
  <div class="header_main">
    <query-table
      ref="queryTable"
      :queryFormData="queryFormData"
      :list-interface="listInterface"
      :query-auth="'report:formh:getAllStatusList'"
      :column="column">
    </query-table>
  </div>
</template>

<script>
import { BASICDATA_API } from '@/api/api'
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
          },
          linkageProp: ['workShop']
        },
        {
          type: 'select',
          label: '生产车间',
          prop: 'workShop',
          optionsFn: (val) => {
            return this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', { deptId: val, deptName: '' })
          },
          resVal: {
            resData: 'typeList',
            label: ['deptName'],
            value: 'deptId'
          }
        },
        {
          type: 'select',
          label: '名称',
          prop: 'name',
          filterable: true
        },
        {
          type: 'date-picker',
          label: '时间',
          prop: 'productDate',
          dataType: 'month',
          valueFormat: 'yyyy-MM'
        }
      ],
      listInterface: (params) => {
        return this.$http(`${BASICDATA_API.REPMADIFFLIST_API}`, 'POST', params)
      },
      column: [
        {
          prop: 'productDate',
          label: '名称'
        },
        {
          prop: 'factoryName',
          label: '数值'
        },
        {
          prop: 'factoryName',
          label: '时间'
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
