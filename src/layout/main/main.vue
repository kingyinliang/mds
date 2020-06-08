<template>
    <div class="site-wrapper" :class="{ 'site-sidebar--fold': sidebarFold }">
        <template>
            <main-navbar ref="mainNavbar" :update-password="updatePassword" :select-factory="SelectFactory" />
            <main-sidebar />
            <div class="site-content__wrapper SelfScrollbar" :style="{ 'min-height': documentClientHeight + 'px' }">
                <main-content />
            </div>
            <scroll-top />
        </template>
        <update-pass v-if="pasVisible" id="upPass" ref="upPass" :refresh-data-list="refreshDataList" />
        <select-factory v-if="factoryVisible" ref="selectfactory" />
    </div>
</template>

<script>
import UpdatePass from './UpdatePass';
import SelectFactory from './SelectFactory';

export default {
    name: 'MainFrame',
    components: {
        MainContent: resolve => {
            require(['./main_content'], resolve);
        },
        MainSidebar: resolve => {
            require(['./main_leftbar'], resolve);
        },
        MainNavbar: resolve => {
            require(['./main_topbar'], resolve);
        },
        UpdatePass,
        SelectFactory
    },
    data() {
        return {
            pasVisible: false,
            factoryVisible: false
        };
    },
    computed: {
        documentClientHeight: {
            get() {
                return this.$store.state.common.documentClientHeight;
            },
            set(val) {
                this.$store.commit('common/updateDocumentClientHeight', val);
            }
        },
        mainClientHeight: {
            get() {
                return this.$store.state.common.mainClientHeight;
            },
            set(val) {
                this.$store.commit('common/updateMainClientHeight', val);
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
        userId: {
            get() {
                return this.$store.state.user.id;
            },
            set(val) {
                this.$store.commit('user/updateId', val);
            }
        },
        userName: {
            get() {
                return this.$store.state.user.name;
            },
            set(val) {
                this.$store.commit('user/updateName', val);
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
    created() {
        this.getUserInfo();
    },
    mounted() {
        this.resetDocumentClientHeight();
        this.setShortcutKey()
    },
    methods: {
        refreshDataList() {
            this.pasVisible = false;
        },
        // 选择工厂
        SelectFactory() {
            this.factoryVisible = true
            this.$nextTick(() => {
                this.$refs['selectfactory'].init();
            });
        },
        // 修改密码
        updatePassword() {
            this.pasVisible = true;
            this.$nextTick(() => {
                this.$refs['upPass'].init();
            });
        },
        // 重置窗口可视高度
        resetDocumentClientHeight() {
            this.documentClientHeight = document.documentElement['clientHeight'];
            this.mainClientHeight = document.documentElement['clientHeight'] - 32 - 40 - 56;
            window.onresize = () => {
                this.documentClientHeight = document.documentElement['clientHeight'];
                this.mainClientHeight = document.documentElement['clientHeight'] - 32 - 40 - 56;
            };
        },
        // 获取当前管理员信息
        getUserInfo() {
            this.userId = sessionStorage.getItem('userId');
            this.userName = sessionStorage.getItem('userName');
            this.realName = sessionStorage.getItem('realName');
        },
        setShortcutKey() {
            window.onkeydown = (e) => {
                const obj = e.srcElement;
                if (obj !== null) {
                    if (obj.tagName === 'BODY') {
                        // 设置快捷键
                        console.log(e.keyCode);
                        if (e.keyCode === 77) {
                            this.sidebarFold = !this.sidebarFold
                        }
                        if (e.keyCode === 70) {
                            this.SelectFactory()
                        }
                        if (e.keyCode === 81) {
                            this.$refs.mainNavbar.logoutHandle()
                        }
                    }
                }
            }
        }
    }
};
</script>
<style scoped></style>
