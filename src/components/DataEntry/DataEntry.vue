<template>
  <div class="header_main">
    <div class="redact"></div>
  </div>
</template>

<script>
export default {
  name: 'DataEntry',
  data () {
    return {}
  },
  mounted () {
  },
  methods: {},
  computed: {},
  components: {}
}
</script>

<style lang="scss" scoped>
.redact {
  padding-left: 20px;
  width: 100%;
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 9999;
  height: 47px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(232, 232, 232, 1);
}
</style>
