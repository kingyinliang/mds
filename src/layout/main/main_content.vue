<template>
    <main :style="{ 'min-height': (documentClientHeight - 32) + 'px' }" class="site-content" :class="{ 'site-content--tabs': $route.meta.isTab }">
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
                        <router-view v-if="item.name === mainTabsActiveName" ref="routerViews" :style="siteContentViewHeight" />
                    </keep-alive>
                </transition>
            </el-tab-pane>
        </el-tabs>
        <!-- 主入口标签页 e -->
        <transition v-else name="custom-classes-transition" enter-active-class="animated rollin" leave-active-class="animated rollOut">
            <keep-alive>
                <router-view :style="siteContentViewHeight" />
            </keep-alive>
        </transition>
        <div class="footer">
            <p>Copyright @ 2018 烟台欣和企业食品有限公司版权所有</p>
        </div>
    </main>
</template>

<script>
import { isURL } from 'utils/utils.ts';

export default {
    data() {
        return {};
    },
    computed: {
        // 消息管理用 - 关闭当前页签
        closeTab: {
            get() {
                return this.$store.state.common.msgTabAlive;
            },
            set(val) {
                this.$store.commit('common/updateMsgTabAlive', val);
            }
        },
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
            let height = this.documentClientHeight - 32 - 75;
            if (this.$route.meta.isTab) {
                height -= 40;
                return isURL(this.$route.meta.iframeUrl) ? { height: height + 'px' } : { minHeight: height + 'px' };
            }
            return { minHeight: height + 'px' };
        }
    },
    watch: {
        closeTab(newTab) {
            if (newTab !== false) {
                this.$store.commit('common/updateMsgTabAlive', false);
                this.removeTabHandle('DFMDS-pages-Message-index', true);
                this.$nextTick(() => {
                    this.$router.push({ name: 'DFMDS-pages-Message-index' });
                });
            }
        }
    },
    methods: {
        // tabs, 选中tab
        selectedTabHandle(tab) {
            const finalTab = this.mainTabs.filter(item => item.name === tab.name);
            if (finalTab.length >= 1) {
                this.$router.push({ name: finalTab[0].name });
            }
            // 重新加载消息
            if (tab.name === 'DFMDS-pages-Message-index') {
                this.removeTabHandle('DFMDS-pages-Message-index', true);
                this.$nextTick(() => {
                    this.$router.push({ name: 'DFMDS-pages-Message-index' });
                });
            }
        },
        // tabs, 删除tab
        removeTabHandle(tabName, add) {
            if (/录入/g.test(this.mainTabs.filter(item => item.name === tabName)[0].title) && this.$refs.routerViews[0].$refs.dataEntry.isRedact) {
                this.$confirm('为防止数据丢失请保存后关闭, 是否继续?', '关闭', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
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
