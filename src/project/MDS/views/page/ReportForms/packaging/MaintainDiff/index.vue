<template>
    <div class="header_main">
        <query-table :query-form-data="queryFormData" :list-interface="listInterface" :query-auth="'report:form:listJWZPIS'" :column="column" :export-excel="true" :export-option="exportOption" />
    </div>
</template>

<script>
import { BASICDATA_API, REP_API } from '@/api/api';
export default {
    name: 'Index',
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
                    linkageProp: ['workshop']
                },
                {
                    type: 'select',
                    label: '生产车间',
                    prop: 'workshop',
                    optionsFn: val => {
                        return this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {
                            deptId: val,
                            deptName: '包装 组装'
                        });
                    },
                    resVal: {
                        resData: 'typeList',
                        label: ['deptName'],
                        value: 'deptId'
                    },
                    linkageProp: ['productline']
                },
                {
                    type: 'select',
                    label: '生产产线',
                    prop: 'productline',
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
                    type: 'select',
                    label: '品项',
                    prop: 'materialCode',
                    filterable: true,
                    resVal: {
                        resData: 'list',
                        label: ['sapCode', 'itemName'],
                        value: 'sapCode'
                    },
                    defaultValue: '',
                    defaultOptionsFn: () => {
                        return this.$http(`${BASICDATA_API.FINDSAP_API}`, 'POST', { params: '' }, false, false, false);
                    }
                },
                {
                    type: 'date-interval',
                    label: '生产日期',
                    prop: 'commitDateOne',
                    propTwo: 'commitDateTwo'
                }
            ],
            listInterface: params => {
                return this.$http(`${REP_API.REPMADIFFLIST_API}`, 'POST', params);
            },
            exportOption: {
                exportInterface: REP_API.REPMADIFFOUTPUT_API,
                auth: 'report:form:exportJWZPIS',
                text: '机维组数量差异报表数据导出'
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
                    width: '90'
                },
                {
                    prop: 'workShopName',
                    label: '车间',
                    width: '95'
                },
                {
                    prop: 'productLineName',
                    label: '产线',
                    width: '70'
                },
                {
                    prop: 'orderNo',
                    label: '生产订单',
                    width: '120'
                },
                {
                    prop: 'materialH',
                    label: '品项'
                },
                {
                    prop: 'batch',
                    label: '生产批次',
                    width: '120'
                },
                {
                    prop: 'orgnDifferent',
                    label: '差异数量',
                    width: '80'
                },
                {
                    prop: 'differentInfo',
                    label: '差异说明',
                    width: '100'
                },
                {
                    prop: 'remark',
                    label: '备注',
                    width: '100'
                }
            ]
        };
    }
};
</script>

<style scoped></style>
