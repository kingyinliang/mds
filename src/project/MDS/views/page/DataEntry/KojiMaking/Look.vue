<template>
    <div class="header_main">
        <el-card class="searchCard queryHead">
            <el-form :model="params" size="small" :inline="true" label-position="right" label-width="70px" class="sole_row">
                <el-form-item label="生产工厂：">
                    <el-select v-model="params.factoryId" class="selectwpx" style="width: 150px;">
                        <el-option label="请选择" value="" />
                        <el-option v-for="sole in factoryList" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="生产车间：">
                    <el-select v-model="params.workShop" class="selectwpx" style="width: 150px;">
                        <el-option label="请选择" value="" />
                        <el-option v-for="sole in workshopList" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId" />
                    </el-select>
                </el-form-item>
                <el-form-item style="float: right;">
                    <el-button type="primary" size="small" style="float: right;" @click="getOrderList()">
                        查询
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-row :gutter="10">
            <el-col v-for="(item, index) in orderList" :key="index" :span="8" style="margin-top: 5px;">
                <div class="box-item">
                    <div class="box-item-top">
                        <div class="box-item-title">
                            <div class="box-item-title-name">
                                <div
                                    :style="{
                                        background: index % 3 === 0 ? '#FFBF00' : index % 3 === 1 ? '#5BD171' : '#2C92F6',
                                    }"
                                >
                                    {{ item.houseNo }}
                                </div>
                                <div>{{ item.inPotNoName }}</div>
                            </div>
                            <div
                                class="box-item-title-state"
                                :class="{
                                    diannopassBtn: item.guardStatus === 'noPass',
                                }"
                            >
                                状态：{{ item.guardStatus === 'noPass' ? '审核不通过' : item.guardStatus === 'saved' ? '已保存' : item.guardStatus === 'submit' ? '已提交' : item.guardStatus === 'checked' ? '通过' : item.guardStatus === '已同步' ? '未录入' : item.guardStatus }}
                            </div>
                        </div>
                        <div class="box-item-container">
                            <div class="box-item-container-left">
                                <div class="box-item-container-img">
                                    <img src="@/assets/img/fajiaoguan.png" alt="" class="bgimg">
                                </div>
                            </div>
                            <div class="box-item-container-right">
                                <div class="box-item-container-item">
                                    <div class="name">
                                        生产订单
                                    </div>
                                    <div class="detail">
                                        {{ item.orderNo }}
                                    </div>
                                </div>
                                <div class="box-item-container-item">
                                    <div class="name">
                                        生产品项
                                    </div>
                                    <div class="detail">
                                        {{ item.materialName + ' ' + item.materialCode }}
                                    </div>
                                </div>
                                <div class="box-item-container-item">
                                    <div class="name">
                                        入曲时长
                                    </div>
                                    <div class="detail">
                                        {{ item.inEndTimeLength }} 小时
                                    </div>
                                </div>
                                <div class="box-item-container-item">
                                    <div class="name">
                                        入曲时间
                                    </div>
                                    <div class="detail">
                                        {{ item.inEndTime ? item.inEndTime : '' }}
                                    </div>
                                </div>
                                <div class="btn">
                                    <el-button
                                        type="primary"
                                        size="mini"
                                        :class="{
                                            nopassBtn: item.guardStatus === 'noPass',
                                        }"
                                        @click="goPage('看曲', item)"
                                    >
                                        数据录入
                                    </el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { BASICDATA_API, KJM_API } from '@/api/api';
