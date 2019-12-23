<template>
  <div class="pageMain">
    <echarts-head>欣和企业开发区分工厂</echarts-head>
    <div class="Container">
      <img src="@/assets/img/ozoneBg.png" alt="" class="Container_bg">
      <div class="Container_box">
        <img src="@/assets/img/ozoneTitle.png" alt="" class="Container_box_title">
        <el-row class="Container_box_row" :gutter="10">
          <el-col :span="8" class="Container_box_row_col">
            <img src="@/assets/img/ozoneItemBg.png" alt="">
            <div class="Container_box_row_col_echarts" id="Line1"></div>
          </el-col>
          <el-col :span="8" class="Container_box_row_col">
            <img src="@/assets/img/ozoneItemBg.png" alt="">
            <div class="Container_box_row_col_echarts" id="Line2"></div>
          </el-col>
          <el-col :span="8" class="Container_box_row_col">
            <img src="@/assets/img/ozoneItemBg.png" alt="">
            <div class="Container_box_row_col_echarts"></div>
          </el-col>
          <el-col :span="8" class="Container_box_row_col">
            <img src="@/assets/img/ozoneItemBg.png" alt="">
            <div class="Container_box_row_col_echarts"></div>
          </el-col>
          <el-col :span="8" class="Container_box_row_col">
            <img src="@/assets/img/ozoneItemBg.png" alt="">
            <div class="Container_box_row_col_echarts"></div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { line } from './Line'
export default {
  name: 'index',
  data () {
    return {
      Line1: null,
      Line2: null,
      Line3: null
    }
  },
  mounted () {
    this.Line1 = echarts.init(document.getElementById('Line1'))
    this.Line2 = echarts.init(document.getElementById('Line2'))
    this.Line1.setOption(line)
    this.Line2.setOption(line)
    window.addEventListener('resize', () => {
      if (this.Line1) {
        this.Line1.resize()
      }
      if (this.Line2) {
        this.Line2.resize()
      }
    })
  },
  methods: {},
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
