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
      :fixTableHeightFromTop="180"
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
            return this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', { deptId: val, deptName: '制曲' })
          },
          resVal: {
            resData: 'typeList',
            label: ['deptName'],
            value: 'deptId'
          }
        },
        {
          type: 'date-picker',
          label: '选择月份',
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
          label: '工序',
          fixed: 'left'
        },
        {
          prop: 'workShopName',
          label: '炒麦',
          child: [{
            label: '小麦/kg',
            prop: 'wheat'
          }, {
            label: '粉麦数/kg',
            prop: 'wheatFlour',
            width: '120'
          }, {
            label: '粉麦率/%',
            prop: 'wheatFlourRate',
            width: '120'
          }, {
            label: '损耗率/%',
            prop: 'wheatFlourLossRate',
            width: '120'
          }]
        },
        {
          prop: 'productLineName',
          label: 'PW小麦',
          child: [
            {
              label: '小麦/kg',
              prop: 'pwWheatOut'
            }, {
              label: 'PW小麦/kg',
              prop: 'pwWheatIn',
              width: '120'
            }, {
              label: '小颗粒/kg',
              prop: 'pwWheatSmall',
              width: '120'
            }, {
              label: '出仁率/%',
              prop: 'pwKernelRate',
              width: '120'
            }, {
              label: '损耗率/%',
              prop: 'pwKernelLossRate',
              width: '120'
            }
          ]
        },
        {
          prop: 'productDate',
          label: '制曲',
          child: [
            {
              label: '豆粕/kg',
              prop: 'zhiquPulp'
            }, {
              label: '小麦粉/kg',
              prop: 'zhiquWheatFlour',
              width: '120'
            }, {
              label: '盐水/方',
              prop: 'zhiquSalt'
            }, {
              label: '菌种/盒',
              prop: 'zhiquBacteria'
            }, {
              label: '入曲/批',
              prop: 'zhiquHolderPatch'
            }, {
              label: '曲房号/号',
              prop: 'zhiquHouseNo',
              width: '120',
              showOverFlowTooltip: true
            }, {
              label: '产量/方',
              prop: 'zhiquProduction'
            }
          ]
        },
        {
          prop: 'orderNo',
          label: '出曲',
          child: [
            {
              label: '出曲/批',
              prop: 'outHolderPatch'
            }, {
              label: '出曲数量/方',
              prop: 'outProduction',
              width: '130'
            }
          ]
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
