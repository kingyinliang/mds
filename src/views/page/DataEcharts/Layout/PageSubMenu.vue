<template>
  <div v-if="/制曲车间/g.test(page.name)">
    <sub-menu :page="page"></sub-menu>
  </div>
  <div v-else>
    <el-submenu
      v-if="page.list.filter(it => it.type !== '2').length">
      <template slot="title">
        <div>
          <i :class="page.icon || ''" class="site-sidebar__menu-icon iconfont"></i>
          <span>{{ page.name }}</span>
        </div>
      </template>
      <page-sub-menu v-for="(item, index) in page.list.filter(it => it.type !== '2')" :page="item" :key="index"></page-sub-menu>
    </el-submenu>
    <el-menu-item v-else @click="goPage(page)" :index="page.menuId">
      <i :class="page.icon || ''" class="site-sidebar__menu-icon iconfont"></i>
      <span slot="title">{{page.name}}</span>
    </el-menu-item>
  </div>
</template>

<script>
export default {
  name: 'PageSubMenu',
  data () {
    return {}
  },
  props: {
    page: {
      type: Object,
      required: true
    }
  },
  mounted () {
  },
  methods: {
    goPage (page) {
      var route = this.dynamicMenuRoutes.filter(item => item.meta.menuId === page.menuId)
      if (route.length >= 1) {
        this.menuActiveName = page.menuId
        this.$router.push({ path: route[0].path })
      }
    }
  },
  computed: {
    dynamicMenuRoutes: {
      get () { return this.$store.state.common.dynamicMenuRoutes },
      set (val) { this.$store.commit('common/updateDynamicMenuRoutes', val) }
    },
    menuActiveName: {
      get () { return this.$store.state.common.menuActiveName },
      set (val) { this.$store.commit('common/updateMenuActiveName', val) }
    },
    mainTabsActiveName: {
      get () { return this.$store.state.common.mainTabsActiveName },
      set (val) { this.$store.commit('common/updateMainTabsActiveName', val) }
    }
  },
  components: {
    SubMenu: resolve => {
      require(['./SubMenu'], resolve)
    },
    PageSubMenu: resolve => {
      require(['./PageSubMenu'], resolve)
    }
  }
}
</script>

<style scoped>

</style>
