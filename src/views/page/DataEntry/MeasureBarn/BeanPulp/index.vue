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
          <el-col :span="12" v-for="(item, index) in dataList" :key="index">
            <el-card class="card-item">
              <div slot="header">豆粕罐号：{{item.holderName}} <span class="card-item_detail" @click="goTargetDetail(item)">详情</span></div>
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
  </div>
</template>

<script>
import { BASICDATA_API, MEASUREBARN_BEAN_API } from '@/api/api'
import { isAuth } from '../../../../../net/validate'
import MSG from '@/assets/js/hint-msg'
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
      oriAPIData: []
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
      this.mainTabs = this.mainTabs.filter(item => item.name !== 'DataEntry-MeasureBarn-targetAugs-DataEntryIndex')
      setTimeout(() => {
        this.$router.push({ name: `DataEntry-MeasureBarn-BeanPulp-DataEntryIndex` })
      }, 100)
    }
  },
  computed: {
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
  components: {}
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
    &::after{
      content: " >>"
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
