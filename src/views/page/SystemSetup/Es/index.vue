<template>
  <div class="header_main">
    <query-table
      ref="queryTable"
      :rules="rules"
      :queryFormData="queryFormData"
      :list-interface="listInterface"
      @get-data-success="getDataSuccess"
      :customData="true"
      :query-auth="'esCommon:iot'"
      :column="column">
    </query-table>
  </div>
</template>

<script>
import { BASICDATA_API, SYSTEMSETUP_API } from '@/api/api'
export default {
  name: 'index',
  data () {
    return {
      rules: [
        {
          prop: 'factory',
          text: '请选择生产工厂'
        },
        {
          prop: 'workShopid',
          text: '请选择生产车间'
        },
        {
          prop: 'startDate',
          text: '请选择时间'
        },
        {
          prop: 'endDate',
          text: '请选择时间'
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
          },
          linkageProp: ['workShopid']
        },
        {
          type: 'select',
          label: '生产车间',
          prop: 'workShopid',
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
          type: 'input',
          label: '名称',
          prop: 'name'
        },
        {
          type: 'date-interval',
          label: '时间',
          dataType: 'datetime',
          prop: 'startDate',
          propTwo: 'endDate',
          valueFormat: 'yyyy-MM-dd HH:mm:ss'
        }
      ],
      listInterface: (params) => {
        params.werks = this.$refs.queryTable.optionLists.factory.filter(it => it.deptId === params.factory)[0].deptCode
        params.workShop = this.$refs.queryTable.optionLists.workShopid.filter(it => it.deptId === params.workShopid)[0].deptCode
        // params.werks = '7101'
        // params.workShop = 'BZ1'
        return this.$http(`${SYSTEMSETUP_API.ES_LIST_API}`, 'POST', params)
      },
      column: [
        {
          prop: 'name',
          label: '名称'
        },
        {
          prop: 'v',
          label: '数值',
          width: '120'
        },
        {
          prop: 'datetime',
          label: '时间'
        }
      ]
    }
  },
  mounted () {
  },
  methods: {
    getDataSuccess (data) {
      this.$refs.queryTable.tableData = data.page.content
      this.$refs.queryTable.currPage = data.page.pageNumber
      this.$refs.queryTable.pageSize = data.page.pageSize
      this.$refs.queryTable.totalCount = data.page.total
    }
  },
  computed: {},
  components: {}
}
</script>

<style scoped>

</style>
