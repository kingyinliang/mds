<template>
  <div>
    <el-menu
      :default-active="menuActiveName"
      class="DataEchartsMenu">
      <el-menu-item index="1" @click="menuActiveName='home';$router.push({ path: '/home' })">
        <i class="site-sidebar__menu-icon iconfont factory-shouye"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <page-sub-menu v-for="(item, index) in menuList.filter(it => it.type === '4')[0].list" :page="item" :key="index"></page-sub-menu>
    </el-menu>
    <div class="DataEchartsContent">
      <router-view v-if="isRouterAlive"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      isRouterAlive: true,
      factory: [],
      workshop: []
    }
  },
  created () {
    this.menuList = JSON.parse(sessionStorage.getItem('menuList') || '[]')
    console.log(this.menuList)
    this.dynamicMenuRoutes = JSON.parse(sessionStorage.getItem('dynamicMenuRoutes') || '[]')
    this.routeHandle(this.$route)
  },
  mounted () {
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    },
    // 路由操作
    routeHandle (route) {
      // console.log(this.menuActiveName)
      // this.menuActiveName = (route.meta.menuId || route.name) + ''
      // this.mainTabsActiveName = route.name
    }
  },
  computed: {
    dynamicMenuRoutes: {
      get () { return this.$store.state.common.dynamicMenuRoutes },
      set (val) { this.$store.commit('common/updateDynamicMenuRoutes', val) }
    },
    menuList: {
      get () { return this.$store.state.common.menuList },
      set (val) { this.$store.commit('common/updateMenuList', val) }
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

<style lang="scss">
.DataEchartsMenu {
  border-right: none !important;
  width: 107px;
  position: fixed !important;
  z-index: 999;
  left: 0;
  top: 80px;
  background-color: rgba(255, 255, 255, 0) !important;
  max-height: 80%;
  overflow-y: scroll;
  &::-webkit-scrollbar { width: 0 !important; }

  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
  .el-menu {
    background-color: rgba(255, 255, 255, 0);
  }
  .el-menu-item *,
  .el-submenu__title * {
    vertical-align: inherit;
  }
  .el-menu-item,
  .el-submenu__title {
    font-size: 15px;
    color: #59baf2;
    height: 40px !important;
    line-height: 40px !important;
    padding-left: 13px !important;
    background-image: linear-gradient(-90deg, #112041 0%, rgba(17, 32, 65, 0.5) 66%, #112041 100%);
    border: 2px solid #2461d1;
    border-left: none;
    border-radius: 0 20px 20px 0;
  }
  .el-submenu .el-menu-item {
    width: 85px;
    min-width: 0 !important;
  }
  .el-submenu__title:hover,
  .el-submenu.is-active .el-submenu__title,
  .el-menu-item.is-active,
  .el-menu-item:hover {
    /* background-image: linear-gradient(-90deg, #112041 0%, rgba(17, 32, 65, 0.5) 66%, #112041 100%); */
    background-color: rgba(255, 255, 255, 0);
    border: 2px solid #fff;
    border-left: none;
  }
  li {
    margin-top: 10px;
    margin-bottom: 10px;
  }
}
.DataEchartsContent {
  /* padding-left: 107px; */
  min-width: 1000px;

  /* background: #0e0e40; */
  background: url("~@/assets/img/echartsBgs.png") no-repeat;
  background-size: 100% 100%;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  &::-webkit-scrollbar { width: 0 !important; }

  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
}
</style>
