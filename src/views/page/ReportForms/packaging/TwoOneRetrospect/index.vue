<template>
  <div class="header_main">
    <query-table
      :queryFormData="queryFormData"
      :list-interface="listInterface"
      :query-auth="'report:formh:pkgOneAndTwoList'"
      :column="column">
      <template slot="mds-button">
        <el-button type="primary" size="small" @click="ExportExcel(true)" v-if="isAuth('report:formh:exportPkgOneAndTwoList')">导出</el-button>
      </template>
    </query-table>
  </div>
</template>

<script>
import { BASICDATA_API, REP_API } from '@/api/api'
import { exportFile } from '@/net/validate'
export default {
  name: 'TwoOneRetrospect',
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
        }, {
          type: 'select',
          label: '生产车间',
          prop: 'workShop',
          optionsFn: (val) => {
            return this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', { deptId: val, deptName: '二合一' })
          },
          resVal: {
            resData: 'typeList',
            label: ['deptName'],
            value: 'deptId'
          },
          linkageProp: ['productLine']
        }, {
          type: 'select',
          label: '生产产线',
          prop: 'productLine',
          resVal: {
            resData: 'childList',
            label: ['deptName'],
            value: 'deptId'
          },
          optionsFn: (val) => {
            return this.$http(`${BASICDATA_API.FINDORGBYPARENTID_API}`, 'POST', { parentId: val })
          }
        }, {
          type: 'input',
          label: '生产订单',
          prop: 'orderNo'
        }, {
          type: 'input',
          label: '品项',
          prop: 'materialCode'
        }, {
          type: 'date-interval',
          label: '生产日期',
          prop: 'commitDateOne',
          propTwo: 'commitDateTwo'
        }
      ],
      listInterface: (params) => {
        return this.$http(`${REP_API.TWOONERETROSPECT_LIST_API}`, 'POST', params)
      },
      column: [{
        prop: 'productDate',
        label: '生产日期',
        width: '110'
      }, {
        prop: 'factoryName',
        label: '工厂'
      }, {
        prop: 'workShopName',
        label: '车间'
      }, {
        prop: 'productLineName',
        label: '产线',
        width: '120'
      }, {
        prop: 'orderNo',
        label: '生产订单',
        width: '120'
      }, {
        prop: 'material',
        label: '生产物料'
      }, {
        prop: 'batch',
        label: '生产批次',
        width: '110'
      }, {
        prop: 'countOutPut',
        label: '生产数'
      }, {
        prop: 'countOutPutUnit',
        label: '单位',
        width: '50'
      }, {
        prop: 'mainBatch',
        label: '主产品批次',
        width: '110'
      }, {
        prop: 'attachBatch',
        label: '赠品批次',
        width: '110'
      }, {
        prop: 'remark',
        label: '备注'
      }]
    }
  },
  methods: {
    ExportExcel () {
      let that = this
      exportFile(`${REP_API.REPTWOONERETROSPECT_API}`, '二合一批次追溯报表', that)
    }
  },
  components: {
  }
}
</script>
