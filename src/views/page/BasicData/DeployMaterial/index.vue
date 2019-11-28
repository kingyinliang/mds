<template>
  <div class="header_main">
    <query-table
      ref="queryTable"
      :query-auth="'ste:material:list'"
      :show-operation-column="true"
      :operation-column-width="70"
      :show-select-column="true"
      :list-interface="listInterface"
      :queryFormData="queryFormData"
      :column="column">
      <template slot="mds-button">
        <el-button type="primary" size="small" @click="addOrupdate()" v-if="isAuth('ste:material:dataInsert')">新增</el-button>
        <el-button type="danger" size="small" @click="remove" v-if="isAuth('ste:material:del')">批量删除</el-button>
      </template>
      <template slot="operation_column" slot-scope="{scope}">
        <el-button class="ra_btn" type="primary" round size="mini" @click="addOrupdate(scope.row)" v-if="isAuth('ste:material:dataInsert')">编辑</el-button>
      </template>
    </query-table>
    <el-dialog :visible.sync="AddDialogTableVisible" :close-on-click-modal="false" width="550px" custom-class='dialog__class'>
      <div slot="title" style="line-hight:59px">{{addAndupdate? '新增调配物料' : '修改调配物料'}}</div>
      <el-form :model="AddDialogTable" label-width="100px" size="small" ref="AddDialogTable">
        <el-form-item label="工厂：">
          <el-select v-model="AddDialogTable.factory" placeholder="请选择" style="width: 100%">
            <el-option :label="item.deptName" v-for="(item, index) in factory" :key="index" :value="item.deptId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生产物料：">
          <el-select v-model="AddDialogTable.productionMaterielCode" @change="(e)=>{AddDialogTable.productionMaterielName = productionMaterielCode.filter(it => it.MATERIAL_CODE === e)[0].MATERIAL_NAME}" filterable placeholder="请选择" style="width: 100%">
            <el-option :label="item.MATERIAL_CODE + ' ' + item.MATERIAL_NAME" v-for="(item, index) in productionMaterielCode" :key="index" :value="item.MATERIAL_CODE"></el-option>
          </el-select>
        </el-form-item>
        <el-row>
          <el-row style="width: 510px;" v-for="(item, index) in AddDialogTable.useMateriel" :key="index">
            <el-col style="width: 290px">
              <el-form-item label="领用物料：">
                <el-select v-model="item.useMaterielCode" filterable placeholder="请选择" style="width: 100%" @change="(e)=>{item.useMaterielName = useMaterielCode.filter(it => it.MATERIAL_CODE === e)[0].MATERIAL_NAME}">
                  <el-option :label="item.MATERIAL_CODE + ' ' + item.MATERIAL_NAME" v-for="(item, index) in useMaterielCode" :key="index" :value="item.MATERIAL_CODE"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col style="width: 180px">
              <el-form-item label="BL_LY标识：" label-width="90px">
                <el-select v-model="item.type" placeholder="请选择" style="width: 100%">
                  <el-option :label="item.label" v-for="(item, index) in queryFormData[3].options" :key="index" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col style="width: 32px; margin-left: 8px">
              <el-button type="primary" icon="el-icon-plus" circle @click="addUseMateriel" size="small" v-if="index === 0"></el-button>
              <el-button type="danger" icon="el-icon-delete" circle @click="delUseMateriel(index)" size="small" v-else ></el-button>
            </el-col>
          </el-row>
        </el-row>
        <!--<el-row v-else>-->
          <!--<el-form-item label="领用物料：">-->
            <!--<el-select v-model="AddDialogTable.useMaterielCode" filterable placeholder="请选择" style="width: 100%" @change="(e)=>{AddDialogTable.useMaterielName = useMaterielCode.filter(it => it.MATERIAL_CODE === e)[0].MATERIAL_NAME}">-->
              <!--<el-option :label="item.MATERIAL_CODE + ' ' + item.MATERIAL_NAME" v-for="(item, index) in useMaterielCode" :key="index" :value="item.MATERIAL_CODE"></el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="BL_LY标识：">-->
            <!--<el-select v-model="AddDialogTable.type" placeholder="请选择" style="width: 100%">-->
              <!--<el-option :label="item.label" v-for="(item, index) in queryFormData[3].options" :key="index" :value="item.value"></el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
        <!--</el-row>-->
        <el-form-item label="备注：">
          <el-input v-model="AddDialogTable.remark" placeholder="手动输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="操作人：">
        </el-form-item>
        <el-form-item label="操作时间：">
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddDialogTableVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {BASICDATA_API} from '@/api/api'
export default {
  name: 'index',
  data () {
    return {
      AddDialogTableVisible: false,
      addAndupdate: false,
      AddDialogTable: {},
      factory: [],
      productionMaterielCode: [],
      useMaterielCode: [],
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
          linkageProp: ['productionMaterielCode', 'useMaterielCode']
        },
        {
          type: 'select',
          label: '生产物料',
          prop: 'productionMaterielCode',
          optionsFn: (val) => {
            return this.$http(`${BASICDATA_API.DEPLOY_MATERIAL_SELECT_LIST}`, 'POST', {factory: val})
          },
          defaultValue: '',
          resVal: {
            resData: 'materielList.productionMateriel',
            label: ['MATERIAL_CODE', 'MATERIAL_NAME'],
            value: 'MATERIAL_CODE'
          }
        },
        {
          type: 'select',
          label: '领用物料',
          prop: 'useMaterielCode',
          optionsFn: (val) => {
            return this.$http(`${BASICDATA_API.DEPLOY_MATERIAL_SELECT_LIST}`, 'POST', {factory: val})
          },
          defaultValue: '',
          resVal: {
            resData: 'materielList.useMateriel',
            label: ['MATERIAL_CODE', 'MATERIAL_NAME'],
            value: 'MATERIAL_CODE'
          }
        },
        {
          type: 'select',
          label: '标识',
          prop: 'type',
          options: [{label: 'BL', value: 'BL'}, {label: 'LY', value: 'LY'}, {label: 'BL_LY', value: 'BL_LY'}],
          resVal: {
            label: ['label'],
            value: 'value'
          }
        }
      ],
      listInterface: (params) => {
        return this.$http(`${BASICDATA_API.DEPLOY_MATERIAL_LIST}`, 'POST', params)
      },
      column: [{
        prop: 'factoryName',
        label: '工厂',
        width: '100'
      }, {
        prop: 'productionMaterielCode',
        label: '生产物料',
        formatter: (row) => {
          return row.productionMaterielCode + ' ' + row.productionMaterielName
        }
      }, {
        prop: 'useMaterielCode',
        label: '领用物料',
        formatter: (row) => {
          return row.useMaterielCode + ' ' + row.useMaterielName
        }
      }, {
        prop: 'type',
        label: 'BL与LY',
        width: '100'
      }, {
        prop: 'remark',
        label: '备注',
        width: '100'
        // formatter: (row, col, value) => {
        //   let h = this.$createElement
        //   return h('el-input', {
        //     attrs: {
        //       size: 'small'
        //     }
        //   })
        // }
      }, {
        prop: 'changer',
        label: '操作人员',
        width: '100'
      }, {
        prop: 'changed',
        label: '操作时间'
      }]
    }
  },
  watch: {
    'AddDialogTable.factory' (n, o) {
      this.getMeateriel(n)
    }
  },
  mounted () {
  },
  methods: {
    getMeateriel (val) {
      this.$http(`${BASICDATA_API.DEPLOY_MATERIAL_SELECT_LIST}`, 'POST', {factory: val}).then(({data}) => {
        if (data.code === 0) {
          this.productionMaterielCode = data.materielList.productionMateriel
          this.useMaterielCode = data.materielList.useMateriel
        } else {
          this.$error_SHINHO(data.msg)
        }
      })
    },
    addOrupdate (row) {
      this.AddDialogTableVisible = true
      if (row) {
        this.addAndupdate = false
        this.$http(`${BASICDATA_API.DEPLOY_MATERIAL_ROWLIST}`, 'POST', {factory: row.factory, productionMaterielCode: row.productionMaterielCode}).then(({data}) => {
          if (data.code === 0) {
            this.AddDialogTable = {
              id: row.id,
              factory: row.factory,
              productionMaterielCode: row.productionMaterielCode,
              productionMaterielName: row.productionMaterielName,
              useMateriel: data.page,
              remark: row.remark
            }
          } else {
            this.$error_SHINHO(data.msg)
          }
        })
      } else {
        this.addAndupdate = true
        this.AddDialogTable = {
          id: '',
          factory: '',
          productionMaterielCode: '',
          productionMaterielName: '',
          useMateriel: [
            {
              useMaterielCode: '',
              useMaterielName: '',
              type: ''
            }
          ],
          remark: ''
        }
      }
      this.factory = this.$refs.queryTable.optionLists.factory
      this.productionMaterielCode = this.$refs.queryTable.optionLists.productionMaterielCode
      this.useMaterielCode = this.$refs.queryTable.optionLists.useMaterielCode
    },
    submitForm () {
      this.$refs.AddDialogTable.validate((valid) => {
        if (valid) {
          // if (!this.addAndupdate) {
          //   this.AddDialogTable.useMateriel = [{
          //     useMaterielCode: this.AddDialogTable.useMaterielCode,
          //     useMaterielName: this.AddDialogTable.useMaterielName,
          //     type: this.AddDialogTable.type
          //   }]
          // }
          this.$http(`${!this.addAndupdate ? BASICDATA_API.DEPLOY_MATERIAL_SAVE : BASICDATA_API.DEPLOY_MATERIAL_UPDATE}`, 'POST', this.AddDialogTable).then(({data}) => {
            if (data.code === 0) {
              this.AddDialogTableVisible = false
              this.$success_SHINHO('操作成功')
              this.$refs.queryTable.GetDataList()
            } else {
              this.$error_SHINHO(data.msg)
            }
          })
        }
      })
    },
    remove () {
      if (this.$refs.queryTable.multipleSelection.length > 0) {
        this.$confirm('正在执行删除操作, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http(`${BASICDATA_API.DEPLOY_MATERIAL_DEL}`, 'POST', this.$refs.queryTable.multipleSelection).then(({data}) => {
            if (data.code === 0) {
              this.$success_SHINHO('操作成功')
              this.$refs.queryTable.GetDataList()
            } else {
              this.$error_SHINHO(data.msg)
            }
          })
        })
      } else {
        this.$warning_SHINHO('请选择数据')
      }
    },
    addUseMateriel () {
      this.AddDialogTable.useMateriel.push({ id: '', useMaterielCode: '', useMaterielName: '', type: '' })
    },
    delUseMateriel (index) {
      this.AddDialogTable.useMateriel.splice(index, 1)
    }
  },
  computed: {},
  components: {
  }
}
</script>

<style scoped>

</style>
