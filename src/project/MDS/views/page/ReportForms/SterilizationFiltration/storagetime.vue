<template>
    <div class="header_main">
        <query-table ref="queryTable" :query-form-data="queryFormData" :list-interface="listInterface" :query-auth="'report:res:filterTrace'" :column="column" :export-excel="true" :export-option="exportOption" :show-page="true" />
    </div>
</template>

<script>
import { BASICDATA_API, REP_API } from '@/api/api';
export default {
    name: 'Storagetime',
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
                    linkageProp: ['workShop']
                },
                {
                    type: 'select',
                    label: '生产车间',
                    prop: 'workShop',
                    optionsFn: val => {
                        return this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', { deptId: val, deptName: '过滤' });
                    },
                    resVal: {
                        resData: 'typeList',
                        label: ['deptName'],
                        value: 'deptId'
                    }
                },
                {
                    type: 'input',
                    label: '订单号',
                    prop: 'orderNo'
                }
            ],
            listInterface: params => {
                return this.$http(`${REP_API.STERILIZATIONFILTRATION_LIST_API}`, 'POST', params);
            },
            exportOption: {
                exportInterface: REP_API.STERILIZATIONFILTRATION_EXPORT_API,
                auth: 'report:res:expectFilterTrace',
                text: '存储时间追溯'
            },
            column: [
                {
                    prop: 'orderNo',
                    label: '订单',
                    width: '120'
                },
                {
                    prop: 'deviceName',
                    label: '过滤机',
                    width: '120'
                },
                {
                    prop: 'holderName',
                    label: '领用罐号',
                    width: '120'
                },
                {
                    prop: 'material',
                    label: '物料',
                    width: '190'
                },
                {
                    prop: 'batch',
                    label: '批次',
                    width: '120'
                },
                {
                    prop: 'receiveAmount',
                    label: '数量',
                    width: '120'
                },
                {
                    prop: 'unit',
                    label: '单位',
                    width: '120'
                },
                {
                    prop: 'gnEndTime',
                    label: '搅罐时间',
                    width: '160'
                },
                {
                    prop: 'startTime',
                    label: '领用时间',
                    width: '160'
                },
                {
                    prop: 'precipitationTime',
                    label: '沉淀期',
                    width: '120'
                }
            ]
        };
    },
    computed: {},
    methods: {}
};
</script>

<style scoped></style>
