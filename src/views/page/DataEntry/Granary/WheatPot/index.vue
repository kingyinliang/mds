<template>
  <div class="header_main">
    <el-card class="queryHead">
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
        <el-form-item style="float: right;">
          <el-button type="primary" size="small" @click="getOrderList()" :disabled="plantList.factoryIDValue==='' && plantList.workshopIDValue==='' || workshopList.length === 0">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-row :gutter="30" v-if="isMainAreaShow" class="cardList">
      <el-col :span="12" v-for="(item, index) in dataList" :key="index">
        <el-card class="card-item">
          <div slot="header">小麦罐号：{{item.holderName}} <span class="card-item_detail" @click="goTargetDetail(item)">详情</span></div>
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="card-item-color-lump" style="background: #ffbf00;">
                <span class="card-item-color-lump_icon iconfont factory-chuguan1"></span>
                <div class="card-item-color-lump__img">
                  <div class="card-item-color-lump__img__box">
                    <div class="card-item-color-lump__img__box__bg" :style="{height: `${Math.min(sumBatch(item.wheatList) / (item.holderHold*1), 100)}%`}"></div>
                  </div>
                  <img src="@/assets/img/ui2.0/pot.png" alt="">
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="card-item-color-lump">
                <span class="card-item-color-lump_icon iconfont factory-zongliangguanli"></span>
                <p class="card-item-color-lump_text"><span>{{sumBatch(item.wheatList).toLocaleString()}}</span>KG</p>
                <p class="card-item-color-lump_text">库存总量</p>
              </div>
            </el-col>
          </el-row>
          <div class="card-item-color-lump_text">
            <p class="card-item-color-lump_text__title">
              <i class="card-item-color-lump_text__icon"></i>
              <span>库存明细</span>
            </p>
            <el-table :data="item.wheatList" header-row-class-name="card-item-color-lump_text__table__head" class="card-item-color-lump_text__table">
              <el-table-column prop="batch" width="auto"><template slot="header" slot-scope="scope"><i class="iconfont factory-pici" style="margin-right: 5px;"></i>批次</template></el-table-column>
              <el-table-column prop="currentQuantity" width="auto" header-align="left">
                <template slot="header" slot-scope="scope"><i class="iconfont factory-shuliang" style="font-size: 18px; margin-right: 5px;"></i>数量</template>
                <template slot-scope="scope">
                  {{(scope.row.currentQuantity*1).toLocaleString()}} KG
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {BASICDATA_API, GRANARY_API} from '@/api/api'
import { isAuth } from '../../../../../net/validate'
import MSG from '@/assets/js/hint-msg'
export default {
  name: 'GranaryWheatPotIndex',
  data () {
    return {
      factoryList: [],
      workshopList: [],
      plantList: {
        factoryIDValue: '',
        factoryName: '',
        workshopIDValue: '',
        workshopName: '',
        holderId: '',
        holderName: ''
      },
      dataList: [],
      oriAPIData: []
    }
  },
  // watch: {
  // },
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
        this.factoryList = []
        this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, `POST`, {}, false, false, false).then(({data}) => {
          if (data.code === 0) {
            resolve(data.typeList)
          } else {
            this.$notify.error({title: MSG.API.getFactoryError.title, message: data.msg})
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
          this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {deptId: id, deptName: '炒麦'}, false, false, false).then(({data}) => {
            if (data.code === 0) {
              resolve(data.typeList)
            } else {
              this.$notify.error({title: MSG.API.getWorkshopError.title, message: data.msg})
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
      this.$http(`${GRANARY_API.WHEAT_POT_LIST}/${this.plantList.factoryIDValue}?deptId=${this.plantList.workshopIDValue}&flag=002`, `GET`).then(({data}) => {
        if (data.code === 0) {
          if (data.data.length !== 0) {
            this.dataList = data.data.holders
            this.dataList.map((item) => {
              item.wheatList = item.stocks
              delete item.stocks
            })
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
      if (!isAuth('gra:material:list')) {
        this.$notify.error({title: MSG.AUTH.noAuthority.title, message: MSG.AUTH.noAuthority.message})
        return
      }
      // ！！！！！！此部份逻辑不一样会需要送不同参数！！！！！！
      let searchTarget = this.oriAPIData.find(ele => ele.deptId === this.plantList.factoryIDValue)
      this.targetAugs = {
        // holderId: item.holderId,
        // factory: this.plantList.factoryIDValue
        factoryId: this.plantList.factoryIDValue,
        factoryName: searchTarget.deptName,
        workshopId: item.deptId,
        workshopName: searchTarget.workshop.find(ele => ele.deptId === item.deptId).deptName,
        holderId: item.holderId,
        holderName: item.holderName
      }
      this.mainTabs = this.mainTabs.filter(item => item.name !== 'DataEntry-Granary-WheatPot-dataEntryIndex')
      setTimeout(() => {
        this.$router.push({name: 'DataEntry-Granary-WheatPot-dataEntryIndex'})
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
          sum = sum + (item.currentQuantity * 1)
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
        return this.$store.state.common.GranaryWheatPot
      },
      set (val) {
        this.$store.commit('common/updateGranaryWheatPot', val)
      }
    }
  },
  components: {}
}
</script>

<style lang="scss">

</style>
