<template>
  <div class="header_main">
    <query-table
      ref="queryTable"
      :query-auth="false"
      :show-operation-column="true"
      :operation-column-width="70"
      :show-select-column="true"
      :list-interface="listInterface"
      :queryFormData="queryFormData"
      :column="column"
      returnColumnType='iotListInfo'
      :exportOption="exportOption"
      queryAuth=''
    >
      <template slot="mds-button-middle">
        <div style="width:220px; float:right">
          <el-upload class="upload-demo" style="width:56px; float:left"
            :action="uploadApi"
            :show-file-list="false"
            :headers="myHeaders"
            :before-upload="beforeUp"
            :on-success="importSuccess"
            :on-error="improtError"
          >
            <el-button size="small" type="primary">导入</el-button>
          </el-upload>
          <el-button type="primary" size="small" @click="exportData()">导出</el-button>
          <el-button type="danger" size="small" @click="remove">批量删除</el-button>
        </div>
      </template>
      <template slot="operation_column" slot-scope="{scope}">
        <el-button class="ra_btn" type="primary" round size="mini" @click="editRow(scope.row)">编辑</el-button>
      </template>
    </query-table>
    <el-dialog :visible.sync="DialogTableVisible" :close-on-click-modal="false" width="500px" custom-class='dialog__class'>
      <div slot="title" style="line-hight:59px">编辑</div>
      <el-form ref="form" size="small" label-width="100px" :model="form">
        <el-form-item label="工厂编码：">
          <el-input v-model="form.factory"></el-input>
        </el-form-item>
        <el-form-item label="工厂名称：">
          <el-input v-model="form.factoryName"></el-input>
        </el-form-item>
        <el-form-item label="车间编码：">
          <el-input v-model="form.workShop"></el-input>
        </el-form-item>
        <el-form-item label="车间名称：">
          <el-input v-model="form.workShopName"></el-input>
        </el-form-item>
        <el-form-item label="终端编码：">
          <el-input v-model="form.plcCode"></el-input>
        </el-form-item>
        <el-form-item label="终端名称：">
          <el-input v-model="form.plcName"></el-input>
        </el-form-item>
        <el-form-item label="产线编码：">
          <el-input v-model="form.productionLineCode"></el-input>
        </el-form-item>
        <el-form-item label="产线名称：">
          <el-input v-model="form.productionLineName"></el-input>
        </el-form-item>
        <el-form-item label="工序编码：">
          <el-input v-model="form.processesCode"></el-input>
        </el-form-item>
        <el-form-item label="工序名称：">
          <el-input v-model="form.processesName"></el-input>
        </el-form-item>
        <el-form-item label="设备编码：">
          <el-input v-model="form.deviceCode"></el-input>
        </el-form-item>
        <el-form-item label="设备名称：">
          <el-input v-model="form.deviceName"></el-input>
        </el-form-item>
        <el-form-item label="参数类型：">
          <el-input v-model="form.parameterTypeCode"></el-input>
        </el-form-item>
        <el-form-item label="参数类型描述：">
          <el-input v-model="form.parameterTypeName"></el-input>
        </el-form-item>
        <el-form-item label="参数编码：">
          <el-input v-model="form.parameterCode"></el-input>
        </el-form-item>
        <el-form-item label="参数名称：">
          <el-input v-model="form.parameterName"></el-input>
        </el-form-item>
        <el-form-item label="换算公式：">
          <el-input v-model="form.formula"></el-input>
        </el-form-item>
        <el-form-item label="上限值：">
          <el-input v-model="form.upLimit"></el-input>
        </el-form-item>
        <el-form-item label="下限值：">
          <el-input v-model="form.lowerLimit"></el-input>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="DialogTableVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="saveRow" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import { Loading } from 'element-ui'
