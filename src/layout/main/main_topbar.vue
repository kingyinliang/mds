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
                <el-badge :value="messageNum" :max="99" class="item" :hidden="messageNum===0">
                    <i class="iconfont factory-bell" style="font-size: 18px;" />
                </el-badge>
            </el-button>
        </div>
    </nav>
</template>

<script>
    import { COMMON_API, MSG_API } from 'common/api/api';
    import * as socketApi from 'utils/net/WebSocketConnect';

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
                gender: '',
                visible: false,
                factory: JSON.parse(sessionStorage.getItem('userFactory') || '[]'),
                factoryName: JSON.parse(sessionStorage.getItem('factory') || '{}').deptShort,
                messageNum: 0
            };
        },
        computed: {
            // 消息管理用 - 关闭当前页签
            updateMsgNum: {
                get() {
                    return this.$store.state.common.updateMsg;
                },
                set(val) {
                    this.$store.commit('common/updateMsg', val);
                }
            },
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
        watch: {
            updateMsgNum(newStatus) {
                if (this.factoryName !== '系统设置') {
                    if (newStatus !== false) {
                        this.$store.commit('common/updateMsg', false);
                    }
                    this.getMsgNum()
                }
            }
        },
        created() {
            socketApi.getSock(this.getConfigResult)
        },
        mounted() {
            this.gender = sessionStorage.getItem('gender')

            if (this.factoryName !== '系统设置') {
                this.websocketToLogin()
                 // 获取消息数字
                this.getMsgNum()
            }


        },
        methods: {
            getMsgNum() {
                MSG_API.MSG_UNREAD_TOTAL_API({
                    userId: sessionStorage.getItem('loginUserId') // 用户消息id列表
                }).then(({ data }) => {
                    this.messageNum = data.data
                });
            },

            goMessage() {
                if (this.$store.state.common.mainTabs.find(tabItem => tabItem.name === 'DFMDS-pages-Message-index')) {
                    this.$store.commit('common/updateMsgTabAlive', true);
                } else {
                    setTimeout(() => {
                        this.$router.push({
                            name: `DFMDS-pages-Message-index`
                        });
                    }, 500);
                }


            },
            goEacharts() {
                this.$router.push({
                    path: `/DataEcharts/${this.menuList
                        .filter(item => item.type === '4')[0]
                        .list[0].url.slice(12)
                        .replace(/\//g, '-')}`
                });
            },
            getConfigResult(res) {
                // 接收回调函数返回数据的方法
                console.log('函数 websocket 接收')
                console.log(res)
                //this.messageNum = res.data
                this.getMsgNum()
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
            },
            websocketToLogin() {
                // 【agentData：发送的参数；this.getConfigResult：回调方法】
                let key
                if (process.env.VUE_APP_ENV === 'development') {
                    key = 0
                } else if (process.env.VUE_APP_ENV === 'test') {
                    key = 1
                } else {
                    key = 2
                }
                const wsObject = [{
                        url: 'wss://n2j6guq05a.execute-api.cn-north-1.amazonaws.com.cn/dev',
                        appid: 'df-mds-dev',
                        channel: 'df-mds-business-msg-dev'
                    }, {
                        url: 'wss://3nieh13pk3.execute-api.cn-north-1.amazonaws.com.cn/test',
                        appid: 'df-mds-test',
                        channel: 'df-mds-business-msg-test'
                    }, {
                        url: 'wss://95po8swao3.execute-api.cn-north-1.amazonaws.com.cn/prod',
                        appid: 'df-mds-prod',
                        channel: 'df-mds-business-msg-prod'
                    }]

                const url = `${wsObject[key].url}?appid=${wsObject[key].appid}&channel=${wsObject[key].channel}&flag=${sessionStorage.getItem('loginUserId')}`
                socketApi.createWebSocket(url)
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
    margin-top: 6px;
    margin-right: 15px;
}
</style>
