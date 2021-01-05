<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            query-auth="steQuery"
            :type="'home'"
            :rules="rules"
            :query-form-data="queryFormData"
            :list-interface="listInterface"
            :custom-data="true"
            @get-data-success="setData"
            @created-end="createdEnd"
        >
            <template slot="home">
                <el-row class="home_card__main" :gutter="10">
                    <el-col v-for="(item, index) in queryResultList" :key="index" :span="8" style=" min-width: 396px; margin-bottom: 10px;">
                        <el-form :model="item" size="small" label-position="right" label-width="85px">
                            <div class="home_card__main__item">
                                <div class="home_card__main__item__title clearfix">
                                    <p class="home_card__main__item__title__left">
                                        锅号：<span class="home_card__main__item__title__left__proLine">{{ item.splitOrders[0].potName }}</span>
                                    </p>
                                    <p v-if="item.activeOrderNo!==''" :class="item.potOrderMap? item.potOrderMap.statusName === '已退回' ? 'noPass' : '' : ''" class="home_card__main__item__title__right">
                                        <span>状态：{{ item.potOrderMap? item.potOrderMap.statusName : '' }}</span>
                                    </p>
                                </div>
                                <div class="home_card__main__item__main">
                                    <div class="home_card__main__item__main__left">
                                        <div class="home_card__main__item__main__left_ptobox">
                                            <div class="home_card__main__item__main__left_ptobox_pto">
                                                <div class="home_card__main__item__main__left_ptobox_pto_bg" />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="home_card__main__item__main__right">
                                        <el-form-item label="生产订单：">
                                            <el-select v-model="item.orderNo" placeholder="请选择" style="width: 100%;" @change="orderchange(item)">
                                                <el-option v-for="(subItem, subIndex) in item.splitOrders" :key="subIndex" :label="subItem.orderNo" :value="subItem.id" />
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="生产物料：">
                                            <div class="disabled-input el-input el-input--small is-disabled">
                                                <el-tooltip class="item" effect="dark" :content=" item.orderNoMap? `${item.orderNoMap.materialName} ${item.orderNoMap.materialCode}` : ''" placement="top">
                                                    <span class="el-input__inner">{{ item.orderNoMap? `${item.orderNoMap.materialName} ${item.orderNoMap.materialCode}` : '' }}</span>
                                                </el-tooltip>
                                            </div>
                                        </el-form-item>
                                        <el-form-item label="生产锅序：">
                                            <el-select v-model="item.potOrder" placeholder="请选择" style="width: 100%;" @change="potOrderChange(item)">
                                                <span v-if="item.orderNoMap">
                                                    <el-option v-for="(subItem, subIndex) in item.orderNoMap['potOrders']" :key="subIndex" :label="'第' + subItem.potOrder + '锅'" :value="subItem.id" />
                                                </span>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="计划锅数：">
                                            <div class="disabled-input el-input el-input--small is-disabled">
                                                <span class="el-input__inner">{{ item.orderNoMap? item.orderNoMap.potCount : '' }}</span>
                                            </div>
                                        </el-form-item>
                                        <el-form-item label="生产锅数：">
                                            <div class="disabled-input el-input el-input--small is-disabled">
                                                <span class="el-input__inner">{{ item.orderNoMap? item.orderNoMap.productPotCount : '' }}</span>
                                            </div>
                                        </el-form-item>
                                    </div>
                                </div>
                                <div class="home_card__main__item__footer clearfix">
                                    <div style="float: right;">
                                        <el-tooltip class="item" effect="dark" :content="item.potOrderMap && item.potOrderMap.steTagPot? item.potOrderMap.steTagPot.semiMaterialStatusName : ''" placement="top-start">
                                            <el-button v-if="isAuth('steMaterial')" type="primary" :disabled="!item.potOrderMap" :style="{ color: item.potOrderMap && item.potOrderMap.steTagPot&& item.potOrderMap.steTagPot.semiMaterialStatusName === '退回' ? 'red' : ''}" size="small" @click="goEntry(item, 1)">
                                                半成品领用
                                            </el-button>
                                        </el-tooltip>
                                        <el-tooltip class="item" effect="dark" :content="item.potOrderMap && item.potOrderMap.steTagPot? item.potOrderMap.steTagPot.accessoriesStatusName : ''" placement="top-start">
                                            <el-button v-if="isAuth('steAcc')" type="primary" :disabled="!item.potOrderMap" :style="{ color: item.potOrderMap && item.potOrderMap.steTagPot && item.potOrderMap.steTagPot.accessoriesStatusName === '退回' ? 'red' : ''}" size="small" @click="goEntry(item, 2)">
                                                辅料添加
                                            </el-button>
                                        </el-tooltip>
                                        <el-tooltip class="item" effect="dark" :content="item.potOrderMap && item.potOrderMap.steTagPot? item.potOrderMap.steTagPot.controlStatusName : ''" placement="top-start">
                                            <el-button v-if="isAuth('steControl')" type="primary" :disabled="!item.potOrderMap" :style="{ color: item.potOrderMap && item.potOrderMap.steTagPot && item.potOrderMap.steTagPot.controlStatusName === '退回' ? 'red' : ''}" size="small" @click="goEntry(item, 3)">
                                                工艺控制
                                            </el-button>
                                        </el-tooltip>
                                    </div>
                                </div>
                            </div>
                        </el-form>
                    </el-col>
                </el-row>
            </template>
        </query-table>
    </div>