import {SYSTEMSETUP_API} from '@/api/api'
import {DeepClone} from '@/net/validate.js'
export default {
  name: 'index',
  data () {
    return {
      myHeaders: {Authorization: Vue.cookie.get('token')},
      DialogTableVisible: false,
      showSelectColumn: true,
      queryFormData: [
        {
          type: 'select',
          label: '生产工厂',
          prop: 'factory',
          defaultOptionsMore: () => {
            return this.$http(`${SYSTEMSETUP_API.IOTHEADSEARCHLIST_API}`, 'POST', {}, false, false, false)
          },
          resVal: {
            resData: 'factory.workShop.parameterCode',
            label: ['FACTORY_NAME'],
            value: 'FACTORY'
          }
        }, {
          type: 'select',
          label: '生产车间',
          prop: 'workShop',
          resVal: {
            resData: 'workShop',
            label: ['WORK_SHOP_NAME'],
            value: 'WORK_SHOP'
          }
        },
        {
          type: 'select',
          label: '参数名称',
          prop: 'parameterCode',
          resVal: {
            resData: 'parameterCode',
            label: ['PARAMETER_NAME'],
            value: 'PARAMETER_CODE'
          }
        }
      ],
      listInterface: (params) => {
        return this.$http(`${SYSTEMSETUP_API.IOTDATALIST_API}`, 'POST', params)
      },
      column: [{
        prop: 'factory',
        label: '工厂编码',
        width: '80'
      }, {
        prop: 'factoryName',
        label: '工厂名称',
        width: '120'
      }, {
        prop: 'workShop',
        label: '车间编码',
        width: '80'
      }, {
        prop: 'workShopName',
        label: '车间名称',
        width: '100'
      }, {
        prop: 'plcCode',
        label: '终端编码',
        width: '80'
      }, {
        prop: 'plcName',
        label: '终端名称',
        width: '100'
      }, {
        prop: 'productionLineCode',
        label: '产线编码',
        width: '80'
      }, {
        prop: 'productionLineName',
        label: '产线名称',
        width: '100'
      }, {
        prop: 'processesCode',
        label: '工序编码',
        width: '80'
      }, {
        prop: 'processesName',
        label: '工序名称',
        width: '100'
      }, {
        prop: 'deviceCode',
        label: '设备编码',
        width: '80'
      }, {
        prop: 'deviceName',
        label: '设备名称',
        width: '100'
      }, {
        prop: 'parameterTypeCode',
        label: '参数类型',
        width: '100'
      }, {
        prop: 'parameterTypeName',
        label: '参数类型描述',
        width: '130'
      }, {
        prop: 'parameterCode',
        label: '参数编码',
        width: '100'
      }, {
        prop: 'parameterName',
        label: '参数名称',
        width: '100'
      }, {
        prop: 'formula',
        label: '换算公式',
        width: '100'
      }, {
        prop: 'upLimit',
        label: '上限值',
        width: '100'
      }, {
        prop: 'lowerLimit',
        label: '下限值',
        width: 100
      }, {
        prop: 'remark',
        label: '备注',
        width: '100'
      }],
      form: {},
      exportOption: {
        auth: '',
        exportInterface: SYSTEMSETUP_API.IOTDATALISTEXPORT_API,
        text: 'IOT换算'
      },
      uploadApi: `${SYSTEMSETUP_API.IOTDATALISTIMPORT_API}`
    }
  },
  watch: {
  },
  mounted () {
    this.getHeaderSearchList()
  },
  methods: {
    // 头部搜索条件拉取
    getHeaderSearchList () {
      this.$http(`${SYSTEMSETUP_API.IOTHEADSEARCHLIST_API}`, 'POST', {}, false, false, false).then(({data}) => {
        if (data.code === 0) {

        } else {
          this.$$warning_SHINHO(data.msg)
        }
      })
    },
    // 编辑
    editRow (row) {
      this.DialogTableVisible = true
      this.form = DeepClone(row)
    },
    // 保存
    saveRow () {
      this.$http(`${SYSTEMSETUP_API.IOTDATAUPDATE_API}`, 'POST', this.form).then(({data}) => {
        if (data.code === 0) {
          this.$success_SHINHO('保存成功')
          this.DialogTableVisible = false
          this.$refs.queryTable.GetDataList(true)
        } else {
          this.$warning_SHINHO(data.msg)
        }
      })
    },
    // 删除
    remove () {
      if (this.$refs.queryTable.multipleSelection.length > 0) {
        this.$confirm('正在执行删除操作, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http(`${SYSTEMSETUP_API.IOTDATADEL_API}`, 'POST', this.$refs.queryTable.multipleSelection).then(({data}) => {
            if (data.code === 0) {
              this.$success_SHINHO('删除成功')
              this.$refs.queryTable.GetDataList(true)
            } else {
              this.$error_SHINHO(data.msg)
            }
          })
        })
      } else {
        this.$warning_SHINHO('请选择数据')
      }
    },
    // 导出
    exportData () {
      this.$refs.queryTable.FormExportExcel()
    },
    beforeUp () {
      this.loading = Loading.service({
        lock: true,
        spinner: 'loadingGif',
        text: '加载中……',
        background: 'rgba(255, 255, 255, 0.7)'
      })
    },
    importSuccess (response, file, fileList) {
      if (response.code === 0) {
        this.$success_SHINHO('导入成功')
        this.$refs.queryTable.GetDataList(true)
      } else {
        this.loading.close()
        this.$warning_SHINHO('导入失败')
      }
    },
    improtError () {
      this.$warning_SHINHO('导入失败')
      this.loading.close()
    }
  },
  computed: {},
  components: {
  }
}
</script>

<style scoped>

</style>
