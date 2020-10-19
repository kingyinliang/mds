<template>
    <div class="header_main">
        <query-table ref="queryTable" :query-form-data="queryFormData" :list-interface="listInterface" :query-auth="'report:formh:collectList'" :column="column" :export-excel="true" :export-option="exportOption" />
    </div>
</template>

<script>
import { BASICDATA_API, REP_API } from '@/api/api'
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
                params.currPage = String(params.currPage);
                params.pageSize = String(params.pageSize);
                return this.$http(`${REP_API.REPOUTPUTLIST_API}`, 'POST', params);
            },
            exportOption: {
                exportInterface: REP_API.REPYIELDOUTPUT_API,
                auth: 'report:formh:exportCollect',
                text: '产量汇总报表导出'
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
                    prop: 'planOutput',
                    label: '计划产量',
                    minwidth: '120'
                },
                {
                    prop: 'outPutUnit',
                    label: '单位',
                    width: '55'
                },
                {
                    prop: 'realOutPut',
                    label: '实际产量',
                    minwidth: '80'
                },
                {
                    prop: 'realOutPutUnit',
                    label: '单位',
                    width: '55'
                },
                {
                    prop: 'batch',
                    label: '批次',
                    width: '120'
                },
                {
                    prop: 'allBad',
                    label: '不良品数',
                    minwidth: '80'
                },
                {
                    prop: 'badUnit',
                    label: '单位',
                    width: '55'
                },
                {
                    prop: 'allSample',
                    label: '样品',
                    minwidth: '60'
                },
                {
                    prop: 'sampleUnit',
                    label: '单位',
                    width: '55'
                },
                {
                    prop: 'allNum',
                    label: '实际作业人数',
                    minwidth: '120'
                },
                {
                    prop: 'allTime',
                    label: '实际投入时间',
                    minwidth: '120'
                },
                {
                    prop: 'shift',
                    label: '交接班',
                    minwidth: '70'
                },
                {
                    prop: 'meeting',
                    label: '班前会',
                    minwidth: '70'
                },
                {
                    prop: 'prepared',
                    label: '生产前的准备',
                    minwidth: '120'
                }, {
                    prop: 'dinnerTime',
                    label: '用餐时间',
                    minwidth: '80'
                }, {
                    prop: 'clear',
                    label: '生产后清理时间',
                    minwidth: '120'
                },
                {
                    prop: 'changeTime',
                    label: '切换时间',
                    minwidth: '80'
                }
            ]
        }
    }
}
</script>

<style scoped>

</style>
