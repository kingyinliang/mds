<template>
<div>
<!-- <h1>home</h1> -->
<img src="@/assets/img/index.svg" style="width: 80%; display: block; margin: 120px auto;">
  <!--<Dialog></Dialog>-->
</div>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      form: {
        currPage: 1,
        pageSize: 10,
        totalCount: 1000
      }
    }
  },
  mounted () {
    console.log(this.version)
  },
  methods: {
  },
  computed: {},
  components: {
    Dialog: resolve => {
      require(['../components/dialog/sh-dialog'], resolve)
    }
  }
}
</script>

<style scoped>

</style>
