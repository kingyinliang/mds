<template>
  <div class="KojiMaking-Out-index">
    <el-button type="primary" @click="AddMateriel(MaterielDate)" size="small" :disabled="formHeader.materialCode !== 'SS02010001' ? true : !isRedact" style="float: right;">新增</el-button>
    <el-table header-row-class-name="tableHead" :data="MaterielDate" :row-class-name="RowDelFlag" border tooltip-effect="dark">
      <el-table-column type="index" width="50" label="序号"></el-table-column>
      <el-table-column label="盐水" width="140">
        <template slot="header">
          <i class="reqI">*</i>
          <span>盐水</span>
        </template>
        <template slot-scope="scope">
          <el-select v-model="scope.row.material" placeholder="请选择" :disabled="!(isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked' && scope.row.delFlag !== '1')" size="small">
            <el-option :label="item.value" v-for="(item, index) in brine" :key="index" :value="item.code + ' ' + item.value"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="盐水罐号" width="140">
        <template slot="header">
          <i class="reqI">*</i>
          <span>盐水罐号</span>
        </template>
        <template slot-scope="scope">
          <el-select v-model="scope.row.saltWaterHolderId" placeholder="请选择" :disabled="!(isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked' && scope.row.delFlag !== '1')"  size="small">
            <el-option :label="item.holderName" v-for="(item, index) in brineTankNo" :key="index" :value="item.holderId"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column width="130">
        <template slot="header">
          <i class="reqI">*</i>
          <span>批次</span>
        </template>
        <template slot-scope="scope">
          <el-select v-if="formHeader.materialCode === 'SS02010001'" v-model="scope.row.batch" @change="checkBatchStock(scope.row)" :disabled="!(isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked' && scope.row.delFlag !== '1')" size="small">
            <el-option v-for="(item, index) in batchList" :key="index" :label="item.batch" :value="item.batch"></el-option>
          </el-select>
          <el-input v-else type="text" v-model="scope.row.batch" maxlength="10" :disabled="!(isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked' && scope.row.delFlag !== '1')" size="small" placeholder="手工录入"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="起始值" width="140">
        <template slot="header">
          <i class="reqI">*</i>
          <span>起始值</span>
        </template>
        <template slot-scope="scope">
          <el-input type="number" @change="checkBatchStock(scope.row)" v-model="scope.row.startValue" :disabled="!(isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked' && scope.row.delFlag !== '1')" size="small" placeholder="手工录入"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="结束值" width="140">
        <template slot="header">
          <i class="reqI">*</i>
          <span>结束值</span>
        </template>
        <template slot-scope="scope">
          <el-input type="number" @change="checkBatchStock(scope.row)" v-model="scope.row.endValue" :disabled="!(isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked' && scope.row.delFlag !== '1')" size="small" placeholder="手工录入"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="数量" width="90" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.amount = ((scope.row.endValue*1 - scope.row.startValue*1) * 1000).toFixed(3)*1}}
        </template>
      </el-table-column>
      <el-table-column label="库存量" width="90" show-overflow-tooltip prop="leftAmount"></el-table-column>
      <el-table-column label="单位" width="50" prop="unit" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作人" prop="creator" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作时间" prop="created" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="70" fixed="right">
        <template slot-scope="scope">
          <el-button class="delBtn" type="text" icon="el-icon-delete" size="small" :disabled="formHeader.materialCode !== 'SS02010001' ? true : !(isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked' && scope.row.delFlag !== '1')" @click="delMateriel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <p style="line-height: 32px;">总数量：{{BrineNum}}</p>
    <audit-log :tableData="MaterielAuditlog"></audit-log>
  </div>
</template>

