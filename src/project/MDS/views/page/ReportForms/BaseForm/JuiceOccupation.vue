<template>
    <div class="header_main">
        <query-table ref="queryTable" :rules="rules" :queryFormData="queryFormData" :listInterface="listInterface" :queryAuth="'juice:occupy:report'" :column="column" :exportExcel="true" :exportOption="exportOption" />
    </div>
</template>

<script>
import { REP_API, BASICDATA_API } from '@/api/api';
export default {
    name: 'JuiceOccupation',
    components: {},
    data() {
        return {
            rules: [
                {
                    prop: 'factory',
                    text: '请选择工厂'
                }
            ],
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
                        return this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', { deptId: val, deptName: '杀菌' });
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
                    label: '品项',
                    prop: 'materialCode',
                    filterable: true,
                    resVal: {
                        resData: 'list',
                        label: ['sapCode', 'itemName'],
                        value: 'sapCode'
                    },
                    defaultValue: '',
                    defaultOptionsFn: val => {
                        return this.$http(`${REP_API.JUICEOCCUPATION_SEMIPROD}`, 'POST', { params: '' }, false, false, false);
                    }
                },
                {
                    type: 'input',
                    label: '生产批次',
                    prop: 'batch'
                },
                {
                    type: 'date-interval',
                    label: '生产日期',
                    prop: 'startDate',
                    propTwo: 'endDate'
                }
            ],
            listInterface: params => {
                return this.$http(`${REP_API.JUICEOCCUPATION_LIST}`, 'POST', params);
            },
            exportOption: {
                exportInterface: REP_API.JUICEOCCUPATION_OUT,
                auth: 'juice:occupy:export',
                text: '原汁占用报表数据导出'
            },
            column: [
                {
                    prop: 'factory',
                    label: '工厂'
                },
                {
                    prop: 'workShop',
                    label: '车间'
                },
                {
                    prop: 'productDate',
                    label: '生产日期'
                },
                {
                    prop: 'material',
                    label: '物料',
                    width: '200'
                },
                {
                    prop: 'batch',
                    label: '生产批次',
                    width: '120'
                },
                {
                    prop: 'amount',
                    label: '数量'
                },
                {
                    prop: 'unit',
                    label: '单位',
                    width: '50'
                },
                {
                    prop: 'orderNo',
                    label: '订单号',
                    width: '220'
                }
            ]
        };
    },
    computed: {},
    mounted() {},
    methods: {}
};
</script>

<style scoped></style>
