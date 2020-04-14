<template>
    <div>
        <el-menu-item v-for="(item, index) in container" :key="index" :index="item.holderId" @click="goPage(item)">
            <i :class="page.icon || ''" class="site-sidebar__menu-icon iconfont" />
            <span slot="title">{{ item.holderNo }}</span>
        </el-menu-item>
    </div>
</template>

<script>
import { MAIN_API } from '@/api/api';
export default {
    name: 'MenuItem',
    components: {},
    props: {
        deptId: {
            type: Object,
            default: function() { return {} }
        },
        page: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            container: []
        };
    },
    inject: ['reload'],
    computed: {
        dataEchartUid: {
            get() {
                return this.$store.state.echarts.dataEchartUid;
            },
            set(val) {
                this.$store.commit('echarts/updateDataEchartUid', val);
            }
        },
        dataEchartDetailDeptId: {
            get() {
                return this.$store.state.echarts.dataEchartDetailDeptId;
            },
            set(val) {
                this.$store.commit('echarts/updateDataEchartDetailDeptId', val);
            }
        },
        dataEchartDetailHolderName: {
            get() {
                return this.$store.state.echarts.dataEchartDetailHolderName;
            },
            set(val) {
                this.$store.commit('echarts/updateDataEchartDetailHolderName', val);
            }
        },
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
        }
    },
    mounted() {
        this.getContainer();
    },
    methods: {
        goPage(item) {
            const route = this.dynamicMenuRoutes.filter(subItem => subItem.meta.menuId === this.page.menuId);
            if (route.length >= 1) {
                this.menuActiveName = item.holderId;
                this.dataEchartUid = item.holderId;
                this.dataEchartDetailDeptId = item.deptId;
                this.dataEchartDetailHolderName = item.holderName;
                this.$router.push({ path: route[0].path });
                this.reload();
            }
        },
        getContainer() {
            this.$http(
                `${MAIN_API.CONTAINER_API}`,
                'POST',
                {
                    workShop: this.deptId
                },
                false,
                false,
                false
            ).then(({ data }) => {
                if (data.code === 0) {
                    this.container = data.list;
                } else {
                    this.$errorTost(data.msg);
                }
            });
        }
    }
};
</script>

<style scoped></style>
