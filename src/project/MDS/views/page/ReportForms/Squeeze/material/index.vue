<template>
    <div class="header_main">
        <query-table ref="queryTable" :query-form-data="queryFormData" :list-interface="listInterface" :query-auth="'report:res:prsMaterial'" :column="column" :export-excel="true" :export-option="exportOption" />
    </div>
</template>

<script>
import { BASICDATA_API, REP_API, SYSTEMSETUP_API } from '@/api/api';
import { dateFormat } from '@/net/validate';
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
                        return this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST', {}, false, false, false);// eslint-disable-line
                    },
                    resVal: {
                        resData: 'typeList',
                        label: ['deptName'],
                        value: 'deptId'
                    },
                    linkageProp: ['workShop', 'materialCode']
                },
                {
                    type: 'select',
                    label: '生产车间',
                    prop: 'workShop',
                    optionsFn: val => {
                        return this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {// eslint-disable-line
                            deptId: val,
                            deptName: '压榨'
                        });
                    },
                    resVal: {
                        resData: 'typeList',
                        label: ['deptName'],
                        value: 'deptId'
                    },
                    linkageProp: ['potNo']
                },
                {
                    type: 'select',
                    label: '原汁罐',
                    prop: 'potNo',
                    resVal: {
                        resData: 'page.list',
                        label: ['holderName'],
                        value: 'holderId'
                    },
                    defaultValue: '',
                    /* eslint-disable */
                    optionsFn: val => {
                        const workShopName = this.$refs.queryTable.optionLists.workShop.find(item => item.deptId === val)['deptName'];
                        return this.$http(`${BASICDATA_API.CONTAINERLIST_API}`, 'POST', {
                            type: 'holder_type',
                            holder_type: '013',
                            pageSize: 9999,
                            workShopName: workShopName,
                            currPage: 1,
                            dept_id: val
                        });
                    }
                    /* eslint-enable */
                },
                {
                    type: 'select',
                    label: '生产物料',
                    prop: 'materialCode',
                    resVal: {
                        resData: 'dicList',
                        label: ['value', 'code'],
                        value: 'code'
                    },
                    defaultValue: '',
                    optionsFn: val => {
                        return this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {
                            factory: val,
                            type: 'YA_M_MATERIAL'
                        });
                    }
                },
                {
                    type: 'date-interval',
                    label: '生产日期',
                    prop: 'startTime',
                    defaultValue: dateFormat(new Date(), 'yyyy-MM-dd'),
                    defaultValueTwo: dateFormat(new Date(), 'yyyy-MM-dd'),
                    propTwo: 'endTime'
                }
            ],
            listInterface: params => {
                return this.$http(`${REP_API.PRSMATERIAL_LIST_API}`, 'POST', params);
            },
            exportOption: {
                exportInterface: REP_API.PRSMATERIAL_EXPECT_API,
                auth: 'report:res:expectPrsMaterial',
                text: '物料领用报表'
            },
            column: [
                {
                    prop: 'factoryName',
                    label: '工厂',
                    minwidth: '120'
                }, {
                    prop: 'workShopName',
                    label: '车间',
                    minwidth: '120'
                }, {
                    prop: 'productDate',
                    label: '生产日期',
                    minwidth: '110'
                }, {
                    prop: 'material',
                    label: '生产物料',
                    minwidth: '180'
                }, {
                    prop: 'useAmount',
                    label: '领用数量',
                    minwidth: '100'
                }, {
                    prop: 'useBatch',
                    label: '领用批次',
                    minwidth: '120'
                }, {
                    prop: 'inPotAmount',
                    label: '原汁入库数量',
                    minwidth: '120'
                }, {
                    prop: 'batch',
                    label: '入库批次',
                    minwidth: '110'
                }
            ]
        };
    }
};
</script>

<style scoped></style>
