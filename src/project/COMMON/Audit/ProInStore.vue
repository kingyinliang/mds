<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            :query-form-data="queryFormData"
            :list-interface="listInterface"
            :tabs="tabs"
            :show-index-column="true"
            :show-select-column="true"
            :show-operation-column="true"
            :operation-column-width="70"
        >
            <template slot="tab-head0">
                <div class="tab__heads clearfix">
                    <i class="title-icon" />
                    <span>发料列表</span>
                    <div style="float: right;">
                        <span>过账日期：</span><el-date-picker size="small" style="width: 120px; margin-right: 10px;" />
                        <span>抬头文本：</span><el-input size="small" style="width: 190px; margin-right: 10px;" />
                        <el-button type="primary" size="small">
                            过账
                        </el-button>
                        <el-button type="primary" size="small" class="sub-red">
                            退回
                        </el-button>
                        <el-button type="primary" size="small" class="sub-yellow">
                            反审
                        </el-button>
                    </div>
                </div>
            </template>
            <template slot="tab-head1">
                <div class="tab__heads clearfix">
                    <i class="title-icon" />
                    <span>发料列表</span>
                </div>
            </template>
            <template slot="operation_column" slot-scope="{ scope }">
                <el-button class="ra_btn" type="primary" round size="mini" @click="addOrupdate(scope.row)">
                    编辑
                </el-button>
            </template>
        </query-table>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, AUDIT_API } from 'common/api/api';

    const Column = [
        {
            prop: 'status',
            label: '过账状态'
        },
        {
            prop: 'orderProductDate',
            label: '生产日期'
        },
        {
            prop: 'orderNo',
            label: '生产订单'
        },
        {
            prop: 'orderMaterialCode',
            label: '生产物料 '
        },
        {
            prop: 'orderAmount',
            label: '计划数量'
        },
        {
            prop: 'orderEntryUom',
            label: '单位'
        },
        {
            prop: 'entryQnt',
            label: '入库数量'
        },
        {
            prop: 'entryUom',
            label: '单位'
        },
        {
            prop: 'isSample',
            label: '是否样品'
        },
        {
            prop: 'batch',
            label: '物料批次'
        },
        {
            prop: 'pkgOrderProductDate',
            label: '订单生产日期'
        },
        {
            prop: 'stgeLoc',
            label: '入库库位'
        },
        {
            prop: 'moveType',
            label: '移动类型'
        },
        {
            prop: 'stckType',
            label: '库存类型'
        },
        {
            prop: 'noMoreGr',
            label: '交货已完成',
            width: '120'
        },
        {
            prop: 'expirydate',
            label: '货架寿命到期日',
            width: '120'
        },
        {
            prop: 'theDate',
            label: '备注'
        },
        {
            prop: 'interfaceReturn',
            label: '接口回写'
        }
    ]

    @Component({
        components: {
        }
    })
    export default class ProInStore extends Vue {
        queryFormData = [
            {
                type: 'select',
                label: '生产车间',
                prop: 'workShop',
                defaultOptionsFn: () => {
                    return COMMON_API.ORG_QUERY_WORKSHOP_API({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        deptType: 'workshop'
                    })
                },
                resVal: {
                    resData: 'data',
                    label: ['deptName'],
                    value: 'id'
                },
                linkageProp: ['productLine']
            },
            {
                type: 'select',
                label: '生产产线',
                prop: 'productLine',
                defaultOptionsFn: val => {
                    return COMMON_API.ORG_QUERY_CHILDREN_API({
                        parentId: val || ''
                    })
                },
                resVal: {
                    resData: 'typeList',
                    label: ['deptName'],
                    value: 'id'
                }
            },
            {
                type: 'input',
                label: '生产订单',
                prop: 'orderNo'
            },
            {
                type: 'select',
                label: '订单类型',
                prop: 'orderType',
                defaultOptionsFn: () => {
                    return COMMON_API.DICTQUERY_API({
                        dictType: 'COMMON_CHECK_STATUS'
                    })
                },
                defaultValue: '',
                resVal: {
                    resData: 'data',
                    label: ['dictValue'],
                    value: 'dictCode'
                }
            },
            {
                type: 'select',
                label: '订单状态',
                prop: 'orderStatus',
                defaultOptionsFn: () => {
                    return COMMON_API.DICTQUERY_API({
                        dictType: 'COMMON_CHECK_STATUS'
                    })
                },
                defaultValue: '',
                resVal: {
                    resData: 'data',
                    label: ['dictValue'],
                    value: 'dictCode'
                }
            },
            {
                type: 'date-interval',
                label: '生产日期',
                prop: 'productDateStart',
                propTwo: 'productDateEnd'
            }
        ]

        tabs = [
            {
                label: '未过账',
                tableData: [],
                column: Column
            },
            {
                label: '已过账',
                tableData: [],
                column: Column
            }
        ]

        listInterface = params => {
            params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id
            return AUDIT_API.INLIST_API(params);
        }
    }
</script>

<style lang="scss" scoped>
    .tab__heads {
        margin-bottom: 10px;
        line-height: 32px;
    }
    .title-icon {
        float: left;
        width: 4px;
        height: 12px;
        margin-top: 10px;
        margin-right: 5px;
        background: #487bff;
        border-radius: 2px;
    }
</style>
