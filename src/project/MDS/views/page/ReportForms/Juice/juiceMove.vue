<template>
    <div class="header_main">
        <query-table ref="queryTable" :query-form-data="queryFormData" :list-interface="listInterface" :query-auth="'report:res:juiceMove'" :column="column" :export-excel="true" :export-option="exportOption" :show-page="true" />
    </div>
</template>

<script>
import { BASICDATA_API, REP_API, JUICE_API, SYSTEMSETUP_API } from '@/api/api';
export default {
    name: 'JuiceMove',
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
                        return this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', { deptId: val, deptName: '原汁' });
                    },
                    resVal: {
                        resData: 'typeList',
                        label: ['deptName'],
                        value: 'deptId'
                    }
                },
                {
                    type: 'select',
                    label: '原汁罐号',
                    prop: 'holderNo',
                    filterable: true,
                    resVal: {
                        resData: 'holderList',
                        label: ['holderName'],
                        value: 'holderNo'
                    },
                    defaultValue: '',
                    defaultOptionsFn: () => {
                        return this.$http(`${JUICE_API.JUICE_SEARCH_POT_LIST}`, 'POST', { holderType: '013' }, false, false, false);
                    }
                },
                {
                    type: 'select',
                    label: '原汁类别',
                    prop: 'type',
                    filterable: true,
                    resVal: {
                        resData: 'maintain',
                        label: ['halfName'],
                        value: 'halfType'
                    },
                    defaultValue: '',
                    defaultOptionsFn: () => {
                        return this.$http(`${JUICE_API.JUICE_TYPE_LIST}`, 'POST', {}, false, false, false);
                    }
                },
                {
                    type: 'select',
                    label: '移动类型',
                    prop: 'moveType',
                    filterable: true,
                    resVal: {
                        resData: 'dicList',
                        label: ['value'],
                        value: 'value'
                    },
                    defaultValue: '',
                    defaultOptionsFn: () => {
                        return this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', { type: 'allocating_type' }, false, false, false);
                    }
                },
                {
                    type: 'date-interval',
                    label: '移动日期',
                    prop: 'moveTimeStart',
                    propTwo: 'moveTimeEnd'
                }
            ],
            listInterface: params => {
                return this.$http(`${REP_API.JUICEMOVE_LIST_API}`, 'POST', params);
            },
            exportOption: {
                exportInterface: REP_API.JUICEMOVE_EXPORT_API,
                auth: 'report:res:expectJuiceMove',
                text: '原汁移动报表'
            },
            column: [
                {
                    prop: 'holderName',
                    label: '罐号',
                    minwidth: '100'
                },
                {
                    prop: 'moveTime',
                    label: '移动日期',
                    minwidth: '165'
                },
                {
                    prop: 'material',
                    label: '物料',
                    minwidth: '180'
                },
                {
                    prop: 'type',
                    label: '原汁类别',
                    minwidth: '90'
                },
                {
                    prop: 'moveType',
                    label: '移动类型',
                    minwidth: '85'
                },
                {
                    prop: 'amount',
                    label: '数量',
                    minwidth: '90'
                },
                {
                    prop: 'unit',
                    label: '单位',
                    minwidth: '60'
                },
                {
                    prop: 'materialBatch',
                    label: '物料批次',
                    minwidth: '115'
                },
                {
                    prop: 'inBatch',
                    label: '转入批次',
                    minwidth: '115'
                },
                {
                    prop: 'inHolderName',
                    label: '罐号',
                    minwidth: '100'
                },
                {
                    prop: 'factory',
                    label: '工厂',
                    minwidth: '120'
                }
            ]
        };
    },
    computed: {},
    methods: {}
};
</script>

<style scoped>
</style>
