<template>
    <div class="header_main">
        <query-table ref="queryTable" :query-form-data="queryFormData" :list-interface="listInterface" query-auth="report:formh:kjmOutTechList" :column="column" :export-excel="true" :export-option="exportOption" />
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
                    linkageProp: ['houseId', 'inPotNo']
                },
                {
                    type: 'select',
                    label: '生产曲房',
                    prop: 'houseId',
                    resVal: {
                        resData: 'page.list',
                        label: ['holderName'],
                        value: 'holderId'
                    },
                    defaultValue: '',
                    optionsFn: val => {
                        const workShopName = this.$refs.queryTable.optionLists.workshop.find(item => item.deptId === val)['deptName'];
                        return this.$http(`${BASICDATA_API.CONTAINERLIST_API}`, 'POST', {
                            currPage: 1,
                            dept_id: val,// eslint-disable-line
                            holder_type: '005',// eslint-disable-line
                            pageSize: 9999,
                            type: 'holder_type',
                            workShopName: workShopName
                        });
                    }
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
                    type: 'date-interval',
                    label: '制曲日期',
                    prop: 'commitDateOne',
                    propTwo: 'commitDateTwo'
                }
            ],
            listInterface: params => {
                params.currPage = String(params.currPage);
                params.pageSize = String(params.pageSize);
                return this.$http(`${REP_API.REPOUTCRAFT_API}`, 'POST', params);
            },
            exportOption: {
                exportInterface: REP_API.REPOUTCRAFTOUT_API,
                auth: 'report:formh:exportkjmOutTechList',
                text: '出曲工艺报表导出'
            },
            column: [
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
                    prop: 'houseName',
                    label: '曲房',
                    minwidth: '100'
                },
                {
                    prop: 'inPotName',
                    label: '发酵罐',
                    minwidth: '100'
                },
                {
                    prop: 'inKjmDate',
                    label: '制曲日期',
                    minwidth: '100'
                },
                {
                    prop: 'outStartTime',
                    label: '出曲开始时间',
                    minwidth: '120'
                },
                {
                    prop: 'outEndTime',
                    label: '出曲结束时间',
                    minwidth: '120'
                },
                {
                    prop: 'saltWaterTemp',
                    label: '盐水温度',
                    minwidth: '100'
                },
                {
                    prop: 'saltWaterNd',
                    label: '盐水浓度',
                    minwidth: '100'
                },
                {
                    prop: 'outTempOne',
                    label: '出曲温度1',
                    minwidth: '90'
                },
                {
                    prop: 'blendTempOne',
                    label: '出曲混合料温度1',
                    minwidth: '128'
                },
                {
                    prop: 'windSpeedOne',
                    label: '出曲风速1',
                    minwidth: '90'
                },
                {
                    prop: 'outTempTwo',
                    label: '出曲温度2',
                    minwidth: '90'
                },
                {
                    prop: 'blendTempTwo',
                    label: '出曲混合料温度2',
                    minwidth: '128'
                },
                {
                    prop: 'windSpeedTwo',
                    label: '出曲风速2',
                    minwidth: '90'
                },
                {
                    prop: 'outTempThree',
                    label: '出曲温度3',
                    minwidth: '90'
                },
                {
                    prop: 'blendTempThree',
                    label: '出曲混合料温度3',
                    minwidth: '128'
                },
                {
                    prop: 'windSpeedThree',
                    label: '出曲风速3',
                    minwidth: '90'
                },
                {
                    prop: 'outTempFour',
                    label: '出曲温度4',
                    minwidth: '90'
                },
                {
                    prop: 'blendTempFour',
                    label: '出曲混合料温度4',
                    minwidth: '128'
                },
                {
                    prop: 'windSpeedFour',
                    label: '出曲风速4',
                    minwidth: '90'
                },
                {
                    prop: 'outTempFive',
                    label: '出曲温度5',
                    minwidth: '90'
                },
                {
                    prop: 'blendTempFive',
                    label: '出曲混合料温度5',
                    minwidth: '128'
                },
                {
                    prop: 'windSpeedFive',
                    label: '出曲风速5',
                    minwidth: '90'
                }
            ]
        };
    }
};
</script>

<style>
.out-craft-report-forms .el-card__body {
    padding: 12px !important;
}
</style>
<style scoped></style>
