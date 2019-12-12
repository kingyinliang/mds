<template>
  <div class="measurebarn-bean-pulp-data-entry">
    <el-row>
      <el-col>
        <div class="header_main measurebarn-bean-pulp__header">
          <el-card>
            <el-row type="flex" class="header">
              <el-col class="header-pot">
                <div class='header-pot__label'>豆粕罐号：{{formData.holderName ? formData.holderName : ''}}</div>
                <div class="header-pot__image">
                  <div class="header-pot__image_content">
                  </div>
                </div>
              </el-col>
              <el-col class="header-form">
                <el-form :inline="true" size="small" label-width="auto" class="topform">
                  <el-form-item label="生产工厂：">
                    <p class="header-form_input">{{formData.factoryName ? formData.factoryName : ''}}</p>
                  </el-form-item>
                  <el-form-item label="物理区域：">
                    <p class="header-form_input">{{formData.area ? formData.area : ''}}</p>
                  </el-form-item>
                  <el-form-item label="容器号：">
                    <p class="header-form_input">{{formData.holderName ? formData.holderName : ''}}</p>
                  </el-form-item>
                  <el-form-item label="罐体容量：">
                    <p class="header-form_input">{{formData.capacity ? formData.capacity.toLocaleString() : ''}} KG</p>
                  </el-form-item>
                  <el-form-item label="物料编码：">
                    <p class="header-form_input">{{formData.materialNo ? formData.materialNo : '' + ' ' + formData.materialName ? formData.materialName : ''}}</p>
                  </el-form-item>
                  <el-form-item label="当前总量：">
                    <p class="header-form_input">{{formData.totalWeight.toLocaleString()}} KG</p>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </el-card>
        </div>
        <div class="main">
          <div class="tableCard">
            <div class="toggleSearchTop" style="background-color: white;margin-bottom: 8px;position: relative;border-radius: 5px">
              <em class="el-icon-caret-bottom"></em>
            </div>
            <el-tabs ref='tabs'  v-model="activeName" id="DaatTtabs" class="NewDaatTtabs" type="border-card" style="border-radius: 15px;overflow: hidden">
              <el-tab-pane name="1">
                <span slot="label" class="spanview">
                  <el-button>当前库存信息</el-button>
                </span>
                <el-row>
                  <el-table header-row-class-name="" :data="dataList" border tooltip-effect="dark" class="datatTableHead-normal">
                    <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                    <el-table-column label="物料" :show-overflow-tooltip="true">
                      <template slot-scope="scope">
                        {{scope.row.materialCode + ' ' + scope.row.materialName}}
                      </template>
                    </el-table-column>
                    <el-table-column label="批次" :show-overflow-tooltip="true" width="180">
                      <template slot-scope="scope">
                        {{scope.row.batch}}
                      </template>
                    </el-table-column>
                    <el-table-column label="入库数量(KG)" :show-overflow-tooltip="true" width="160" align="right">
                      <template slot-scope="scope">
                        {{(scope.row.inAmount!==null? scope.row.inAmount.toLocaleString() : '')}}
                      </template>
                    </el-table-column>
                    <el-table-column label="当前数量(KG)" width="160" align="right">
                      <template slot-scope="scope">
                        {{(scope.row.amount!==null ? scope.row.amount.toLocaleString() : '')}}
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="150" align="center">
                      <template slot-scope="scope">
                        <el-button type="text" size="small" @click="showMoreDetail(scope.row.batch)"><em class="iconfont factory-fangdajing-copy" style="font-size: 12px;margin-right: 5px"></em>查看</el-button>
                        <el-button type="text" size="small" @click="makeAdjust(scope.row)" v-if="isAuth('Gra:adjust:material:soybeanUpdate')"><em class="iconfont factory-banshou" style="font-size: 12px;margin-right: 5px"></em>调整</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-row>
                <!-- <el-row v-if="dataList.length!==0">
                  <el-pagination
                    @size-change="handleDataSizeChange"
                    @current-change="handleDataCurrentChange"
                    :current-page="dataCurrPage"
                    :page-sizes="[10, 20, 50]"
                    :page-size="dataPageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="dataTotalCount">
                  </el-pagination>
                </el-row> -->
              </el-tab-pane>
              <el-tab-pane name="2">
                <span slot="label"  class="spanview">
                  <el-button>调整信息记录</el-button>
                </span>
                <el-row>
                  <el-table header-row-class-name="" :data="adjustList" border tooltip-effect="dark" class="datatTableHead-normal">
                    <el-table-column type="index" label="序号" width="55"></el-table-column>
                    <el-table-column label="物料" :show-overflow-tooltip="true"  width="200">
                      <template slot-scope="scope">
                        {{scope.row.materialCode + ' ' + scope.row.materialName}}
                      </template>
                    </el-table-column>
                    <el-table-column label="批次" :show-overflow-tooltip="true" width="140">
                      <template slot-scope="scope">
                        {{scope.row.batch}}
                      </template>
                    </el-table-column>
                    <el-table-column label="调整类型" :show-overflow-tooltip="true" width="100">
                      <template slot-scope="scope">
                        {{scope.row.adjustType === '0' ? '盘盈' : '盘亏'}}
                      </template>
                    </el-table-column>
                    <el-table-column label="数量(KG)" :show-overflow-tooltip="true" width="120" >
                      <template slot-scope="scope">
                        {{(scope.row.quantity?scope.row.quantity.toLocaleString() : '')}}
                      </template>
                    </el-table-column>
                    <el-table-column label="说明" width="170">
                      <template slot-scope="scope">
                        {{scope.row.remark}}
                      </template>
                    </el-table-column>
                    <el-table-column label="调整时间" >
                      <template slot-scope="scope">
                        {{scope.row.adjustTime}}
                      </template>
                    </el-table-column>
                    <el-table-column label="调整人" >
                      <template slot-scope="scope">
                        {{scope.row.adjuster}}
                      </template>
                    </el-table-column>
                  </el-table>
                </el-row>
                <el-row v-if="adjustList.length !== 0">
                  <el-pagination
                    @size-change="handleAdjustSizeChange"
                    @current-change="handleAdjustCurrentChange"
                    :current-page="adjustCurrPage"
                    :page-sizes="[10, 20, 50]"
                    :page-size="adjustPageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="adjustTotalCount"
                    v-if="adjustList.length !==0">
                  </el-pagination>
                </el-row>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <el-dialog :visible.sync="isShowMessageBoxAdjust" width="900px" custom-class='dialog__class'>
          <div slot="title" class='title'>
            <span>查询明细</span>
          </div>
          <el-tabs v-model="activeDialogFormName" type="card">
            <el-tab-pane label="入库信息" name="inStorage">
              <el-table header-row-class-name="" :data="applyInStorageList" border tooltip-effect="dark" class="datatTableHead-normal">
                <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                <el-table-column label="物料" :show-overflow-tooltip="true"  width="160">
                  <template slot-scope="scope">
                    {{scope.row.materialCode + ' ' + scope.row.materialName}}
                  </template>
                </el-table-column>
                <el-table-column label="批次" :show-overflow-tooltip="true" width="140">
                  <template slot-scope="scope">
                    {{scope.row.inPortBatch}}
                  </template>
                </el-table-column>
                <el-table-column label="入库量(KG)" :show-overflow-tooltip="true" width="100" align="right" header-align="center">
                  <template slot-scope="scope">
                    {{(scope.row.inPortWeight? scope.row.inPortWeight.toLocaleString() : '')}}
                  </template>
                </el-table-column>
                <el-table-column label="入库订单" :show-overflow-tooltip="true" width="130" >
                  <template slot-scope="scope">
                    {{scope.row.orderNo}}
                  </template>
                </el-table-column>
                <el-table-column label="入库时间">
                  <template slot-scope="scope">
                    {{scope.row.created}}
                  </template>
                </el-table-column>
                <el-table-column label="入库人">
                  <template slot-scope="scope">
                    {{scope.row.creator}}
                  </template>
                </el-table-column>
              </el-table>
              <el-row v-if="applyInStorageList.length !== 0">
                <el-pagination
                  @size-change="handleInStorageListSizeChange"
                  @current-change="handleInStorageListCurrentChange"
                  :current-page="currPageInStorageList"
                  :page-sizes="[10, 20, 50]"
                  :page-size="pageSizeInStorageList"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="totalCountInStorageList">
                </el-pagination>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="领用信息" name="receive">
              <el-table header-row-class-name="" :data="applyReceiveList" border tooltip-effect="dark" class="datatTableHead-normal">
                <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                <el-table-column label="物料" :show-overflow-tooltip="true"  width="160">
                  <template slot-scope="scope">
                    {{scope.row.materialCode + ' ' + scope.row.materialName}}
                  </template>
                </el-table-column>
                <el-table-column label="批次" :show-overflow-tooltip="true" width="140">
                  <template slot-scope="scope">
                    {{scope.row.whtBatch}}
                  </template>
                </el-table-column>
                <el-table-column label="领用量(KG)" :show-overflow-tooltip="true" width="100" align="right">
                  <template slot-scope="scope">
                    {{(scope.row.userWeight? scope.row.userWeight.toLocaleString() : '')}}
                  </template>
                </el-table-column>
                <el-table-column label="领用订单" :show-overflow-tooltip="true" width="130" >
                  <template slot-scope="scope">
                    {{scope.row.orderNo}}
                  </template>
                </el-table-column>
                <el-table-column label="领用时间">
                  <template slot-scope="scope">
                    {{scope.row.created}}
                  </template>
                </el-table-column>
                <el-table-column label="领用人">
                  <template slot-scope="scope">
                    {{scope.row.creator}}
                  </template>
                </el-table-column>
              </el-table>
              <el-row v-if="applyReceiveList.length !== 0">
                <el-pagination
                  @size-change="handleReceiveListSizeChange"
                  @current-change="handleReceiveListCurrentChange"
                  :current-page="currPageReceiveList"
                  :page-sizes="[10, 20, 50]"
                  :page-size="pageSizeReceiveList"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="totalCountReceiveList">
                </el-pagination>
              </el-row>
            </el-tab-pane>
          </el-tabs>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" size="small" style="color: #000000;background-color: #FFFFFF;border-color: #D9D9D9;" @click="isShowMessageBoxAdjust = false">取消</el-button>
            <el-button type="primary" size="small" style="background-color: #1890FF;color: #FFFFFF;border-color: #1890FF;" @click="isShowMessageBoxAdjust = false">确定</el-button>
          </div>
        </el-dialog>
        <el-dialog :visible.sync="isShowMessageBoxCheck" width="400px" custom-class='dialog__class'>
          <div slot="title" class='title'>
            <span>盘点调整</span>
          </div>
          <div>
            <el-form :model="adjustForm" label-width="100px" size="small" ref="adjustForm">
              <el-form-item label="物料：">
                <p>{{adjustForm.materialCode + ' ' + adjustForm.materialName}}</p>
              </el-form-item>
              <el-form-item label="批次：" >
                <p>{{adjustForm.batch}}</p>
              </el-form-item>
              <el-form-item label="调整类型：" required>
                <el-select  placeholder="请选择"  v-model="adjustForm.adjustType" style="width:220px" >
                  <el-option label="盘亏" value="1" ></el-option>
                  <el-option label="盘盈" value="0" ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="调整量："
                required
                prop="quantity"
                :rules="[
                  { required: true, validator: validatePassAdjustNum, message: '请填写调整量 ', trigger: 'blur' }
                ]"
              >
                <el-input  type='number'  v-model.number="adjustForm.quantity" style='width:150px'/> KG
              </el-form-item>
              <el-form-item
                  label="说明："
                  required
                  prop="remark"
                  :rules="[
                    { required: true, message: '请填写调整说明', trigger: 'blur' }
                  ]"
              >
                <el-input  type='text'  v-model.trim="adjustForm.remark" style='width:220px'/>
              </el-form-item>
            </el-form>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" size="small" style="color: #000000;background-color: #FFFFFF;border-color: #D9D9D9;" @click="cannalSaveAdjust('adjustForm')">取消</el-button>
            <el-button type="primary" size="small" style="background-color: #1890FF;color: #FFFFFF;border-color: #1890FF;" @click="saveAdjust('adjustForm')">确定</el-button>
          </div>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator'
