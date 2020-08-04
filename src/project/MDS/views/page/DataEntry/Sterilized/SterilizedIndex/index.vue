<template>
    <div class="header_main">
        <el-card class="searchCard  newCard" style="margin-bottom: 5px;">
            <el-form :inline="true" size="small" :model="formHeader" label-width="70px" class="topform sole_row">
                <el-form-item label="生产工厂：">
                    <el-select v-model="formHeader.factory" placeholder="请选择" style="width: 180px;">
                        <el-option label="请选择" value="" />
                        <el-option v-for="(item, index) in factory" :key="index" :label="item.deptName" :value="item.deptId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="生产车间：">
                    <el-select v-model="formHeader.workShop" placeholder="请选择" style="width: 180px;">
                        <el-option label="请选择" value="" />
                        <el-option v-for="(item, index) in workshop" :key="index" :label="item.deptName" :value="item.deptId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="生产日期：" label-width="70px">
                    <el-date-picker v-model="formHeader.productDate" type="date" placeholder="选择" value-format="yyyy-MM-dd" style="width: 180px;" />
                </el-form-item>
                <el-form-item label="订单：">
                    <el-input v-model="formHeader.orderNo" type="text" clearable />
                </el-form-item>
                <el-button v-if="isAuth('ste:order:list')" type="primary" size="small" style="float: right;" @click="getResultData(true)">
                    查询
                </el-button>
            </el-form>
        </el-card>

        <div>
            <el-row class="potList" :gutter="10" style="min-height: 150px;">
                <el-col v-for="(item, index) in dataList" :key="index" :span="8">
                    <div class="box-item" style="margin-bottom: 10px;">
                        <div class="box-item-top">
                            <div class="box-item-title">
                                <div class="box-item-title-name">
                                    <i class="title-icon" />{{ item.holderName }}
                                </div>
                                <div :class="item.selectOrder.orderStatus === 'noPass' ? 'box-item-title-state-nopass' : 'box-item-title-state'">
                                    <label style="color: rgba(0, 0, 0, 0.65);">状态：</label>{{ item.selectOrder.orderStatus === 'submit' ? '已提交' : item.selectOrder.orderStatus === 'checked' ? '审核通过' : item.selectOrder.orderStatus === 'noPass' ? '审核不通过' : item.selectOrder.orderStatus === 'saved' ? '已保存' : item.selectOrder.orderStatus === '已同步' ? '未录入' : item.selectOrder.orderStatus }}
                                </div>
                            </div>
                            <div class="box-item-container">
                                <div class="box-item-container-left">
                                    <div class="pot_border">
                                        <div class="pot" />
                                        <div class="pot_water">
                                            <div
                                                class="pot_water_sole"
                                                :style="{'height': '70%', 'background': item.potColor}"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div class="box-item-container-right">
                                    <div class="box-item-container-item">
                                        <div class="name">
                                            订单编号：
                                        </div>
                                        <div class="detail" style=" padding-left: 0; background: none;">
                                            <el-select v-model="item.selectOrderId" size="small" class="orderSelect" placeholder="请选择" style="width: 100%;" value-key="orderId" @change="OrderChange($event, item)">
                                                <el-option v-for="(item1, index1) in item.steList" :key="index1" :label="item1.orderNo" :value="item1.orderId">
                                                    <div
                                                        :style="{
                                                            color: item1.orderStatus === 'noPass' ? 'red' : item1.exportMaterial !== '' ? '#FFBF00' : '',
                                                        }"
                                                    >
                                                        {{ item1.orderNo }}
                                                    </div>
                                                </el-option>
                                            </el-select>
                                        </div>
                                    </div>
                                    <div class="box-item-container-item">
                                        <div class="name">
                                            生产品项：
                                        </div>
                                        <div class="detail">
                                            <el-tooltip class="item" effect="dark" :content="(item.selectOrder.materialCode || '') + ' ' + (item.selectOrder.materialName || '')" placement="top">
                                                <p>
                                                    {{ (item.selectOrder.materialCode || '') + ' ' + (item.selectOrder.materialName || '') }}
                                                </p>
                                            </el-tooltip>
                                        </div>
                                    </div>
                                    <div class="box-item-container-item">
                                        <div class="name">
                                            订单日期：
                                        </div>
                                        <div class="detail">
                                            {{ item.selectOrder.productDate || '' }}
                                        </div>
                                    </div>
                                    <div class="box-item-container-item">
                                        <div class="name">
                                            计划产量：
                                        </div>
                                        <div class="detail">
                                            {{ item.selectOrder.planOutput || '' }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="buttonCss" style="margin: 0 10px 10px 10px;">
                            <el-tooltip
                                class="item"
                                effect="dark"
                                :content="item.selectOrder.semiStatus === 'noPass' ? '审核不通过' : item.selectOrder.semiStatus === 'saved' ? '已保存' : item.selectOrder.semiStatus === 'submit' ? '已提交' : item.selectOrder.semiStatus === 'checked' ? '通过' : item.selectOrder.semiStatus === '已同步' ? '未录入' : '未录入'"
                                placement="top"
                            >
                                <el-button type="primary" size="small" style="width: 24%;" @click="toRouter('1', item.selectOrder)">
                                    半成品领用
                                </el-button>
                            </el-tooltip>
                            <el-tooltip
                                class="item"
                                effect="dark"
                                :content="item.selectOrder.supmStatus === 'noPass' ? '审核不通过' : item.selectOrder.supmStatus === 'saved' ? '已保存' : item.selectOrder.supmStatus === 'submit' ? '已提交' : item.selectOrder.supmStatus === 'checked' ? '通过' : item.selectOrder.supmStatus === '已同步' ? '未录入' : '未录入'"
                                placement="top"
                            >
                                <el-button type="primary" size="small" style="width: 24%; margin-left: 1%;" @click="toRouter('2', item.selectOrder)">
                                    辅料添加
                                </el-button>
                            </el-tooltip>
                            <el-tooltip
                                class="item"
                                effect="dark"
                                :content="item.selectOrder.techStatus === 'noPass' ? '审核不通过' : item.selectOrder.techStatus === 'saved' ? '已保存' : item.selectOrder.techStatus === 'submit' ? '已提交' : item.selectOrder.techStatus === 'checked' ? '通过' : item.selectOrder.techStatus === '已同步' ? '未录入' : '未录入'"
                                placement="top"
                            >
                                <el-button type="primary" size="small" style="width: 24%; margin-left: 1%;" @click="toRouter('3', item.selectOrder)">
                                    工艺控制
                                </el-button>
                            </el-tooltip>
                            <el-tooltip
                                class="item"
                                effect="dark"
                                :content="item.selectOrder.insStatus === 'noPass' ? '审核不通过' : item.selectOrder.insStatus === 'saved' ? '已保存' : item.selectOrder.insStatus === 'submit' ? '已提交' : item.selectOrder.insStatus === 'checked' ? '通过' : item.selectOrder.insStatus === '已同步' ? '未录入' : '未录入'"
                                placement="top"
                            >
                                <el-button type="primary" size="small" style="width: 24%; margin-left: 1%;" @click="toRouter('4', item.selectOrder)">
                                    杀菌入库
                                </el-button>
                            </el-tooltip>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import { getFactory, getWorkshop, dateFormat } from '@/net/validate';
import { STERILIZED_API, SYSTEMSETUP_API } from '@/api/api';
export default {
    name: 'Index',
    components: {},
    data() {
        return {
            formHeader: {
                holderType: '014',
                factory: '',
                workShop: '',
                productDate: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                orderNo: ''
            },
            factory: [],
            workshop: [],
            Materails: [],
            dataList: []
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
        'formHeader.factory'(n) {
            this.formHeader.workShop = '';
            getWorkshop(this, n, '杀菌');
        }
    },
    mounted() {
        getFactory(this);
    },
    methods: {
        getResultData() {
            if (!this.formHeader.factory || !this.formHeader.workShop) {
                this.$warningToast('请选择工厂与车间');
                return;
            }
            if ((this.formHeader.productDate === '' || !this.formHeader.productDate) && this.formHeader.orderNo === '') {
                this.$warningToast('生产日期或订单请选填一项');
                return false;
            }
            this.$http(`${STERILIZED_API.STE_HOME_LIST_API}`, 'POST', this.formHeader).then(({ data }) => {
                if (data.code === 0) {
                    if (data.list.length !== 0) {
                        this.GetMaterails(this.formHeader.factory);
                        // this.dataList = data.list
                        this.dataList = data.list;
                        this.dataList.forEach((item) => {
                            if (item.steList.length === 1) {
                                item.selectOrder = item.steList[0];
                                item.selectOrderId = item.steList[0].orderId;
                            } else {
                                item.selectOrder = {};
                            }
                        });
                    } else {
                        this.$infoToast('暂无任何内容');
                    }

                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        OrderChange(e, row) {
            row.selectOrder = row.steList.filter(item => e === item.orderId)[0];
        },
        // 物料字典
        GetMaterails(factory) {
            this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {
                factory: factory,
                type: 'TeShuShaJun_Material'
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.Materails = data.dicList;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        toRouter(str, item) {
            let url;
            if (!item.orderId) {
                this.$warningToast('请选择订单');
                return;
            }
            if (str === '1') {
                // let st = this.Materails.filter(items => items.code === item.materialCode)
                // if (st.length === 0) {
                //   this.$warningToast('非特殊物料，不能跳转')
                //   return
                // }
                if (!this.isAuth('ste:semiMaterial:list')) {
                    this.$warningToast('没有分配权限');
                    return;
                }
                this.$http(`${STERILIZED_API.STE_ENTER_MATERIAL_LIST_API}`, 'POST', {
                    orderId: item.orderId,
                    factory: item.factory,
                    orderNo: item.orderNo,
                    materialCode: item.materialCode
                }).then(({ data }) => {
                    if (data.code === 500) {
                        this.$warningToast(data.msg);
                    } else {
                        this.$store.state.common.sterilized.seiOrderId = item.orderId;
                        this.$store.state.common.sterilized.seiFactory = item.factory;
                        this.$store.state.common.sterilized.seiOrderNo = item.orderNo;
                        url = 'DataEntry-Sterilized-SterilizedIndex-semiReceive-index';
                        this.mainTabs = this.mainTabs.filter(subItem => subItem.name !== url);
                        setTimeout(() => {
                            this.$router.push({ name: url });
                        }, 100);
                    }
                });
            } else if (str === '2') {
                if (!this.isAuth('ste:supMaterial:list')) {
                    this.$warningToast('没有分配权限');
                    return;
                }
                this.$http(`${STERILIZED_API.STE_ENTER_SUP_LIST_API}`, 'POST', {
                    orderId: item.orderId,
                    factory: item.factory,
                    orderNo: item.orderNo,
                    materialCode: item.materialCode
                }).then(({ data }) => {
                    if (data.code === 0) {
                        if (!data.steSupMaterialBean.resultList.length && !data.steSupMaterialBean.supList.length) {
                            this.$warningToast('此订单无需辅料添加');
                        } else {
                            this.$store.state.common.sterilized.acceOrderId = item.orderId;
                            this.$store.state.common.sterilized.acceFactory = item.factory;
                            this.$store.state.common.sterilized.acceOrderNo = item.orderNo;
                            url = 'DataEntry-Sterilized-SterilizedIndex-acceAdd-index';
                            this.mainTabs = this.mainTabs.filter(subItem => subItem.name !== url);
                            setTimeout(() => {
                                this.$router.push({ name: url });
                            }, 100);
                        }
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            } else if (str === '3') {
                if (!this.isAuth('ste:tec:list')) {
                    this.$warningToast('没有分配权限');
                    return;
                }
                this.$store.state.common.sterilized.craftOrderId = item.orderId;
                url = 'DataEntry-Sterilized-SterilizedIndex-craftControl-index';
                this.mainTabs = this.mainTabs.filter(subItem => subItem.name !== url);
                setTimeout(() => {
                    this.$router.push({ name: url });
                }, 100);
            } else if (str === '4') {
                if (!this.isAuth('ste:inStorage:list')) {
                    this.$warningToast('没有分配权限');
                    return;
                }
                this.$store.state.common.sterilized.inOrderId = item.orderId;
                this.$store.state.common.sterilized.inFactory = item.factory;
                this.$store.state.common.sterilized.inOrderNo = item.orderNo;
                url = 'DataEntry-Sterilized-SterilizedIndex-inStock-index';
                this.mainTabs = this.mainTabs.filter(subItem => subItem.name !== url);
                setTimeout(() => {
                    this.$router.push({ name: url });
                }, 100);
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.box-item {
    box-sizing: border-box;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(232, 232, 232, 1);
    border-radius: 6px;
    .box-item-top {
        padding: 10px 10px 15px;
        .box-item-title {
            display: flex;
            flex: 1;
            justify-content: space-between;
            height: 34px;
            margin-bottom: 16px;
            .box-item-title-name {
                .title-icon {
                    float: left;
                    width: 4px;
                    height: 12px;
                    margin-top: 5px;
                    margin-right: 5px;
                    background: #487bff;
                    border-radius: 2px;
                }
                // display: flex;
                // flex: 1;
                // :first-child {
                //     width: 30px;
                //     height: 30px;
                //     color: #fff;
                //     font-weight: 500;
                //     font-size: 12px;
                //     line-height: 30px;
                //     text-align: center;
                //     background: #ffbf00;
                //     border-radius: 15px;
                // }
                // :nth-child(2) {
                margin-top: 4px;
                margin-left: 5px;
                color: #717171;
                font-weight: 400;
                font-size: 14px;
                line-height: 22px;
                // }
            }
            .box-item-title-state {
                flex: 1;
                margin-top: 4px;
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
            .box-item-title-state-nopass {
                flex: 1;
                margin-top: 4px;
                color: red;
                font-weight: 500;
                font-size: 14px;
                line-height: 20px;
                text-align: right;
                &::before {
                    display: inline-block;
                    width: 6px;
                    height: 6px;
                    margin-right: 10px;
                    margin-bottom: 2px;
                    background: red;
                    border-radius: 50%;
                    content: "";
                }
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
                // background: rgba(242, 242, 242, 1);
                // border-radius: 8px;
                .pot_border {
                    position: relative;
                    width: 77px;
                    .pot {
                        position: absolute;
                        top: -70px;
                        left: -25px;
                        z-index: 99;
                        width: 126px;
                        height: 143px;
                        background: url("~@/assets/img/sterilized.png") no-repeat;
                        background-size: contain;
                    }
                    .pot_water {
                        position: absolute;
                        bottom: -18px;
                        left: 9px;
                        width: 58px;
                        height: 116px;
                        &_sole {
                            position: absolute;
                            bottom: 0;
                            width: 100%;
                            overflow: hidden;
                            background-color: skyblue;
                            border-top: none;
                        }
                        &_sole::before,
                        &_sole::after {
                            position: absolute;
                            bottom: 100%;
                            left: 50%;
                            width: 300px;
                            height: 290px;
                            background-color: #fff;
                            border-radius: 55% 45%;
                            transform: translateX(-50%);
                            content: "";
                        }
                        &_sole::after {
                            bottom: 100%;
                            left: 47%;
                            border-radius: 45% 50%;
                            opacity: 0.3;
                        }
                    }
                    &:hover {
                        .pot_water_sole::before,
                        .pot_water_sole::after {
                            animation: rotate 5s linear infinite;
                        }
                    }

                    @keyframes rotate {
                        0% {
                            transform: translate(-50%) rotateZ(0deg);
                        }
                        100% {
                            transform: translate(-50%) rotateZ(360deg);
                        }
                    }
                }
            }
            .box-item-container-right {
                display: flex;
                flex: 1;
                flex-direction: column;
                width: 60%;
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
                        color: rgba(0, 0, 0, 0.45);
                        font-weight: 400;
                        font-size: 12px;
                        line-height: 32px;
                    }
                    .detail {
                        flex: 1;
                        padding-left: 10px;
                        overflow: hidden;
                        color: #333;
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
}
.buttonCss .el-button--primary:first-child {
    color: #000;
    background-color: #fff;
    border-color: #d9d9d9;
}
.buttonCss .el-button--primary:hover {
    color: #fff;
    background-color: #1890ff;
}
.el-select-dropdown__wrap {
    max-height: 200px;
}
</style>
