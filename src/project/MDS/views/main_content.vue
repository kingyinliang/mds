<template>
    <main class="site-content" :class="{ 'site-content--tabs': $route.meta.isTab }">
        <!-- 主入口标签页 s -->
        <el-tabs v-if="$route.meta.isTab" v-model="mainTabsActiveName" :closable="true" @tab-click="selectedTabHandle" @tab-remove="removeTabHandle">
            <el-dropdown class="site-tabs__tools" :show-timeout="0">
                <i class="el-icon-arrow-down el-icon--right" />
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="tabsCloseCurrentHandle">
                        关闭当前标签页
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="tabsCloseOtherHandle">
                        关闭其它标签页
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="tabsCloseAllHandle">
                        关闭全部标签页
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="tabsRefreshCurrentHandle">
                        刷新当前标签页
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-tab-pane v-for="item in mainTabs" :key="item.name" :label="item.title" :name="item.name">
                <iframe v-if="item.type === 'iframe'" :src="item.iframeUrl" width="100%" height="100%" title="" />
                <transition v-else name="custom-classes-transition" enter-active-class="animated rollin" leave-active-class="animated rollOut">
                    <keep-alive>
                        <router-view v-if="item.name === mainTabsActiveName" />
                    </keep-alive>
                </transition>
            </el-tab-pane>
        </el-tabs>
        <!-- 主入口标签页 e -->
        <transition v-else name="custom-classes-transition" enter-active-class="animated rollin" leave-active-class="animated rollOut">
            <keep-alive>
                <div :body-style="siteContentViewHeight">
                    <router-view />
                </div>
            </keep-alive>
        </transition>
        <div class="footer">
            <p>Copyright @ 2018 烟台欣和企业食品有限公司版权所有</p>
        </div>
    </main>
</template>

<script>
    import { isURL } from '@/net/validate';

    export default {
        data() {
            return {};
        },
        computed: {
            documentClientHeight: {
                get() {
                    return this.$store.state.common.documentClientHeight;
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
            },
            siteContentViewHeight() {
                let height = this.documentClientHeight - 50 - 30 - 2;
                if (this.$route.meta.isTab) {
                    height -= 40;
                    return isURL(this.$route.meta.iframeUrl) ? { height: height + 'px' } : { minHeight: height + 'px' };
                }
                return { minHeight: height + 'px' };
            }
        },
        methods: {
            // tabs, 选中tab
            selectedTabHandle(tab) {
                const finalTab = this.mainTabs.filter(item => item.name === tab.name);
                if (finalTab.length >= 1 && this.$router.history.current.name !== finalTab[0].name) {
                    this.$router.push({ name: finalTab[0].name });
                }
            },
            // tabs, 删除tab
            removeTabHandle(tabName, add) {
                if (/录入/g.test(this.mainTabs.filter(item => item.name === tabName)[0].title)) {
                    this.$confirm('为防止数据丢失请保存后关闭, 是否继续?', '关闭', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                        .then(() => {
                            this.mainTabs = this.mainTabs.filter(item => item.name !== tabName);
                            if (this.mainTabs.length >= 1) {
                                // 当前选中tab被删除
                                if (tabName === this.mainTabsActiveName) {
                                    this.$router.push(
                                        {
                                            name: this.mainTabs[this.mainTabs.length - 1].name
                                        },
                                        () => {
                                            this.mainTabsActiveName = this.$route.name;
                                        }
                                    );
                                }
                            } else {
                                this.menuActiveName = '';
                                this.$router.push({ name: 'home' });
                            }
                            if (add) {
                                this.$nextTick(() => {
                                    this.$router.push({ name: tabName });
                                });
                            }
                        })
                        .catch(() => {
                            // this.$infoToast('已取消删除');
                        });
                } else {
                    this.mainTabs = this.mainTabs.filter(item => item.name !== tabName);
                    if (this.mainTabs.length >= 1) {
                        // 当前选中tab被删除
                        if (tabName === this.mainTabsActiveName) {
                            this.$router.push(
                                {
                                    name: this.mainTabs[this.mainTabs.length - 1].name
                                },
                                () => {
                                    this.mainTabsActiveName = this.$route.name;
                                }
                            );
                        }
                    } else {
                        this.menuActiveName = '';
                        this.$router.push({ name: 'home' });
                    }
                }
            },
            // tabs, 关闭当前
            tabsCloseCurrentHandle() {
                this.removeTabHandle(this.mainTabsActiveName);
            },
            // tabs, 关闭其它
            tabsCloseOtherHandle() {
                this.mainTabs = this.mainTabs.filter(item => item.name === this.mainTabsActiveName);
            },
            // tabs, 关闭全部
            tabsCloseAllHandle() {
                this.mainTabs = [];
                this.menuActiveName = '';
                this.$router.push({ name: 'home' });
            },
            // tabs, 刷新当前
            tabsRefreshCurrentHandle() {
                const tempTabName = this.mainTabsActiveName;
                this.removeTabHandle(tempTabName, true);
                this.$nextTick(() => {
                    this.$router.push({ name: tempTabName });
                });
            }
        }
    };
</script>
<style lang="scss" scoped>
    .footer {
        position: absolute;
        bottom: 7px;
        width: 100%;
        color: rgba(0, 0, 0, 0.45);
        font-size: 12px;
        line-height: 20px;
        text-align: center;
        a {
            margin: 0 10px;
            color: rgba(0, 0, 0, 0.45);
            font-size: 14px;
        }
    }

    @keyframes rollin {
        0% {
            transform: translate3d(-100%, 0, 0) rotate(-0deg);
            opacity: 0;
        }
        to {
            transform: none;
            opacity: 1;
        }
    }

    .rollin {
        animation-name: rollin;
    }
    .animated {
        animation-duration: 1s;
        animation-fill-mode: both;
    }

    .animated.infinite {
        animation-iteration-count: infinite;
    }

    .animated.hinge {
        animation-duration: 2s;
    }

    /* stylelint-disable */
    .animated.bounceIn,
    .animated.bounceOut,
    .animated.flipOutX,
    .animated.flipOutY {
        animation-duration: 0.75s;
    }
</style>
