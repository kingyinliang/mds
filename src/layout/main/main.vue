<template>
    <div class="site-wrapper" :class="{ 'site-sidebar--fold': sidebarFold }">
        <template v-if="!loading">
            <main-navbar :updatePassword="updatePassword" />
            <main-sidebar />
            <div class="site-content__wrapper SelfScrollbar" :style="{ 'min-height': documentClientHeight + 'px' }">
                <main-content />
            </div>
            <scroll-top />
        </template>
        <update-pass v-if="pasVisible" id="upPass" ref="upPass" :refreshDataList="refreshDataList" />
    </div>
</template>

<script>
import UpdatePass from './UpdatePass';
import { MAIN_API } from '@/api/api';

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
        UpdatePass
    },
    data() {
        return {
            pasVisible: false,
            loading: true
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
            this.$http(`${MAIN_API.USERINFO_API}`, 'GET', {}).then(({ data }) => {
                if (data && data.code === 0) {
                    this.loading = false;
                    this.userId = data.user.userId;
                    this.userName = data.user.userName;
                    this.realName = data.user.realName;
                }
            });
        }
    }
};
</script>
<style scoped></style>
