<template>
    <aside class="site-sidebar" :class="'site-sidebar--' + sidebarLayoutSkin" @mouseenter="showMenu" @mouseleave="closeMenu">
        <div class="site-sidebar__inner">
            <el-menu :defaultActive="menuActiveName || 'home'" :collapse="sidebarFold" :collapseTransition="false" class="site-sidebar__menu">
                <el-menu-item
                    index="home"
                    @click="menuActiveName = 'home';$router.push({ path: 'home' });"
                >
                    <i class="site-sidebar__menu-icon iconfont factory-shouye" />
                    <span slot="title">首页</span>
                </el-menu-item>
                <template v-for="menu in menuList">
                    <sub-menu v-if="menu.type != '4'" :key="menu.menuId" :menu="menu" :dynamicMenuRoutes="dynamicMenuRoutes" />
                </template>
            </el-menu>
        </div>
    </aside>
</template>

<script>
import { isURL } from '@/net/validate';
export default {
    name: 'MainLeftbar',
    components: {
        SubMenu: resolve => {
            require(['@/views/main_leftbar_menu'], resolve);
        }
    },
    data() {
        return {
            dynamicMenuRoutes: []
        };
    },
    computed: {
        sidebarLayoutSkin: {
            get() {
                return this.$store.state.common.sidebarLayoutSkin;
            }
        },
        sidebarFold: {
            get() {
                return this.$store.state.common.sidebarFold;
            },
            set(val) {
                this.$store.commit('common/updateSidebarFold', val);
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
        mainTabs: {
            get() {
                return this.$store.state.common.mainTabs;
            },
            set(val) {
                this.$store.commit('common/updateMainTabs', val);
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
    watch: {
        $route: 'routeHandle'
    },
    created() {
        this.menuList = JSON.parse(sessionStorage.getItem('menuList') || '[]');
        this.dynamicMenuRoutes = JSON.parse(sessionStorage.getItem('dynamicMenuRoutes') || '[]');
        this.routeHandle(this.$route);
    },
    methods: {
        showMenu() {
            this.sidebarFold = false;
        },
        closeMenu() {
            this.sidebarFold = true;
        },
        // 路由操作
        routeHandle(route) {
            if (route.meta.isTab) {
                // tab选中, 不存在先添加
                let tab = this.mainTabs.filter(item => item.name === route.name)[0];
                if (!tab) {
                    if (route.meta.isDynamic) {
                        if (!this.dynamicMenuRoutes.filter(item => item.name === route.name)[0]) {
                            return;
                        }
                    }
                    tab = {
                        menuId: route.meta.menuId || route.name,
                        name: route.name,
                        title: route.meta.title,
                        type: isURL(route.meta.iframeUrl) ? 'iframe' : 'module',
                        iframeUrl: route.meta.iframeUrl || ''
                    };
                    this.mainTabs = this.mainTabs.concat(tab);
                }
                this.menuActiveName = String(tab.menuId);
                this.mainTabsActiveName = tab.name;
            }
        }
    }
};
</script>

<style scoped></style>
