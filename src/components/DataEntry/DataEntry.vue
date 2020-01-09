<template>
  <div class="header_main">
    <div class="dataEntry-head">
      <div class="dataEntry-head-title">
        <i class="dataEntry-head-title__icon iconfont factory-gongchang"></i>
        <span class="dataEntry-head-title__text" v-if="headShow">{{formHeader.factoryName}}烟台欣和企业食品有限公司</span>
        <span class="dataEntry-head-title__text" v-else>基础信息</span>
        <i class="dataEntry-head-title__status"
          :class="{'noPass': orderStatus === 'noPass', 'saved': orderStatus === 'saved', 'submit': orderStatus === 'submit', 'checked': orderStatus === 'checked', '': orderStatus === '已同步'}">
          订单状态：{{orderStatus === 'noPass'? '审核不通过':orderStatus === 'saved'? '已保存':orderStatus === 'submit' ? '已提交' : orderStatus === 'checked'? '通过':orderStatus === '已同步' ? '未录入' : orderStatus }}
        </i>
      </div>
      <div v-if="headShow" class="dataEntry-head-base">
        <el-form :inline="true" :model="formHeader" size="small" label-width="91px" class="dataEntry-head-base__form">
          <el-form-item v-for="(item, index) in headerBase" :key="index">
            <template slot="label">
              <i class="iconfont" :class="item.icon"></i>
              <span>{{item.label}}：</span>
            </template>
            <p v-if="item.type === 'p'">{{item.value | itemValue(formHeader)}}</p>
            <el-date-picker size="mini" @change="updateProductDate" type="date" :disabled="!isRedact" value-format="yyyy-MM-dd" format="yyyy-MM-dd" v-model="formHeader[item.value]" style="width: 120px;" v-if="item.type === 'date-picker'"></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <!--<div class="dataEntry-head-show-hidden">-->
        <!--<span @click="headShow = !headShow">{{headShow ? '收起' : '展开'}} <i class="el-icon-caret-top" :class="{'el-icon-caret-top': headShow, 'el-icon-caret-bottom': !headShow}"></i></span>-->
      <!--</div>-->
    </div>
    <!--tabs-->
    <el-tabs ref='tabs'  v-model="activeName" id="DaatTtabs" class="NewDaatTtabs tabsPages" type="border-card">
      <el-tab-pane :name="setKey(index)" v-for="(item, index) in tabs" :key="index">
        <span slot="label" class="spanview" v-if="item.status !== undefined">
          <el-tooltip class="item" effect="dark" :content="item.status === 'noPass'? '不通过':item.status === 'saved'? '已保存':item.status === 'submit' ? '已提交' : item.status === 'checked'? '通过':'未录入'" placement="top-start">
            <span :style="{'color': item.status === 'noPass'? 'red' : ''}">{{item.label}}</span>
          </el-tooltip>
        </span>
        <span slot="label" class="spanview" v-if="item.status === undefined">
          {{item.label}}
        </span>
        <slot :name="setKey(index)" :isRedact="isRedact"></slot>
      </el-tab-pane>
    </el-tabs>
    <!--编辑-->
    <div class="redactBox">
      <div class="redactBox" :style="{'padding-left': sidebarFold? '64px': '170px'}">
        <div class="redact clearfix">
          <div class="redact_tips">
            <i class="el-icon-info"></i>
            <span v-if="orderStatus === 'submit'">订单已提交，请等待审核</span>
            <span v-if="orderStatus === 'checked'">订单已审核通过</span>
            <span v-if="orderStatus !== 'submit' && orderStatus !== 'checked'">
              <span v-if="isRedact">点击提交按钮，当前页面编辑信息将提交系统</span>
              <span v-else>点击编辑按钮，对当前页面进行编辑</span>
            </span>
          </div>
          <div class="redact_btn">
            <el-button type="primary" size="small" @click="isRedact = !isRedact" v-if="orderStatus !== 'submit' && orderStatus !== 'checked' && isAuth(redactAuth)">{{isRedact?'取消':'编辑'}}</el-button>
            <template v-if="isRedact">
              <el-button type="primary" size="small" v-if="orderStatus !== 'submit' && orderStatus !== 'checked' && isAuth(saveAuth)" @click="savedData('saved')">保存</el-button>
              <el-button type="primary" size="small" v-if="orderStatus !== 'submit' && orderStatus !== 'checked' && isAuth(submitAuth)" @click="submitData">提交</el-button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataEntry',
  data () {
    return {
      headShow: true,
      isRedact: false,
      activeName: '1'
    }
  },
  filters: {
    itemValue (value, formHeader) {
      if (Object.prototype.toString.call(value) === '[object Array]') {
        let str = ''
        value.forEach(it => {
          str = str + ' ' + formHeader[it]
        })
        return str
      } else {
        return formHeader[value]
      }
    }
  },
  props: {
    orderStatus: {
      type: String,
      default: ''
    },
    redactAuth: {
      type: String,
      default: ''
    },
    saveAuth: {
      type: String,
      default: ''
    },
    submitAuth: {
      type: String,
      default: ''
    },
    formHeader: {
      type: Object,
      default: () => {
        return {}
      }
    },
    headerBase: {
      type: Array,
      default: () => {
        return []
      }
    },
    tabs: {
      type: Array,
      default: () => {
        return []
      }
    },
    submitRules: {
      type: Function,
      default: () => []
    },
    savedRules: {
      type: Function,
      default: () => []
    },
    savedDatas: {
      type: Function,
      default: () => {}
    },
    submitDatas: {
      type: Function,
      default: () => {}
    }
  },
  mounted () {
  },
  methods: {
    // 设置tabs的绑定
    setKey (index) {
      return (index + 1).toString()
    },
    updateTabs () {
      // this.$refs.tabs.handleTabClick(this.$refs.tabs.panes[parseInt(this.$refs.tabs.currentName) - 1])
    },
    updateProductDate (dataStr) {
      this.$emit('updateProductDate', dataStr)
    },
    // 保存
    savedData (str) {
      if (str === 'saved') {
        let arr = this.savedRules()
        for (let rule of arr) {
          if (!rule()) {
            return false
          }
        }
        this.savedDatas(str).then(res => {
          this.$success_SHINHO('保存成功')
          this.$emit('success')
        })
      } else {
        this.submitDatas(str).then(res => {
          this.$success_SHINHO('提交成功')
          this.$emit('success')
        })
      }
    },
    // 提交
    submitData () {
      let arr = this.submitRules()
      for (let rule of arr) {
        if (!rule()) {
          return false
        }
      }
      this.$confirm('确认提交该订单, 是否继续?', '提交订单', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.savedData('submit')
      })
    }
  },
  computed: {
    sidebarFold: {
      get () { return this.$store.state.common.sidebarFold }
    }
  },
  components: {}
}
</script>

<style lang="scss">
</style>
