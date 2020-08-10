<template>
    <div class="header_main">
        <query-table ref="queryTable" :query-form-data="queryFormData" :list-interface="listInterface" query-auth="report:kjmORwht:kjmMaterialList" :column="column" :export-excel="true" :export-option="exportOption" />
    </div>
</template>

<script>
import { BASICDATA_API, REP_API } from '@/api/api';
export default {
    data() {
        return {
            queryFormData: [
                {
                    type: 'select',
                    label: '生产工厂',
                    prop: 'factory',
                    defaultOptionsFn: () => {
                        return this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST', {}, false, false, false);
                    },
                    resVal: {
                        resData: 'typeList',
                        label: ['deptName'],
                        value: 'deptId'
                    },
                    linkageProp: ['workShop']
                },
                {
                    type: 'select',
                    label: '生产车间',
                    prop: 'workShop',
                    optionsFn: val => {
                        return this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {
                            deptId: val,
                            deptName: '炒麦 制曲'
                        });
                    },
                    resVal: {
                        resData: 'typeList',
                        label: ['deptName'],
                        value: 'deptId'
                    }
                },
                {
                    type: 'input',
                    label: '生产订单',
                    prop: 'orderNo'
                },
                {
                    type: 'select',
                    label: '容器类型',
                    prop: 'type',
                    defaultValue: '',
                    options: [
                        { label: '豆粕计量仓', value: '豆粕计量仓' },
                        { label: '麦粉计量仓', value: '麦粉计量仓' },
                        { label: '盐水罐', value: '盐水罐' }
                    ],
                    resVal: {
                        label: ['label'],
                        value: 'value'
                    }
                },
                {
                    type: 'input',
                    label: '容器号',
                    prop: 'holderName'
                },
                {
                    type: 'date-interval',
                    label: '生产日期',
                    prop: 'commitDateOne',
                    propTwo: 'commitDateTwo'
                }
            ],
            listInterface: params => {
                return this.$http(`${REP_API.REPOUTMATERIALREQU_API}`, 'POST', params);
            },
            exportOption: {
                exportInterface: REP_API.REPOUTMATERIALREQUEXPORT_API,
                auth: 'report:kjmORwht:expectKjmMaterial',
                text: '物料领用汇总报表导出'
            },
            column: [
                {
                    prop: 'productDate',
                    label: '生产日期',
                    width: '100'
                },
                {
                    prop: 'factoryName',
                    label: '工厂',
                    minwidth: '90'
                },
                {
                    prop: 'workShopName',
                    label: '车间',
                    minwidth: '95'
                },
                {
                    prop: 'processName',
                    label: '工序',
                    minwidth: '70'
                },
                {
                    prop: 'houseNo',
                    label: '曲房号',
                    minwidth: '130'
                },
                {
                    prop: 'orderNo',
                    label: '生产订单',
                    minwidth: '120'
                },
                {
                    prop: 'material',
                    label: '品项',
                    minwidth: '180'
                },
                {
                    prop: 'useMaterial',
                    label: '领用物料',
                    minwidth: '160'
                },
                {
                    prop: 'holderName',
                    label: '领用容器',
                    minwidth: '120'
                },
                {
                    prop: 'amount',
                    label: '数量',
                    minwidth: '80'
                },
                {
                    prop: 'unitName',
                    label: '单位',
                    width: '50'
                },
                {
                    prop: 'materialBatch',
                    label: '物料批次',
                    width: '110'
                },
                {
                    prop: 'productBatch',
                    label: '生产批次',
                    width: '110'
                }
            ]
        };
    }
};
</script>

<style lang="scss" scoped>
.width158px {
    width: 158px;
}
.el-date-editor .el-range-input {
    width: 100px;
}
.el-range-editor--small .el-range-separator {
    padding-right: 20px;
}
.search-card {
    .el-button--primary,
    .el-button--primary:focus {
        color: #000;
        background-color: #fff;
        border-color: #d9d9d9;
    }
    .el-button--primary:hover {
        color: #fff;
        background-color: #1890ff;
    }
    .el-button--primary:first-child {
        color: #fff;
        background-color: #1890ff;
        border-color: #1890ff;
    }
}
</style>
