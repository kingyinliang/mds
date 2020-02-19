<template>
  <div class="main">
    <el-card>
      <div class="titleLeft">
        <i class="iconfont factory-kucun" style="color: #666; margin-right: 10px;"></i>发酵罐分布情况
        <el-button type="primary" size="small" @click="ExportExcelA(true)"  v-if="isAuth('report:production:fermentationExport')" style="background-color: #1890ff; color: #fff; float: right;">导出</el-button>
      </div>
      <el-table :data="headerInfo" border header-row-class-name="tableHead" style="margin-top: 10px;">
        <el-table-column label="区域" show-overflow-tooltip prop="holderArea"></el-table-column>
        <el-table-column label="空罐" show-overflow-tooltip prop="empty"></el-table-column>
        <el-table-column label="投料中" show-overflow-tooltip prop="feeding" ></el-table-column>
        <el-table-column label="发酵中" show-overflow-tooltip prop="fermentation"></el-table-column>
        <el-table-column label="领用中" show-overflow-tooltip prop="collarUse"></el-table-column>
        <el-table-column label="其他占用罐" show-overflow-tooltip prop="other"></el-table-column>
        <el-table-column label="味极鲜罐数" show-overflow-tooltip prop="weijixian"></el-table-column>
        <el-table-column label="六月鲜罐数" show-overflow-tooltip prop="liuyuexian"></el-table-column>
        <el-table-column label="TB罐数" show-overflow-tooltip prop="tb"></el-table-column>
        <el-table-column label="JYTB罐数" show-overflow-tooltip prop="jytb"></el-table-column>
        <el-table-column label="JY罐数" show-overflow-tooltip prop="jy"></el-table-column>
        <el-table-column label="发酵一总罐数" show-overflow-tooltip prop="sum" width="110"></el-table-column>
      </el-table>
      <div class="titleLeft" style="margin-top: 15px;">
        <i class="iconfont factory-icon_function_keyongkucun" style="color: #666; margin-right: 10px;"></i>发酵总库存列表
      </div>
      <el-table :data="dataList" border header-row-class-name="tableHead" style="margin-top: 10px;">
        <el-table-column label="罐号" show-overflow-tooltip prop="holderNo" width="50"></el-table-column>
        <el-table-column label="状态" show-overflow-tooltip prop="holderStatus" width="70"></el-table-column>
        <el-table-column label="投料数(M³)" show-overflow-tooltip prop="realInAmount" width="75"></el-table-column>
        <el-table-column label="入库数(M³)" show-overflow-tooltip prop="ferAmount" width="75"></el-table-column>
        <el-table-column label="库存数(M³)" show-overflow-tooltip prop="stockAmount" width="75"></el-table-column>
        <el-table-column label="类别" prop="halfType" show-overflow-tooltip width="70"></el-table-column>
        <el-table-column label="" show-overflow-tooltip prop="feedingDate" width="100">
          <template slot="header">投料开始<br>时间</template>
          <template slot-scope="scope">{{scope.row.feedingDate}}</template>
        </el-table-column>
        <el-table-column label="" show-overflow-tooltip prop="fermentDate" width="100">
          <template slot="header">发酵开始<br>时间</template>
          <template slot-scope="scope">{{scope.row.fermentDate}}</template>
        </el-table-column>
        <el-table-column label="发酵结束时间" show-overflow-tooltip prop="fermentEndDate" width="100">
          <template slot="header">发酵结束<br>时间</template>
          <template slot-scope="scope">{{scope.row.fermentEndDate}}</template>
        </el-table-column>
        <el-table-column label="发酵期" show-overflow-tooltip prop="fermentTime" width="60"></el-table-column>
        <el-table-column label="发酵时间" show-overflow-tooltip prop="fermentDays" width="50"></el-table-column>
        <el-table-column label="压榨时间" show-overflow-tooltip prop="pulpDate" width="100"></el-table-column>
        <el-table-column label="领用酱醪数(M³)" show-overflow-tooltip prop="useNums" width="80"></el-table-column>
        <el-table-column label="出品数" show-overflow-tooltip prop="outAmount" width="70"></el-table-column>
        <el-table-column label="出品率" show-overflow-tooltip prop="yield" width="80"></el-table-column>
        <el-table-column label="发酵罐容量(M³)" show-overflow-tooltip prop="holderHold"></el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 15, 30, 35]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import {FERMENTATION_API} from '@/api/api'
import { exportFile } from '@/net/validate'
export default {
  name: 'summarys',
  data () {
    return {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      headerInfo: [],
      dataList: [],
      dataListAll: [],
      plantList: {
        workShop: ''
      }
    }
  },
  mounted () {
    this.GetList()
  },
  methods: {
    GetList () {
      this.$http(`${FERMENTATION_API.FER_REPORT_LIST}`, 'POST', {workShop: this.$store.state.common.Fermentation.workShop}).then(({data}) => {
        if (data.code === 0) {
          // this.headerInfo = data.returnMap.head
          data.returnMap.head.map((item) => {
            this.headerInfo.push(item)
          })
          this.dataListAll = data.returnMap.info
          this.total = data.returnMap.info.length
          this.changeList()
        } else {
          this.$error_SHINHO(data.msg)
        }
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.currentPage = 1
      this.changeList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.changeList()
    },
    changeList () {
      this.dataList = this.dataListAll.slice((this.currentPage - 1) * this.pageSize, (this.currentPage - 1) * this.pageSize + this.pageSize)
    },
    // 导出
    ExportExcelA () {
      this.plantList.workShop = this.$store.state.common.Fermentation.workShop
      exportFile(`${FERMENTATION_API.FER_REPORT_EXPORTLIST}`, '发酵罐一览表', this)
    }
  }
}
</script>

<style lang="scss" scoped>
.titleLeft {
  font-weight: bold;
  margin: 0;
  line-height: 32px;
}
</style>