import {MEASUREBARN_BEAN_API} from '@/api/api'
import {deepCopy} from '@/assets/js/util.js'
import MSG from '@/assets/js/hint-msg'
@Component({
  components: {
  }
})
export default class Index extends Vue {
  factoryId: string = ''
  deptId: string = ''
  holderId: string = ''
  activeName = '1'
  // 批次数据
  dataList:any = []
  totalDataList = []
  dataCurrPage: number = 1
  dataPageSize: number = 10
  dataTotalCount: number = 0
  // 调整数据
  adjustList:any = []
  totalAdjustList = []
  adjustCurrPage: number = 1
  adjustPageSize: number = 10
  adjustTotalCount: number = 0
  // 入库数据
  applyInStorageList:any = []
  totalInStorageList = []
  currPageInStorageList: number = 1
  pageSizeInStorageList: number = 10
  totalCountInStorageList: number = 0
  // 领用数据
  applyReceiveList:any = []
  totalReceiveList = []
  currPageReceiveList: number = 1
  pageSizeReceiveList: number = 10
  totalCountReceiveList: number = 0
  isShowMessageBoxAdjust : boolean = false
  isShowMessageBoxCheck : boolean = false
  formData = {
    area: '',
    capacity: '',
    factory: '',
    factoryName: '',
    holderNo: '',
    holderName: '',
    materialName: '',
    materialNo: '',
    totalWeight: 0
  }
  adjustForm = {
    materialCode: '',
    materialName: '',
    batch: '',
    // MATERIAL_TYPE_NAME: '',
    // LOCATION: '',
    // MOVE_TYPE: '',
    // MATERIAL_TYPE_CODE: '',
    // POSTING_DATE: '',
    // CURRENT_QUANTITY: 0,
    factory: '',
    holderId: '',
    adjustType: '0',
    quantity: 0,
    // UNIT: 'KG',
    deptId: '',
    remark: ''
  }
  activeDialogFormName: string = 'inStorage'
  mounted () {
    let orgData = this.$store.state.common.MeasureBarnBeanPulp
    this.factoryId = this.$store.state.common.MeasureBarnBeanPulp.factory
    this.holderId = this.$store.state.common.MeasureBarnBeanPulp.holderId
    this.deptId = this.$store.state.common.MeasureBarnBeanPulp.deptId
    // 获取基本讯息
    // this.retrieveDetail()
    this.formData.factoryName = orgData.factoryName // 生产工厂名
    this.formData.area = orgData.holderArea // 物理区域
    this.formData.holderName = orgData.holderName // 容器号/名称
    this.formData.capacity = orgData.holderHold // 罐体容量
    this.formData.materialName = orgData.pulpList[0] !== null ? orgData.pulpList[0].materialName : ''
    this.formData.materialNo = orgData.pulpList[0] !== null ? orgData.pulpList[0].materialCode : ''
    this.formData.factory = orgData.factory // 生产工厂 ID
    this.formData.holderNo = orgData.holderNo
    this.formData.totalWeight = orgData.pulpList.map((item) => item.amount).reduce((accumulator, currentValue) => accumulator + currentValue)

    // 当前库存量
    this.retrieveDataList()
    // this.dataList = []
    // orgData.pulpList.map((item) => {
    //   this.dataList.push({
    //     'materialCode': item.materialCode,
    //     'materialName': item.materialName,
    //     'batch': item.batch, // 批次
    //     'inAmount': item.inAmount, // 入库数量
    //     'amount': item.amount // 当前数量
    //   })
    // })
    // 调整信息记录
    this.retrieveAdjustList()
  }
  validatePassAdjustNum = (rule, value, callback) => {
    if (value === 0) {
      callback(new Error('请填写调整量'))
    } else {
      callback()
    }
  }
  showMoreDetail (batch) {
    this.retrieveLogList(batch)
    this.isShowMessageBoxAdjust = true
  }
  makeAdjust (row) {
    this.adjustForm = {
      materialCode: row.materialCode,
      materialName: row.materialName,
      batch: row.batch,
      // MATERIAL_TYPE_NAME: row.materialTypeName,
      // LOCATION: row.location,
      // MOVE_TYPE: row.moveType,
      // MATERIAL_TYPE_CODE: row.materialTypeCode,
      // POSTING_DATE: row.postingDate,
      // CURRENT_QUANTITY: row.currentQuantity,
      factory: this.factoryId,
      holderId: this.holderId,
      adjustType: '0',
      quantity: 0,
      deptId: this.deptId,
      // UNIT: row.unit,
      remark: ''
    }
    this.isShowMessageBoxCheck = true
  }
  // 改变每页条数
  handleReceiveListSizeChange (val: number) {
    this.pageSizeReceiveList = val
    this.currPageReceiveList = 1
    this.applyReceiveList = deepCopy(this.totalReceiveList.slice((this.currPageReceiveList - 1) * this.pageSizeReceiveList, (this.currPageReceiveList - 1) * this.pageSizeReceiveList + this.pageSizeReceiveList))
  }
  handleInStorageListSizeChange (val: number) {
    this.pageSizeInStorageList = val
    this.currPageInStorageList = 1
    this.applyInStorageList = deepCopy(this.totalInStorageList.slice((this.currPageInStorageList - 1) * this.pageSizeInStorageList, (this.currPageInStorageList - 1) * this.pageSizeInStorageList + this.pageSizeInStorageList))
  }
  handleDataSizeChange (val: number) {
    this.dataPageSize = val
    this.dataCurrPage = 1
    this.dataList = deepCopy(this.totalDataList.slice((this.dataCurrPage - 1) * this.dataPageSize, (this.dataCurrPage - 1) * this.dataPageSize + this.dataPageSize))
  }
  handleAdjustSizeChange (val: number) {
    this.adjustPageSize = val
    this.adjustCurrPage = 1
    this.adjustList = deepCopy(this.totalAdjustList.slice((this.adjustCurrPage - 1) * this.adjustPageSize, (this.adjustCurrPage - 1) * this.adjustPageSize + this.adjustPageSize))
  }

