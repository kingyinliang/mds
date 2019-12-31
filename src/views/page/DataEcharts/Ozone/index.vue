<template>
  <div class="pageMain">
    <echarts-head>欣和企业开发区分工厂</echarts-head>
    <div class="Container">
      <img src="@/assets/img/ozoneBg.png" alt="" class="Container_bg">
      <div class="Container_box">
        <img src="@/assets/img/ozoneTitle.png" alt="" class="Container_box_title">
        <el-row class="Container_box_row" :gutter="10">
          <el-col :span="8" class="Container_box_row_col" v-for="(item, index) in dataList" :key="index">
            <img src="@/assets/img/ozoneItemBg.png" alt="">
            <div class="Container_box_row_col_echarts" :id="'Line' + index"></div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { line } from './Line'
import { ECHARTS_API } from '@/api/api'
import { throttle } from '@/utils/index'
export default {
  name: 'index',
  data () {
    return {
      Line0: null,
      Line1: null,
      Line2: null,
      Line3: null,
      Line4: null,
      Line5: null,
      Line6: null,
      Line7: null,
      dataList: [],
      sumData: []
    }
  },
  mounted () {
    this.getDataList()
  },
  methods: {
    getDataList () {
      this.$http(`${ECHARTS_API.OZONE_LINE}`, 'POST', {}, false, false, false).then(({data}) => {
        if (data.code === 0) {
          if (data.list.length) {
            this.dataList = data.list[0]
            this.sumData = data.list[1]
            this.$nextTick(() => {
              this.setEcharts()
            })
          }
        } else {
          this.$error_SHINHO(data.msg)
        }
      })
    },
    setEcharts () {
      this.dataList.forEach((item, index) => {
        this['Line' + index] = echarts.init(document.getElementById('Line' + index))
        this['Line' + index].setOption(this.setLine(item, index))
        setTimeout(() => {
          this['Line' + index].resize()
        }, 500)
        if (index + 1 === this.dataList.length) {
          window.addEventListener('resize', throttle(() => {
            this.dataList.forEach((it, indexs) => {
              if (this['Line' + indexs]) {
                this['Line' + indexs].resize()
              }
            })
          }, 500, 2000))
        }
      })
    },
    setLine (data, index) {
      let option = JSON.parse(JSON.stringify(line))
      option.title[0].text = data.name
      option.xAxis.data = data.time
      option.series[0].data = data.temp
      if (/浓度/g.test(data.name)) {
        option.yAxis.max = 120
        option.yAxis.name = 'ppm'
        option.title[1].text = `最高浓度：${this.sumData[index].data}\n${this.sumData[index].time}`
      } else if (/温度/g.test(data.name)) {
        option.yAxis.max = 100
        option.yAxis.name = '℃'
        option.title[1].text = `最高温度：${this.sumData[index].data}\n${this.sumData[index].time}`
      } else {
        option.yAxis.max = 100
        option.yAxis.name = '%'
        option.title[1].text = `最高湿度：${this.sumData[index].data}\n${this.sumData[index].time}`
      }
      return option
    }
  },
  computed: {},
  components: {
    EchartsHead: resolve => {
      require(['../Layout/EchartsHead'], resolve)
    }
  }
}
</script>

<style lang="scss" scoped>
  .pageMain {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    transition: all 1s;
    .Container {
      position: relative;
      padding: 20px 30px 0 140px;
      &_bg {
        width: 100%;
      }
      &_box {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        padding: 20px 30px 0 140px;
        &_title {
          display: block;
          width: 250px;
          margin: auto;
        }
        &_row {
          margin-top: 10px;
          padding: 0 25px;
          &_col {
            position: relative;
            margin-bottom: 10px;
            img {
              width: 100%;
            }
            &_echarts {
              padding: 0 5px;
              width: 100%;
              height: 100%;
              position: absolute;
              top: 0;
              left: 0;
            }
          }
        }
      }
    }
  }
</style>
