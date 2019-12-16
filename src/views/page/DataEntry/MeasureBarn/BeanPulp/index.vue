<template>
  <div class="measurebarn-bean-pulp">
    <div class="header_main measurebarn-bean-pulp__header">
      <el-card>
        <el-row type="flex" :gutter="10">
          <el-col :span="22">
            <el-form :model="plantList" size="small" :inline="true" label-position="right" label-width="auto" class="sole_row">
              <el-form-item label="生产工厂：">
                <el-select v-model="plantList.factoryIDValue" class="w300" placeholder="请选择" @change="changeSearchOptions(plantList.factoryIDValue)">
                  <el-option v-for="sole in factoryList" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="生产车间：">
                <el-select v-model="plantList.workshopIDValue" class="w200" clearable placeholder="请选择" :disabled="plantList.factoryIDValue ==='' || workshopList.length === 0">
                  <el-option v-for="sole in workshopList" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="2" style="display:flex;align-items:flex-end;justify-content:flex-end">
            <el-button type="primary" size="small" @click="getOrderList()" :disabled="plantList.factoryIDValue==='' && plantList.workshopIDValue==='' || workshopList.length === 0" v-if="isAuth('realTime:pulp:pulpMeasuringBin')">查询</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <div class="main measurebarn-bean-pulp__body" v-if="isMainAreaShow" >
      <el-card class="newCard area-to-bottom">
        <el-row :gutter="10">
          <el-col :span="12" v-for="(item, index) in dataList" :key="'h'+index">
            <el-card class="card-item">
              <div slot="header">豆粕罐号：{{item.holderName}} <span class="card-item_detail" @click="goTargetDetail(item)">详情</span><el-button type="primary" size="small" style="margin-left:10px;" @click="goParn(item)">入罐</el-button></div>
              <div style="display: flex">
                <div class="card-item_img">
                  <div class="card-item_img_box">
                    <div class="card-item_img_box_bg" :style="{height: `${Math.min(sumBatch(item.pulpList) / (item.holderHold*1), 100)}%`}"></div>
                  </div>
                  <img src="@/assets/img/granary.png" alt="">
                </div>
                <div class="card-item_text">
                  <el-card style="margin-top: 25px">
                    <div slot="header">库存明细 <span style="float: right">合计：{{sumBatch(item.pulpList).toLocaleString()}} KG</span></div>
                    <el-table
                      :data="item.pulpList"
                      stripe
                      size="medium"
                      height="200"
                      min-width="300"
                      style="width: 100%">
                      <el-table-column
                        prop="batch"
                        label="批次"
                        width="auto">
                      </el-table-column>
                      <el-table-column
                        prop="amount"
                        label="数量"
                        width="auto"
                        align="right"
                        header-align="left">
                        <template slot-scope="scope">
                          <div>
                            {{(scope.row.amount*1).toLocaleString()}} KG
                          </div>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-card>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <div>
      <el-dialog :visible.sync="isShowMessageBoxCheck" width="400px" custom-class='dialog__class' @close="closeInParnDialog()">
          <div slot="title" class='title'>
            <span>豆粕罐入罐</span>
          </div>
          <div>
            <el-form :model="inParnForm" label-width="100px" size="small" ref="inParnForm">
              <!-- <el-form-item label="领用粮仓：">
                <p>{{inParnForm.materialCode + ' ' + inParnForm.materialName}}</p>
              </el-form-item> -->
              <el-form-item
                label="领用粮仓："
                required
                prop="foodHolderId"
                :rules="[
                  { required: true, message: '请选择领用粮仓', trigger: 'blur' }
                ]"
                >
                <el-select  placeholder="请选择"  v-model="inParnForm.foodHolderId" style="width:220px" @change="changeInParnHolderOptions(inParnForm.foodHolderId)">
                  <el-option v-for="sole in inParnHolder" :key="sole.deptId+sole.holderId" :label="sole.holderName" :value="sole.holderId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="批次："
                required
                prop="batch"
                :rules="[
                  { required: true, message: '请选择批次', trigger: 'blur' }
                ]"
                >
                <el-select  placeholder="请选择"  v-model="inParnForm.batch" style="width:220px" @change="changeInParnBatchOptions(inParnForm.foodHolderId,inParnForm.batch)">
                  <el-option v-for="sole in inParn.holdList" :key="sole.batch" :label="sole.batch" :value="sole.batch"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="物料：">
                <template slot-scope="scope">
                  {{inParnForm.materialCode + ' ' + inParnForm.materialName}}
                </template>
              </el-form-item>
              <el-form-item label="剩馀数：" :disabled="true">
                <template slot-scope="scope">
                  {{inParnForm.currentQuantity}}
                </template>
              </el-form-item>
              <el-form-item
                label="起始数："
                prop="startWeight"
                :rules="[
                  { required: true, validator: validateCheckStartWeight, message: '起始数不可大于等于结束数', trigger: 'blur' }
                ]"
              >
                <el-input  type='text' v-model.number="inParnForm.startWeight" style='width:150px' :disabled="isInputWeight" @change="countWeight('startWeight')"/> KG
              </el-form-item>
              <el-form-item
                label="结束数："
                prop="endWeight"
                :rules="[
                  { required: true, validator: validateCheckEndWeight, message: '结束数不可小于等于起始数', trigger: 'blur' }
                ]"
                >
                <el-input  type='text' v-model.number="inParnForm.endWeight" style='width:150px' :disabled="isInputWeight" @change="countWeight('endWeight')"/> KG
              </el-form-item>
              <el-form-item label="领用数量：">
                <template slot-scope="scope">
                  {{inParnForm.useWeight}} KG
                </template>
                <!-- <el-input  type='text' v-model.trim="inParnForm.useWeight" style='width:150px' :disabled="true" /> KG -->
              </el-form-item>
              <el-form-item label="操作时间：" >
                <el-input  type='text' v-model.trim="inParnForm.changed" style='width:220px' :disabled="true"/>
              </el-form-item>
              <el-form-item label="操作人：">
                <el-input  type='text' v-model.trim="inParnForm.changer" style='width:220px' :disabled="true"/>
              </el-form-item>
            </el-form>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" size="small" style="color: #000000;background-color: #FFFFFF;border-color: #D9D9D9;" @click="cannalInParn('inParnForm')">取消</el-button>
            <el-button type="primary" size="small" style="background-color: #1890FF;color: #FFFFFF;border-color: #1890FF;" @click="saveInParn('inParnForm')">确定</el-button>
          </div>
        </el-dialog>
    </div>
  </div>
