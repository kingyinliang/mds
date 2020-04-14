<template>
    <nav class="site-navbar" :class="'site-navbar--' + navbarLayoutType">
        <div class="site-navbar__header">
            <h1 class="site-navbar__brand" @click="$router.push({ name: 'home' })">
                <a class="site-navbar__brand-lg" href="javascript:;"><img src="@/assets/img/logohead1.png" alt="" style="width: 140px;"></a>
                <a class="site-navbar__brand-mini" href="javascript:;"><img src="@/assets/img/logoHead2.png" alt="" style="width: 47px;"></a>
            </h1>
        </div>
        <div class="site-navbar__body clearfix">
            <el-menu class="site-navbar__menu" mode="horizontal">
                <el-menu-item class="site-navbar__switch" index="0" @click="sidebarFold = !sidebarFold">
                    <i class="iconfont factory-shouqicaidan switching" :class="{ open: sidebarFold, packup: !sidebarFold }" style="font-size: 25px;" />
                </el-menu-item>
            </el-menu>
            <el-menu v-if="menuList.filter(item => item.type === '4').length > 0" class="site-navbar__menu site-navbar__menu--right" mode="horizontal">
                <el-menu-item class="site-navbar__switch" index="4" style="padding: 8px 0;" @click="goEacharts">
                    <span style=" display: block; height: 16px; padding: 0 11px; color: #00a2d4; font-size: 16px; line-height: 16px; border-left: 1px solid #d9d9d9;">数据面板 <i class="iconfont factory-mianban" style="color: #00a2d4;" /></span>
                </el-menu-item>
            </el-menu>
            <el-menu class="site-navbar__menu site-navbar__menu--right" mode="horizontal">
                <el-menu-item class="site-navbar__avatar" index="3" style="padding: 0 4px;">
                    <el-dropdown :showTimeout="0" placement="bottom">
                        <span class="el-dropdown-link"><img src="@/assets/img/avatar.png" :alt="userName"><span>{{ realName + '（' + userName + '）' }}</span></span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="updatePassword">
                                修改密码
                            </el-dropdown-item>
                            <el-dropdown-item @click.native="logoutHandle()">
                                退出
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-menu-item>
            </el-menu>
        </div>
    </nav>
</template>

<script>
import { COMMON_API } from 'common/api/api';

export default {
    name: 'MainTopbar',
    components: {},
    props: {
        updatePassword: {
            type: Function,
            default: () => 1
        }
    },
    data() {
        return {
            visible: false
        };
    },
    computed: {
        navbarLayoutType: {
            get() {
                return this.$store.state.common.navbarLayoutType;
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
        mainTabs: {
            get() {
                return this.$store.state.common.mainTabs;
            },
            set(val) {
                this.$store.commit('common/updateMainTabs', val);
            }
        },
        userName: {
            get() {
                return this.$store.state.user.name;
            }
        },
        realName: {
            get() {
                return this.$store.state.user.realName;
            },
            set(val) {
                this.$store.commit('user/updaterealName', val);
            }
        }
    },
    methods: {
        goEacharts() {
            this.$router.push({
                path: `/DataEcharts/${this.menuList
                    .filter(item => item.type === '4')[0]
                    .list[0].url.slice(12)
                    .replace(/\//g, '-')}`
            });
        },
        // 退出
        logoutHandle() {
            this.$confirm(`确定进行[退出]操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    COMMON_API.LOGOUT_API({}).then(({ data }) => {
                        if (data && data.code === 200) {
                            this.$cookie.delete('token');
                            this.$router.options.isAddDynamicMenuRoutes = false;
                            window.location.href = `${process.env.VUE_APP_HOST}`;
                        }
                    });
                })
                .catch();
        }
    }
};
</script>

<style lang="scss" scoped>
.site-navbar {
    background: #002140 !important;
}
.packup {
    transform: rotate(0deg);
}
.open {
    transform: rotate(180deg);
}
.switching {
    display: block;
    transition: 500ms;
}
</style>
