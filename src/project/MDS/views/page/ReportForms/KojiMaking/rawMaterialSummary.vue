<template>
    <div class="header_main">
        <query-table ref="queryTable" :query-form-data="queryFormData" :list-interface="listInterface" :query-auth="'report:res:kjmWheatPulp'" :column="column" :export-excel="true" :export-option="exportOption" :show-page="true" />
    </div>
</template>

<script>
import { BASICDATA_API, REP_API } from '@/api/api';
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
                        return this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', { deptId: val, deptName: '制曲' });
                    },
                    resVal: {
                        resData: 'typeList',
                        label: ['deptName'],
                        value: 'deptId'
                    },
                    linkageProp: ['inPotNo']
                },
                {
                    type: 'select',
                    label: '发酵罐号',
                    prop: 'inPotNo',
                    filterable: true,
                    resVal: {
                        resData: 'page.list',
                        label: ['holderName'],
                        value: 'holderNo'
                    },
                    defaultValue: '',
                    returnValue: {
                        findList: 'workShop',
                        findId: 'deptId',
                        findField: 'deptName'
                    },
                    /* eslint-disable */
                    optionsFn: (val, secondVal) => {
                        return this.$http(`${BASICDATA_API.CONTAINERLIST_API}`, 'POST', { type: 'holder_type', holder_type: '001', pageSize: 9999, deptId: val, workShopName: secondVal, currPage: 1 }, false, false, false);
                    }
                    /* eslint-enable */
                },
                {
                    type: 'date-interval',
                    label: '制曲日期',
                    prop: 'inKjmDateStart',
                    propTwo: 'inKjmDateEnd'
                }
            ],
            listInterface: params => {
                return this.$http(`${REP_API.KJMWHEATPULP_LIST_API}`, 'POST', params);
            },
            exportOption: {
                exportInterface: REP_API.KJMWHEATPULP_EXPORT_API,
                auth: 'report:res:expectKjmWheatPulp',
                text: '原料领用汇总报表'
            },
            column: [
                {
                    prop: 'workShopName',
                    label: '车间',
                    width: '180'
                },
                {
                    prop: 'inKjmDate',
                    label: '制曲日期',
                    width: '180'
                },
                {
                    prop: 'houseNo',
                    label: '曲房号',
                    width: '180'
                },
                {
                    prop: 'inPotNo',
                    label: '发酵罐号',
                    width: '100'
                },
                {
                    prop: 'material',
                    label: '领用物料'
                },
                {
                    prop: 'amount',
                    label: '领用数量',
                    width: '180'
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