export default {
    name: 'Out',
    components: {},
    data() {
        return {
            params: {
                factoryId: '',
                workShop: ''
            },
            factoryList: [],
            workshopList: [],
            orderList: []
        };
    },
    computed: {
        mainTabs: {
            get() {
                return this.$store.state.common.mainTabs;
            },
            set(val) {
                this.$store.commit('common/updateMainTabs', val);
            }
        }
    },
    watch: {
        'params.factoryId'(n) {
            this.getWorkshop(n);
        }
    },
    mounted() {
        this.getFactory();
    },
    methods: {
        getOrderList() {
            if (this.params.factoryId === '') {
                this.$warningToast('请选择工厂');
                return;
            }
            if (this.params.workShop === '') {
                this.$warningToast('请选择车间');
                return;
            }
            this.$http(`${KJM_API.KJMAKINGORDERLIST_API}`, 'POST', this.params).then(({ data }) => {
                if (data.code === 0) {
                    this.orderList = this.ProcessingData(data.list);
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        ProcessingData(data) {
            const newArr = [];
            data.forEach((item) => {
                if (item.guardStatus === 'saved' || item.guardStatus === '已同步') {
                    newArr.push(item);
                }
            });
            newArr.sort(function(a, b) {
                const order = ['saved', '已同步'];
                if (order.indexOf(a.guardStatus) - order.indexOf(b.guardStatus) === 0) {
                    return b.inEndTimeLength - a.inEndTimeLength;
                }
                    return order.indexOf(a.guardStatus) - order.indexOf(b.guardStatus);

            });
            return newArr;
        },
        goPage(page, item) {
            let flag = false;
            if (page === '煮豆') {
                flag = this.isAuth('kjm:bean:material:list');
            } else if (page === '看曲') {
                flag = this.isAuth('kjm:guard:list');
            } else if (page === '出曲') {
                flag = this.isAuth('sys:kjmOutMaterial:list');
            }
            if (!flag) {
                this.$notify.error({
                    title: '错误',
                    message: '无权限查看' + page
                });
                return;
            }
            this.$store.commit('common/updateZQParamsOrderNo', item.orderNo);
            this.$store.commit('common/updateZQParamsOrderId', item.orderId);
            let name = '';
            if (page === '煮豆') {
                this.$store.commit('common/updateZQParamsBeanHouseId', item.orderHouseId);
                name = 'MDS-views-page-DataEntry-KojiMaking-BoiledBeans-index';
            } else if (page === '看曲') {
                this.$store.commit('common/updateZQParamsLookHouseId', item.orderHouseId);
                name = 'MDS-views-page-DataEntry-KojiMaking-Look-index';
            } else if (page === '出曲') {
                this.$store.commit('common/updateZQParamsOutHouseId', item.orderHouseId);
                name = 'MDS-views-page-DataEntry-KojiMaking-Out-index';
            }
            this.pushPage(name);
        },
        pushPage(name) {
            this.mainTabs = this.mainTabs.filter(item => item.name !== name);
            setTimeout(() => {
                this.$router.push({ name });
            }, 100);
        },
        getFactory() {
            this.factoryList = [];
            this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, `POST`, {}, false, false, false).then(res => {
                if (res.data.code === 0) {
                    this.factoryList = res.data.typeList;
                    if (!this.params.factoryId) {
                        this.params.factoryId = res.data.typeList[0].deptId;
                    }
                } else {
                    this.$notify.error({ title: '错误', message: res.data.msg });
                }
            });
        },
        // 根据工厂获车间
        getWorkshop(id) {
            this.workshopList = [];
            this.params.workShop = '';
            if (id) {
                this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', { deptId: id, deptName: '制曲' }, false, false, false).then(res => {
                    if (res.data.code === 0) {
                        this.workshopList = res.data.typeList;
                        if (!this.params.workShop) {
                            if (res.data.typeList.length !== 0) {
                                this.params.workShop = res.data.typeList[0].deptId;
                            }
                        }
                    } else {
                        this.$notify.error({
                            title: '错误',
                            message: res.data.msg
                        });
                    }
                });
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.diannopassBtn {
    &::before {
        background: #f05c4a !important;
    }
}
.nopassBtn {
    background: #f05c4a;
    border: none;
}
.box-item {
    box-sizing: border-box;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(232, 232, 232, 1);
    border-radius: 2px;
    .box-item-top {
        padding: 10px 10px 20px;
        border-bottom: 1px solid rgba(232, 232, 232, 1);
        .box-item-title {
            display: flex;
            flex: 1;
            justify-content: space-between;
            height: 34px;
            margin-bottom: 16px;
            .box-item-title-name {
                display: flex;
                flex: 1;
                :first-child {
                    width: 30px;
                    height: 30px;
                    color: #fff;
                    font-weight: 500;
                    font-size: 12px;
                    line-height: 30px;
                    text-align: center;
                    background: #ffbf00;
                    border-radius: 15px;
                }
                :nth-child(2) {
                    margin-top: 4px;
                    margin-left: 5px;
                    color: rgba(0, 0, 0, 0.85);
                    font-weight: 400;
                    font-size: 16px;
                    line-height: 22px;
                }
            }
        }
        .box-item-title-state {
            flex: 1;
            margin-top: 4px;
            margin-bottom: 6px;
            padding-left: 10px;
            color: rgba(0, 0, 0, 0.65);
            font-weight: 500;
            font-size: 12px;
            line-height: 20px;
            text-align: right;
            &::before {
                display: inline-block;
                width: 6px;
                height: 6px;
                margin-right: 10px;
                margin-bottom: 2px;
                background: rgba(126, 211, 33, 1);
                border-radius: 50%;
                content: "";
            }
        }
        .box-item-container {
            display: flex;
            flex: 1;
            justify-content: space-between;
            .box-item-container-left {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 40%;
                background: rgba(242, 242, 242, 1);
                border-radius: 8px;
                .box-item-container-img {
                    width: 150px;
                    .bgimg {
                        width: 100%;
                    }
                }
            }
            .box-item-container-right {
                display: flex;
                flex: 1;
                flex-direction: column;
                width: 60%;
                margin-left: 16px;
                .btn {
                    text-align: right;
                }
                .box-item-container-item {
                    display: flex;
                    flex: 1;
                    justify-content: space-between;
                    margin-bottom: 10px;
                    .name {
                        width: 60px;
                        color: black;
                        font-weight: 400;
                        font-size: 12px;
                        line-height: 32px;
                    }
                    .detail {
                        flex: 1;
                        padding-left: 10px;
                        overflow: hidden;
                        color: #333;
                        font-weight: 500;
                        font-size: 12px;
                        line-height: 32px;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        background: #f5f5f5;
                        border-radius: 4px;
                    }
                }
            }
        }
    }
    .box-item-bottom {
        display: flex;
        justify-content: space-between;
        box-sizing: border-box;
        height: 40px;
        background: rgba(247, 249, 250, 1);
        border-radius: 0 0 2px 2px;
        .box-item-bottom-item {
            flex: 1;
            color: rgba(0, 0, 0, 0.65);
            font-weight: 500;
            font-size: 12px;
            line-height: 40px;
            text-align: center;
            &:hover {
                color: #fff;
                background: #1890ff;
                cursor: pointer;
            }
        }
        .box-item-bottom-split {
            width: 1px;
            height: 16px;
            margin-top: 12px;
            background: rgba(232, 232, 232, 1);
        }
    }
}
.rowButton {
    button {
        margin: 0 3px !important;
    }
}
.box-card {
    .pro-line {
        border-bottom: 1px solid #dcdfe6;
    }
    .pro-line p {
        color: red;
        font-size: 16px;
        letter-spacing: 0.1em;
    }
    b {
        float: left;
        font-size: 16px;
        line-height: 32px;
    }
    .item {
        display: flex;
        margin-top: 20px;
        img {
            float: left;
            width: 220px;
            height: 220px;
            margin-right: 20px;
            border: 1px solid #dcdfe6;
            border-radius: 6px;
        }
        .itemForm {
            flex: 1;
            p {
                color: #8a979e;
            }
        }
        .margb20px {
            margin-bottom: 10px;
        }
    }
}
.el-row {
    margin-bottom: 20px;
    &:last-child {
        margin-bottom: 0;
    }
}
</style>
