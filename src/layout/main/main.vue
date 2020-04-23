<template>
    <div class="site-wrapper" :class="{ 'site-sidebar--fold': sidebarFold }">
        <template>
            <main-navbar :update-password="updatePassword" :select-factory="SelectFactory" />
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
        sidebarFold: {
            get() {
                return this.$store.state.common.sidebarFold;
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
            window.onresize = () => {
                this.documentClientHeight = document.documentElement['clientHeight'];
            };
        },
        // 获取当前管理员信息
        getUserInfo() {
            // this.$http(`${MAIN_API.USERINFO_API}`, 'GET', {}).then(({ data }) => {
            //     if (data && data.code === 0) {
            //         this.loading = false;
            //         this.userId = data.user.userId;
            //         this.userName = data.user.userName;
            //         this.realName = data.user.realName;
            //     }
            // });
            this.userId = sessionStorage.getItem('userId');
            this.userName = sessionStorage.getItem('userName');
            this.realName = sessionStorage.getItem('realName');
        }
    }
};
</script>
<style scoped></style>
