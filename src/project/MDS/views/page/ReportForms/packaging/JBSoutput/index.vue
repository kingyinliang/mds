<template>
    <div class="header_main">
        <query-table ref="queryTable" :query-form-data="queryFormData" :list-interface="listInterface" :query-auth="'report:form:listJBS'" :column="column" :export-excel="true" :export-option="exportOption" />
    </div>
</template>

<script>
import { BASICDATA_API, REP_API } from '@/api/api';
export default {
    name: 'Index',
    components: {},
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
                    type: 'select',
                    label: '品项',
                    prop: 'materialCode',
                    filterable: true,
                    resVal: {
                        resData: 'list',
                        label: ['itemName', 'sapCode'],
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
                return this.$http(`${REP_API.REPJBSLIST_API}`, 'POST', params);
            },
            exportOption: {
                exportInterface: REP_API.REPJBSOUTPUT_API,
                auth: 'report:form:exportJBS',
                text: 'JBS产出明细报表数据导出'
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
                    prop: 'productLineName',
                    label: '产线',
                    minwidth: '70'
                },
                {
                    prop: 'orderNo',
                    label: '生产订单',
                    minwidth: '120'
                },
                {
                    prop: 'materialH',
                    label: '生产品项',
                    minwidth: '180'
                },
                {
                    prop: 'batch',
                    label: '生产批次',
                    minwidth: '120'
                },
                {
                    prop: 'washing',
                    label: '清洗冲顶',
                    minwidth: '80'
                },
                {
                    prop: 'changeProduct',
                    label: '换罐冲顶',
                    minwidth: '80'
                },
                {
                    prop: 'bootHeader',
                    label: '开机冲顶',
                    minwidth: '80'
                },
                {
                    prop: 'badMaterial',
                    label: '包材不良',
                    minwidth: '80'
                },
                {
                    prop: 'badProduct',
                    label: '制程不良',
                    minwidth: '80'
                },
                {
                    prop: 'badSemi',
                    label: '半成品物料不合格',
                    minwidth: '140'
                },
                {
                    prop: 'deviceLoss',
                    label: '设备残留',
                    minwidth: '80'
                },
                {
                    prop: 'remark',
                    label: '备注',
                    width: '120'
                }
            ]
        };
    },
    methods: {}
};
</script>
