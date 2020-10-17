<template>
    <div class="header_main">
        <query-table ref="queryTable" :query-form-data="queryFormData" :list-interface="listInterface" query-auth="report:formh:totalHoursList" :column="column" :export-excel="true" :export-option="exportOption" />
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
                    linkageProp: ['workshop', 'teamId']
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
                    defaultValue: '',
                    optionsFn: val => {
                        return this.$http(`${BASICDATA_API.FINDORGBYPARENTID_API}`, 'POST', { parentId: val });
                    }
                },
                {
                    type: 'select',
                    label: '生产班组',
                    prop: 'teamId',
                    optionsFn: val => {
                        return this.$http(`${BASICDATA_API.FINDTEAM_API}`, 'POST', {
                            factory: val
                        });
                    },
                    defaultValue: '',
                    resVal: {
                        resData: 'teamList',
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
                        label: ['sapName', 'itemCode'],
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
                return this.$http(`${REP_API.REPOUTPUTMANHOUR_API}`, 'POST', params);
            },
            exportOption: {
                exportInterface: REP_API.REPOUTPUTMANHOUREXPORT_API,
                auth: 'report:formh:exportTotalHours',
                text: '产量总工时报表数据导出'
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
                    prop: 'materialName',
                    label: '生产品项',
                    minwidth: '180'
                },
                {
                    prop: 'batch',
                    label: '生产批次',
                    minwidth: '120'
                },
                {
                    prop: 'className',
                    label: '班次',
                    minwidth: '65'
                },
                {
                    prop: 'team',
                    label: '班组',
                    minwidth: '80'
                },
                {
                    prop: 'realOutPut',
                    label: '产量',
                    minwidth: '80'
                },
                {
                    prop: 'realOutPutUnit',
                    label: '单位',
                    width: '50'
                },
                {
                    prop: 'allSample',
                    label: '样品',
                    minwidth: '50'
                },
                {
                    prop: 'sampleUnit',
                    label: '单位',
                    width: '50'
                },
                {
                    prop: 'workTime',
                    label: '人工工时（H）',
                    minwidth: '120'
                }
            ]
        };
    }
};
</script>

<style scoped></style>
