<template>
  <div class="header_main">
    <div class="dataEntry-head">
      <div class="dataEntry-head-title">
        <i class="dataEntry-head-title__icon iconfont factory-gongchang"></i>
        <span class="dataEntry-head-title__text" v-if="headShow">{{formHeader.factoryName}}</span>
        <span class="dataEntry-head-title__text" v-else>基础信息</span>
        <i class="dataEntry-head-title__status">订单状态：未录入</i>
      </div>
      <div v-if="headShow" class="dataEntry-head-base">
        <el-form :inline="true" :model="formHeader" size="small" label-width="91px" class="dataEntry-head-base__form">
          <el-form-item v-for="(item, index) in headerBase" :key="index">
            <template slot="label">
              <i class="iconfont" :class="item.icon"></i>
              <span>{{item.label}}：</span>
            </template>
            <p v-if="item.type === 'p'">{{item.value | itemValue(formHeader)}}</p>
            <el-date-picker size="mini" type="date" :disabled="!isRedact" value-format="yyyy-MM-dd" format="yyyy-MM-dd" v-model="formHeader[item.value]" style="width: 140px;" v-if="item.type === 'date-picker'"></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <div class="dataEntry-head-show-hidden">
        <span @click="headShow = !headShow">{{headShow ? '收起' : '展开'}} <i class="el-icon-caret-top" :class="{'el-icon-caret-top': headShow, 'el-icon-caret-bottom': !headShow}"></i></span>
      </div>
    </div>
    <!--tabs-->
    <el-tabs ref='tabs'  v-model="activeName" id="DaatTtabs" class="NewDaatTtabs tabsPages" type="border-card">
      <el-tab-pane :name="setKey(index)" v-for="(item, index) in tabs" :key="index">
        <span slot="label" class="spanview">
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
            <span v-if="isRedact">点击提交按钮，当前页面编辑信息将提交系统</span>
            <span v-else>点击编辑按钮，对当前页面进行编辑</span>
          </div>
          <div class="redact_btn">
            <el-button type="primary" size="small" @click="isRedact = !isRedact">{{isRedact?'取消':'编辑'}}</el-button>
            <template v-if="isRedact">
              <el-button type="primary" size="small">保存</el-button>
              <el-button type="primary" size="small">提交</el-button>
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
    }
  },
  mounted () {
  },
  methods: {
    // 设置tabs的绑定
    setKey (index) {
      return (index + 1).toString()
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
.dataEntry-head {
  width: 100%;
  padding: 16px;
  background: rgba(72, 123, 255, 1);
  box-shadow: 3px 3px 5px 0 rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  transition: all 0.5s;
  &-title {
    color: white;
    &__icon {
      font-size: 20px;
      margin-right: 10px;
    }
    &__text {
      font-size: 18px;
    }
    &__status {
      position: relative;
      font-size: 14px;
      float: right;
      padding-left: 15px;
      &::before {
        content: "";
        display: block;
        border-radius: 50%;
        position: absolute;
        top: 5px;
        left: 0;
        width: 6px;
        height: 6px;
        background: rgba(175, 177, 189, 1);
      }
    }
  }
  &-base {
    &__form {
      margin-top: 20px;
      .el-form-item {
        margin-bottom: 5px;
      }
      .el-form-item__label,
      .el-form-item__content {
        color: white;
      }
      .el-date-editor {
        .el-input__inner {
          padding-right: 46px !important;
          padding-left: 15px !important;
        }
        .el-input__prefix {
          right: 0;
          left: auto;
          border-radius: 0 4px 4px 0;
          .el-input__icon {
            width: 32px;
          }
        }
        .el-input__suffix {
          right: 26px;
        }
      }
      p {
        width: 140px;
        line-height: 22px;
        height: 23px;
        margin-top: 5px;
        color: white;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        border-bottom: 1px solid white;
      }
    }
  }
  &-show-hidden {
    height: 6px;
    span {
      cursor: pointer;
      font-size: 12px;
      float: right;
      color: white;
    }
  }
}
.redactBox {
  transition: all 0.3s;
  width: 100%;
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 99;
  height: 48px;
  .redact {
    width: 100%;
    height: 100%;
    padding: 8px 16px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 2px -3px 5px 0 rgba(214, 210, 196, 1);
    border: 1px solid rgba(232, 232, 232, 1);
    &_btn {
      float: right;
      .el-button--primary {
        color: #000;
        background-color: #fff;
        border-color: #d9d9d9;
      }
      .el-button--primary:last-child {
        background-color: #487bff;
        color: #fff;
        border-color: #487bff;
      }
    }
    &_tips {
      float: left;
      font-size: 14px;
      color: #999;
      line-height: 32px;
      i {
        color: #487bff;
        margin-right: 5px;
      }
    }
  }
}
</style>
