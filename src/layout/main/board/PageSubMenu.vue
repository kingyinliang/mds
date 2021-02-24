<template>
    <div v-if="/制曲车间/g.test(page.menuName)">
        <sub-menu :page="page" />
    </div>
    <div v-else>
        <el-submenu v-if="page.list.length">
            <template slot="title">
                <div>
                    <em :class="page.menuIcon || ''" class="site-sidebar__menu-icon iconfont" />
                    <span>{{ page.menuName }}</span>
                </div>
            </template>
            <page-sub-menu v-for="(item, index) in page.list.filter(it => it.type !== '2')" :key="index" :page="item" />
        </el-submenu>
        <el-menu-item v-else :index="page.id" @click="goPage(page)">
            <em :class="page.menuIcon || ''" class="site-sidebar__menu-icon iconfont" />
            <span slot="title">{{ page.menuName }}</span>
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
    methods: {
        goPage(page) {
            const route = this.dynamicMenuRoutes.filter(item => item.meta.menuId === page.id);
            if (route.length >= 1) {
                this.menuActiveName = page.id;
                this.$router.push({ path: route[0].path });
            }
        }
    }
};
</script>

<style scoped></style>