<script>
import {BASICDATA_API, SYSTEMSETUP_API, KJM_API} from '@/api/api'
import {dateFormat} from '@/net/validate'
export default {
  name: 'materiel',
  data () {
    return {
      MaterielDate: [],
      MaterielAuditlog: [],
      Materielstatus: '',
      brine: [],
      brineTankNo: [],
      batchList: []
    }
  },
  props: {
    isRedact: {},
    formHeader: {}
  },
  mounted () {
    // this.GetBrine()
  },
  methods: {
    saveRul2 () {
      let ty = true
      if (this.MaterielDate.length !== 0) {
        // this.MaterielDate.forEach((item) => {
        //   if (item.delFlag !== '1') {
        //     console.log(item.leftAmount)
        //     if (item.material && item.saltWaterHolderId && item.batch && (item.startValue || item.startValue === 0) && (item.endValue || item.endValue === 0)) {} else {
        //       ty = false
        //       this.$warning_SHINHO('原料领用必填项未填')
        //       return false
        //     }
        //     if (item.leftAmount < 0) {
        //       ty = false
        //       this.$warning_SHINHO('原料领用库存量不能为负')
        //       return false
        //     }
        //   }
        // })
        for (let item of this.MaterielDate) {
          if (item.delFlag !== '1') {
            if (item.material && item.saltWaterHolderId && item.batch && (item.startValue || item.startValue === 0) && (item.endValue || item.endValue === 0)) {} else {
              ty = false
              this.$warning_SHINHO('原料领用必填项未填')
              return false
            }
            if (item.leftAmount < 0) {
              ty = false
              this.$warning_SHINHO('原料领用库存量不能为负')
              return false
            }
          }
        }
      }
      return ty
    },
    // 库存校验
    checkBatchStock (row) {
      if (this.formHeader.materialCode === 'SS02010001') {
        if (row.batch !== '' && row.startValue !== '' && row.endValue !== '') {
          this.getRepertory(this.formHeader, this.MaterielDate)
        }
      }
    },
    // 获取原料领用列表
    GetmaterielDate (formHeader) {
      this.$http(`${KJM_API.OUTMATERIELLIST_API}`, 'POST', {
        orderId: formHeader.orderId,
        orderHouseId: formHeader.id,
        orderNo: formHeader.orderNo,
        outStatus: formHeader.outStatus,
        orderMaterialCode: formHeader.materialCode
      }).then(({data}) => {
        if (data.code === 0) {
          this.MaterielDate = data.list
          if (formHeader.materialCode === 'SS02010001') {
            this.getRepertory(formHeader, this.MaterielDate)
          }
          this.MaterielAuditlog = data.vrlist
          let sub = 0
          let che = 0
          let no = 0
          let sav = 0
          this.MaterielDate.forEach((item) => {
            item.material = item.materialCode + ' ' + item.materialName
            if (item.status === 'noPass') {
              no = no + 1
            } else if (item.status === 'submit') {
              sub = sub + 1
            } else if (item.status === 'checked') {
              che = che + 1
            } else if (item.status === 'saved') {
              sav = sav + 1
            }
          })
          if (no > 0) {
            this.Materielstatus = 'noPass'
          } else if (sub > 0) {
            this.Materielstatus = 'submit'
          } else if (sav > 0) {
            this.Materielstatus = 'saved'
          } else if (che > 0) {
            this.Materielstatus = 'checked'
          }
          this.$emit('GetMaterielStatus', this.Materielstatus)
        } else {
          this.$notify.error({title: '错误', message: data.msg})
        }
      })
    },
    // 库存拉取
    getRepertory (formHeader, data) {
      let location = '7102'
      if (formHeader.workShopName === '制曲二车间') {
        location = '71A2'
      }
      this.$http(`${KJM_API.OUT_GETSTOCK_API}`, 'POST', {factory: formHeader.factory, location: location, orderHouseId: formHeader.id, workList: this.MaterielDate}, false, false, false).then(({data}) => {
        if (data.code === 0) {
          this.batchList = data.list
          this.MaterielDate.map((item) => {
            item.leftAmount = this.batchList.find(items => items.batch === item.batch).currentQuantity
          })
        } else {
          this.$error_SHINHO(data.msg)
        }
      })
    },
    saveRul () {
      let ty = true
      this.MaterielDate.forEach((item) => {
        if (item.delFlag !== '1') {
          if (item.material && item.saltWaterHolderId && (item.startValue || item.startValue === 0) && (item.endValue || item.endValue === 0)) {} else {
            ty = false
            this.$warning_SHINHO('原料领用必填项未填')
            return false
          }
        }
      })
      return ty
    },
    // 保存
    SaveOrSubmitMateriel (str, resolve, reject) {
      this.MaterielDate.forEach((item) => {
        item.orderHouseId = this.formHeader.id
        if (item.material) {
          item.materialCode = item.material.substring(0, item.material.indexOf(' '))
          item.materialName = item.material.substring(item.material.indexOf(' ') + 1)
        }
        if (item.status) {
          if (item.status === 'saved') { item.status = str } else if (item.status === 'noPass' && str === 'submit') { item.status = str }
        } else {
          item.status = str
        }
      })
      this.$http(`${str === 'submit' ? KJM_API.OUTMATERIELSUBMIT_API : KJM_API.OUTMATERIELSAVE_API}`, 'POST', this.MaterielDate).then(({data}) => {
        if (data.code === 0) {
          if (resolve) {
            resolve('resolve')
          }
        } else {
          this.$notify.error({title: '错误', message: data.msg})
          if (reject) {
            reject('原料领用' + data.msg)
          }
        }
      })
    },
    // 获取盐水
    GetBrine (factory) {
      this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {factory: factory, type: 'ZQ_MATERIAL_YANSHUI'}).then(({data}) => {
        if (data.code === 0) {
          this.brine = data.dicList
        } else {
          this.$notify.error({title: '错误', message: data.msg})
        }
      })
    },
    // 获取盐水罐号
    GetBrineTankNo (deptId) {
      this.$http(`${BASICDATA_API.CONTAINERLIST_API}`, 'POST', {
        factory: deptId.factory,
        dept_id: deptId.workShop,
        type: 'holder_type',
        holder_type: '011',
        currPage: 1,
        pageSize: 9999
      }).then(({data}) => {
        if (data.code === 0) {
          this.brineTankNo = data.page.list
        } else {
          this.$notify.error({title: '错误', message: data.msg})
        }
      })
    },
    // 新增
    AddMateriel () {
      this.MaterielDate.push({
        id: '',
        status: '',
        orderHouseId: '',
        outDate: '',
        material: '',
        materialCode: '',
        materialName: '',
        saltWaterHolderId: '',
        startValue: '',
        endValue: '',
        amount: '',
        unit: 'L',
        delFlag: '0',
        batch: '',
        leftAmount: 0,
        created: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
        creator: this.$store.state.user.realName + `(${this.$store.state.user.name})`
      })
    },
    // 删除
    delMateriel (row) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row.delFlag = '1'
        this.checkBatchStock(row)
      })
    },
    //  RowDelFlag
    RowDelFlag ({row, rowIndex}) {
      if (row.delFlag === '1') {
        return 'rowCCC'
        // return 'rowDel'
      } else {
        return ''
      }
    }
  },
  computed: {
    BrineNum: function () {
      let num = 0
      let SetMeaterielNum = 0
      let a = this.brine.filter(item => item.code === 'M040000001')[0]
      this.MaterielDate.forEach((item) => {
        num = num + (item.delFlag === '0' ? item.amount * 1 : 0)
        if (a) {
          SetMeaterielNum = SetMeaterielNum + (item.delFlag === '0' ? (item.material === (a.code + ' ' + a.value) ? 0 : item.amount * 1) : 0)
        } else {
          SetMeaterielNum = SetMeaterielNum + (item.delFlag === '0' ? item.amount * 1 : 0)
        }
      })
      this.$emit('SetMeaterielNum', SetMeaterielNum)
      return num
    }
  },
  components: {
    AuditLog: resolve => {
      require(['@/views/components/AuditLog'], resolve)
    }
  }
}
</script>

<style lang="scss">
  .KojiMaking-Out-index {
    .el-table tr.rowCCC {
      background-color: #cccc;
    }
  }
</style>