</template>

<script>
import { BASICDATA_API, MEASUREBARN_BEAN_API } from '@/api/api'
import { isAuth } from '../../../../../net/validate'
import MSG from '@/assets/js/hint-msg'
import {dateFormat} from '@/net/validate.js'
export default {
  name: 'MeasureBarnBeanPulpIndex',
  data () {
    return {
      factoryList: [],
      workshopList: [],
      plantList: {
        factoryIDValue: '',
        workshopIDValue: ''
      },
      dataList: [],
      oriAPIData: [],
      isShowMessageBoxCheck: false,
      isInputWeight: true,
      inParnForm: {
        foodHolderId: '',
        batch: '',
        materialCode: '',
        materialName: '',
        currentQuantity: 0,
        startWeight: 0,
        endWeight: 0,
        // pulpBatch: '',
        pulpHolderId: '',
        useWeight: 0,
        unit: 'KG',
        changed: '',
        changer: this.$store.state.user.realName + '（' + this.$store.state.user.name + '）'
      },
      inParnHolder: [], // API 进来数据
      inParn: {
        holderId: '',
        pulpBatch: '',
        holdList: [],
        startWeight: 0,
        endWeight: 0,
        finishWeight: this.endWeight - this.endWeight
      }
    }
  },
  mounted () {
    this.getOriDataFromAPI().then(() => {
      // 初始化搜寻条件
      this.plantList.factoryIDValue = this.oriAPIData[0].deptId
      if (this.oriAPIData[0].workshop.length !== 0) {
        this.workshopList = this.oriAPIData[0].workshop
        this.plantList.workshopIDValue = this.oriAPIData[0].workshop[0].deptId
      } else {
        this.workshopList = []
        this.plantList.workshopIDValue = ''
      }
    })
  },
  methods: {
    closeInParnDialog () {
      this.inParn.holdList = []
      this.inParnForm.foodHolderId = ''
      this.inParnForm.batch = ''
      this.inParnForm.materialCode = ''
      this.inParnForm.materialName = ''
      this.inParnForm.currentQuantity = 0
      this.inParnForm.startWeight = 0
      this.inParnForm.endWeight = 0
      this.inParnForm.useWeight = 0
      this.cannalInParn('inParnForm')
    },
    validateCheckStartWeight (rule, value, callback) {
      if (value >= this.inParnForm.endWeight) {
        callback(new Error('起始数不可大于等于结束数'))
      } else {
        callback()
      }
    },
    validateCheckEndWeight (rule, value, callback) {
      if (value <= this.inParnForm.startWeight) {
        callback(new Error('结束数不可小于等于起始数'))
      } else {
        callback()
      }
    },
    countWeight (flag) {
      if (flag === 'startWeight') {
        this.inParnForm.endWeight = this.inParnForm.startWeight + 1
      }
      this.inParnForm.useWeight = this.inParnForm.endWeight - this.inParnForm.startWeight
    },
    // 改变选单数据
    changeSearchOptions (flag) {
      let item = this.oriAPIData.find(ele => ele.deptId === flag)
      if (item.workshop.length !== 0) {
        this.workshopList = item.workshop
      } else {
        this.workshopList = []
        this.plantList.workshopIDValue = ''
      }
    },
    changeInParnHolderOptions (flag) {
      let item = this.inParnHolder.find(ele => ele.holderId === flag)

      this.isInputWeight = true
      this.inParn.holdList = []
      this.inParnForm.batch = ''
      this.inParnForm.materialCode = ''
      this.inParnForm.materialName = ''
      this.inParnForm.currentQuantity = 0
      this.inParnForm.startWeight = 0
      this.inParnForm.endWeight = 0
      if (item.pulpData.length !== 0) {
        this.inParn.holdList = item.pulpData
        // this.inParnForm.materialCode = item.pulpData
        // this.inParnForm.materialName = item.pulpData
      } else {
        this.inParn.holdList = []
        this.inParnForm.batch = ''
      }
    },
    changeInParnBatchOptions (holder, batch) {
      let item = this.inParnHolder.find(ele => ele.holderId === holder)
      if (item.pulpData.length !== 0) {
        this.isInputWeight = false
        let itemW = item.pulpData.find(ele => ele.batch === batch)
        // this.inParn.holdList = item.pulpData
        this.inParnForm.materialCode = itemW.materialCode
        this.inParnForm.materialName = itemW.materialName
        this.inParnForm.currentQuantity = itemW.currentQuantity
      } else {
        // this.inParn.holdList = []
        this.isInputWeight = true
        this.inParnForm.materialCode = ''
        this.inParnForm.materialName = ''
        this.inParnForm.currentQuantity = 0
      }
    },
    goParn (item) {
      this.plantList.factoryIDValue = item.factory
      this.plantList.workshopIDValue = item.deptId
      this.isShowMessageBoxCheck = true
      this.inParnForm.pulpHolderId = item.holderId
      this.$http(`${MEASUREBARN_BEAN_API.BEANPULP_INPARN}`, 'POST', {factory: item.factory, workShop: item.deptId}).then(({data}) => {
        if (data.code === 0) {
          // console.log('data')
          // console.log(data)
          this.inParnHolder = []
          data.holder.map(item => {
            this.inParnHolder.push({deptId: item.deptId, holderName: item.holderName, holderId: item.holderId, pulpData: item.pulpData})
          })
          this.isInputWeight = true
          this.inParnForm.changed = dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
          // this.inParnForm = data.holder

          // console.log('this.inParnHolder')
          // console.log(this.inParnHolder)
        } else {
          this.$notify.error({title: '错误', message: data.msg})
        }
      })
      // let temp = {
      //   batch: '1902240101',
      //   changed: '2019-06-18 11:06:46',
      //   changer: 'SAP_SYNC',
      //   currentQuantity: 95945,
      //   endWeight: 21,
      //   foodHolderId: '3321240',
      //   materialCode: 'M020200001',
      //   materialName: '脱脂大豆1#',
      //   pulpHolderId: '7E0AA796139E46738A949E88E1272578',
      //   startWeight: 20,
      //   unit: 'KG',
      //   useWeight: 1
      // }
      // this.$http(`${MEASUREBARN_BEAN_API.BEANPULP_SAVE_INPARN}`, 'POST', temp).then(({data}) => {
      //   if (data.code === 0) {
      //     console.log('datadatadatadatadata')
      //     console.log(data)
      //   } else {
      //     this.$notify.error({title: '错误', message: data.msg})
      //   }
      // })
    },
    cannalInParn (formName) {
      this.$refs[formName].resetFields()
      this.inParn.holdList = []
      this.inParnForm.foodHolderId = ''
      this.inParnForm.batch = ''
      this.inParnForm.materialCode = ''
      this.inParnForm.materialName = ''
      this.inParnForm.currentQuantity = 0
      this.inParnForm.startWeight = 0
      this.inParnForm.endWeight = 0
      this.inParnForm.useWeight = 0
      this.isShowMessageBoxCheck = false
    },
    saveInParn (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // this.inParnForm.pulpHolderId = this.dataList.holderId
          this.$http(`${MEASUREBARN_BEAN_API.BEANPULP_SAVE_INPARN}`, 'POST', this.inParnForm).then(({data}) => {
            if (data.code === 0) {
              this.$notify({title: MSG.OPERATE.saveSuccess.title, message: MSG.OPERATE.saveSuccess.message, type: 'success'})
              this.inParnForm.foodHolderId = ''
              this.inParnForm.batch = ''
              this.inParnForm.materialCode = ''
              this.inParnForm.materialName = ''
              this.inParnForm.currentQuantity = 0
              this.inParnForm.startWeight = 0
              this.inParnForm.endWeight = 0
              this.inParnForm.useWeight = 0
              this.isShowMessageBoxCheck = false
              this.$refs[formName].resetFields()
              this.getOrderList()
            } else {
              this.$notify.error({title: '错误', message: data.msg})
            }
          })
        } else {
          return false
        }
      })
    },
    // 获取工厂
    getFactory () {
      return new Promise((resolve, reject) => {
        this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST', {}, false, false, false).then(({data}) => {
          if (data.code === 0) {
            resolve(data.typeList)
          } else {
            this.$notify.error({title: MSG.API.BeanPulp.getFactoryError.title, message: data.msg})
            reject(data.msg)
          }
        })
      })
    },
    // 根据工厂获车间
    getWorkshop (id) {
      return new Promise((resolve, reject) => {
        this.plantList.workshopIDValue = ''
        this.workshopList = []
        if (id) {
          this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {deptId: id, deptName: '制曲'}, false, false, false).then(({data}) => {
            if (data.code === 0) {
              resolve(data.typeList)
            } else {
              this.$notify.error({title: MSG.API.BeanPulp.getWorkshopError.title, message: data.msg})
              reject(data.msg)
            }
          })
        }
      })
    },
    // 获取工厂车间
    getOriDataFromAPI () {
      return new Promise((resolve, reject) => {
        this.getFactory().then((valueFactory) => {
          this.oriAPIData = []
          this.factoryList = []
          for (let i = 0; i < valueFactory.length; i++) {
            let dataTempF = {
              deptId: valueFactory[i].deptId,
              deptName: valueFactory[i].deptName,
              workshop: []
            }
            this.factoryList.push({deptId: valueFactory[i].deptId, deptName: valueFactory[i].deptName})
            this.getWorkshop(valueFactory[i].deptId).then((valueWorkshop) => {
              if (valueWorkshop.length !== 0) {
                for (let j = 0; j < valueWorkshop.length; j++) {
                  let dataTempW = {
                    deptId: valueWorkshop[j].deptId,
                    deptName: valueWorkshop[j].deptName
                  }
                  dataTempF.workshop.push(dataTempW)
                }
              }
              this.oriAPIData.push(dataTempF)
              resolve()
            })
          }
        })
      })
    },
    // 获取列表
    getOrderList () {
      this.dataList = []
      if (!this.plantList.factoryIDValue) {
        this.$warning_SHINHO('请选择工厂')
        return
      }
      this.$http(`${MEASUREBARN_BEAN_API.BEANPULP_POT_LIST}`, 'POST', {factory: this.plantList.factoryIDValue, workShop: this.plantList.workshopIDValue}).then(({data}) => {
        if (data.code === 0) {
          if (data.infoList.length !== 0) {
            this.dataList = data.infoList
          } else {
            this.$notify.info({title: MSG.API.BeanPulp.searchResult.title, message: MSG.API.BeanPulp.searchResult.message})
          }
        } else {
          this.$notify.error({title: '错误', message: data.msg})
        }
      })
    },
    // 去详请
    goTargetDetail (item) {
      if (!isAuth('realTime:pulp:pulpMeasuringBin')) {
        this.$notify.error({title: MSG.AUTH.noAuthority.title, message: MSG.AUTH.noAuthority.message})
        return
      }
      // ！！！！！！此部份逻辑不一样会需要送不同参数！！！！！！
      this.targetAugs = {
        holderId: item.holderId,
        factory: this.plantList.factoryIDValue,
        deptId: this.plantList.workshopIDValue
      }
      this.$store.state.common.MeasureBarnBeanPulp = item
      this.mainTabs = this.mainTabs.filter(item => item.name !== 'DataEntry-MeasureBarn-BeanPulp-DataEntryIndex')
      setTimeout(() => {
        this.$router.push({ name: `DataEntry-MeasureBarn-BeanPulp-DataEntryIndex` })
      }, 100)
    }
  },
  computed: {
    // countWeight: function () {
    //   return Number(this.endWeight) - Number(this.startWeight)
    // },
    isMainAreaShow: function () {
      return this.dataList.length !== 0
    },
    sumBatch: function () {
      return function (items) {
        let sum = 0
        items.forEach((item) => {
          sum = sum + (item.amount * 1)
        })
        return sum
      }
    },
    mainTabs: {
      get () {
        return this.$store.state.common.mainTabs
      },
      set (val) {
        this.$store.commit('common/updateMainTabs', val)
      }
    },
    targetAugs: {
      get () {
        return this.$store.state.common.BeanPulp
      },
      set (val) {
        this.$store.commit('common/updateMeasureBarnBeanPulp', val)
      }
    }
  },
  components: {
    realName: {
      get () { return this.$store.state.user.realName }
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/_common.scss';
@import '@/assets/scss/_share.scss';
.measurebarn-bean-pulp{
  .area-to-bottom{
    min-height: calc(82vh);
  }
  .measurebarn-bean-pulp__body{
    .el-col-12{
      margin-bottom: 10px;
    }
  }
  .card-item_detail{
    margin-right: 5px;
    margin-top: 5px;
    &::after{
      content: " >>";
      font-size: 12px;
    }
  }
  .card-item{
    .el-card__header{
      padding: 15px 20px;
      font-size: 16px;
      color: #666;
    }
    &_detail{
      float: right;
      cursor: pointer;
      color: #1890FF;
    }
    &_img{
      width: 250px;
      position: relative;
      img{
        width: 250px;
      }
      &_box{
        width: 89px;
        height: 161px;
        position: absolute;
        left: 83px;
        top: 33px;
        display: flex;
        flex-wrap: wrap;
        align-content: flex-end;
        &_bg{
          flex: 1;
          height: 161px;
          align-items: center;
          position: relative;
          background: linear-gradient(#35C3FF,#1890FF);
          overflow: hidden;
          &::before,&::after{
            content: "";
            position: absolute;
            left: 50%;
            min-width: 155px;
            min-height: 145px;
            background: #fff;
            animation: roateTwo 10s linear infinite;
          }

          &::before {
            top: -138px;
            border-radius: 45%;
          }
          &::after {
            top: -132px;
            opacity: 0.5;
            border-radius: 47%;
          }
        }
        &:hover &_bg::before,&:hover &_bg::after{
          animation: roateOne 10s linear infinite;
        }
      }
    }
    &_text{
      flex: 1;
      margin-right:2em;
      .el-card__header{
        font-size: 14px;
        padding: 10px 12px;
        background: #1890FF;
        color: white;
      }
      &_box{
        position: relative;
        padding-bottom: 6px;
        max-height: 180px;
        overflow: scroll;
        &_bg1,&_bg2{
          position: absolute;
          width: 100%;
          height: 20px;
          background: linear-gradient(rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%);
          z-index: 999;
        }
        &_bg2{
          bottom: 0;
          background: linear-gradient(rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%);
        }
      }
      .card-item_text_box::-webkit-scrollbar {
        display: none;
      }
      &_item{
        color: #4A4A4A;
        font-size: 14px;
        padding-top: 10px;
      }
    }
  }
}
</style>
