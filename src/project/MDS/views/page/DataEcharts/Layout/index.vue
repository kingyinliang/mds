<template>
    <div>
        <el-menu :default-active="menuActiveName" class="DataEchartsMenu">
            <el-menu-item
                index="1"
                @click="
                    menuActiveName = 'home';
                    $router.push({ path: '/home' });"
            >
                <em class="site-sidebar__menu-icon iconfont factory-shouye" />
                <span slot="title">首页</span>
            </el-menu-item>
            <page-sub-menu v-for="(item, index) in menuList.filter(it => it.type === '4')[0].list" :key="index" :page="item" />
            <el-menu-item
                index="100"
                @click="
                    menuActiveName = 'realTime';
                    $router.push({ path: '/DataEcharts/RealTime-index' });"
            >
                <span slot="title">蚝油看板</span>
            </el-menu-item>
        </el-menu>
        <div class="DataEchartsContent">
            <router-view v-if="isRouterAlive" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'Index',
    provide() {
        return {
            reload: this.reload
        };
    },
    components: {
        PageSubMenu: resolve => {
            require(['./PageSubMenu'], resolve);
        }
    },
    data() {
        return {
            isRouterAlive: true,
            factory: [],
            workshop: []
        };
    },
    computed: {
        dynamicMenuRoutes: {
            get() {
                return this.$store.state.common.dynamicMenuRoutes;
            },
            set(val) {
                this.$store.commit('common/updateDynamicMenuRoutes', val);
            }
        },
        menuList: {
            get() {
                return this.$store.state.common.menuList;
            },
            set(val) {
                this.$store.commit('common/updateMenuList', val);
            }
        },
        menuActiveName: {
            get() {
                return this.$store.state.common.menuActiveName;
            },
            set(val) {
                this.$store.commit('common/updateMenuActiveName', val);
            }
        },
        mainTabsActiveName: {
            get() {
                return this.$store.state.common.mainTabsActiveName;
            },
            set(val) {
                this.$store.commit('common/updateMainTabsActiveName', val);
            }
        }
    },
    created() {
        this.menuList = JSON.parse(sessionStorage.getItem('menuList') || '[]');
        console.log(this.menuList);
        this.dynamicMenuRoutes = JSON.parse(sessionStorage.getItem('dynamicMenuRoutes') || '[]');
        this.routeHandle(this.$route);
    },
    methods: {
        reload() {
            this.isRouterAlive = false;
            this.$nextTick(() => {
                this.isRouterAlive = true;
            });
        },
        // 路由操作
        routeHandle() {
            // console.log(this.menuActiveName)
            // this.menuActiveName = (route.meta.menuId || route.name) + ''
            // this.mainTabsActiveName = route.name
        }
    }
};
</script>

<style lang="scss">
.DataEchartsMenu {
    position: fixed !important;
    top: 80px;
    left: 0;
    z-index: 999;
    width: 107px;
    max-height: 80%;
    overflow: -moz-scrollbars-none;
    overflow-y: scroll;
    background-color: rgba(255, 255, 255, 0) !important;
    border-right: none !important;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
        width: 0 !important;
    }
    .el-menu {
        background-color: rgba(255, 255, 255, 0);
    }
    .el-menu-item *,
    .el-submenu__title * {
        vertical-align: inherit;
    }
    .el-menu-item,
    .el-submenu__title {
        height: 40px !important;
        padding-left: 13px !important;
        color: #59baf2;
        font-size: 15px;
        line-height: 40px !important;
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
    width: 100%;

    /* padding-left: 107px; */
    min-width: 1000px;
    height: 100%;
    overflow: -moz-scrollbars-none;
    overflow-y: scroll;

    /* background: #0e0e40; */
    background: url("~@/assets/img/echartsBgs.png") no-repeat;
    background-size: 100% 100%;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
        width: 0 !important;
    }
}
</style>
