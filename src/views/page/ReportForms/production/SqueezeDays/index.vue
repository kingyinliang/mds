<template>
  <div class="header_main">
    <query-table
      ref="queryTable"
      :queryFormData="queryFormData"
      :list-interface="listInterface"
      :query-auth="'report:formh:getAllStatusList'"
      :tabs="tabs"
      @get-data-success="setData">
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
          }
        },
        {
          type: 'date-picker',
          label: '月份',
          prop: 'productDate',
          dataType: 'month',
          valueFormat: 'yyyy-MM'
        }
      ],
      listInterface: (params) => {
        return this.$http(`${BASICDATA_API.REPMADIFFLIST_API}`, 'POST', params)
      },
      tabs: [
        {
          label: '压榨一',
          tableData: [],
          column: [
            {
              prop: 'factoryName',
              label: '名称'
            },
            {
              label: '领用/m³',
              child: [{
                prop: 'factoryName',
                label: '普通酱醪'
              }]
            },
            {
              label: '产出/m³',
              child: [{
                prop: 'factoryName',
                label: '普通原汁'
              }]
            },
            {
              label: '生产笼数/笼',
              child: [{
                prop: 'factoryName',
                label: '一期'
              }, {
                prop: 'factoryName',
                label: '二期'
              }, {
                prop: 'factoryName',
                label: '三期'
              }, {
                prop: 'factoryName',
                label: '四期'
              }]
            },
            {
              prop: 'factoryName',
              label: '酱渣板数/板'
            },
            {
              prop: 'factoryName',
              label: '出油率/%'
            },
            {
              prop: 'factoryName',
              label: '名称'
            },
            {
              label: '领用/m³',
              child: [{
                prop: 'factoryName',
                label: 'JYTB酱醪'
              }]
            },
            {
              label: '产出/m³',
              child: [{
                prop: 'factoryName',
                label: 'TB原汁'
              }]
            },
            {
              label: '生产笼数/笼',
              child: [{
                prop: 'factoryName',
                label: '一期'
              }, {
                prop: 'factoryName',
                label: '二期'
              }, {
                prop: 'factoryName',
                label: '三期'
              }, {
                prop: 'factoryName',
                label: '四期'
              }]
            },
            {
              prop: 'factoryName',
              label: '酱渣板数/板'
            },
            {
              prop: 'factoryName',
              label: '出油率/%'
            }
          ]
        },
        {
          label: '压榨二',
          tableData: [],
          column: [
            {
              prop: 'factoryName',
              label: '名称'
            },
            {
              label: '领用/m³',
              child: [{
                prop: 'factoryName',
                label: '普通酱醪'
              }]
            },
            {
              label: '产出/m³',
              child: [{
                prop: 'factoryName',
                label: '普通原汁'
              }]
            },
            {
              label: '生产笼数/笼',
              child: [{
                prop: 'factoryName',
                label: '一期'
              }, {
                prop: 'factoryName',
                label: '二期'
              }, {
                prop: 'factoryName',
                label: '三期'
              }, {
                prop: 'factoryName',
                label: '四期'
              }]
            },
            {
              prop: 'factoryName',
              label: '酱渣板数/板'
            },
            {
              prop: 'factoryName',
              label: '出油率/%'
            }
          ]
        }
      ]
    }
  },
  mounted () {
  },
  methods: {
    setData (data) {}
  },
  computed: {},
  components: {}
}
</script>

<style scoped>

</style>
