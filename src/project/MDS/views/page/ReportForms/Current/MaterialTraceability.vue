<template>
    <div class="header_main">
        <query-table ref="queryTable" :query-form-data="queryFormData" :rules="rules" :list-interface="listInterface" query-auth="report:production:materielTrace" :column="column" />
    </div>
</template>

<script>
import { BASICDATA_API, REP_API, AUDIT_API } from '@/api/api';
export default {
    name: 'TwoOneRetrospect',
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
                    linkageProp: ['workShop', 'materialCodeLittle']
                },
                {
                    type: 'select',
                    label: '生产车间',
                    prop: 'workShop',
                    optionsFn: val => {
                        return this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {
                            deptId: val
                        });
                    },
                    resVal: {
                        resData: 'typeList',
                        label: ['deptName'],
                        value: 'deptId'
                    },
                    linkageProp: ['productLine']
                },
                {
                    type: 'select',
                    label: '生产产线',
                    prop: 'productLine',
                    resVal: {
                        resData: 'childList',
                        label: ['deptName'],
                        value: 'deptId'
                    },
                    optionsFn: val => {
                        return this.$http(`${BASICDATA_API.FINDORGBYPARENTID_API}`, 'POST', { parentId: val });
                    }
                },
                {
                    type: 'input',
                    label: '生产订单',
                    prop: 'orderNo'
                },
                {
                    type: 'input',
                    label: '生产批次',
                    prop: 'batch'
                },
                {
                    type: 'input',
                    label: '组件批次',
                    prop: 'batchLittle'
                },
                {
                    type: 'select',
                    label: '生产物料',
                    prop: 'materialCode',
                    resVal: {
                        resData: 'materielTraceSelectInfo',
                        label: ['MATERIAL_NAME', 'MATERIAL_CODE'],
                        value: 'MATERIAL_CODE'
                    },
                    defaultValue: '',
                    defaultOptionsFn: () => {
                        return this.$http(`${REP_API.CURRENT_MATERIALTRACEABILITY_LIAT}`, 'POST', {});
                    }
                },
                {
                    type: 'select',
                    label: '组件物料',
                    prop: 'materialCodeLittle',
                    optionsFn: val => {
                        return this.$http(`${AUDIT_API.AUDIT_ISSUE_MATERIAL_API}`, 'POST', {
                            factory: val
                        });
                    },
                    defaultValue: '',
                    resVal: {
                        resData: 'list',
                        label: ['materialName', 'materialCode'],
                        value: 'materialCode'
                    }
                },
                {
                    type: 'date-interval',
                    label: '生产日期',
                    prop: 'orderStartDate',
                    propTwo: 'orderEndDate'
                }
            ],
            listInterface: params => {
                return this.$http(`${REP_API.CURRENT_MATERIALTRACEABILITY_LIST}`, 'POST', params);
            },
            rules: [
                {
                    prop: 'workShop',
                    text: '请选择车间'
                }
            ],
            column: [
                {
                    prop: 'orderDate',
                    label: '日期',
                    minwidth: '100'
                },
                {
                    prop: 'factory',
                    label: '工厂',
                    minwidth: '90'
                },
                {
                    prop: 'workShopName',
                    label: '车间',
                    minwidth: '95'
                },
                {
                    prop: 'productLineName',
                    label: '产线',
                    minwidth: '100'
                },
                {
                    prop: 'orderNo',
                    label: '订单',
                    minwidth: '120'
                },
                {
                    prop: 'materialCode',
                    label: '生产物料',
                    minwidth: '120',
                    formatter: (row) => {
                        return row.materialName + ' ' + row.materialCode;
                    }
                },
                {
                    prop: 'realInAmount',
                    label: '生产数量',
                    minwidth: '90'
                },
                {
                    prop: 'inUnit',
                    label: '单位',
                    width: '50'
                },
                {
                    prop: 'inBatch',
                    label: '生产批次',
                    minwidth: '110'
                },
                {
                    prop: 'useMaterialCode',
                    label: '组件物料',
                    minwidth: '110',
                    formatter: (row) => {
                        return row.useMaterialCode + ' ' + row.useMaterialName;
                    }
                },
                {
                    prop: 'useInAmount',
                    label: '组件物料数量',
                    minwidth: '120'
                },
                {
                    prop: 'useUnit',
                    label: '单位',
                    width: '50'
                },
                {
                    prop: 'useBatch',
                    label: '组件物料批次',
                    minwidth: '100'
                }
            ]
        };
    }
};
</script>
