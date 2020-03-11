<template>
    <div class="header_main">
        <el-card class="searchCard  newCard" style="margin-bottom: 5px;">
            <el-form :inline="true" size="small" :model="formHeader" labelWidth="70px" class="topform sole_row">
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
                <el-form-item label="生产日期：" labelWidth="70px">
                    <el-date-picker v-model="formHeader.productDate" type="date" placeholder="选择" valueFormat="yyyy-MM-dd" style="width: 180px;" />
                </el-form-item>
                <el-form-item label="订单：">
                    <el-input v-model="formHeader.orderNo" type="text" clearable />
                </el-form-item>
                <el-button v-if="isAuth('ste:order:list')" type="primary" size="small" style="float: right;" @click="GetDataList(true)">
                    查询
                </el-button>
            </el-form>
        </el-card>
        <el-card class="searchCard  newCard" style="min-height: 420px;">
            <el-row class="dataList" :gutter="6" style="min-height: 150px;">
                <el-col v-for="(item, index) in dataList" :key="index" :span="6">
                    <el-card class="dataList_item">
                        <h3 class="dataList_item_tit">
                            <span
                                :style="{
                                    color: item.steList.filter(it => it.orderStatus === 'noPass').length > 0 ? 'red' : '',
                                }"
                            >{{ item.holderName }}</span>
                            <span
                                class="dataList_item_tit_right"
                                :style="{
                                    color: item.selectOrder.orderStatus === 'noPass' ? 'red' : item.selectOrder.orderStatus === 'checked' ? '#67C23A' : '',
                                }"
                            ><i
                                v-if="item.selectOrder.orderStatus"
                                class="dataList_item_tit_dian"
                                :style="{
                                    background: item.selectOrder.orderStatus === 'noPass' ? 'red' : item.selectOrder.orderStatus === 'checked' ? '#67C23A' : '',
                                }"
                            />{{ item.selectOrder.orderStatus === 'submit' ? '已提交' : item.selectOrder.orderStatus === 'checked' ? '审核通过' : item.selectOrder.orderStatus === 'noPass' ? '审核不通过' : item.selectOrder.orderStatus === 'saved' ? '已保存' : item.selectOrder.orderStatus === '已同步' ? '未录入' : item.selectOrder.orderStatus }}</span>
                        </h3>
                        <div class="dataList_item_body">
                            <div class="dataList_item_body_ptobox">
                                <div class="dataList_item_body_ptobox_pto">
                                    <div class="dataList_item_body_ptobox_pto_bg" />
                                </div>
                            </div>
                            <div class="dataList_item_body_text">
                                <el-form :inline="true" size="mini">
                                    <el-form-item label="订单编号：">
                                        <el-select v-model="item.selectOrderId" class="orderSelect" placeholder="请选择" style="width: 100px;" valueKey="orderId" @change="OrderChange($event, item)">
                                            <el-option v-for="(item1, index1) in item.steList" :key="index1" :label="item1.orderNo" :value="item1.orderId">
                                                <div
                                                    :style="{
                                                        color: item1.orderStatus === 'noPass' ? 'red' : '',
                                                    }"
                                                >
                                                    {{ item1.orderNo }}
                                                </div>
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="生产品项：" style="line-height: 22px;">
                                        <el-tooltip class="item" effect="dark" :content="(item.selectOrder.materialCode || '') + ' ' + (item.selectOrder.materialName || '')" placement="top">
                                            <p class="dataList_item_body_text_tit">
                                                {{ (item.selectOrder.materialCode || '') + ' ' + (item.selectOrder.materialName || '') }}
                                            </p>
                                        </el-tooltip>
                                    </el-form-item>
                                    <el-form-item label="订单日期：">
                                        <p class="dataList_item_body_text_tit">
                                            {{ item.selectOrder.productDate || '' }}
                                        </p>
                                    </el-form-item>
                                    <el-form-item label="计划产量：">
                                        <p class="dataList_item_body_text_tit">
                                            {{ item.selectOrder.planOutput || '' }}
                                        </p>
                                    </el-form-item>
                                </el-form>
                            </div>
                            <img v-if="item.selectOrder.supStatus === '已确认'" src="@/assets/img/zhang.png" alt="" class="dataList_item_body_text_img">
                        </div>
                        <el-row class="dataList_item_btn">
                            <el-col :span="6" class="dataList_item_btn_item">
                                <el-tooltip
                                    class="item"
                                    effect="dark"
                                    :content="item.selectOrder.semiStatus === 'noPass' ? '审核不通过' : item.selectOrder.semiStatus === 'saved' ? '已保存' : item.selectOrder.semiStatus === 'submit' ? '已提交' : item.selectOrder.semiStatus === 'checked' ? '通过' : item.selectOrder.semiStatus === '已同步' ? '未录入' : '未录入'"
                                    placement="top"
                                >
                                    <p @click="toRouter('1', item.selectOrder)">
                                        半成品领用
                                    </p>
                                </el-tooltip>
                            </el-col>
                            <el-col :span="6" class="dataList_item_btn_item">
                                <el-tooltip
                                    class="item"
                                    effect="dark"
                                    :content="item.selectOrder.supmStatus === 'noPass' ? '审核不通过' : item.selectOrder.supmStatus === 'saved' ? '已保存' : item.selectOrder.supmStatus === 'submit' ? '已提交' : item.selectOrder.supmStatus === 'checked' ? '通过' : item.selectOrder.supmStatus === '已同步' ? '未录入' : '未录入'"
                                    placement="top"
                                >
                                    <p @click="toRouter('2', item.selectOrder)">
                                        辅料添加
                                    </p>
                                </el-tooltip>
                            </el-col>
                            <el-col :span="6" class="dataList_item_btn_item">
                                <el-tooltip
                                    class="item"
                                    effect="dark"
                                    :content="item.selectOrder.techStatus === 'noPass' ? '审核不通过' : item.selectOrder.techStatus === 'saved' ? '已保存' : item.selectOrder.techStatus === 'submit' ? '已提交' : item.selectOrder.techStatus === 'checked' ? '通过' : item.selectOrder.techStatus === '已同步' ? '未录入' : '未录入'"
                                    placement="top"
                                >
                                    <p @click="toRouter('3', item.selectOrder)">
                                        工艺控制
                                    </p>
                                </el-tooltip>
                            </el-col>
                            <el-col :span="6" class="dataList_item_btn_item">
                                <el-tooltip
                                    class="item"
                                    effect="dark"
                                    :content="item.selectOrder.insStatus === 'noPass' ? '审核不通过' : item.selectOrder.insStatus === 'saved' ? '已保存' : item.selectOrder.insStatus === 'submit' ? '已提交' : item.selectOrder.insStatus === 'checked' ? '通过' : item.selectOrder.insStatus === '已同步' ? '未录入' : '未录入'"
                                    placement="top"
                                >
                                    <p @click="toRouter('4', item.selectOrder)">
                                        杀菌入库
                                    </p>
                                </el-tooltip>
                            </el-col>
                        </el-row>
                    </el-card>
                </el-col>
            </el-row>
        </el-card>
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
        'formHeader.factory'(n, o) {
            this.formHeader.workShop = '';
            getWorkshop(this, n, '杀菌');
        }
    },
    mounted() {
        getFactory(this);
    },
    methods: {
        GetDataList() {
            if (!this.formHeader.factory || !this.formHeader.workShop) {
                this.$warning_SHINHO('请选择工厂与车间');
                return;
            }
            if ((this.formHeader.productDate === '' || !this.formHeader.productDate) && this.formHeader.orderNo === '') {
                this.$warning_SHINHO('生产日期或订单请选填一项');
                return false;
            }
            this.$http(`${STERILIZED_API.STE_HOME_LIST_API}`, 'POST', this.formHeader).then(({ data }) => {
                if (data.code === 0) {
                    this.GetMaterails(this.formHeader.factory);
                    // this.dataList = data.list
                    this.dataList = data.list;
                    this.dataList.forEach((item, index) => {
                        if (item.steList.length === 1) {
                            item.selectOrder = item.steList[0];
                            item.selectOrderId = item.steList[0].orderId;
                        } else {
                            item.selectOrder = {};
                        }
                    });
                } else {
                    this.$error_SHINHO(data.msg);
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
                    this.$error_SHINHO(data.msg);
                }
            });
        },
        toRouter(str, item) {
            let url;
            if (!item.orderId) {
                this.$warning_SHINHO('请选择订单');
                return;
            }
            if (str === '1') {
                // let st = this.Materails.filter(items => items.code === item.materialCode)
                // if (st.length === 0) {
                //   this.$warning_SHINHO('非特殊物料，不能跳转')
                //   return
                // }
                if (!this.isAuth('ste:semiMaterial:list')) {
                    this.$warning_SHINHO('没有分配权限');
                    return;
                }
                this.$http(`${STERILIZED_API.STE_ENTER_MATERIAL_LIST_API}`, 'POST', {
                    orderId: item.orderId,
                    factory: item.factory,
                    orderNo: item.orderNo,
                    materialCode: item.materialCode
                }).then(({ data }) => {
                    if (data.code === 500) {
                        this.$warning_SHINHO(data.msg);
                    } else {
                        this.$store.state.common.sterilized.seiOrderId = item.orderId;
                        this.$store.state.common.sterilized.seiFactory = item.factory;
                        this.$store.state.common.sterilized.seiOrderNo = item.orderNo;
                        url = 'DataEntry-Sterilized-SterilizedIndex-semiReceive-index';
                        this.mainTabs = this.mainTabs.filter(item => item.name !== url);
                        setTimeout(() => {
                            this.$router.push({ name: url });
                        }, 100);
                    }
                });
            } else if (str === '2') {
                if (!this.isAuth('ste:supMaterial:list')) {
                    this.$warning_SHINHO('没有分配权限');
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
                            this.$warning_SHINHO('此订单无需辅料添加');
                        } else {
                            this.$store.state.common.sterilized.acceOrderId = item.orderId;
                            this.$store.state.common.sterilized.acceFactory = item.factory;
                            this.$store.state.common.sterilized.acceOrderNo = item.orderNo;
                            url = 'DataEntry-Sterilized-SterilizedIndex-acceAdd-index';
                            this.mainTabs = this.mainTabs.filter(item => item.name !== url);
                            setTimeout(() => {
                                this.$router.push({ name: url });
                            }, 100);
                        }
                    } else {
                        this.$error_SHINHO(data.msg);
                    }
                });
            } else if (str === '3') {
                if (!this.isAuth('ste:tec:list')) {
                    this.$warning_SHINHO('没有分配权限');
                    return;
                }
                this.$store.state.common.sterilized.craftOrderId = item.orderId;
                url = 'DataEntry-Sterilized-SterilizedIndex-craftControl-index';
                this.mainTabs = this.mainTabs.filter(item => item.name !== url);
                setTimeout(() => {
                    this.$router.push({ name: url });
                }, 100);
            } else if (str === '4') {
                if (!this.isAuth('ste:inStorage:list')) {
                    this.$warning_SHINHO('没有分配权限');
                    return;
                }
                this.$store.state.common.sterilized.inOrderId = item.orderId;
                this.$store.state.common.sterilized.inFactory = item.factory;
                this.$store.state.common.sterilized.inOrderNo = item.orderNo;
                url = 'DataEntry-Sterilized-SterilizedIndex-inStock-index';
                this.mainTabs = this.mainTabs.filter(item => item.name !== url);
                setTimeout(() => {
                    this.$router.push({ name: url });
                }, 100);
            }
        }
    }
};
</script>
<style lang="scss" scoped>
// TODO
.dataList {
    margin-top: 10px;
    &_item {
        margin-bottom: 10px;
        &_tit {
            font-weight: 200;
            color: black;
            font-size: 16px;
            padding: 0 10px;
            line-height: 40px;
            border-bottom: 1px solid #e8e8e8;
            &_right {
                float: right;
                font-size: 14px;
                position: relative;
                padding-left: 8px;
            }
            &_dian {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                position: absolute;
                background: #1890ff;
                left: 0;
                top: 17px;
            }
        }
        &_body {
            position: relative;
            padding-top: 10px;
            display: flex;
            justify-content: center;
            &_ptobox {
                width: 100px;
                min-width: 100px;
                height: 111px;
                margin-top: 10px;
                position: relative;
                background: url('~@/assets/img/sterilized.png') no-repeat;
                background-size: contain;
                &_pto {
                    width: 41px;
                    border-bottom-right-radius: 53px 21px;
                    border-bottom-left-radius: 53px 21px;
                    height: 53px;
                    position: absolute;
                    top: 13px;
                    left: 28px;
                    display: flex;
                    flex-wrap: wrap;
                    align-content: flex-end;
                    overflow: hidden;
                    &_bg {
                        flex: 1;
                        height: 40px;
                        align-items: center;
                        overflow: hidden;
                        position: relative;
                        background: linear-gradient(#35c3ff, #1890ff);
                        &::before,
                        &::after {
                            content: '';
                            position: absolute;
                            left: 50%;
                            min-width: 65px;
                            min-height: 60px;
                            background: #fff;
                            animation: roateTwo 10s linear infinite;
                        }
                        &::before {
                            top: -55px;
                            border-radius: 45%;
                        }
                        &::after {
                            top: -51px;
                            opacity: 0.5;
                            border-radius: 47%;
                        }
                    }
                }
                &:hover &_pto_bg::before,
                &:hover &_pto_bg::after {
                    animation: roateOne 10s linear infinite;
                }
            }
            &_text {
                width: 170px;
                min-width: 170px;
                position: relative;
                .el-form-item {
                    margin-bottom: 4px !important;
                    margin-right: 0 !important;
                }
                &_tit {
                    width: 100px;
                    min-height: 29px;
                    font-size: 12px;
                    border-bottom: 1px solid #d8d8d8;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                &_img {
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    width: 45px;
                    height: 45px;
                    transform: rotateZ(-50deg);
                }
            }
        }
    }
}

@keyframes roateOne {
    0% {
        transform: translate(-50%, -0%) rotateZ(0deg);
    }
    50% {
        transform: translate(-50%, -1%) rotateZ(180deg);
    }
    100% {
        transform: translate(-50%, -0%) rotateZ(360deg);
    }
}

@keyframes roateTwo {
    0% {
        transform: translate(-50%, -0%) rotateZ(0deg);
    }
    50% {
        transform: translate(-50%, -0%) rotateZ(0deg);
    }
    100% {
        transform: translate(-50%, -0%) rotateZ(0deg);
    }
}
</style>
<style lang="scss">
.el-select-dropdown__wrap {
    max-height: 200px;
}
.header_main .dataList_item .el-card__body {
    padding: 0 !important;
}
.header_main .dataList_item_body_text .el-form-item {
    .el-form-item__label {
        font-size: 12px;
    }
}
</style>