  // 跳转页数
  handleReceiveListCurrentChange (val: number) {
    this.currPageReceiveList = val
    this.applyReceiveList = deepCopy(this.totalReceiveList.slice((this.currPageReceiveList - 1) * this.pageSizeReceiveList, (val - 1) * this.pageSizeReceiveList + this.pageSizeReceiveList))
  }
  handleInStorageListCurrentChange (val: number) {
    this.currPageInStorageList = val
    this.applyInStorageList = deepCopy(this.totalInStorageList.slice((this.currPageInStorageList - 1) * this.pageSizeInStorageList, (val - 1) * this.pageSizeInStorageList + this.pageSizeInStorageList))
  }
  handleDataCurrentChange (val: number) {
    this.dataCurrPage = val
    this.dataList = deepCopy(this.totalDataList.slice((this.dataCurrPage - 1) * this.dataPageSize, (val - 1) * this.dataPageSize + this.dataPageSize))
  }
  handleAdjustCurrentChange (val: number) {
    this.adjustCurrPage = val
    this.adjustList = deepCopy(this.totalAdjustList.slice((this.adjustCurrPage - 1) * this.adjustPageSize, (val - 1) * this.adjustPageSize + this.adjustPageSize))
  }
  // 获取基本讯息
  // retrieveDetail () {
  //   this.formData = {}
  //   Vue.prototype.$http(`${GRANARY_API.WHEAT_POT_DETAIL}/${this.factoryId}/${this.holderId}`, `GET`).then((res) => {
  //     if (res.data.code === 0) {
  //       this.formData = res.data.data
  //     } else {
  //       this.$notify.error({title: MSG.API.normalError.title, message: res.data.msg})
  //     }
  //   })
  // }
  // 当前库存量
  retrieveDataList () {
    this.dataList = []
    this.dataTotalCount = 0
    this.dataCurrPage = 1
    this.dataPageSize = 10
    Vue.prototype.$http(`${MEASUREBARN_BEAN_API.BEANPULP_POT_LIST}`, `POST`, {factory: this.factoryId, workShop: this.deptId, holderId: this.holderId}).then(({data}) => {
      if (data.code === 0) {
        if (data.infoList.length !== 0) {
          this.totalDataList = data.infoList[0].pulpList
          this.dataTotalCount = this.totalDataList.length
          this.dataList = deepCopy(this.totalDataList.slice(0, this.dataPageSize))
        } else {
          this.$notify.info({title: MSG.API.WheatPot.BeanPulp.searchResult.title, message: MSG.API.WheatPot.BeanPulp.searchResult.message})
        }
      } else {
        this.$notify.error({title: '错误', message: data.msg})
      }
    })
  }
  // 调整信息
  retrieveAdjustList () {
    this.totalAdjustList = []
    this.adjustList = []
    this.adjustTotalCount = 0
    this.adjustCurrPage = 1
    this.adjustPageSize = 10
    Vue.prototype.$http(`${MEASUREBARN_BEAN_API.BEANPULP_ADJSUT_LIST}`, `POST`, {factory: this.factoryId, holderId: this.holderId, currPage: this.adjustCurrPage, pageSize: this.adjustPageSize}).then(({data}) => {
      if (data.code === 0) {
        this.totalAdjustList = data.adjustInfo.list
        this.adjustTotalCount = this.totalAdjustList.length
        this.adjustList = deepCopy(this.totalAdjustList.slice(0, this.adjustPageSize))
      } else {
        this.$notify.error({title: MSG.API.normalError.title, message: data.msg})
      }
    })
  }
  // 查看（领用记录| 入库）
  retrieveLogList (batch) {
    this.activeDialogFormName = 'inStorage'
    this.totalInStorageList = []
    this.applyInStorageList = []
    this.totalReceiveList = []
    this.applyReceiveList = []
    // 入库
    // 领用记录
    this.currPageInStorageList = 1
    this.pageSizeInStorageList = 10
    this.totalCountInStorageList = 0
    this.currPageReceiveList = 1
    this.pageSizeReceiveList = 10
    this.totalCountReceiveList = 0
    Vue.prototype.$http(`${MEASUREBARN_BEAN_API.BEANPULP_APPLY_LIST}`, `POST`, {holderId: this.holderId, batch: batch}).then(({data}) => {
      if (data.code === 0) {
        this.totalInStorageList = data.detailListIn
        this.totalReceiveList = data.detailListOut
        this.totalCountInStorageList = data.detailListIn.length
        this.totalCountReceiveList = data.detailListOut.length
        this.applyInStorageList = deepCopy(data.detailListIn.slice(0, this.pageSizeInStorageList))
        this.applyReceiveList = deepCopy(data.detailListOut.slice(0, this.pageSizeReceiveList))
      } else {
        this.$notify.error({title: MSG.API.normalError.title, message: data.msg})
      }
    })
  }
  saveAdjust (formName) {
    const ref: any = this.$refs[formName]
    ref.validate((valid) => {
      if (valid) {
        Vue.prototype.$http(`${MEASUREBARN_BEAN_API.BEANPULP_ADJUST}`, `POST`, this.adjustForm).then(({data}) => {
          if (data.code === 0) {
            this.$notify({title: MSG.OPERATE.saveSuccess.title, message: MSG.OPERATE.saveSuccess.message, type: 'success'})
            this.retrieveDataList()
            this.retrieveAdjustList()
          } else {
            this.$notify.error({title: MSG.API.normalError.title, message: data.msg})
          }
        })
        this.isShowMessageBoxCheck = false
      } else {
        return false
      }
    })
    // if (this.adjustForm.quantity.toString() === '') {
    //   Vue.prototype.$warning_SHINHO(MSG.VALIDATE.updatNumNotEmpty)
    //   return false
    // }
  }
  cannalSaveAdjust (formName) {
    const ref: any = this.$refs[formName]
    ref.resetFields()
    this.isShowMessageBoxCheck = false
  }
  get total () {
    return this.totalDataList.reduce((prev, next) => { return prev + (next.currentQuantity ? next.currentQuantity : 0) }, 0).toLocaleString()
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/_common.scss';
@import '@/assets/scss/_share.scss';
.measurebarn-bean-pulp-data-entry{
  .header {
    height: 200px;
    .header-pot {
      width: 250px;
      .header-pot__label {
        font-size: 18px;
        font-weight: 400;
        color: rgba(102,102,102,1);
        line-height:30px;
        height: 30px;
        width: 300px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      };
      .header-pot__image {
        position: relative;
        margin-top:10px;
        height:160px;
        width:250px;
        background: url('~@/assets/img/pot.png') no-repeat top right;
        background-size:contain;
        .header-pot__image_content {
          height: 65px;
          width: 46px;
          position: absolute;
          right: 40px;
          bottom: 61px;
          background: linear-gradient(#35C3FF,#1890FF);
        }
      }
    }
    .header-form {
      width: 600px;
      margin-left: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      .header-form_input {
        width:150px;
        font-size:14px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(0,0,0,0.85);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .topform{
    .el-form-item__content{
      height: 32px;
      border-bottom: 1px solid #D8D8D8;
    }
  }
}
</style>
