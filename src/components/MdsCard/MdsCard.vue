<template>
  <div class="box-card">
    <div class="box-card-title clearfix">
      <h3><i class="title-icon" :style="{background: iconBg}"></i>{{title}}</h3>
      <slot name="titleBtn"></slot>
    </div>
    <div :class="name+'Box'">
      <slot></slot>
    </div>
    <div class="box-card-show-hidden">
      <span class="showHiddenBtn" :name="name">收起 <i class="el-icon-caret-top"></i></span>
    </div>
  </div>
</template>

<script>
import { ShowHiddenNameBox } from '@/utils/index'
export default {
  name: 'MdsCard',
  data () {
    return {}
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    iconBg: {
      type: String,
      default: '#487bff'
    }
  },
  mounted () {
    ShowHiddenNameBox(this.$)
  },
  methods: {},
  computed: {},
  components: {}
}
</script>

<style scoped>

</style>
