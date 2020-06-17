<template>
    <nav class="site-navbar" :class="'site-navbar--' + navbarLayoutType">
        <div class="site-navbar__header">
            <h1 class="site-navbar__brand" @click="$router.push({ name: 'home' })">
                <a class="site-navbar__brand-lg" href="javascript:;"><img src="~common/img/logohead1.png" alt="" style="width: 140px;"></a>
                <a class="site-navbar__brand-mini" href="javascript:;"><img src="~common/img/logoHead2.png" alt="" style="width: 47px;"></a>
            </h1>
        </div>
        <div class="site-navbar__body clearfix">
            <el-menu class="site-navbar__menu" mode="horizontal">
                <el-menu-item class="site-navbar__switch" index="0" @click="sidebarFold = !sidebarFold">
                    <i class="iconfont factory-shouqicaidan switching" :class="{ open: sidebarFold, packup: !sidebarFold }" style="font-size: 25px;" />
                </el-menu-item>
            </el-menu>
            <el-menu class="site-navbar__menu site-navbar__menu--right" mode="horizontal">
                <el-menu-item class="site-navbar__switch" index="4" style="padding: 8px 0;" @click.native="selectFactory">
                    <span style=" display: block; height: 16px; padding: 0 11px; color: #00a2d4; font-size: 16px; line-height: 16px; border-left: 1px solid #d9d9d9;"><i class="iconfont factory-gongchang" style=" margin-right: 5px; color: #00a2d4;" />{{ factoryName }}</span>
                </el-menu-item>
            </el-menu>
            <el-menu class="site-navbar__menu site-navbar__menu--right" mode="horizontal">
                <el-menu-item class="site-navbar__avatar" index="3" style="padding: 0 4px;">
                    <el-dropdown :show-timeout="0" placement="bottom">
                        <span class="el-dropdown-link"><img v-if="gender==='M'" src="~common/img/avatarM.png" :alt="userName"><img v-else src="~common/img/avatarF.png" :alt="userName"><span>{{ realName + '(' + userName + ')' }}</span></span>
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
            <el-button v-if="factoryName!=='系统设置'" type="text" style="float: right;" @click.native="goMessage">
                <el-badge :value="200" :max="99" class="item">
                    <i class="iconfont factory-bell" style="font-size: 18px;" />
                </el-badge>
            </el-button>
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
        },
        selectFactory: {
            type: Function,
            default: () => {
            //
            }
        }
    },
    data() {
        return {
            visible: false,
            factory: JSON.parse(sessionStorage.getItem('userFactory') || '[]'),
            factoryName: JSON.parse(sessionStorage.getItem('factory') || '{}').deptShort
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
        },
        gender: {
            get() {
                return this.$store.state.user.gender;
            },
            set(val) {
                this.$store.commit('user/gender', val);
            }
        }
    },
    mounted() {
        console.log('factory')
        console.log(sessionStorage.getItem('factory'))
    },
    methods: {
        goMessage() {
            // this.$store.commit('packaging/updatePackDetail', item.activeOrderMap);
            this.mainTabs = this.mainTabs.filter(tabItem => tabItem.name !== 'DFMDS-pages-Message');
            setTimeout(() => {
                this.$router.push({
                    name: `DFMDS-pages-Message`
                });
            }, 100);

            console.log(this.$store.state.common.mainTabs.filter(subItem => subItem.name !== 'DFMDS-pages-Message'))

        },
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
.item {
    margin-top: 10px;
    margin-right: 40px;
}
</style>
