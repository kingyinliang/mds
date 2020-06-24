<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            :type="'home'"
            :rules="rules"
            :query-form-data="queryFormData"
            :list-interface="listInterface"
            :custom-data="true"
            @get-data-success="setData"
        >
            <template slot="home">
                <el-row class="home_card__main" :gutter="10">
                    <el-col v-for="(item, index) in queryResultList" :key="index" :span="8" style="margin-bottom: 10px;">
                        <el-form :model="item" size="small" label-position="right" label-width="85px">
                            <div class="home_card__main__item">
                                <div class="home_card__main__item__title clearfix">
                                    <p class="home_card__main__item__title__left">
                                        锅号：<span class="home_card__main__item__title__left__proLine">{{ item.productLineName }}</span>锅
                                    </p>
                                    <p v-if="item.activeOrderNo!==''" class="home_card__main__item__title__right">
                                        <span>状态：{{ item.activeOrderMap? item.activeOrderMap.orderStatusValue : '' }}</span>
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
                                            <el-select v-model="item.activeOrderNo" placeholder="请选择" style="width: 100%;" @change="orderchange(item)">
                                                <el-option v-for="(subItem, subIndex) in item.orderNoList" :key="subIndex" :label="subItem" :value="subItem" />
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="生产物料：">
                                            <div class="disabled-input el-input el-input--small is-disabled">
                                                <span class="el-input__inner">{{ item.activeOrderMap? `${item.activeOrderMap.materialCode} ${item.activeOrderMap.materialName}` : '' }}</span>
                                            </div>
                                        </el-form-item>
                                        <el-form-item label="生产锅序：">
                                            <el-select v-model="item.activeOrderNo" placeholder="请选择" style="width: 100%;" @change="orderchange(item)">
                                                <el-option v-for="(subItem, subIndex) in item.orderNoList" :key="subIndex" :label="subItem" :value="subItem" />
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="计划锅数：">
                                            <div class="disabled-input el-input el-input--small is-disabled">
                                                <span class="el-input__inner">1</span>
                                            </div>
                                        </el-form-item>
                                        <el-form-item label="生产锅数：">
                                            <div class="disabled-input el-input el-input--small is-disabled">
                                                <span class="el-input__inner">1</span>
                                            </div>
                                        </el-form-item>
                                    </div>
                                </div>
                                <div class="home_card__main__item__footer clearfix">
                                    <div style="float: right;">
                                        <el-button size="small">
                                            半成品领用
                                        </el-button>
                                        <el-button size="small">
                                            辅料添加
                                        </el-button>
                                        <el-button size="small">
                                            工艺控制
                                        </el-button>
                                        <el-button size="small">
                                            杀菌入库
                                        </el-button>
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
        queryResultList: SteObj[] = [{}];
        rules = [
            {
                prop: 'workshop',
                text: '请选择生产车间'
            }
        ];

        queryFormData = [
            {
                type: 'select',
                label: '生产车间',
                prop: 'workshop',
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
                }
            },
            {
                type: 'date-picker',
                label: '生产日期',
                prop: 'productDate',
                valueFormat: 'yyyy-MM-dd hh:mm:ss',
                defaultValue: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
            },
            {
                type: 'input',
                label: '生产订单',
                prop: 'orderNo'
            },
            {
                type: 'input',
                label: '生产锅号',
                prop: 'guoNo'
            }
        ];

        // 查询请求
        listInterface = params => {
            params.current = 1;
            params.size = 10;
            params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            return STE_API.STE_HOME_LIST_API(params);
        };

        setData(data) {
            console.log(data);
        }
    }
    interface SteObj{
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
