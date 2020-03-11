<template>
    <div v-if="/制曲车间/g.test(page.name)">
        <sub-menu :page="page" />
    </div>
    <div v-else>
        <el-submenu v-if="page.list.filter(it => it.type !== '2').length">
            <template slot="title">
                <div>
                    <i :class="page.icon || ''" class="site-sidebar__menu-icon iconfont" />
                    <span>{{ page.name }}</span>
                </div>
            </template>
            <page-sub-menu v-for="(item, index) in page.list.filter(it => it.type !== '2')" :key="index" :page="item" />
        </el-submenu>
        <el-menu-item v-else :index="page.menuId" @click="goPage(page)">
            <i :class="page.icon || ''" class="site-sidebar__menu-icon iconfont" />
            <span slot="title">{{ page.name }}</span>
        </el-menu-item>
    </div>
</template>

<script>
export default {
    name: 'PageSubMenu',
    components: {
        SubMenu: resolve => {
            require(['./SubMenu'], resolve);
        },
        PageSubMenu: resolve => {
            require(['./PageSubMenu'], resolve);
        }
    },
    props: {
        page: {
            type: Object,
            required: true
        }
    },
    data() {
        return {};
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
    mounted() {},
    methods: {
        goPage(page) {
            const route = this.dynamicMenuRoutes.filter(item => item.meta.menuId === page.menuId);
            if (route.length >= 1) {
                this.menuActiveName = page.menuId;
                this.$router.push({ path: route[0].path });
            }
        }
    }
};
</script>

<style scoped></style>
