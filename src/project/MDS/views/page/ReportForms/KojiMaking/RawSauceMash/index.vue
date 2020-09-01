<template>
    <div class="header_main">
        <query-table ref="queryTable" :query-form-data="queryFormData" :list-interface="listInterface" query-auth="report:formh:kjmSauceList" :column="column" :export-excel="true" :export-option="exportOption" />
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
                            deptName: '制曲'
                        });
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
                    label: '发酵罐',
                    prop: 'inPotNo',
                    optionsFn: val => {
                        const workShopName = this.$refs.queryTable.optionLists.workshop.find(item => item.deptId === val)['deptName'];
                        return this.$http(`${BASICDATA_API.CONTAINERLIST_API}`, 'POST', {
                            currPage: 1,
                            dept_id: val,// eslint-disable-line
                            holder_type: '001',// eslint-disable-line
                            pageSize: 9999,
                            type: 'holder_type',
                            workShopName: workShopName
                        });
                    },
                    defaultValue: '',
                    resVal: {
                        resData: 'page.list',
                        label: ['holderName'],
                        value: 'holderId'
                    }
                },
                {
                    type: 'input',
                    label: '生产订单',
                    prop: 'orderNo'
                },
                {
                    type: 'date-interval',
                    label: '生产日期',
                    prop: 'commitDateOne',
                    propTwo: 'commitDateTwo'
                }
            ],
            listInterface: params => {
                params.currPage = String(params.currPage);
                params.pageSize = String(params.pageSize);
                return this.$http(`${REP_API.REPRAW_API}`, 'POST', params);
            },
            exportOption: {
                exportInterface: REP_API.REPRAWOUT_API,
                auth: 'report:formh:kjmSauceList',
                text: '生酱醪统计报表导出'
            },
            column: [
                {
                    prop: 'productDate',
                    label: '生产日期',
                    minwidth: '100'
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
                    prop: 'orderNo',
                    label: '生产订单',
                    minwidth: '120'
                },
                {
                    prop: 'material',
                    label: '品项',
                    minwidth: '150'
                },
                {
                    prop: 'holderName',
                    label: '发酵罐',
                    minwidth: '100'
                },
                {
                    prop: 'holderHold',
                    label: '发酵罐容量',
                    minwidth: '100'
                },
                {
                    prop: 'planOutput',
                    label: '计划产量',
                    minwidth: '100'
                },
                {
                    prop: 'realOutput',
                    label: '实际产量',
                    minwidth: '100'
                },
                {
                    prop: 'canningDate',
                    label: '投罐日期',
                    minwidth: '100'
                },
                {
                    prop: 'canfulDate',
                    label: '满罐日期',
                    minwidth: '100'
                },
                {
                    prop: 'oheDate',
                    label: '180天成熟期',
                    minwidth: '110'
                },
                {
                    prop: 'ohtDate',
                    label: '130天成熟期',
                    minwidth: '110'
                },
                {
                    prop: 'nowDate',
                    label: '日期',
                    minwidth: '110'
                },
                {
                    prop: 'ferDate',
                    label: '发酵天数',
                    minwidth: '110'
                }
            ]
        };
    }
};
</script>

<style scoped></style>