</template>


<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, STE_API } from 'common/api/api';
    import { dateFormat } from 'utils/utils';

    @Component
    export default class Sterilize extends Vue {
        $refs: {
            queryTable: HTMLFormElement;
        };

        queryResultList: SteObj[] = [];
        rules = [
            {
                prop: 'workShop',
                text: '请选择生产车间'
            }
        ];

        queryFormData = [
            {
                type: 'select',
                label: '生产车间',
                prop: 'workShop',
                labelWidth: 90,
                rule: [
                    { required: true, message: ' ', trigger: 'change' }
                ],
                defaultOptionsFn: () => {
                    return COMMON_API.ORG_QUERY_WORKSHOP_API({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        deptType: ['WORK_SHOP'],
                        deptName: '杀菌'
                    })
                },
                resVal: {
                    resData: 'data',
                    label: ['deptName'],
                    value: 'id'
                },
                linkageProp: ['pkgLine']
            },
            {
                type: 'date-picker',
                label: '生产日期',
                prop: 'productDate',
                labelWidth: 90,
                valueFormat: 'yyyy-MM-dd hh:mm:ss',
                defaultValue: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
            },
            {
                type: 'input',
                label: '生产订单',
                labelWidth: 90,
                prop: 'orderNo'
            },
            {
                type: 'select',
                label: '包装产线',
                prop: 'pkgLine',
                optionsFn: val => {
                    return STE_API.STE_LINE_API({
                        workShop: val || ''
                    })
                },
                defaultValue: '',
                resVal: {
                    resData: 'data',
                    label: ['pkgLineName'],
                    value: 'pkgLine'
                }
            },
            {
                type: 'input',
                label: '生产锅号',
                labelWidth: 90,
                prop: 'potNo'
            }
        ];

        // 查询请求
        listInterface = params => {
            if ((params.productDate === '' || !params.productDate) && params.orderNo === '') {
                this.$warningToast('日期或订单请选填一项');// eslint-disable-line
                return new Promise((resolve, reject) => {
                    reject('error') // eslint-disable-line
                });
            }
            params.current = 1;
            params.size = 10;
            params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            return STE_API.STE_HOME_LIST_API(params);
        };

        createdEnd() {
            this.$nextTick(() => {
                if (this.$refs.queryTable.queryForm.workShop !== '' && this.$refs.queryTable.queryForm.workShop.productDate !== '') {
                    this.$refs.queryTable.getDataList(true)
                }
            })
        }

        setData(data) {
            if (data.data) {
                this.queryResultList = data.data
                this.queryResultList.forEach(item => {
                    // if (item.splitOrders.length === 1) {
                    item.orderNo = item.splitOrders[0].id;
                    this.orderchange(item);
                    // }
                })
            } else {
                this.queryResultList = []
                this.$infoToast('暂无任何内容');
            }
        }

        orderchange(item) {
            const filterArr: (any) = item.splitOrders.filter(it => it.id === item.orderNo);// eslint-disable-line
            item.orderNoMap = filterArr[0];
            // if (item.orderNoMap['potOrders'].length === 1) {
            item.potOrder = item.orderNoMap['potOrders'][0].id;
            item.potOrderMap = item.orderNoMap['potOrders'][0];
            // } else {
            //     item.potOrder = '';
            //     item.potOrderMap = '';
            // }
        }

        potOrderChange(item) {
            const filterArr: (any) = item.orderNoMap.potOrders.filter(it => it.id === item.potOrder);// eslint-disable-line
            item.potOrderMap = filterArr[0];
            this.queryResultList.splice(this.queryResultList.length, 0, { splitOrders: [] });
            this.queryResultList.splice(this.queryResultList.length - 1, 1);
        }

        goEntry(item, index) {
            if (!item.orderNo || !item.potOrder) {
                this.$warningToast('请选择订单和锅序！')
                return false;
            }
            if (index === 1) {
                this.changeRouter(item, 'DFMDS-pages-Sterilize-SemiReceive', 'sterilize/updateSemiReceive')
            } else if (index === 2) {
                this.changeRouter(item, 'DFMDS-pages-Sterilize-AcceAdd', 'sterilize/updateAcceAdd')
            } else if (index === 3) {
                this.changeRouter(item, 'DFMDS-pages-Sterilize-Craft', 'sterilize/updateCraft')
            } else if (index === 4) {
                this.changeRouter(item, 'DFMDS-pages-Sterilize-SemiReceive', 'sterilize/updateSemiReceive')
            }
        }

        changeRouter(item, url, store) {
            this.$store.commit(store, {
                potNo: item.potNo,
                orderNoMap: item.orderNoMap,
                potOrderMap: item.potOrderMap
            });
            this.$store.commit('common/updateMainTabs', this.$store.state.common.mainTabs.filter(subItem => subItem.name !== url));
            setTimeout(() => {
                this.$router.push({
                    name: url
                });
            }, 100);
        }
    }
    interface SteObj{
        id?: string;
        orderNo?: string;
        splitOrders: SplitOrders[];
    }
    interface SplitOrders{
        id?: string;
    }

