<template>
    <div class="header_main">
        <query-table ref="queryTable" :query-form-data="queryFormData" :list-interface="listInterface" :query-auth="'report:formPress:oilYieldList'" :column="column" :export-excel="true" :export-option="exportOption" />
    </div>
</template>

<script>
import { BASICDATA_API, REP_API } from '@/api/api';
import { dateFormat } from '@/net/validate';
export default {
    name: 'Press',
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
                    linkageProp: ['workShop']
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
                    linkageProp: ['childPotNo']
                },
                {
                    type: 'select',
                    label: '发酵罐',
                    defaultValue: '',
                    prop: 'childPotNo',
                    resVal: {
                        resData: 'list',
                        label: ['holderName'],
                        value: 'holderId'
                    },
                    optionsFn: val => {
                        return this.$http(`${BASICDATA_API.CONTAINER_LIST_API}`, 'POST', {
                            factory: this.$refs.queryTable.queryForm.factory,
                            workShop: val
                        })
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
                return this.$http(`${REP_API.SQUEEZEOILERLIST_API}`, 'POST', params);
            },
            exportOption: {
                exportInterface: REP_API.REPSQUEEZEOILERLIST_API,
                auth: 'report:formPress:exportoilYield',
                text: '出油率报表数据导出'
            },
            column: [
                {
                    prop: 'factoryName',
                    label: '工厂',
                    minwidth: '230'
                }, {
                    prop: 'workShop',
                    label: '车间'
                }, {
                    prop: 'productDate',
                    label: '生产日期'
                }, {
                    prop: 'yield',
                    label: '出品率'
                }, {
                    prop: 'holderName',
                    label: '发酵罐'
                }, {
                    prop: 'childUsedAmount',
                    label: '领用酱醪量'
                }, {
                    prop: 'inPotAmount',
                    label: '原汁产量'
                }
            ]
        };
    }
};
</script>

<style scoped></style>