</script>

<style lang="scss" scoped>
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
    .home_card__main__item__main__left {
        &_ptobox {
            position: relative;
            width: 160px;
            min-width: 160px;
            height: 200px;
            margin-top: 10px;
            background: url("~@/assets/img/sterilized.png") no-repeat;
            background-size: contain;
            &_pto {
                position: absolute;
                top: 26px;
                left: 46px;
                display: flex;
                flex-wrap: wrap;
                align-content: flex-end;
                width: 68px;
                height: 84px;
                overflow: hidden;
                border-bottom-right-radius: 53px 21px;
                border-bottom-left-radius: 53px 21px;
                &_bg {
                    position: relative;
                    flex: 1;
                    align-items: center;
                    height: 100%;
                    overflow: hidden;
                    background: linear-gradient(#35c3ff, #1890ff);
                    &::before,
                    &::after {
                        position: absolute;
                        left: 50%;
                        min-width: 82px;
                        min-height: 70px;
                        background: #fff;
                        animation: roateTwo 10s linear infinite;
                        content: "";
                    }
                    &::before {
                        top: -55px;
                        border-radius: 45%;
                    }
                    &::after {
                        top: -51px;
                        border-radius: 47%;
                        opacity: 0.5;
                    }
                }
            }
            &:hover &_pto_bg::before,
            &:hover &_pto_bg::after {
                animation: roateOne 10s linear infinite;
            }
        }
    }
</style>
